import LoginService from "../loginService.js";

import lettersTexture from "../assets/letters.png";
import lettersDescription from "../assets/letters.json";

class Main extends Phaser.Scene {
    constructor() {
        super({
            key: "main"
        });

        this.loginSrv = new LoginService();

        this.loginButton;
        this.logoutButton;
        this.loginBadge;
    }

    preload() {
        this.load.atlas('letters', lettersTexture, lettersDescription);
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

        this.input.keyboard.createCombo("play");
        this.input.keyboard.createCombo("ranking");

        this.input.keyboard.on("keycombomatch", event => {
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            if(typedWord === "play") {
                this.scene.start("game");
            } else if (typedWord === "ranking") {
                this.scene.start("ranking");
            }
        });

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

        this.loginBadge = this.createTextBox(this, 10, this.game.canvas.height - 100);

        this.loginSrv.setAuthStateObserver(this.authStateChanged.bind(this));
    }

    authStateChanged(user) {
        this.loginSrv.user = user;
        this.loginButton.visible = !user;
        this.logoutButton.visible = !!user;
        let loggedInUsername = user ? (user.displayName || "No name") : "Not logged in";
        this.loginBadge.start(loggedInUsername, 50);
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

    createTextBox(scene, xPos, yPos) {
        let textBox = scene.rexUI.add.textBox({
            x: xPos,
            y: yPos,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xccbbbb)
                .setStrokeStyle(2, 0x3f2c2c),

            text: scene.add.text(0, 0, this.loginSrv.loggedInUsername, {
                fill: "#ffffff",
                font: "12px carbontyperegular"
            }),

            action: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x3f2c2c).setAlpha(0),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
        .setOrigin(0)
        .layout();

        textBox
            .setInteractive()
            .on("pointerdown", function() {
                if (this.isTyping) {
                    this.stop(true);
                }
            }, textBox)
            .on("pageend", function() {
                let icon = this.getElement("action").setAlpha(1);
                icon.y -= 30;
                scene.tweens.add({
                    targets: icon,
                    y: "+=30",
                    ease: "Cubic",
                    duration: 500,
                    repeat: 0,
                    yoyo: false
                });
            }, textBox);

        return textBox;
    }
}

export default Main;
