class GameScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameScene);
    }

    init() {
        this.allowUserInput = false;
        this.boardState = null;

        this.gameTitle = null;
        this.restart = null;
        this.board = null;
    }

    create() {
        /* Adding UI images */
        this.gameTitle = this.add.image(T3.game.config.width / 2, 90, "gametitle");
        this.gameTitle.setOrigin(0.5, 0);
        this.gameTitle.alpha = 0;

        /* Game board */
        this.board = this.add.sprite(T3.game.config.width / 2, T3.game.config.height / 2, "board", 0);
        this.board.setOrigin(0.5, 0.5);

        this.restart = this.add.image(T3.game.config.width / 2, T3.game.config.height - 90, "restart");
        this.restart.setOrigin(0.5, 1);
        this.restart.setInteractive();
        this.restart.on('pointerdown', function () {
            if (this.allowUserInput) {
                this.scene.start(T3.GameOptions.scenes.mainMenuScene);
            }
        }, this);
        this.restart.alpha = 0;

        this.initBoard();
        this.showEntryAnimation();
    }

    initBoard() {
        this.boardState = [];

        /* Initializing individual empty element */
        this.boardState.push({used: null, player: null, index: 0, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 1, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 2, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 3, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 4, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 5, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 6, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 7, center: {x: null, y: null}});
        this.boardState.push({used: null, player: null, index: 8, center: {x: null, y: null}});
    }

    showEntryAnimation() {
        let timerConfig = {
            delay: T3.GameOptions.animations.iconAppearAnimationDelay,
            callback: function () {

                if (!this.anims.get('drawBoardAnim')) {
                    let boardAnimConfig = {
                        key: 'drawBoardAnim',
                        frames: this.anims.generateFrameNumbers('board', {
                            start: 0,
                            end: 12
                        }),
                        frameRate: 25,
                    };
                    this.anims.create(boardAnimConfig);
                }

                this.board.on('animationcomplete', function (animation) {
                    if (animation.key === 'drawBoardAnim') {
                        this.gameTitle.alpha = 1;
                        this.restart.alpha = 1;
                        this.allowUserInput = true;
                    }
                }, this);

                this.board.anims.play('drawBoardAnim');
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }
}