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
    let combos = {};

    let words = ["cat", "dog", "house"];
    let allPosters = words.map(word => {
        this.input.keyboard.createCombo(word);
        let poster = createPoster(word, this);

        // Associate each combo with a poster.
        // This way, we can destroy the corresponding poster when
        // WHOLE a word is typed, this is, a combo is matched
        combos[word] = poster;

        return poster;
    });

    // This will listen for a WHOLE word to be typed
    this.input.keyboard.on('keycombomatch', function (event) {
        let typedWord = event.keyCodes.map(keyCode => {
            return String.fromCharCode(keyCode);
        }).join("").toLowerCase();
        
        destroyPoster(0, combos[typedWord]);
    });

    // Put an empty object at the bottom of the screen to detect when a poster collides with it
    // NOTE: The X position = 15 is a fix to adjust the position more precisely
    let bottomCollider = this.physics.add.image(15, this.game.canvas.height).setImmovable(true);
    bottomCollider.setSize(this.game.canvas.width, 30, false);
    this.physics.add.collider(bottomCollider, allPosters, destroyPoster);
}

function destroyPoster(bottomCollider, poster) {
    poster.destroy();
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
