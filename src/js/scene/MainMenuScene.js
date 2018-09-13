class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.mainMenuScene);
    }

    init() {
        this.allowUserInput = false;
        this.isPlayingReverse = false;
        this.firstPlayer = null;
        this.selectedDifficulty = null;

        this.gameTitle = null;

        this.crossIcon = null;
        this.circleIcon = null;
        this.choosePlayerText = null;

        this.difficultyText = null;
        this.arrowLeft = null;
        this.arrowRight = null
    }

    create() {
        /* Adding UI images */
        this.gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        this.gameTitle.setOrigin(0.5, 0);

        /* Game difficulty */
        this.difficultyText = this.add.image(T3.game.config.width / 2, (T3.game.config.height / 4) * 1.5, "difficultyMedium");
        this.difficultyText.setOrigin(0.5, 0.5);
        this.difficultyText.alpha = 0;

        this.arrowLeft = this.add.image(110, (T3.game.config.height / 4) * 1.5, "arrowLeft");
        this.arrowLeft.setOrigin(0.5, 0.5);
        this.arrowLeft.setInteractive();
        this.arrowLeft.on('pointerdown', function () {
            this.switchDifficulty(-1);
        }, this);
        this.arrowLeft.alpha = 0;

        this.arrowRight = this.add.image(T3.game.config.width - 110, (T3.game.config.height / 4) * 1.5, "arrowRight");
        this.arrowRight.setOrigin(0.5, 0.5);
        this.arrowRight.setInteractive();
        this.arrowRight.on('pointerdown', function () {
            this.switchDifficulty(1);
        }, this);
        this.arrowRight.alpha = 0;

        /* Player icons */
        this.crossIcon = this.add.sprite(T3.game.config.width / 4 + 50, T3.game.config.height / 2, "cross", 0);
        this.crossIcon.setOrigin(0.5, 0);
        this.crossIcon.setInteractive();
        this.crossIcon.on('pointerdown', function () {
            this.firstPlayer = PlayerType.Human;
            this.startGame();
        }, this);

        this.circleIcon = this.add.sprite((T3.game.config.width / 4) * 3 - 50, T3.game.config.height / 2, "circle", 0);
        this.circleIcon.setOrigin(0.5, 0);
        this.circleIcon.setInteractive();
        this.circleIcon.on('pointerdown', function () {
            this.firstPlayer = PlayerType.Bot;
            this.startGame();
        }, this);

        /* Choose player text */
        this.choosePlayerText = this.add.image(T3.game.config.width / 2, (T3.game.config.height / 4) * 3, "chooseplayer");
        this.choosePlayerText.setOrigin(0.5, 0);
        this.choosePlayerText.alpha = 0;

        /* Loading game difficulty*/
        switch (Number(localStorage.getItem(T3.GameOptions.storage.difficulty))) {
            case DifficultyLevel.Easy:
                this.selectedDifficulty = DifficultyLevel.Easy;
                break;
            case DifficultyLevel.Medium:
                this.selectedDifficulty = DifficultyLevel.Medium;
                break;
            case DifficultyLevel.Hard:
                this.selectedDifficulty = DifficultyLevel.Hard;
                break;
            default:
                this.selectedDifficulty = DifficultyLevel.Medium;
                break;
        }
        this.setDifficulty(this.selectedDifficulty);

        this.showEntryAnimation();
    }

    showEntryAnimation() {
        let timerConfig = {
            delay: T3.GameOptions.animations.iconAppearAnimationDelay,
            callback: function () {
                this.crossIcon.on('animationcomplete', this.onCrossAnimationComplete, this);
                this.circleIcon.on('animationcomplete', this.onCircleAnimationComplete, this);

                this.crossIcon.anims.play(T3.GameOptions.animations.keys.drawCross);
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }

    onCrossAnimationComplete(animation) {
        if (animation.key === T3.GameOptions.animations.keys.drawCross) {
            if (!this.isPlayingReverse) {
                this.circleIcon.anims.play(T3.GameOptions.animations.keys.drawCircle);
            }
            else {
                this.scene.start(T3.GameOptions.scenes.gameScene, {
                    firstPlayer: this.firstPlayer,
                    difficulty: this.selectedDifficulty
                });
            }
        }
    }

    onCircleAnimationComplete(animation) {
        if (animation.key === T3.GameOptions.animations.keys.drawCircle) {
            if (!this.isPlayingReverse) {
                this.choosePlayerText.alpha = 1;
                this.difficultyText.alpha = 1;
                this.arrowLeft.alpha = 1;
                this.arrowRight.alpha = 1;
                this.allowUserInput = true;
            }
            else {
                this.crossIcon.anims.playReverse(T3.GameOptions.animations.keys.drawCross);
            }
        }
    }

    startGame() {
        if (!this.allowUserInput) {
            return;
        }
        this.allowUserInput = false;

        let timerConfig = {
            delay: T3.GameOptions.animations.iconAppearAnimationDelay,
            callback: function () {
                this.isPlayingReverse = true;
                this.circleIcon.anims.playReverse(T3.GameOptions.animations.keys.drawCircle);
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }

    switchDifficulty(direction) {
        if (!this.allowUserInput) {
            return;
        }

        switch (this.selectedDifficulty) {
            case DifficultyLevel.Easy:
                if (direction > 0) {
                    this.selectedDifficulty = DifficultyLevel.Medium;
                }
                break;

            case DifficultyLevel.Medium:
                if (direction > 0) {
                    this.selectedDifficulty = DifficultyLevel.Hard;
                }
                else if (direction < 0) {
                    this.selectedDifficulty = DifficultyLevel.Easy;
                }
                break;

            case DifficultyLevel.Hard:
                if (direction < 0) {
                    this.selectedDifficulty = DifficultyLevel.Medium;
                }
                break;
        }

        this.setDifficulty(this.selectedDifficulty);
    }

    setDifficulty(difficulty) {
        difficulty = difficulty || DifficultyLevel.Medium;
        this.selectedDifficulty = difficulty;
        localStorage.setItem(T3.GameOptions.storage.difficulty, this.selectedDifficulty);

        switch (this.selectedDifficulty) {
            case DifficultyLevel.Easy:
                this.difficultyText.setTexture('difficultyEasy');
                this.arrowLeft.visible = false;
                break;

            case DifficultyLevel.Medium:
                this.difficultyText.setTexture('difficultyMedium');
                this.arrowLeft.visible = true;
                this.arrowRight.visible = true;
                break;

            case DifficultyLevel.Hard:
                this.difficultyText.setTexture('difficultyHard');
                this.arrowRight.visible = false;
                break;
        }
    }
}
