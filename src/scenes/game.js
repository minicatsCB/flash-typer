import GameService from "../gameService.js";

import paper from "../assets/paper.png";
import background from "../assets/cartoon.jpg";

let wordsObject = {};
let combos = {};
let posterCreationInterval;
let scoreText;
let livesText;
let bottomCollider;

class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'game'
        });

        this.gameService = new GameService();
        this.currentLevel = this.gameService.getLevelByDifficulty("easy");
    }

    preload() {
        this.load.image("paper", paper);
        this.load.image("backgound", background);
    }

    create() {
        this.add.image(500, 500, 'backgound');

        let iter = this.createPoster();
        clearInterval(posterCreationInterval);  // Stop any previous started interval
        posterCreationInterval = setInterval(() => {
            iter.next();
        }, 1000);

        // The text to be shown in the score area
        scoreText = this.add.text(16, 16, 'Score: ' + this.gameService.getCurrentScore(), {
            fontSize: '32px',
            fill: '#fff'
        });

        // The text to be shown in the lives area
        livesText = this.add.text(160, 16, 'Lives: ' + this.gameService.getCurrentLives(), {
            fontSize: '32px',
            fill: '#fff'
        });

        // This will listen for a WHOLE word to be typed
        this.input.keyboard.on('keycombomatch', (event) => {
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            // The match is only valid if the word hasn't been typed yet (it's alive)
            if(wordsObject[typedWord].isAlive === true) {
                wordsObject[typedWord].isAlive = false;
                combos[typedWord].destroy();
                let updatedScore = this.gameService.getCurrentScore() + 10;
                this.gameService.setScore(updatedScore);
                scoreText.setText("Score: " + this.gameService.getCurrentScore());
            }
        });

        // Put an empty object at the bottom of the screen to detect when a poster collides with it
        // NOTE: The X position = 15 is a fix to adjust the position more precisely
        bottomCollider = this.physics.add.image(15, this.game.canvas.height).setImmovable(true);
        bottomCollider.setSize(this.game.canvas.width, 30, false);    }

    update() {
        if (this.gameService.getCurrentLives() > 0) {
            if(!this.currentLevel.isLastLevel) {
                if(this.gameService.getCurrentScore() === this.currentLevel.nextLevel.neededScore) {
                    console.log("Going from " + this.currentLevel.name + " to " + this.currentLevel.nextLevel.name);
                    this.scene.start("game");
                    this.currentLevel = this.gameService.getNextLevel(this.currentLevel);
                }
            }
        } else {
            console.log("Game Over");
            this.scene.start("ranking");

            // Stop creating posters
            clearInterval(posterCreationInterval);

            this.physics.pause();
        }

    }

    posterCollided(bottomCollider, poster) {
        // NOTE: We know it's position 1 of the array because when we created
        // the poster container, we added the image first and the text secondly
        let collidedWord = poster.list[1].text;
        wordsObject[collidedWord].isAlive = false;
        poster.destroy();
        let currentLives = this.gameService.getCurrentLives();
        currentLives = (currentLives <= 0) ? 0 : --currentLives;
        this.gameService.setLives(currentLives);
        livesText.setText("Lives: " + this.gameService.getCurrentLives());
    }

    // A poster is an image and the specific word put together as a group
    *createPoster() {
        let index = 0;
        for(let word of this.currentLevel.wordList) {
            wordsObject[word] = { isAlive: true };
            let posterImage = this.add.image(0, 0, "paper");
            let posterText = this.add.text(0, 0, word, {
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
            let randomX = Phaser.Math.Between(0, this.game.canvas.width);
            let randomY = Phaser.Math.Between(-(posterImage.displayHeight / 2), -(posterImage.displayHeight) * 2);

            // Create the poster itself by grouping both image and text in a "container"
            let container = this.add.container(randomX, randomY, [posterImage, posterText]);

            // Set the size of the container to the same size of the text (same as the image's)
            container.setSize(posterImage.displayWidth, posterImage.displayHeight);

            // Apply physics to the container
            this.physics.world.enable(container);
            container.body.setVelocity(0, this.currentLevel.posterVelocity);
            this.physics.add.collider(bottomCollider, container, this.posterCollided.bind(this));

            this.input.keyboard.createCombo(word);
            //Associate each combo with a poster.
            // This way, we can destroy the corresponding poster when
            // WHOLE a word is typed, this is, a combo is matched
            combos[word] = container;

            index++;
            yield container;
        }
    }
}

export default Game;
