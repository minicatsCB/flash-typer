import LoginService from "../loginService.js";
import Utils from "../utils.js";

import lettersTexture from "../assets/letters.png";
import lettersDescription from "../assets/letters.json";

class Main extends Phaser.Scene {
    constructor() {
        super({
            key: "main"
        });

        this.utils = new Utils();
        this.loginSrv = new LoginService();

        this.loginButton;
        this.logoutButton;
        this.loginBadge;
        this.logoutWarning;
    }

    preload() {
        this.load.atlas('letters', lettersTexture, lettersDescription);
    }

    create() {
        // Set the backgrond color to white
        this.cameras.main.setBackgroundColor("#ffffff");

        // Define the zone where we want the particles to be emitted from
        let emitZone = new Phaser.Geom.Rectangle(0, -10, 540, 20);
        // Create a numbered array just to access the letters texture atlas by index
        let letterIndices = Phaser.Utils.Array.NumberArray(1, 25).map(String);
        // Create the particle emitter with the previous created objects
        this.utils.createParticles(this, "letters", emitZone, letterIndices);

        // Add some texts to the scene
        let canvasXMiddle = this.game.canvas.width / 2;
        let titleText = this.add.text(canvasXMiddle, this.game.canvas.height / 4, "Flash Typer", {
            fill: "#000000",
            font: "48px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        let instructionsText = this.add.text(canvasXMiddle, titleText.y + 50, "Choose an option by typing it", {
            fill: "#000000",
            font: "16px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        let playText = this.add.text(canvasXMiddle, instructionsText.y + 50, "play", {
            fill: "#000000",
            font: "32px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        let rankingText = this.add.text(canvasXMiddle, playText.y + 50, "ranking", {
            fill: "#000000",
            font: "32px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        // Listen for "play" and "ranking" words to be typed by the user
        this.input.keyboard.createCombo("play");
        this.input.keyboard.createCombo("ranking");

        this.input.keyboard.on("keycombomatch", event => {
            // Convert the matched word to lower case. Just for convenience
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            if(typedWord === "play") {
                this.scene.start("game");
            } else if (typedWord === "ranking") {
                this.scene.start("ranking");
            }
        });

        // Define the login and logout buttons
        this.loginButton = this.add.text(rankingText.x, rankingText.y + 100, "Login with Github", {
            fill: "#000000",
            font: "12px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        this.loginButton.setInteractive({ useHandCursor: true });
        this.loginButton.on("pointerover", this.enterButtonHoverState);
        this.loginButton.on("pointerout", this.enterButtonRestState);
        this.loginButton.on("pointerdown", this.loginSrv.signInWithGithub.bind(this.loginSrv));
        this.loginButton.visible = false;

        this.logoutButton = this.add.text(rankingText.x, rankingText.y + 100, "Logout from Github", {
            fill: "#000000",
            font: "12px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        this.logoutButton.setInteractive({ useHandCursor: true });
        this.logoutButton.on("pointerover", this.enterButtonHoverState);
        this.logoutButton.on("pointerout", this.enterButtonRestState);
        this.logoutButton.on("pointerdown", this.loginSrv.signOut);
        this.logoutButton.visible = false;

        // Define a login badge that will contain the name of the user if logged in
        this.loginBadge = this.utils.createTextBox(this, 10, this.game.canvas.height - 100, this.loginSrv.loggedInUsername);
        this.logoutWarning = this.utils.createAnimatedText(this, 10, this.game.canvas.height - 120, this.loginSrv.loggedInUsername);

        // Listen to changes in the auth state
        this.loginSrv.setAuthStateObserver(this.authStateChanged.bind(this));
    }

    authStateChanged(user) {
        this.loginSrv.user = user;

        // Make visible the corresponding button
        this.loginButton.visible = !user;
        this.logoutButton.visible = !!user;

        // Activate the login badge with the received data
        let loggedInUsername = user ? (user.displayName || "No name") : "Not logged in";
        this.loginBadge.start(loggedInUsername, 50);

        let loggedOutWarning = !user ? "Your score will not be saved :(" : "";
        this.logoutWarning.start(loggedOutWarning, 50);
    }

    enterButtonHoverState() {
        this.setStyle({
            fill: "#f91616"
        });
    }

    enterButtonRestState() {
        this.setStyle({
            fill: "#000000"
        });
    }
}

export default Main;
