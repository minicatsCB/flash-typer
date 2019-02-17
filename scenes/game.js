let wordsObject;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let easyWords = [ "cat", "ghost", "cow", "bug", "snake", "lips", "socks", "coat", "heart", "kite", "milk", "skateboard", "apple", "mouse", "star", "whale", "hippo", "face", "spoon", "sun", "flower", "banana", "book", "light", "apple", "smile", "shoe", "hat", "dog", "duck", "bird", "person", "ball", "nose", "jacket", "beach", "cookie", "drum", "worm", "cup", "pie", "snowflake", "jar", "tree", "slide", "swing", "water", "ocean", "mouth", "eyes", "boy", "girl", "house", "bed", "shirt", "egg", "cheese", "circle"];
let mediumWords = [ "horse", "trip", "round", "park", "state", "baseball", "dominoes", "hockey", "whisk", "mattress", "circus", "cowboy", "skate", "thief", "spring", "toast", "half", "door", "backbone", "treasure", "pirate", "whistle", "coal", "photograph", "aircraft", "key", "frog", "pinwheel", "battery", "password", "electricity", "teapot", "nature", "outside", "spare", "platypus", "song", "bomb", "garbage", "ski", "palace", "queen", "computer", "lawnmower", "cake", "mailman", "bicycle", "lightsaber", "deep", "shallow", "America", "bowtie", "wax", "music"];
let difficultWords = [ "snag", "mime", "hail", "password", "newsletter", "dripping", "catalog", "laser", "myth", "hydrogen", "darkness", "vegetarian", "ditch", "neighborhood", "retail", "fabric", "jazz", "commercial", "double", "landscape", "jungle", "peasant", "clog", "bookend", "pharmacist", "ringleader", "diagonal", "dorsal", "macaroni", "yolk", "shrew", "wobble", "dizzy", "drawback", "mirror", "migrate", "dashboard", "download", "important", "bargain", "scream", "professor", "landscape", "husband", "comfy", "biscuit", "rubber", "exercise", "chestnut", "glitter", "fireside", "logo", "barber", "drought", "bargain", "professor", "vitamin"] ;
let levels = {
    easy: {
        name: "easy",
        posterVelocity: 50,
        wordList: easyWords,
        nextLevel: {
            name: "medium",
            neededScore: 30
        },
        isLastLevel: false
    },
    medium: {
        name: "medium",
        posterVelocity: 100,
        wordList: mediumWords,
        nextLevel: {
            name: "difficult",
            neededScore: 60
        },
        isLastLevel: false
    },
    difficult: {
        name: "difficult",
        posterVelocity: 200,
        wordList: difficultWords,
        isLastLevel: true
    }
}
let currentLevel = levels.easy;

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
        wordsObject = this.createWordsObject(currentLevel.wordList);
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
        scoreText = this.add.text(16, 16, 'Score: ' + score, {
            fontSize: '32px',
            fill: '#fff'
        });

        // The text to be shown in the lives area
        livesText = this.add.text(160, 16, 'Lives: ' + lives, {
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

    update() {
        if (lives > 0) {
            if(!currentLevel.isLastLevel) {
                if(score === currentLevel.nextLevel.neededScore) {
                    console.log("Going from " + currentLevel.name + " to " + currentLevel.nextLevel.name);
                    this.scene.start("game");
                    currentLevel = levels[currentLevel.nextLevel.name];
                }
            }
        } else {
            console.log("Game Over");
            this.physics.pause();
        }

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
        lives = (lives <= 0) ? 0 : --lives;
        livesText.setText("Lives: " + lives);
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
        container.body.setVelocity(0, currentLevel.posterVelocity);

        return container;
    }
}
