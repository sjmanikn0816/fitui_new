cd C:\Users\sjman\StudioProjects\fitui_new

# Fix Main AndroidManifest.xml
$file = "android\app\src\main\AndroidManifest.xml"
$content = Get-Content $file -Raw

# Add xmlns:tools namespace if not present
if ($content -notmatch 'xmlns:tools') {
    $content = $content -replace '(<manifest[^>]*)(>)', '$1 xmlns:tools="http://schemas.android.com/tools"$2'
}

# Add android:appComponentFactory with tools:replace to the application tag
if ($content -notmatch 'android:appComponentFactory') {
    $content = $content -replace '(<application[^>]*)(>)', '$1 android:appComponentFactory="androidx.core.app.CoreComponentFactory" tools:replace="android:appComponentFactory"$2'
}

$content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
Write-Host "Fixed main AndroidManifest.xml"

# Fix Debug AndroidManifest.xml
$file = "android\app\src\debug\AndroidManifest.xml"
$content = Get-Content $file -Raw

# Add xmlns:tools namespace if not present
if ($content -notmatch 'xmlns:tools') {
    $content = $content -replace '(<manifest[^>]*)(>)', '$1 xmlns:tools="http://schemas.android.com/tools"$2'
}

# Add android:appComponentFactory with tools:replace to the application tag
if ($content -notmatch 'android:appComponentFactory') {
    $content = $content -replace '(<application[^>]*)(>)', '$1 android:appComponentFactory="androidx.core.app.CoreComponentFactory" tools:replace="android:appComponentFactory"$2'
}

$content | Out-File -FilePath $file -Encoding UTF8 -NoNewline
Write-Host "Fixed debug AndroidManifest.xml"

Write-Host "`nNow run: npm run android"