class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'main'
        });
    }

    preload() {

    }

    create() {
        let titleText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 4, 'Flash Typer', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let instructionsText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 4 + 50, 'Choose an option by typing it', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let playText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 4 + 100, 'play', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let rankingText = this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 4 + 150, 'ranking', {
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
    }
}
