export DEVELOPER_DIR=/Applications/Xcode.app
security unlock-keychain -p $UNLOCK-KEYCHAIN
env
export PATH=$PATH:/usr/local/bin

cp config.xml.base config.xml
sed s/REPLACEME/$BUILD_NUMBER/g config.xml.base > config.xml

npm install
gulp js

cordova build ios --device 
#cordova build android


xcrun -sdk iphoneos PackageApplication -v "${WORKSPACE}/platforms/ios/build/device/MonkeyType.app" -o "${WORKSPACE}/platforms/ios/build/monkeytype-1.0.${BUILD_NUMBER}.ipa"

${WORKSPACE}/platforms/ios/Crashlytics.framework/submit  $CRASHLYTICS_KEY1 $CRASHLYTICS_KEY2 -debug YES -ipaPath "${WORKSPACE}/platforms/ios/build/monkeytype-1.0.${BUILD_NUMBER}.ipa" -groupAliases Testers

