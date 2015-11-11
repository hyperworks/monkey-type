!#/bin/bash
rm -rf staging ;true
mkdir staging
cp -r node_modules/electron-prebuilt/dist/Electron.app staging/
cp main.js staging/Electron.app/Contents/Resources/default_app/
mv staging/Electron.app/Contents/MacOS/Electron MonkeyType
cp platforms/osx/Info.plist staging/Electron.app/Contents/Info.plist
mv staging/Electron.app staging/MonkeyType.app

png2icsns.sh platforms/osx/icon-3.png
mv icon-3.icns staging/MonkeyType.app/Contents/Resources/atom.icns
rm -rf "staging/MonkeyType.app/Contents/Frameworks/Squirrel.framework/Resources/ShipIt"
rm -rf "staging/MonkeyType.app/Contents/Frameworks/Electron Framework.framework/Resources/crashpad_handler"
rm "./staging/MonkeyType.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Resources/crashpad_handler"
rm "./staging/MonkeyType.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/Resources/crashpad_handler"
rm "./staging/MonkeyType.app/Contents/Frameworks/Squirrel.framework/Versions/A/Resources/ShipIt"
rm "./staging/MonkeyType.app/Contents/Frameworks/Squirrel.framework/Versions/Current/Resources/ShipIt"

#TODO setup helpers
#Electron Helper EH.app

./sign_osx.sh