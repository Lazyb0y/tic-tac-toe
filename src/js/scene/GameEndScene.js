class GameEndScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameEndScene);
    }

    init() {
        this.playAgain = null;
    }

    create() {
        let gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        gameTitle.setOrigin(0.5, 0);

        this.playAgain = this.add.image(T3.game.config.width / 2, T3.game.config.height - 90, "playAgain");
        this.playAgain.setOrigin(0.5, 1);
        this.playAgain.setInteractive();
        this.playAgain.on('pointerdown', this.loadGameMenuScene, this);
    }

    loadGameMenuScene() {
        this.scene.start(T3.GameOptions.scenes.mainMenuScene);
    }
}