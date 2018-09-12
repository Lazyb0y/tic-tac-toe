class GameEndScene extends Phaser.Scene {
    constructor() {
        super(T3.GameOptions.scenes.gameEndScene);
    }

    create() {
        console.log("Game End!");
    }
}