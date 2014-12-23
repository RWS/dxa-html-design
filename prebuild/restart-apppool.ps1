param (
    # Path to the html distributive
    [string]$server = "saintjohn03.ams.dev",

    # Path to the build distributive
    [string]$adminUserName = "global\srv-cmbuild",

    # Set this to the saintjohn dev cms url
    [string]$adminUserPass = "srv_tridion_cm",

    # Comma separated list of IIS websites that need to be restarted after publishing the HTML design
    [string]$sites = "8.0 Staging (Stable demo version),8.0 Staging (GIT version)"
)

$pass = ConvertTo-SecureString $adminUserPass -AsPlainText -Force
$credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $adminUserName, $pass

Write-Host "Recycling application pools of '$sites' websites"

Invoke-Command -ComputerName $server -ScriptBlock { 
    Import-Module WebAdministration
    Write-Host "sites: $($Using:sites)"
    ($Using:sites).Split(',', [System.StringSplitOptions]::RemoveEmptyEntries) | % {
        (Get-Item "IIS:\Sites\$_"| Select-Object applicationPool).applicationPool 
    } |  % { 
        Restart-WebAppPool $_   
    }
} -Credential $credentials