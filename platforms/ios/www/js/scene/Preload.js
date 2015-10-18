var game = require("./../lib/game");

var PreloadScene = tine._scene({
    initialize: function() {
        console.log("init preload scene");

        /* BACKGROUND */
        this.initBackground();

        /* PROGRESS BAR */
        this.progressBar = new creatine.ProgressBar(
            '#1D1544',
            '#5A60B4',
            creatine.LEFT_TO_RIGHT,
            game.canvas.width-40,
            10, 0, 1
        );
        this.progressBar.x = 20;
        this.progressBar.y = game.canvas.height - 30;
        this.addChild(this.progressBar);

        game.load.on('progress', this.onProgress, this);
        game.load.on('fileload', this.onFileload, this);
    },
    update: function() {
        // console.log("update preload scene");
    },
    onProgress: function(event) {
        this.progressBar.value = event.progress;
    },
    onFileload: function(file) {
        game.assets[file.item.id] = file.result;
    },
    resize: function(){

        this.removeChild(this.background);
        this.removeChild(this.progressBar);

        this.initBackground();
        this.addChild(this.progressBar);

        this.progressBar.width = game.canvas.width-40;
    },
    initBackground: function(){

        if(game.canvas.width > game.canvas.height)
        {
            var image = "../../assets/img/Default-Landscape@2x~ipad.png";
            
            this.image_size = {
                width: 2048,
                height: 1536
            };
        }
        else
        {
            var image = "../../assets/img/Default-736h.png";
            
            this.image_size = {
                width: 1242,
                height: 2208
            };
        }

        this.background = new createjs.Bitmap(image);
        this.background.x = 0;
        this.background.y = 0;

        var scale = Math.max(game.canvas.width / this.image_size.width, game.canvas.height / this.image_size.height);

        this.background.scaleX = scale;
        this.background.scaleY = scale;

        
        this.addChild(this.background);
    }
});

module.exports = new PreloadScene();
