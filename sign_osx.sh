#!/bin/bash

# Name of your app.
APP="MonkeyType"
# The path of you app to sign.
APP_PATH="staging/MonkeyType.app"
# The path to the location you want to put the signed package.
RESULT_PATH="staging/$APP.pkg"
# The name of certificates you requested.
APP_KEY="3rd Party Mac Developer Application: Hyperworks Inc ($MONKEY_TYPE_KEY)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Hyperworks Inc ($MONKEY_TYPE_KEY)"

FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"
APP_BIN_PATH="staging/MonkeyType.app/Contents/MacOS/MonkeyType"

codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Libraries/libnode.dylib"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/Electron Framework"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/Electron Framework.framework/"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/Squirrel.framework/"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/ReactiveCocoa.framework/"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign --deep -fs "$APP_KEY" --entitlements platforms/osx/child.plist "$FRAMEWORKS_PATH/$APP Helper NP.app/"
#codesign  -fs "$APP_KEY" --entitlements platforms/osx/parent.plist "$APP_PATH"
codesign --verbose --deep --force --sign "$APP_KEY" --entitlements platforms/osx/parent.plist "$APP_PATH"
codesign --verbose --force --sign "$APP_KEY" --entitlements platforms/osx/parent.plist "$APP_BIN_PATH"
productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"