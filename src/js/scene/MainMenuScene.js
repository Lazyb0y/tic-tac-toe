class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.mainMenuScene);
    }

    init() {
        this.crossIcon = null;
        this.circleIcon = null;
    }

    create() {
        /* Adding UI images */
        let gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        gameTitle.setOrigin(0.5, 0);

        /* Player icons */
        let crossIcon = this.add.sprite(T3.game.config.width / 4 + 50, T3.game.config.height / 2, "cross", 5);
        crossIcon.setOrigin(0.5, 0);

        let circleIcon = this.add.sprite((T3.game.config.width / 4) * 3 - 50, T3.game.config.height / 2, "circle", 5);
        circleIcon.setOrigin(0.5, 0);

        /* Choose player text */
        let choosePlayer = this.add.image(T3.game.config.width / 2, (T3.game.config.height / 4) * 3, "chooseplayer");
        choosePlayer.setOrigin(0.5, 0);
    }
}