class GameEndScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameEndScene);
    }

    init(data) {
        this.winner = data.winner;

        this.playAgain = null;
        this.resultText = null;
    }

    create() {
        let gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        gameTitle.setOrigin(0.5, 0);

        this.resultText = this.add.image(T3.game.config.width / 2, (T3.game.config.height / 4) * 1.5, "drawText");
        this.resultText.setOrigin(0.5, 1);
        this.resultText.alpha = 0;

        this.playAgain = this.add.image(T3.game.config.width / 2, T3.game.config.height - 90, "playAgain");
        this.playAgain.setOrigin(0.5, 1);
        this.playAgain.setInteractive();
        this.playAgain.on('pointerdown', this.loadGameMenuScene, this);

        this.showResultText();
    }

    showResultText() {
        if (this.winner === PlayerType.Human) {
            this.resultText.setTexture('winText');
        }
        else if (this.winner === PlayerType.Bot) {
            this.resultText.setTexture('looseText');
        }
        else {
            this.resultText.setTexture('drawText');
        }

        this.tweens.add({
            targets: [this.resultText],
            alpha: 1,
            duration: T3.GameOptions.animations.alphaTweenSpeed
        });
    }

    loadGameMenuScene() {
        this.scene.start(T3.GameOptions.scenes.mainMenuScene);
    }
}