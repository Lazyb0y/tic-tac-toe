class GameScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameScene);
    }

    init(data) {
        this.data = data;

        this.firstPlayer = this.data.firstPlayer;
        this.currentTurn = this.firstPlayer;
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

        /* Game board */
        this.board = this.add.sprite(T3.game.config.width / 2, T3.game.config.height / 2, "board", 0);
        this.board.setOrigin(0.5, 0.5);
        this.board.setInteractive();
        this.board.on('pointerdown', this.handleBoardTap, this);

        this.restart = this.add.image(T3.game.config.width / 2, T3.game.config.height - 90, "restart");
        this.restart.setOrigin(0.5, 1);
        this.restart.setInteractive();
        this.restart.on('pointerdown', function () {
            this.scene.start(T3.GameOptions.scenes.mainMenuScene);
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

        this.calculateBoardCenters();
    }

    calculateBoardCenters() {
        let boardBorderWidth = ((this.board.height / 100) * 4.286);
        let halfCube = Math.round((this.board.height - boardBorderWidth * 2) / 6);

        let top = this.board.getTopLeft().y;
        let bottom = this.board.getBottomRight().y;
        let left = this.board.getTopLeft().x;
        let right = this.board.getBottomRight().x;
        let center = this.board.getCenter();

        /* Calculation center location */
        this.boardState[0].center = {x: left + halfCube, y: top + halfCube};
        this.boardState[1].center = {x: center.x, y: top + halfCube};
        this.boardState[2].center = {x: right - halfCube, y: top + halfCube};

        this.boardState[3].center = {x: left + halfCube, y: center.y};
        this.boardState[4].center = {x: center.x, y: center.y};
        this.boardState[5].center = {x: right - halfCube, y: center.y};

        this.boardState[6].center = {x: left + halfCube, y: bottom - halfCube};
        this.boardState[7].center = {x: center.x, y: bottom - halfCube};
        this.boardState[8].center = {x: right - halfCube, y: bottom - halfCube};
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
                        this.restart.alpha = 1;
                        if (this.currentTurn === PlayerType.Bot) {
                            this.time.delayedCall(T3.GameOptions.animations.botCubeDelay, function () {
                                this.botTurn();
                            }, [], this);
                        }
                        else {
                            this.allowUserInput = true;
                        }
                    }
                }, this);

                this.board.anims.play('drawBoardAnim');
            },
            callbackScope: this,
            paused: false
        };

        this.time.addEvent(timerConfig);
    }

    handleBoardTap(event) {
        if (this.allowUserInput !== true) {
            return;
        }
        this.allowUserInput = false;

        let selectedCube = this.getSelectedCube(event.x, event.y);
        let cube = this.boardState[selectedCube];
        if (cube.used) {
            this.allowUserInput = true;
            return;
        }
        cube.used = true;
        cube.player = PlayerType.Human;

        let animName = 'draw' + (this.firstPlayer === PlayerType.Human ? 'crossCube' : 'circleCube');
        let turnCube = this.add.sprite(cube.center.x, cube.center.y, this.firstPlayer === PlayerType.Human ? 'crossCube' : 'circleCube', 0);
        turnCube.setOrigin(0.5, 0.5);

        if (!this.anims.get(animName)) {
            let playerAnimConfig = {
                key: animName,
                frames: this.anims.generateFrameNumbers(this.firstPlayer === PlayerType.Human ? 'crossCube' : 'circleCube', {
                    start: 0,
                    end: 5
                }),
                frameRate: 25,
            };
            this.anims.create(playerAnimConfig);
        }

        turnCube.on('animationcomplete', function (animation) {
            if (animation.key === animName) {
                /* Checking win status */
                let winCubes = this.checkWin();
                if (winCubes) {
                    this.gameEnd(PlayerType.Human);
                }
                else {
                    this.time.delayedCall(T3.GameOptions.animations.botCubeDelay, function () {
                        this.currentTurn = PlayerType.Bot;
                        this.botTurn();
                    }, [], this);
                }
            }
        }, this);
        turnCube.anims.play(animName);
    }

    getSelectedCube(x, y) {
        let relativeX = x - this.board.getTopLeft().x;
        let relativeY = y - this.board.getTopLeft().y;

        let cubeSize = this.board.height / 3;
        let cube1 = cubeSize;
        let cube2 = cubeSize * 2;
        let cube3 = cubeSize * 3;

        /* row 1 */
        if ((0 < relativeX && relativeX < cube1) && (0 < relativeY && relativeY < cube1)) {
            return 0;
        }

        if ((cube1 < relativeX && relativeX < cube2) && (0 < relativeY && relativeY < cube1)) {
            return 1;
        }

        if ((cube2 < relativeX && relativeX < cube3) && (0 < relativeY && relativeY < cube1)) {
            return 2;
        }

        /* row 2 */
        if ((0 < relativeX && relativeX < cube1) && (cube1 < relativeY && relativeY < cube2)) {
            return 3;
        }

        if ((cube1 < relativeX && relativeX < cube2) && (cube1 < relativeY && relativeY < cube2)) {
            return 4;
        }

        if ((cube2 < relativeX && relativeX < cube3) && (cube1 < relativeY && relativeY < cube2)) {
            return 5;
        }

        /* row 3 */
        if ((0 < relativeX && relativeX < cube1) && (cube2 < relativeY && relativeY < cube3)) {
            return 6;
        }

        if ((cube1 < relativeX && relativeX < cube2) && (cube2 < relativeY && relativeY < cube3)) {
            return 7;
        }

        if ((cube2 < relativeX && relativeX < cube3) && (cube2 < relativeY && relativeY < cube3)) {
            return 8;
        }

        return null;
    }

    botTurn() {
        let nextEmptyCube = this.nextRandomEmptyCube();
        if (!nextEmptyCube) {
            this.gameEnd(null);
            return;
        }
        nextEmptyCube.used = true;
        nextEmptyCube.player = PlayerType.Bot;

        let turnCube = this.add.sprite(nextEmptyCube.center.x, nextEmptyCube.center.y, this.firstPlayer === PlayerType.Bot ? 'crossCube' : 'circleCube', 0);
        turnCube.setOrigin(0.5, 0.5);

        /* Cube draw animation */
        let animName = 'draw' + (this.firstPlayer === PlayerType.Bot ? 'crossCube' : 'circleCube');
        if (!this.anims.get(animName)) {
            let botAnimConfig = {
                key: animName,
                frames: this.anims.generateFrameNumbers(this.firstPlayer === PlayerType.Bot ? 'crossCube' : 'circleCube', {
                    start: 0,
                    end: 5
                }),
                frameRate: 25,
            };
            this.anims.create(botAnimConfig);
        }

        turnCube.on('animationcomplete', function (animation) {
            if (animation.key === animName) {
                /* Checking win status */
                let winCubes = this.checkWin();
                if (winCubes) {
                    this.gameEnd(PlayerType.Bot);
                }
                else {
                    this.currentTurn = PlayerType.Human;
                    this.allowUserInput = true;
                }
            }
        }, this);
        turnCube.anims.play(animName);
    }

    nextRandomEmptyCube() {
        let emptyCubes = [];
        for (let i = 0; i < this.boardState.length; i++) {
            let cube = this.boardState[i];
            if (!cube.used) {
                emptyCubes.push(i);
            }
        }

        if (emptyCubes.length === 0) {
            return null;
        }
        else {
            let randomCube = Phaser.Utils.Array.GetRandom(emptyCubes);
            return this.boardState[randomCube];
        }
    }

    gameEnd(winner) {
        this.scene.start(T3.GameOptions.scenes.gameEndScene, {
            winner: winner
        });
    }

    checkWin() {
        /* Checking row wise */
        if (this.boardState[0].used && this.boardState[0].player === this.boardState[1].player && this.boardState[0].player === this.boardState[2].player) {
            return [this.boardState[0], this.boardState[1], this.boardState[2]];
        }

        if (this.boardState[3].used && this.boardState[3].player === this.boardState[4].player && this.boardState[3].player === this.boardState[5].player) {
            return [this.boardState[3], this.boardState[4], this.boardState[5]];
        }

        if (this.boardState[6].used && this.boardState[6].player === this.boardState[7].player && this.boardState[6].player === this.boardState[8].player) {
            return [this.boardState[6], this.boardState[7], this.boardState[8]];
        }

        /* Checking column wise */
        if (this.boardState[0].used && this.boardState[0].player === this.boardState[3].player && this.boardState[0].player === this.boardState[6].player) {
            return [this.boardState[0], this.boardState[3], this.boardState[6]];
        }

        if (this.boardState[1].used && this.boardState[1].player === this.boardState[4].player && this.boardState[1].player === this.boardState[7].player) {
            return [this.boardState[1], this.boardState[4], this.boardState[7]];
        }

        if (this.boardState[2].used && this.boardState[2].player === this.boardState[5].player && this.boardState[2].player === this.boardState[8].player) {
            return [this.boardState[2], this.boardState[5], this.boardState[8]];
        }

        /* Checking diagonals */
        if (this.boardState[4].used) {
            if (this.boardState[4].player === this.boardState[0].player && this.boardState[4].player === this.boardState[8].player) {
                return [this.boardState[0], this.boardState[4], this.boardState[8]];
            }

            if (this.boardState[4].player === this.boardState[2].player && this.boardState[4].player === this.boardState[6].player) {
                return [this.boardState[2], this.boardState[4], this.boardState[6]];
            }
        }

        return null;
    }
}