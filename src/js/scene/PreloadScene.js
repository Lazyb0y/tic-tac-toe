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
    }

    create() {
        console.log("Created PreloadScene");
    }
}