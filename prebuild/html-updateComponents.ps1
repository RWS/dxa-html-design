param (
    # Path to the html distributive
    [string]$designDir = "..\design",

    # Path to the build distributive
    [string]$buildFilesDir = "..\build-files",

    # Set this to the dev cms url
    [string]$cmsUrl = "http://dxadevweb8.ams.dev/",

    # Set this to the publication target type id of the staging target
    [string]$targetType = "tcm:0-6-65538",

    # Names (comma separated) of Publication(s) that need the HTML Design to be (re-)published after the update
    [string]$publications = "400 Example Site"
)

#Terminate script on first occured exception
$ErrorActionPreference = "Stop"

# Initialization
if(-not $cmsUrl.EndsWith('/')) 
{
    $cmsUrl += "/"
}

$dllsFolder = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "ImportExport\"
$designZip = "html-design.zip"
$buildFilesZip = "build-files.zip"

# Cleanup previous build artifacts (if any)
if (Test-Path $designZip)
{
    Remove-Item $designZip -Force
}
if (Test-Path $buildFilesZip)
{
    Remove-Item $buildFilesZip -Force
}

# Create zip files
Write-Host "Creating ZIP files ..."
Add-Type -Assembly System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
[System.IO.Compression.ZipFile]::CreateFromDirectory($designDir, $designZip, $compressionLevel, $false)
[System.IO.Compression.ZipFile]::CreateFromDirectory($buildFilesDir, $buildFilesZip, $compressionLevel, $false)


function Init-CoreServiceClient 
{
    Add-Type -assemblyName mscorlib
    Add-Type -assemblyName System.ServiceModel
    Add-Type -Path "$($dllsFolder)Tridion.Common.dll"
    Add-Type -Path "$($dllsFolder)Tridion.ContentManager.CoreService.Client.dll"
}

function Get-CoreServiceClient($type) 
{
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
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/CoreService201501.svc/wsHttp")
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
			$endpoint = New-Object System.ServiceModel.EndpointAddress ($cmsUrl + "webservices/CoreService201501.svc/streamUpload_basicHttp")
			New-Object Tridion.ContentManager.CoreService.Client.StreamUploadClient $binding,$endpoint
		}
	}
    
    Write-Host "Using Core Service endpoint: $($endpoint.Uri)"
}

function Publish-Page($pageWebdavUrl, $targetUri)
{
    $page = $coreServiceClient.Read($pageWebdavUrl, $defaultReadOptions)
    $pi = New-Object Tridion.ContentManager.CoreService.Client.PublishInstructionData
    $pi.ResolveInstruction = New-Object Tridion.ContentManager.CoreService.Client.ResolveInstructionData
    $pi.RenderInstruction = New-Object Tridion.ContentManager.CoreService.Client.RenderInstructionData
    $res = $coreServiceClient.Publish(@($page.Id), $pi, @($targetUri), $null, $defaultReadOptions)

    Write-Host "Published Page '$pageWebdavUrl' to TargetType '$targetUri'"
}

function Update-MultimediaComponent($componentWebdavUrl, $binaryLocation)
{
    Write-Host "Updating MM Component '$componentWebdavUrl' with file '$binaryLocation' ..."    
    $mmComp = $coreServiceClient.Read($componentWebdavUrl, $defaultReadOptions)
    $binaryFilename = $mmComp.BinaryContent.Filename
    $mmType = $mmComp.BinaryContent.MultimediaType
    Write-Host "`tBinary filename: '$binaryFilename'"

    # TODO: Use UploadRequest and specify UploadRequest.AccessToken (?)
    $uploadService = Get-CoreServiceClient -type Upload
	$packageStream = [IO.File]::OpenRead($binaryLocation)
	$tempPath = $uploadService.UploadBinaryContent($binaryFilename, $packageStream)
	$packageStream.Dispose()	
	$uploadService.Dispose()	

    try 
    {
        $mmComp = $coreServiceClient.CheckOut($mmComp.Id, $false, $defaultReadOptions)
        $mmComp.BinaryContent = New-Object Tridion.ContentManager.CoreService.Client.BinaryContentData
        $mmComp.BinaryContent.UploadFromFile = $tempPath
        $mmComp.BinaryContent.Filename = $binaryFilename
        $mmComp.BinaryContent.MultimediaType = $mmType
        $mmComp = $coreServiceClient.Save($mmComp, $defaultReadOptions)
        $mmComp = $coreServiceClient.CheckIn($mmComp.Id, $true, $null, $defaultReadOptions)
        Write-Host "Updated MM Component: $($mmComp.Id)"
    }
    catch
    {
        if ($mmComp -ne $null -and $mmComp.LockInfo.LockType -eq "CheckedOut") {
            Write-Host "`tUndo checkout of Component '$($mmComp.Id)'"
            $mmComp = $coreServiceClient.UndoCheckOut($mmComp.Id, $false, $defaultReadOptions)
        }
        throw $_
    }
}

function Increment-DesignVersion($componentWebdavUrl)
{
    Write-Host "Incrementing HTML Design Version of '$componentWebdavUrl' ..."
    $comp = $coreServiceClient.Read($componentWebdavUrl, $defaultReadOptions)
    
    # only deal with local or localized components
    if ($comp.BluePrintInfo.IsShared)
    {
        Write-Warning "$componentWebdavUrl is shared."
        return
    }

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
        Write-Host "`tCurrent version: $version"

        $xmlToReplace = $begin + $version + $end
        $version = $prefix + (1 + $value)
        $xmlNew = $begin + $version + $end

        $comp = $coreServiceClient.CheckOut($comp.Id, $false, $defaultReadOptions)
        $content = $content.Replace($xmlToReplace, $xmlNew)   
        $comp.Content = $content         
        $comp = $coreServiceClient.Save($comp, $defaultReadOptions)
        $comp = $coreServiceClient.CheckIn($comp.Id, $true, $null, $defaultReadOptions)

        Write-Host "`tUpdated to version: $version"
    }
    else
    {
        Write-Warning "Can't find version in '$componentWebdavUrl'."
    }
}

# Create core service client and default read options
Init-CoreServiceClient
$coreServiceClient = Get-CoreServiceClient "Service"
$defaultReadOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions

Update-MultimediaComponent "/webdav/100 Master/Building Blocks/Modules/Core/Admin/HTML Design.zip" $designZip
Update-MultimediaComponent "/webdav/100 Master/Building Blocks/Modules/Core/Admin/Build Files.zip" $buildFilesZip

Increment-DesignVersion "/webdav/100 Master/Building Blocks/Settings/Core/Site Manager/HTML Design Configuration.xml"

foreach ($pub in $publications.Split(','))
{
    Publish-Page "/webdav/$pub/Home/_System/Publish HTML Design.tpg" $targetType
}

$coreServiceClient.Dispose()
