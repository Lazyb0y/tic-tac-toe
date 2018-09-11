class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.mainMenuScene);
    }

    create() {
        /* Adding UI images */
        let gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        gameTitle.setOrigin(0.5, 0);
    }
}