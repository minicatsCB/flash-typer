import Login from "../login.js";

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class Ranking extends Phaser.Scene {
    constructor() {
        super({
            key: "ranking"
        });

        this.loginSrv = new Login();
        this.achievedScore = 0;
    }

    init(data){
        this.achievedScore = data.achievedScore;
    }

    preload() {

    }

    create() {
        let canvasXMiddle = this.game.canvas.width / 2;
        let rankingText = this.add.text(canvasXMiddle, 100, "Ranking", {
            fontSize: "32px",
            fill: "#fff"
        }).setOrigin(0.5, 0.5);

        this.loginSrv.saveUserScoreInDatabase(this.achievedScore).then(() => {
            this.loginSrv.getUsersRanking().then(users => {
                this.createRanking(rankingText.x, rankingText.y, users);
            });
        });
    }

    createRanking(xPos, yPos, users) {
        this.rexUI.add.gridTable({
            x: xPos,
            y: yPos + 50,

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
                    icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, COLOR_DARK),
                    text: scene.add.text(0, 0, item.displayName + " " + item.achievedScore),

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
        .layout()
        .drawBounds(this.add.graphics(), 0xff0000);
    }

    update() {}
}

export default Ranking;
