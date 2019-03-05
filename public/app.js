let config = {
    type: Phaser.AUTO,
    width: 800,
    heigth: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: [Main]
};

let game = new Phaser.Game(config);
