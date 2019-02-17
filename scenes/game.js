let wordsObject;
let score = 0;
let scoreText;

class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'game'
        });
    }

    preload() {
        this.load.image("paper", "assets/paper.png");
    }

    create() {
        let words = ["cat", "dog", "house"];
        wordsObject = this.createWordsObject(words);
        let allPosters = [];
        let combos = {};
        for(let word in wordsObject) {
            this.input.keyboard.createCombo(word);
            let poster = this.createPoster(word, this);

            // Associate each combo with a poster.
            // This way, we can destroy the corresponding poster when
            // WHOLE a word is typed, this is, a combo is matched
            combos[word] = poster;

            allPosters.push(poster);
        }

        // The text to be shown in the score area
        scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#fff'
        });

        // This will listen for a WHOLE word to be typed
        this.input.keyboard.on('keycombomatch', function (event) {
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            // The match is only valid if the word hasn't been typed yet (it's alive)
            if(wordsObject[typedWord].isAlive === true) {
                wordsObject[typedWord].isAlive = false;
                combos[typedWord].destroy();
                score += 10;
                scoreText.setText("Score: " + score);
            }
        });

        // Put an empty object at the bottom of the screen to detect when a poster collides with it
        // NOTE: The X position = 15 is a fix to adjust the position more precisely
        let bottomCollider = this.physics.add.image(15, this.game.canvas.height).setImmovable(true);
        bottomCollider.setSize(this.game.canvas.width, 30, false);
        this.physics.add.collider(bottomCollider, allPosters, this.posterCollided);
    }

    createWordsObject(words){
        // If the word has already been typed, then it is NOT alive (false)
        // If the word has not been typed yed, then it is alive (true). Default value
        let obj = {};
        for(let word of words) {
            obj[word] = { isAlive: true };
        }

        return obj;
    }

    posterCollided(bottomCollider, poster) {
        // NOTE: We know it's position 1 of the array because when we created
        // the poster container, we added the image first and the text secondly
        let collidedWord = poster.list[1].text;
        wordsObject[collidedWord].isAlive = false;
        poster.destroy();
        score = (score <= 0) ? 0 : (score - 10);
        scoreText.setText("Score: " + score);
    }

    // A poster is an image and the specific word put together as a group
    createPoster(word, that) {
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

        // Put the poster randomly at the canvas top
        let randomX = Phaser.Math.Between(0, that.game.canvas.width);
        let randomY = Phaser.Math.Between(-(posterImage.displayHeight / 2), -(posterImage.displayHeight) * 2);

        // Create the poster itself by grouping both image and text in a "container"
        let container = that.add.container(randomX, randomY, [posterImage, posterText]);

        // Set the size of the container to the same size of the text (same as the image's)
        container.setSize(posterImage.displayWidth, posterImage.displayHeight);

        // Apply physics to the container
        that.physics.world.enable(container);
        container.body.setVelocity(0, 30);

        return container;
    }
}
