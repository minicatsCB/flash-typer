let loginButton;
let logoutButton;

class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'main'
        });
    }

    preload() {

    }

    create() {
        let canvarXMiddle = this.game.canvas.width / 2;
        let titleText = this.add.text(canvarXMiddle, this.game.canvas.height / 4, 'Flash Typer', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let instructionsText = this.add.text(canvarXMiddle, titleText.y + 50, 'Choose an option by typing it', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let playText = this.add.text(canvarXMiddle, instructionsText.y + 50, 'play', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let rankingText = this.add.text(canvarXMiddle, playText.y + 50, 'ranking', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        this.input.keyboard.createCombo("play");
        this.input.keyboard.createCombo("ranking");

        this.input.keyboard.on('keycombomatch', event => {
            let typedWord = event.keyCodes.map(keyCode => {
                return String.fromCharCode(keyCode);
            }).join("").toLowerCase();

            if(typedWord === "play") {
                this.scene.start('game');
            } else if (typedWord === "ranking") {
                this.scene.start('ranking');
            }
        });

        loginButton = this.add.text(rankingText.x, rankingText.y + 100, "Login with Github", {
            fill: "#ffffff"
        }).setOrigin(0.5, 0.5);;

        loginButton.setInteractive({ useHandCursor: true });
        loginButton.on("pointerover", this.enterButtonHoverState);
        loginButton.on("pointerout", this.enterButtonRestState);
        loginButton.on("pointerdown", this.login);

        logoutButton = this.add.text(loginButton.x, loginButton.y + 50, "Logout from Github", {
            fill: "#ffffff"
        }).setOrigin(0.5, 0.5);;

        logoutButton.setInteractive({ useHandCursor: true });
        logoutButton.on("pointerover", this.enterButtonHoverState);
        logoutButton.on("pointerout", this.enterButtonRestState);
        logoutButton.on("pointerdown", this.logout);
    }

    enterButtonHoverState() {
        this.setStyle({
            fill: "#ff0000"
        });
    }

    enterButtonRestState() {
        this.setStyle({
            fill: "#ffffff"
        });
    }

    login() {
        console.log("Sign in with Github");
        signInWithGithub();
    }

    logout() {
        console.log("Sign out from Github");
        signOut();
    }
}
