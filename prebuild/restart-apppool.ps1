param (
    # The name of the server hosting the apppools
    [string]$server = "saintjohn03",

    # Administrator user name
    [string]$adminUserName = "global\srv-cmbuild",

    # Administrator password
    [string]$adminUserPass = "srv_tridion_cm",

    # Comma separated list of IIS websites that need to be restarted 
    [string]$sites = "7.1 staging (stable),7.1 staging (git)"
)

$pass = ConvertTo-SecureString $adminUserPass -AsPlainText -Force
$credentials = new-object -typename System.Management.Automation.PSCredential -argumentlist $adminUserName, $pass

Write-Host "Recycling application pools of '$sites' websites on '$server'"

Invoke-Command -ComputerName $server -ScriptBlock { 
    Import-Module WebAdministration
    Write-Host "sites: $($Using:sites)"
    ($Using:sites).Split(',', [System.StringSplitOptions]::RemoveEmptyEntries) | % {
        (Get-Item "IIS:\Sites\$_"| Select-Object applicationPool).applicationPool 
    } |  % { 
        Restart-WebAppPool $_   
    }
} -Credential $credentials