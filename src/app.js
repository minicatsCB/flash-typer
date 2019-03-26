import Phaser from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Main from "./scenes/main.js";
import Game from "./scenes/game.js";
import Ranking from "./scenes/ranking.js";

let config = {
    type: Phaser.CANVAS,
    width: 800,
    heigth: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    plugins: {
        scene: [{
            key: "rexUI",
            plugin: UIPlugin,
            mapping: "rexUI"
        }]
    },
    scene: [Main, Game, Ranking]
};

let game = new Phaser.Game(config);
