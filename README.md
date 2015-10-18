-- For local dev

cd typingjs

npm install

npm install --global gulp

--- to run

gulp


--- or without installing gulp globally

node ./node_modules/gulp/bin/gulp.js



-- To build JS

gulp js

or

browserify www/js/app.js -o www/build.js -d

-- To build IOS 

cordova build ios



--Cordova Plugins

cordova -d plugin add https://github.com/Wizcorp/phonegap-facebook-plugin/ --variable APP_ID="703479189756210" --variable APP_NAME="Monkey Typing"

