
electron-builder Exit code:: 1. Command failed: which python failedTask=build stackTrace=Error: Exit code: 1. 

{ appId?,
 artifactName?, 
 asar?,
 asarUnpack?,
 binaries?,
 bundleShortVersion?,
 bundleVersion?,
 category?,
 compression?,
 cscInstallerKeyPassword?,
 cscInstallerLink?,
 cscKeyPassword?,
 cscLink?,
 darkModeSupport?,
 defaultArch?,
 detectUpdateChannel?,
 electronLanguages?,
 electronUpdaterCompatibility?,
 entitlements?,
 entitlementsInherit?,
 entitlementsLoginHelper?,
 executableName?,
 extendInfo?,
 extraDistFiles?,
 extraFiles?,
 extraResources?,
 fileAssociations?,
 files?,
 forceCodeSigning?,
 gatekeeperAssess?,
 generateUpdatesFilesForAllChannels?,
 hardenedRuntime?,
 helperBundleId?,
 helperEHBundleId?,
 helperGPUBundleId?,
 helperNPBundleId?,
 helperPluginBundleId?,
 helperRendererBundleId?,
 icon?,
 identity?,
 mergeASARs?,
 minimumSystemVersion?,
 protocols?,
 provisioningProfile?,
 publish?,
 releaseInfo?,
 requirements?,
 signIgnore?,
 singleArchFiles?,
 strictVerify?,
 target?,
 timestamp?,
 type?,
 x64ArchFiles? }

"files": [
            "dist/**/*",
            "package.json",
            "embeddedprovisionprofile.provisionprofile",
            "entitlements.mac.plist",
            "Certificati.p12",
            "notarize.js"
        ],
        "mac": {
            "category": "public.app-category.productivity",
            "entitlements": "./entitlements.mac.plist",
            "entitlementsInherit": "./entitlements.mac.plist",
            "hardenedRuntime": true,
            "provisioningProfile": "embeddedprovisionprofile.provisionprofile",
            "target": [
                "zip"
            ]
        },
        "win": {
            "target": [
                {
                    "target": "nsis",
                    "arch": [
                        "x64"
                    ]
                }
            ]
        },
        "nsis": {
            "oneClick": false,
            "perMachine": false,
            "allowElevation": true,
            "allowToChangeInstallationDirectory": true
        }
    },