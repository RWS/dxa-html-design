param (
    # Path to the html distributive
    [string]$htmlDist = "..\html",

    # Path to the build distributive
    [string]$buildDist = "C:\_f",

    # Set this to the saintjohn dev cms url
    [string]$cmsUrl = "http://dxadevweb8.ams.dev/",

    # Set this to the publication target type id of the staging target
    [string]$targetType = "tcm:0-6-65538",

    # Comma separated list of (website) publication names that need the HTML design to be published after the update
    [string]$publications = "400 Example Site"
)

#Terminate script on first occured exception
trap {
    Write-Error $_.Exception
    return 1
}

# Initialization
if(-not $cmsUrl.EndsWith('/')) {
    $cmsUrl += "/"
}
$tempDrive = Split-Path $env:TEMP -Qualifier
$tempFolder = Join-Path $tempDrive "_t"
if (!(Test-Path $tempFolder)) {
    New-Item -ItemType Directory -Path $tempFolder | Out-Null
}

$dllsFolder = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "ImportExport\"
$designZip = Join-Path $htmlDist "html-design.zip"
$buildZip = Join-Path $htmlDist "build-files.zip"

# Prepare packages
$tempDesignZip = Join-Path $tempFolder "html-design.zip"
if (Test-Path $tempDesignZip) {
    Remove-Item $tempDesignZip | Out-Null
}
$tempBuildZip = Join-Path $tempFolder "build-files.zip"
if (Test-Path $tempBuildZip) {
    Remove-Item $tempBuildZip | Out-Null
}

# Copy files to a short path location
$tempHtmlDist = Join-Path $tempFolder "s"
robocopy $htmlDist $tempHtmlDist /E | Out-Null
$tempBuildDist = Join-Path $tempFolder "f"
robocopy $buildDist $tempBuildDist /E | Out-Null

# Create zip files
Add-Type -Assembly System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempHtmlDist, $tempDesignZip, $compressionLevel, $false)
[System.IO.Compression.ZipFile]::CreateFromDirectory($tempBuildDist, $tempBuildZip, $compressionLevel, $false)

# Copy zip files to their desired location
Copy-Item $tempDesignZip $designZip -Force
Copy-Item $tempBuildZip $buildZip -Force

# Cleanup temp folder
Remove-Item $tempFolder -Force -Recurse | Out-Null

function InitUpdater {
    if (-not $global:UpdaterIsInitialized) {
        Add-Type -assemblyName mscorlib
        Add-Type -assemblyName System.ServiceModel
        Add-Type -Path "$($dllsFolder)ChilkatDotNet4.dll"
        Add-Type -Path "$($dllsFolder)Tridion.Common.dll"
        Add-Type -Path "$($dllsFolder)Tridion.ContentManager.CoreService.Client.dll"
        
        $global:UpdaterIsInitialized = $true
    }
}

function Get-CoreServiceClient {
    param(
        [parameter(Mandatory=$false)]
        [AllowNull()]
        [ValidateSet("Service","Upload","Download")]
        [string]$type="Service"
    )

	InitUpdater
	
	switch($type)
	{
		"Service" {
	        $binding = New-Object System.ServiceModel.WSHttpBinding
	        $binding.MaxBufferPoolSize = [int]::MaxValue
	        $binding.MaxReceivedMessageSize = [int]::MaxValue
	        $binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
	        $binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
	        $binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
	        $binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue
			$binding.Security.Mode = "Message"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/CoreService2013.svc/wsHttp")
			New-Object Tridion.ContentManager.CoreService.Client.SessionAwareCoreServiceClient $binding,$endpoint
        }
 
		"Upload" {
			$binding = New-Object System.ServiceModel.BasicHttpBinding
	        $binding.MaxBufferPoolSize = [int]::MaxValue
	        $binding.MaxReceivedMessageSize = [int]::MaxValue
	        $binding.ReaderQuotas.MaxArrayLength = [int]::MaxValue
	        $binding.ReaderQuotas.MaxBytesPerRead = [int]::MaxValue
	        $binding.ReaderQuotas.MaxStringContentLength = [int]::MaxValue
	        $binding.ReaderQuotas.MaxNameTableCharCount = [int]::MaxValue
	        $binding.Security.Mode = "None"
			$binding.TransferMode = "StreamedRequest"
			$binding.MessageEncoding = "Mtom"
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/CoreService2013.svc/streamUpload_basicHttp")
			New-Object Tridion.ContentManager.CoreService.Client.StreamUploadClient $binding,$endpoint
		}
	}
}

function PublishPage($pageWebdavUrl, $targetUri){
    $page = $core.Read($pageWebdavUrl, $defaultReadOptions)
    $pi = New-Object Tridion.ContentManager.CoreService.Client.PublishInstructionData
    $pi.ResolveInstruction = New-Object Tridion.ContentManager.CoreService.Client.ResolveInstructionData
    $pi.RenderInstruction = New-Object Tridion.ContentManager.CoreService.Client.RenderInstructionData
    $res = $core.Publish(@($page.Id), $pi, @($targetUri), $null, $defaultReadOptions)

    Write-Host "Published page to target: " $targetUri
}

function UpdateMultimediaComponent($componentWebdavUrl, $binaryLocation){    
    $mmComp = $core.Read($componentWebdavUrl, $defaultReadOptions)
    $binaryFilename = $mmComp.BinaryContent.Filename
    $mmType = $mmComp.BinaryContent.MultimediaType
    Write-Host $binaryFilename
    $uploadService = Get-CoreServiceClient -type Upload
	try {
		$packageStream = [IO.File]::OpenRead($binaryLocation)
		$tempPath = $uploadService.UploadBinaryContent($binaryFilename, $packageStream)
	}
    catch [Exception] {
        Write-Error $_.Exception.Message
    }
	finally {
		if ($packageStream -ne $null){
			$packageStream.Dispose()	
		}
		if ($uploadService -ne $null){
			$uploadService.Dispose()	
		}
	}

    try {
        $mmComp = $core.CheckOut($mmComp.Id, $false, $defaultReadOptions)
        $mmComp.BinaryContent = New-Object Tridion.ContentManager.CoreService.Client.BinaryContentData
        $mmComp.BinaryContent.UploadFromFile = $tempPath
        $mmComp.BinaryContent.Filename = $binaryFilename
        $mmComp.BinaryContent.MultimediaType = $mmType
        $mmComp = $core.Save($mmComp, $defaultReadOptions)
        $mmComp = $core.CheckIn($mmComp.Id, $true, $null, $defaultReadOptions)
        Write-Host "Updated MM Component"
    }
    catch [Exception] {
        Write-Error $_.Exception.Message
        if ($mmComp -ne $null -and $mmComp.LockInfo.LockType -eq "CheckedOut") {
            Write-Host "Undo checkout"
            $mmComp = $core.UndoCheckOut($mmComp.Id, $false, $defaultReadOptions)
        }
        return $false
    }
    return $true
}

function IncreaseDesignVersion($componentWebdavUrl){
    $comp = $core.Read($componentWebdavUrl, $defaultReadOptions)
    
    # only deal with local or localized components
    if (-not $comp.BluePrintInfo.IsShared)
    {
        $begin = "<version>"
        $end = "</version>"
        $regex = $begin + "(?<content>.*)" + $end

        # read current version, increase and save back    
        $content = $comp.Content    
        if ($content -match $regex)
        {
            # version format vX.YY, lets get the last value and increase that
            $version = $matches["content"]
            $pos = $version.IndexOf('.') + 1
            $prefix = $version.Substring(0, $pos)
            $value = $version.Substring($pos)
            Write-Verbose "HTML Design current version: $version"

            $xmlToReplace = $begin + $version + $end
            $version = $prefix + (1 + $value)
            $xmlNew = $begin + $version + $end

            Write-Host "Updating HTML Design version..."
            $comp = $core.CheckOut($comp.Id, $false, $defaultReadOptions)
            $content = $content.Replace($xmlToReplace, $xmlNew)   
            $comp.Content = $content         
            $comp = $core.Save($comp, $defaultReadOptions)
            $comp = $core.CheckIn($comp.Id, $true, $null, $defaultReadOptions)
            Write-Host "Done"

            Write-Host "Updated Configuration Component with version $version"
        }
        else
        {
           Write-Warning "Can't find version in $componentWebdavUrl."
        }
    }
    else
    {
        Write-Verbose "$componentWebdavUrl is shared."
    }
}

# Create core service client and default read options
$core = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions

# uploading the large zipfile can fail, so see if we need to update the version and publish the pages first
$continue = UpdateMultimediaComponent "/webdav/100 Master/Building Blocks/Modules/Core/Admin/HTML Design.zip" $designZip
if ($continue) {
    $continue = UpdateMultimediaComponent "/webdav/100 Master/Building Blocks/Modules/Core/Admin/Build Files.zip" $buildZip
}
else {
    Write-Warning "Failed to update the HTML Design Component!"
}
if ($continue) {
    IncreaseDesignVersion "/webdav/100 Master/Building Blocks/Settings/Core/Site Manager/HTML Design Configuration.xml"
    $array = $publications.Split(',', [System.StringSplitOptions]::RemoveEmptyEntries)
    foreach ($pub in $array) {
        # increase version if localized
        IncreaseDesignVersion "/webdav/$pub/Building Blocks/Settings/Core/Site Manager/HTML Design Configuration.xml"
        PublishPage "/webdav/$pub/Home/_System/Publish HTML Design.tpg" $targetType
    }
}
else {
    Write-Warning "Failed to update the Build Files Component!"
}

$core.dispose()
#Write-Output "Done"
if (!$continue) {
    exit 1
}