class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'main'
        });
    }

    preload() {

    }

    create() {
        this.input.manager.enabled = true;
        this.input.once('pointerdown', function() {
            this.scene.start('game');
        }, this);
    }
}
