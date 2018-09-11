class GameScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameScene);
    }

    init() {
        this.allowUserInput = false;
        
        this.gameTitle = null;
    }

    create() {
        /* Adding UI images */
        this.gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        this.gameTitle.setOrigin(0.5, 0);
    }
}