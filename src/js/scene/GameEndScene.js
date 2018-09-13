class GameEndScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameEndScene);
    }

    init(data) {
        this.winner = data.winner;

        this.playAgain = null;
        this.resultText = null;
        this.winnerSymbol = null;
    }

    create() {
        let gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        gameTitle.setOrigin(0.5, 0);

        this.resultText = this.add.image(T3.game.config.width / 2, (T3.game.config.height / 4) * 1.5, "drawText");
        this.resultText.setOrigin(0.5, 1);
        this.resultText.alpha = 0;

        this.winnerSymbol = this.add.image(T3.game.config.width / 2, T3.game.config.height / 2, "egg");
        this.winnerSymbol.setOrigin(0.5, 0);
        this.winnerSymbol.alpha = 0;

        this.playAgain = this.add.image(T3.game.config.width / 2, T3.game.config.height + 90, "playAgain");
        this.playAgain.setOrigin(0.5, 0);
        this.playAgain.setInteractive();
        this.playAgain.on('pointerdown', this.loadGameMenuScene, this);

        this.showResult();
    }

    showResult() {
        this.tweens.add({
            targets: [this.playAgain],
            y: T3.game.config.height - 180,
            duration: T3.GameOptions.animations.buttonTweenDelay,
            callbackScope: this,
            onComplete: function () {
                if (this.winner === PlayerType.Human) {
                    this.resultText.setTexture('winText');
                    this.winnerSymbol.setTexture('cup');
                }
                else if (this.winner === PlayerType.Bot) {
                    this.resultText.setTexture('looseText');
                    this.winnerSymbol.setTexture('robotFace');
                }
                else {
                    this.resultText.setTexture('drawText');
                    this.winnerSymbol.setTexture('egg');
                }

                this.tweens.add({
                    targets: [this.resultText, this.winnerSymbol],
                    alpha: 1,
                    duration: T3.GameOptions.animations.alphaTweenSpeed
                });
            }
        });
    }

    loadGameMenuScene() {
        this.tweens.add({
            targets: [this.playAgain],
            y: T3.game.config.height + 90,
            duration: T3.GameOptions.animations.buttonTweenDelay,
            callbackScope: this,
            onComplete: function () {
                this.scene.start(T3.GameOptions.scenes.mainMenuScene);
            }
        });
    }
}