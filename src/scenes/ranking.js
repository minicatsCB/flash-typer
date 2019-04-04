import LoginService from "../loginService.js";

const COLOR_PRIMARY = 0xccbbbb;
const COLOR_DARK = 0x3f2c2c;

class Ranking extends Phaser.Scene {
    constructor() {
        super({
            key: "ranking"
        });

        this.loginSrv = new LoginService();
        this.achievedScore = 0;
    }

    init(data){
        this.achievedScore = data.achievedScore;
    }

    preload() {
    }

    create() {
        this.cameras.main.setBackgroundColor("#ffffff");

        let canvasXMiddle = this.game.canvas.width / 2;
        let rankingText = this.add.text(canvasXMiddle, 100, "Ranking", {
            fill: "#000000",
            font: "32px carbontyperegular"
        }).setOrigin(0.5, 0.5);

        if (this.loginSrv.user && this.achievedScore) {
            this.loginSrv.saveUserScoreInDatabase(this.achievedScore).then(() => {
                this.loginSrv.getUsersRanking().then(users => {
                    this.createRanking(rankingText.x, rankingText.y, users);
                });
            });
        } else {
            this.loginSrv.getUsersRanking().then(users => {
                this.createRanking(rankingText.x, rankingText.y, users);
            });
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
                    background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
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

    update() {}
}

export default Ranking;
