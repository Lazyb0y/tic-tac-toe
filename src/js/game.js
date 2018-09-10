var T3 = T3 || {};

T3.GameOptions = {
    aspectRatio: 16 / 9,
};

window.onload = function () {
    let width = 900;

    T3.GameConfig = {
        width: width,
        height: width * T3.GameOptions.aspectRatio,
        backgroundColor: 0x14BDAC,
        scene: []
    };

    /* Initializing the Phaser 3 framework */
    T3.game = new Phaser.Game(T3.GameConfig);
    window.focus();
};