# Flash Typer
It's a game developed in JavaScript which challenges your speed and skills with the keyboard. When the game starts, every certain time interval a word appears at the top of the screen. The goal is to type as many words as possible before they reach the bottom of the screen, in order to get points and pass to the next level. In case that a word reaches the bottom of the screen, the player loses a life. The more difficult the level, the more difficult the words, in the sense that they are longer and more complex. In each game the words appear in different order.

(Note for the Spaniards of the Tuenti era: this game is inspired in one that existed in this social network ;)).

## Starting the game
In the main scene, you'll see that you can log in with Github or play as a guest. If you log in, your score will be saved and will appear in the ranking. If not, your score will not be saved. To log in, just **click** the "Login with Github" button and wait to see the login badge at the left bottom part of the screen to appear.

You can also see the current ranking to see other's score. For that, just **type** "ranking" with your keyboard.

To start playing, from the main scene, just **type** "play" with your keyboard.

## During the game
Type, type and type!

Type all the words you can before the reach the bottom of the screen! Doesn't mind the order in which you do it.

There are three levels in ascending order of difficulty. When you get the enough score to pass to the next level, it will start automatically.

## If you lose all the lives
If you lose all your lives, you will pass to the ranking scene automatically. If you are logged in, your score will appear marked in a darker color to differentiate it from the rest. If not logged in, the score achieved by the player will not be reflected in the ranking.

## Tools used
The game is build with Phaser, an open source HTML5 game framework that offers WebGL and Canvas rendering across desktop and mobile web browsers. We use here the version 3 of the framework with JavaScript.

If you have ever used a game engine like Unity, you'll be familiar with Phaser except for the lack of an user interface or editor. They share in a similar way the concepts of Scenes and Game Objects, but each one implement it differently, of course. Usually, we'll think of each unique scene as a unique level. In each Scene, you place your environments, obstacles, and decorations, essentially designing and building your game in pieces. Then, we have Game Objects. Every object in your game is a Game Object, from characters and collectible items to lights, cameras and special effects.

When a scene's code is run, a number of event functions are executed in a predetermined order. In the case of Unity some of them are: `awake()` (called when the script instance is being loaded and it is used to initialize any variables or game state before the game starts), `start()` (called on the frame when a script is enabled) and `update()` (called every frame). In Phaser, we have similar "reserved" functions: `preload()` (handles the loading of assets needed by your game), `create()` (we can safely create sprites, particles and anything else we need that may use assets the preload will now have loaded for us. Typically this function would contain the bulk of our set-up code, creating game objects and the like) and `update()` (called every frame).

Moreover, Phaser makes easier working with HTML5 canvas. Fore example, if we wanted to add a text to our canvas in the normal way, we'd do:

``` javascript
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
ctx.font = "30px Arial";
ctx.fillStyle = "#00ff00";
ctx.fillText("My awesome text", 10, 50);
```

However, with Phaser we'd simply do:

``` javascript
let titleText = this.add.text(10, 50, "My awesome text", {
    fill: "#00ff00",
    font: "30px Arial"
});
```

where `this` represents the current scene.

## General explanation of what is done in each scene
Our scenes are going to be: Main (the main screen with a manu), Game (the game itself) and Ranking (here we can see the ranking of players).

### In the Main scene
Create a particle emitter for the background, kind of a Matrix digital rain *but less digital*; the texts, the buttons and the login badge. Also, listen for "play" and "ranking" words to be typed by the user.

### In the Game scene
Create another particle emitter for the background, put some visual marks at the top of the screen to point where are the words going to appear from. Animate them using `tweens`, a utility that Phaser offer us that abstracts what we'd do with CSS animations, show the user the current level she just entered, create the posters (a poster is a word + a background image) each certain amount of time*, add some texts, add an object that detects if a word has collided with it, listen for the possible words that can appear in the level. In the update function, check if the player has lost all her lives or not and behave correspondingly.

*Special mention to the function that creates the posters, since it is a generator. It is a generator because each time we call the function, we don't want it to start from the beginning of the array of words. We want it to "save" the last accessed position in the array of words and start from there. For example, let's say our array is ["banana", "apple", "orange"]. If it were a normal function with a normal `return`, in the first call we'd receive a poster with the word "banana", in the second call again the word "banana" and in the third call again the word "banana". But with a generator function in the first call we'd get "banana", in the second call "apple" and in the third call "orange". So, a generator makes easier our life here.

### In the Ranking scene
Add some texts, show a loading spinner while waiting for the data from the server, save the achieved score if it is the case and show the ranking of players.

### In general
In order to create the login badge with the animated text and the ranking table, I used a special plugin for Phaser.
In order to use the ES6 `imports`, I used webpack.
In order to use different typographies, I used Web Font Loader.
In order to have login functionality and to store the score, I used Firebase.

## Desired improvements
 - Pause menu
 - Sound effects
 - Code improvements (cleaner, best distribution of the responsibilities)
 - Use Web Font Loader from Phaser plugins instead of loaded script in the HTML
 - Remove the configuration constants that currently are declared in the HTML and put them in a better place
 - More game modes and mechanics to get a more engaging and, if possible, funnier experience

## To play in production
Visit https://flash-typer.firebaseapp.com/.

## To play in development
1. Clone the repo.
2. Do `npm install`.
3. Do `npx webpack`.
4. Do `npx firebase serve`.
