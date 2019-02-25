class Ranking extends Phaser.Scene {
    constructor() {
        super({
            key: 'ranking'
        });
    }

    preload() {

    }

    create() {
        let canvasXMiddle = this.game.canvas.width / 2;
        let rankingText = this.add.text(canvasXMiddle, 100, 'Ranking', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);
    }

    update() {}
}
