class GameService {
    constructor(){
        let easyWords = [ "cat", "ghost", "cow", "bug", "snake", "lips", "socks", "coat", "heart", "kite", "milk", "skateboard", "apple", "mouse", "star", "whale", "hippo", "face", "spoon", "sun", "flower", "banana", "book", "light", "apple", "smile", "shoe", "hat", "dog", "duck", "bird", "person", "ball", "nose", "jacket", "beach", "cookie", "drum", "worm", "cup", "pie", "snowflake", "jar", "tree", "slide", "swing", "water", "ocean", "mouth", "eyes", "boy", "girl", "house", "bed", "shirt", "egg", "cheese", "circle"];
        let mediumWords = [ "horse", "trip", "round", "park", "state", "baseball", "dominoes", "hockey", "whisk", "mattress", "circus", "cowboy", "skate", "thief", "spring", "toast", "half", "door", "backbone", "treasure", "pirate", "whistle", "coal", "photograph", "aircraft", "key", "frog", "pinwheel", "battery", "password", "electricity", "teapot", "nature", "outside", "spare", "platypus", "song", "bomb", "garbage", "ski", "palace", "queen", "computer", "lawnmower", "cake", "mailman", "bicycle", "lightsaber", "deep", "shallow", "America", "bowtie", "wax", "music"];
        let difficultWords = [ "snag", "mime", "hail", "password", "newsletter", "dripping", "catalog", "laser", "myth", "hydrogen", "darkness", "vegetarian", "ditch", "neighborhood", "retail", "fabric", "jazz", "commercial", "double", "landscape", "jungle", "peasant", "clog", "bookend", "pharmacist", "ringleader", "diagonal", "dorsal", "macaroni", "yolk", "shrew", "wobble", "dizzy", "drawback", "mirror", "migrate", "dashboard", "download", "important", "bargain", "scream", "professor", "landscape", "husband", "comfy", "biscuit", "rubber", "exercise", "chestnut", "glitter", "fireside", "logo", "barber", "drought", "bargain", "professor", "vitamin"] ;

        this.levels = {
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

        this.score = 0;
        this.lives = 3;
    }

    getLevelByDifficulty(difficulty) {
        return this.levels[difficulty];
    }

    getNextLevel(currentLevel) {
        return this.levels[currentLevel.nextLevel.name];
    }

    getCurrentScore() {
        return this.score;
    }

    setScore(score) {
        this.score = score;
    }

    getCurrentLives(){
        return this.lives;
    }

    setLives(lives){
        this.lives = lives;
    }
}

export default GameService;
