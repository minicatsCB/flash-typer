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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload() {
    this.load.image("paper", "assets/paper.png");
}

function create() {
    let words = ["cat", "dog", "house"];
    let allPosters = words.map(word => {
        return createPoster(word, this);
    });
}

// A poster is an image and the specific word put together as a group
function createPoster(word, that) {
    let posterImage = that.add.image(0, 0, "paper");
    let posterText = that.add.text(0, 0, word, {
        fontSize: "32px",
        fill: "#000",
        padding: 20
    });

    // Center the text on the image
    posterText.setOrigin(0.5, 0.5);

    // Set the size of the image to the same size of the text
    posterImage.displayWidth = posterText.getBounds().width;
    posterImage.displayHeight = posterText.getBounds().height;

    // Put the poster (image + text) randomly at the canvas top
    let randomX = Phaser.Math.Between(0, that.game.canvas.width);

    // Use a contanier to be able to move both image and text at the same time
    let container = that.add.container(randomX, -(posterImage.displayHeight/2), [posterImage, posterText]);

    // Set the size of the container to the same size of the text (same as the image's)
    container.setSize(posterImage.displayWidth, posterImage.displayHeight);

    // Apply physics to the container
    that.physics.world.enable(container);
    container.body.setVelocity(0, 30);

    return container;
}

function update() {

}
