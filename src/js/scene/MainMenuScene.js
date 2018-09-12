class MainMenuScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.mainMenuScene);
    }

    init() {
        this.allowUserInput = false;
        this.isPlayingReverse = false;
        this.firstPlayer = null;

        this.gameTitle = null;

        this.crossIcon = null;
        this.circleIcon = null;
        this.choosePlayerText = null;
    }

    create() {
        /* Adding UI images */
        this.gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        this.gameTitle.setOrigin(0.5, 0);

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

        this.showEntryAnimation();
    }

    showEntryAnimation() {
        let timerConfig = {
            delay: T3.GameOptions.animations.iconAppearAnimationDelay,
            callback: function () {

                if (!this.anims.get('drawCrossAnim')) {
                    let crossAnimConfig = {
                        key: 'drawCrossAnim',
                        frames: this.anims.generateFrameNumbers('cross', {
                            start: 0,
                            end: 5
                        }),
                        frameRate: 25,
                    };
                    this.anims.create(crossAnimConfig);
                }

                if (!this.anims.get('drawCircleAnim')) {
                    let circleAnimConfig = {
                        key: 'drawCircleAnim',
                        frames: this.anims.generateFrameNumbers('circle', {
                            start: 0,
                            end: 5
                        }),
                        frameRate: 25,
                    };
                    this.anims.create(circleAnimConfig);
                }

                this.crossIcon.on('animationcomplete', this.onCrossAnimationComplete, this);
                this.circleIcon.on('animationcomplete', this.onCircleAnimationComplete, this);

                this.crossIcon.anims.play('drawCrossAnim');
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }

    onCrossAnimationComplete(animation) {
        if (animation.key === 'drawCrossAnim') {
            if (!this.isPlayingReverse) {
                this.circleIcon.anims.play('drawCircleAnim');
            }
            else {
                this.scene.start(T3.GameOptions.scenes.gameScene, {
                    firstPlayer: this.firstPlayer
                });
            }
        }
    }

    onCircleAnimationComplete(animation) {
        if (animation.key === 'drawCircleAnim') {
            if (!this.isPlayingReverse) {
                this.choosePlayerText.alpha = 1;
                this.allowUserInput = true;
            }
            else {
                this.crossIcon.anims.playReverse('drawCrossAnim');
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
                this.circleIcon.anims.playReverse('drawCircleAnim');
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }
}