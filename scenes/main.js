let loginButton;

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

        loginButton = this.add.text(rankingText.x, rankingText.y + 100, "Login with Twitter", {
            fill: "#ffffff"
        }).setOrigin(0.5, 0.5);;

        loginButton.setInteractive({ useHandCursor: true });
        loginButton.on("pointerover", this.enterButtonHoverState);
        loginButton.on("pointerout", this.enterButtonRestState);
        loginButton.on("pointerdown", this.enterButtonClickedState);
    }

    enterButtonHoverState() {
        loginButton.setStyle({
            fill: "#ff0000"
        });
    }

    enterButtonRestState() {
        loginButton.setStyle({
            fill: "#ffffff"
        });
    }

    enterButtonClickedState() {
        console.log("Button pointer down!");
    }
}
