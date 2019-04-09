import LoginService from "../loginService.js";

import loadingSpinner from "../assets/spinner.png";
import prizesTexture from "../assets/prizes.png";

const COLOR_PRIMARY = 0xccbbbb;
const COLOR_DARK = 0x3f2c2c;

class Ranking extends Phaser.Scene {
    constructor() {
        super({
            key: "ranking"
        });

        this.loginSrv = new LoginService();
        this.achievedScore = 0;
        this.background;
        this.currentUserDisplayName;
    }

    init(data){
        this.achievedScore = data.achievedScore;
    }

    preload() {
        this.load.image('prizes', prizesTexture);
        this.load.image('loadingSpinner', loadingSpinner);
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        this.background = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'prizes').setOrigin(0, 0);

        let canvasXMiddle = this.game.canvas.width / 2;
        let rankingText = this.add.text(canvasXMiddle, 100, "Ranking", {
            fill: "#000000",
            font: "32px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        let spinner = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 2, "loadingSpinner");
        this.tweens.add({
            targets: spinner,
            angle: 360,
            repeat: -1,
            duration: 3000
        });

        if (this.loginSrv.user && this.achievedScore) {
            this.currentUserDisplayName = this.loginSrv.user.displayName || "No name";
            this.loginSrv.saveUserScoreInDatabase(this.achievedScore).then(() => {
                this.loginSrv.getUsersRanking().then(users => {
                    spinner.visible = false;
                    this.createRanking(rankingText.x, rankingText.y, users);
                });
            });
        } else if(this.loginSrv.user) {
            this.currentUserDisplayName = this.loginSrv.user.displayName || "No name";
            this.loginSrv.getUsersRanking().then(users => {
                spinner.visible = false;
                this.createRanking(rankingText.x, rankingText.y, users);
            });
        } else {
            this.currentUserDisplayName = "Not logged in";
            this.loginSrv.getUsersRanking().then(users => {
                spinner.visible = false;
                this.createRanking(rankingText.x, rankingText.y, users);
            });
        }

        this.createTextBox(this, 10, this.game.canvas.height - 100).start(this.currentUserDisplayName, 50);
        if(this.currentUserDisplayName === "Not logged in") {
            this.createAnimatedText(this, 10, this.game.canvas.height - 120).start("Your score will not be saved :(", 50);
        }
    }

    createRanking(xPos, yPos, users) {
        this.rexUI.add.gridTable({
            x: xPos,
            y: yPos + 50,

            background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY).setStrokeStyle(2, 0x3f2c2c),

            table: {
                width: 340,
                height: 460,
                cellWidth: 600,
                cellHeight: 60,
                columns: 1
            },

            slider: {
                track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY).setStrokeStyle(2, 0x3f2c2c),
                thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_DARK),
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
                    background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, item.displayName === scene.currentUserDisplayName ? COLOR_DARK : COLOR_PRIMARY).setStrokeStyle(2, COLOR_DARK),
                    icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_DARK),
                    text: scene.add.text(0, 0, item.displayName + " " + item.achievedScore, {
                        font: "18px my_underwoodregular"
                    }),

                    space: {
                        icon: 10,
                        left: 15
                    }
                })
                .setOrigin(0, 0);
            },

            items: users

        })
        .setOrigin(0.5, 0)
        .layout();
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

    createAnimatedText(scene, xPos, yPos) {
        let textBox = scene.rexUI.add.textBox({
            x: xPos,
            y: yPos,

            text: scene.add.text(0, 0, this.loginSrv.loggedInUsername, {
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

    update() {
        this.background.tilePositionX -= 0.05;
        this.background.tilePositionY += 0.05;
    }
}

export default Ranking;
