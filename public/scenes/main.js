let loginButton;
let logoutButton;
let loginBadge;

class Main extends Phaser.Scene {
    constructor() {
        super({
            key: 'main'
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
        let canvarXMiddle = this.game.canvas.width / 2;
        let titleText = this.add.text(canvarXMiddle, this.game.canvas.height / 4, 'Flash Typer', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let instructionsText = this.add.text(canvarXMiddle, titleText.y + 50, 'Choose an option by typing it', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let playText = this.add.text(canvarXMiddle, instructionsText.y + 50, 'play', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5, 0.5);

        let rankingText = this.add.text(canvarXMiddle, playText.y + 50, 'ranking', {
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

        loginButton = this.add.text(rankingText.x, rankingText.y + 100, "Login with Github", {
            fill: "#ffffff"
        }).setOrigin(0.5, 0.5);;

        loginButton.setInteractive({ useHandCursor: true });
        loginButton.on("pointerover", this.enterButtonHoverState);
        loginButton.on("pointerout", this.enterButtonRestState);
        loginButton.on("pointerdown", this.login);

        loginButton.visible = false;

        logoutButton = this.add.text(rankingText.x, rankingText.y + 100, "Logout from Github", {
            fill: "#ffffff"
        }).setOrigin(0.5, 0.5);;

        logoutButton.setInteractive({ useHandCursor: true });
        logoutButton.on("pointerover", this.enterButtonHoverState);
        logoutButton.on("pointerout", this.enterButtonRestState);
        logoutButton.on("pointerdown", this.logout);

        logoutButton.visible = false;

        loginBadge = this.createTextBox(this, 10, this.game.canvas.height - 100);
    }

    update() {
        // ÑapaScript®
        // Surely there is better way, but currently I don't know any
        // to subscribe to an observable declared in another script
        // This is like a "manual" listener or subscription (checking with a loop)
        if(hasAuthStateChanged) {
            loginBadge.start(loggedInUsername, 50);
            loginButton.visible = isUserLoggedIn ? false : true;
            logoutButton.visible = isUserLoggedIn ? true : false;
            hasAuthStateChanged = false;
        }
    }

    enterButtonHoverState() {
        this.setStyle({
            fill: "#ff0000"
        });
    }

    enterButtonRestState() {
        this.setStyle({
            fill: "#ffffff"
        });
    }

    login() {
        console.log("Sign in with Github");
        signInWithGithub();
    }

    logout() {
        console.log("Sign out from Github");
        signOut();
    }

    createTextBox(scene, x, y) {
        let textBox = scene.rexUI.add.textBox({
                x: x,
                y: y,

                background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                    .setStrokeStyle(2, COLOR_LIGHT),

                text: scene.add.text(0, 0, loggedInUsername, {
                    fill: "#ffffff"
                }),

                action: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK).setAlpha(0),

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
            .on('pointerdown', function() {
                if (this.isTyping) {
                    this.stop(true);
                }
            }, textBox)
            .on('pageend', function() {
                let icon = this.getElement('action').setAlpha(1);
                icon.y -= 30;
                let tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30',
                    ease: 'Cubic',
                    duration: 500,
                    repeat: 0,
                    yoyo: false
                });
            }, textBox)

        return textBox;
    }
}
