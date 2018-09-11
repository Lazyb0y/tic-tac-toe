class PreloadScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.preloadScene);
    }

    init() {
        this.appIcon = null;
    }

    preload() {
        /* Showing application icon */
        this.appIcon = this.add.image(T3.game.config.width / 2, T3.game.config.height / 4 - 100, "logo");
        this.appIcon.setOrigin(0.5, 0);

        /* Adding and configuring progress bar */
        this.setupProgressBar();

        /* Loading images and sprites */
        this.load.image("gametitle", "assets/sprites/gametitle.png");
        this.load.image("chooseplayer", "assets/sprites/chooseplayer.png");
        this.load.image("restart", "assets/sprites/restart.png");

        this.load.spritesheet("cross", "assets/sprites/crossspritesheet.png", {
            frameWidth: 400,
            frameHeight: 400
        });

        this.load.spritesheet("circle", "assets/sprites/circlespritesheet.png", {
            frameWidth: 400,
            frameHeight: 400
        });

        this.load.spritesheet("board", "assets/sprites/boardspritesheet.png", {
            frameWidth: 900,
            frameHeight: 900
        });
    }

    create() {
        this.scene.start(T3.GameOptions.scenes.mainMenuScene);
    }

    setupProgressBar() {
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x3a3a3c, 0.8);
        progressBox.fillRect(T3.game.config.width / 4, T3.game.config.height - (T3.game.config.height / 4), T3.game.config.width / 2, 50);

        let width = this.cameras.main.width / 2;
        let height = (this.cameras.main.height / 4) * 3;

        /* Initializing text for progress status */
        let loadingText = this.make.text({
            x: width,
            y: height - 30,
            text: 'Loading...',
            style: {
                font: '34px monospace',
                fill: '#16a085'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        let percentText = this.make.text({
            x: width,
            y: height + 25,
            text: '0%',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        let assetText = this.make.text({
            x: width,
            y: height + 80,
            text: '',
            style: {
                font: '30px monospace',
                fill: '#16a085'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        /* Load modules callback */
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x3a3a3c, 1);
            progressBar.fillRect(T3.game.config.width / 4 + 20, T3.game.config.height - (T3.game.config.height / 4) + 10, 300 * value, 30);
        });

        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }
}