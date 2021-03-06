import Phaser from "phaser";
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import Main from "./scenes/main.js";
import Game from "./scenes/game.js";
import Ranking from "./scenes/ranking.js";
import fonts from "./assets/fonts/stylesheet.css";


let webFontLoading = {
  active: function() {
		runGame()
  },
  custom: {
    families: ['carbontyperegular', 'my_underwoodregular', 'dialtoneregular'],
    urls: ["stylesheet.css"]
  }
};

let runGame = function() {
    let config = {
        type: Phaser.AUTO,
        width: 540,
        heigth: 960,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 0},
                debug: false
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
}

WebFont.load(webFontLoading);
