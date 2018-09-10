var T3 = T3 || {};

T3.GameOptions = {
    aspectRatio: 16 / 9,
};

/* Resizing the game to cover the wider area possible */
function resizeGame() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = T3.game.config.width / T3.game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

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
    resizeGame();
    window.addEventListener("resize", resizeGame);
    window.addEventListener('contextmenu', event => event.preventDefault());
};