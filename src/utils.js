class Utils extends Phaser.Scene {
    constructor() {
        super({
            key: "utils"
        });
    }

    createTextBox(scene, xPos, yPos, text) {
        let textBox = scene.rexUI.add.textBox({
            x: xPos,
            y: yPos,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xccbbbb)
                .setStrokeStyle(2, 0x3f2c2c),

            text: scene.add.text(0, 0, text, {
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

    createAnimatedText(scene, xPos, yPos, text) {
        let textBox = scene.rexUI.add.textBox({
            x: xPos,
            y: yPos,

            text: scene.add.text(0, 0, text, {
                fill: "#f91616",
                font: "10px carbontyperegular"
            }),

            space: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
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
        return textBox;
    }

    createParticles(scene, atlas, source, frames) {
        return scene.add.particles(atlas).createEmitter({
            alpha: {
                start: 1,
                end: 0.25,
                ease: 'Expo.easeOut'
            },
            angle: 0,
            blendMode: 'MULTIPLY',
            emitZone: {
                source: source
            },
            frame: frames,
            frequency: 150,
            lifespan: 7000,
            quantity: 1,
            scale: 0.5,
            tint: 0x000000,
            gravityY: 30
        });
    }
}

export default Utils;
