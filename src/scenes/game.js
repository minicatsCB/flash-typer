import GameService from "../gameService.js";

import paper from "../assets/paper.png";
import heart from "../assets/heart.png";
import doubleDownArrow from "../assets/double_arrow_down.png";

import lettersTexture from "../assets/letters.png";
import lettersDescription from "../assets/letters.json";

import sheetsTexture from "../assets/sheets.png";
import sheetsDescription from "../assets/sheets.json";

class Game extends Phaser.Scene {
    constructor() {
        super({
            key: "game"
        });

        this.gameService = new GameService();
        this.currentLevel = this.gameService.getLevelByDifficulty("easy");

        this.wordsObject = {};
        this.combos = {};
        this.posterCreationInterval;
        this.scoreText;
        this.livesText;
        this.bottomCollider;
    }

    preload() {
        this.load.image("paper", paper);
        this.load.image("heart", heart);
        this.load.image("doubleDownArrow", doubleDownArrow);
        this.load.atlas('letters', lettersTexture, lettersDescription);
        this.load.atlas('sheets', sheetsTexture, sheetsDescription);
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");
        
        let emitZone = new Phaser.Geom.Rectangle(0, -10, 540, 20);
        let letterIndices = Phaser.Utils.Array.NumberArray(1, 25).map(String);

        this.add.particles('letters').createEmitter({
            alpha: {
                start: 1,
                end: 0.25,
                ease: 'Expo.easeOut'
            },
            angle: 0,
            blendMode: 'MULTIPLY',
            emitZone: {
                source: emitZone
            },
            frame: letterIndices,
            frequency: 150,
            lifespan: 7000,
            quantity: 1,
            scale: 0.5,
            tint: 0x000000,
            gravityY: 30
        });

        let arrow1 = this.add.image(this.game.canvas.width / 5, 20, "doubleDownArrow");
        let arrow2 = this.add.image(this.game.canvas.width / 2, 20, "doubleDownArrow");
        let arrow3 = this.add.image(this.game.canvas.width - (this.game.canvas.width / 5), 20, "doubleDownArrow");
        let arrows = [arrow1, arrow2, arrow3];

        this.tweens.add({
            targets: arrows,
            ease: 'Sine.easeInOut',
            duration: 1000,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            yoyo: true,
            repeat: 2
        });

        let levelWarning = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 2, "Level " + this.currentLevel.name, {
            font: "32px my_underwoodregular",
            fill: "#000000"
        }).setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: levelWarning,
            ease: 'Sine.easeInOut',
            duration: 1000,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            yoyo: true
        });

        let iter = this.createPoster();
        clearInterval(this.posterCreationInterval);  // Stop any previous started interval
        this.posterCreationInterval = setInterval(() => {
            iter.next();
        }, 1000);

        // The text to be shown in the score area
        this.scoreText = this.add.text(16, 16, this.gameService.getCurrentScore(), {
            font: "64px dialtoneregular",
            fill: "#000000"
        });

        // The text to be shown in the lives area
        this.livesText = this.add.text(16, 70, this.gameService.getCurrentLives(), {
            font: "64px dialtoneregular",
            fill: "#000000"
        });

        this.add.image(64, 90, "heart");

        // This will listen for a WHOLE word to be typed
        this.input.keyboard.on("keycombomatch", (event) => {
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            // The match is only valid if the word hasn't been typed yet (it's alive)
            if(this.wordsObject[typedWord].isAlive === true) {
                this.wordsObject[typedWord].isAlive = false;
                this.combos[typedWord].destroy();
                let updatedScore = this.gameService.getCurrentScore() + 10;
                this.gameService.setScore(updatedScore);
                this.scoreText.setText(this.gameService.getCurrentScore());
            }
        });

        // Put an empty object at the bottom of the screen to detect when a poster collides with it
        // NOTE: The X position = 15 is a fix to adjust the position more precisely
        this.bottomCollider = this.physics.add.image(15, this.game.canvas.height).setImmovable(true);
        this.bottomCollider.setSize(this.game.canvas.width, 30, false);    }

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
            this.scene.start("ranking", { achievedScore: this.gameService.getCurrentScore() });

            // Stop creating posters
            clearInterval(this.posterCreationInterval);

            this.physics.pause();
        }

    }

    posterCollided(bottomCollider, poster) {
        // NOTE: We know it's position 1 of the array because when we created
        // the poster container, we added the image first and the text secondly
        let collidedWord = poster.list[1].text;
        this.wordsObject[collidedWord].isAlive = false;
        poster.destroy();
        let currentLives = this.gameService.getCurrentLives();
        currentLives = (currentLives <= 0) ? 0 : --currentLives;
        this.gameService.setLives(currentLives);
        this.livesText.setText(this.gameService.getCurrentLives());
    }

    // A poster is an image and the specific word put together as a group
    *createPoster() {
        let index = 0;
        for(let word of this.currentLevel.wordList) {
            this.wordsObject[word] = { isAlive: true };
            let posterImage = this.add.image(0, 0, "sheets", Phaser.Math.Between(1, 6).toString());
            let posterText = this.add.text(0, 0, word, {
                fill: "#000",
                font: "32px my_underwoodregular",
                padding: 20
            });

            // Center the text on the image
            posterText.setOrigin(0.5, 0.5);

            // Set the size of the image to the same size of the text
            posterImage.displayWidth = posterText.getBounds().width;
            posterImage.displayHeight = posterText.getBounds().height;

            // Put the poster randomly at the canvas top
            let randomX = Phaser.Math.Between(posterImage.displayWidth / 2, this.game.canvas.width - (posterImage.displayWidth / 2));
            let randomY = Phaser.Math.Between(-(posterImage.displayHeight / 2), -(posterImage.displayHeight) * 2);

            // Create the poster itself by grouping both image and text in a "container"
            let container = this.add.container(randomX, randomY, [posterImage, posterText]);

            // Set the size of the container to the same size of the text (same as the image's)
            container.setSize(posterImage.displayWidth, posterImage.displayHeight);

            // Apply physics to the container
            this.physics.world.enable(container);
            container.body.setVelocity(0, this.currentLevel.posterVelocity);
            this.physics.add.collider(this.bottomCollider, container, this.posterCollided.bind(this));

            this.input.keyboard.createCombo(word);
            //Associate each combo with a poster.
            // This way, we can destroy the corresponding poster when
            // WHOLE a word is typed, this is, a combo is matched
            this.combos[word] = container;

            index++;
            yield container;
        }
    }
}

export default Game;
