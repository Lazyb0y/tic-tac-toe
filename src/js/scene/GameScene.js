class GameScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameScene);
    }

    init() {
        this.allowUserInput = false;

        this.gameTitle = null;
        this.restart = null;
        this.board = null;
    }

    create() {
        /* Adding UI images */
        this.gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        this.gameTitle.setOrigin(0.5, 0);

        /* Game board */
        this.board = this.add.sprite(T3.game.config.width / 2, T3.game.config.height / 2, "board", 12);
        this.board.setOrigin(0.5, 0.5);

        this.restart = this.add.image(T3.game.config.width / 2, T3.game.config.height - 90, "restart");
        this.restart.setOrigin(0.5, 1);
    }
}