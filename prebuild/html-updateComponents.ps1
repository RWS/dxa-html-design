param (
    # Path to the html distributive
    [string]$htmlDist,

    # Set this to the saintjohn dev cms url
    [string]$cmsUrl = "http://localhost/"
)

#Terminate script on first occured exception
trap {
    Write-Error $_.Exception.Message
    return 1
}

# Initialization
$tempFolder = Join-Path $env:TEMP "TSI_html\"
if (!(Test-Path $tempFolder)) {
    New-Item -ItemType Directory -Path $tempFolder | Out-Null
}
if (!(Test-Path $htmlDist)) {
    $htmlDist = Join-Path $ScriptDir "..\html\"
}
$dllsFolder = Join-Path (Split-Path $MyInvocation.MyCommand.Path) "ImportExport\"
$designZip = Join-Path $htmlDist "html-design.zip"

# Prepare package
$tempDesignZip = Join-Path $tempFolder "html-design.zip"
if (Test-Path $tempDesignZip) {
    Remove-Item $tempDesignZip | Out-Null
}
Add-Type -Assembly System.IO.Compression.FileSystem
$compressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
[System.IO.Compression.ZipFile]::CreateFromDirectory($htmlDist,$tempDesignZip, $compressionLevel, $false)
Copy-Item $tempDesignZip $designZip -Force

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

function get-CoreServiceClient {
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
    $core = get-CoreServiceClient("Service")
    $readOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions
    $page = $core.Read($pageWebdavUrl, $readOptions)
    $pi = New-Object Tridion.ContentManager.CoreService.Client.PublishInstructionData
    $pi.ResolveInstruction = New-Object Tridion.ContentManager.CoreService.Client.ResolveInstructionData
    $pi.RenderInstruction = New-Object Tridion.ContentManager.CoreService.Client.RenderInstructionData
    $res = $core.Publish(@($page.Id), $pi, @($targetUri), $null, $readOptions)

    Write-Host "Published page to target: " $targetUri

}
function UpdateMultimediaComponent($componentWebdavUrl, $binaryLocation){
    
    $core = get-CoreServiceClient("Service")
    $readOptions = New-Object Tridion.ContentManager.CoreService.Client.ReadOptions
    $mmComp = $core.Read($componentWebdavUrl, $readOptions)
    $binaryFilename = $mmComp.BinaryContent.Filename
    $mmType = $mmComp.BinaryContent.MultimediaType
    Write-Host $binaryFilename
    $uploadService = get-CoreServiceClient -type Upload
	try {
		$packageStream = [IO.File]::OpenRead($binaryLocation)
		$tempPath = $uploadService.UploadBinaryContent($binaryFilename, $packageStream)
	}
	finally {
		if ($packageStream -ne $null){
			$packageStream.Dispose()	
		}
	}
    $mmComp = $core.CheckOut($mmComp.Id, $false, $readOptions)
    $mmComp.BinaryContent = New-Object Tridion.ContentManager.CoreService.Client.BinaryContentData
    $mmComp.BinaryContent.UploadFromFile = $tempPath
    $mmComp.BinaryContent.Filename = $binaryFilename
    $mmComp.BinaryContent.MultimediaType = $mmType
    $mmComp = $core.Save($mmComp, $readOptions)
    $mmComp = $core.CheckIn($mmComp.Id, $true, $null, $readOptions)
    
    Write-Host "Updated MM Component"
}

UpdateMultimediaComponent "/webdav/100 Master/Building Blocks/Modules/Core/Admin/HTML Design.zip" $designZip 
PublishPage "/webdav/400 Site/Home/_System/Publish HTML Design.tpg" "tcm:0-1-65538"
PublishPage "/webdav/400 Example Site/Home/_System/Publish HTML Design.tpg" "tcm:0-1-65538"

Start-Sleep -s 100

# Recycle application pools
function Recycle-IisAppPool([string]$appPoolName) { 
     Invoke-WmiMethod -Name Recycle -Namespace "root\MicrosoftIISv2" -Path "IIsApplicationPool.Name='W3SVC/APPPOOLS/$appPoolName'" 
}
"Staging (Git Version)", "Staging" | % { Recycle-IisAppPool $_ }