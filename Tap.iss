[Setup]
AppName=Tap
AppVersion=0.0.8
DefaultDirName={autopf}\Tap
DefaultGroupName=Tap
OutputDir=installer_output
OutputBaseFilename=TapSetup
Compression=lzma
SolidCompression=yes
DisableProgramGroupPage=yes

[Files]
Source: "dist\Tap.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Tap"; Filename: "{app}\Tap.exe"
Name: "{autodesktop}\Tap"; Filename: "{app}\Tap.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a shortcut on the desktop"; GroupDescription: "Extra options:"