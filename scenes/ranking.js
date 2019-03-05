const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

let loginButton;

class Ranking extends Phaser.Scene {
    constructor() {
        super({
            key: 'ranking'
        });
    }

    preload() {
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });
    }

    create() {
        let canvasXMiddle = this.game.canvas.width / 2;
        let rankingText = this.add.text(canvasXMiddle, 100, 'Ranking', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let p1 = {
            username: "redVelvet",
            score: 1010,
            color: 0xffffff
        };

        let p2 = {
            username: "chocolateeeeee",
            score: 650,
            color: 0xffffff
        };
        
        let p3 = {
            username: "bananaSplit",
            score: 140,
            color: 0xffffff
        };

        this.rexUI.add.gridTable({
                x: rankingText.x,
                y: rankingText.y + 50,

                background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

                table: {
                    width: 600,
                    height: 400,
                    cellWidth: 600,
                    cellHeight: 60,
                    columns: 1
                },

                slider: {
                    track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
                    thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
                },

                scroller: {
                    slidingDeceleration: 5000,
                    backDeceleration: 2000,
                },

                createCellContainerCallback: function(cell) {
                    let scene = cell.scene,
                        width = cell.width,
                        height = cell.height,
                        item = cell.item,
                        index = cell.index;

                    return scene.rexUI.add.label({
                            width: width,
                            height: height,
                            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                            icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, item.color),
                            text: scene.add.text(0, 0, item.username + " " + item.score),

                            space: {
                                icon: 10,
                                left: 15
                            }
                        })
                        .setOrigin(0, 0);
                },

                items: [p1, p2, p3, p1, p2, p3, p1, p2, p3, p1, p2, p3, p1, p2, p3, p1, p2, p3, p1, p2, p3]

            })
            .setOrigin(0.5, 0)
            .layout()
            .drawBounds(this.add.graphics(), 0xff0000);

            loginButton = this.add.text(rankingText.x, rankingText.y + 30, "Login with Twitter", {
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

    update() {}
}
