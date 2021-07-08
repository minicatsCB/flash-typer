let instance = null;

class Login {
    constructor(){
        if (!instance) {
            this.loggedInUsername = "Not logged in";
            this.isUserLoggedIn = false;
            this.hasAuthStateChanged = false;

            this.initFirebase();
            this.setAuthStateObserver();

            instance = this;
        }

        return instance;
    }

    get loggedInUsername() {
        return this._loggedInUsername;
    }

    set loggedInUsername(username) {
        this._loggedInUsername = username;
    }

    get isUserLoggedIn() {
      return this._isUserLoggedIn;
    }

    set isUserLoggedIn(loginState) {
        this._isUserLoggedIn = loginState;
    }

    get hasAuthStateChanged() {
        return this._hasAuthStateChanged;
    }

    set hasAuthStateChanged(authState) {
        this._hasAuthStateChanged = authState;
    }

    initFirebase() {
        var config = {
            apiKey: "AIzaSyDhZLEfkH6ydtLOEBzjQKjCIjnIwtLooQs",
            authDomain: "flash-typer.firebaseapp.com",
            databaseURL: "https://flash-typer.firebaseio.com",
            projectId: "flash-typer",
        };

        firebase.initializeApp(config);
    }

    setAuthStateObserver() {
        firebase.auth().onAuthStateChanged(this.authStateObserver.bind(this));
    }

    authStateObserver(user) {
        this.hasAuthStateChanged = true;
        if (user) {
            this.loggedInUsername = user.displayName|| "No name";
            this.isUserLoggedIn = true;
            console.log("User is signed in as:", this.loggedInUsername);
        } else {
            this.loggedInUsername = "Not logged in";
            this.isUserLoggedIn = false;
            console.log("User is signed out as:", this.loggedInUsername);
        }
    }

    signInWithGithub() {
        var provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            console.log("User signed up with Github succesfully");
            if (result.additionalUserInfo.isNewUser) {
                let userData = {
                    email: result.user.email,
                    displayName: result.additionalUserInfo.profile.login,
                    photoURL: result.additionalUserInfo.profile.avatar_url
                };
                this.updateCurrentUserAuthProfile(userData);
                this.saveUserDataInDatabase(userData);
            }

            this.loggedInUsername = result.additionalUserInfo.profile.login;
        }).catch(function(error) {
            console.log("An error ocurred while signing in with Github. Error:", error);
        });
    }

    updateCurrentUserAuthProfile(userData) {
        firebase.auth().currentUser.updateProfile({
            email: userData.email,
            displayName: userData.displayName,
            photoURL: userData.photoURL
        }).then(() => {
            console.log("Profile update succesful");
        }).catch(error => {
            console.log("An error ocurrer while updating user profile. Error:", error);
        });
    }

    saveUserDataInDatabase(userData) {
        firebase.database().ref().child('users').push(userData).then(() => {
            console.log("User data saved in database succesfully");
        }).catch(error => {
            console.log("An error ocurred while saving user data in database. Error:", error);
        });;

    }

    saveUserScoreInDatabase(achievedScore) {
        let user = firebase.auth().currentUser;

        if(user != null) {
            return this.getUserByEmail(user.email).then(foundUser => {
                if(foundUser) {
                    let update = {};
                    update["users/" + foundUser.key + "/achievedScore"] = achievedScore;
                    return firebase.database().ref().update(update).then(() => {
                        console.log("User score updated succesfully");
                    }).catch(error => {
                        console.log("An error ocurred while updating user score. Error:", error);
                    });
                } else {
                    console.log("User not found in database. Can't save its score");
                }
            });
        }
    }

    getUserByEmail(email) {
        let user;
        return firebase.database().ref().child("users")
            .orderByChild("email")
            .equalTo(email)
            .once("value")
            .then(snapshot => {
                snapshot.forEach((childSnapshot) => {
                    user = childSnapshot;
                });

                return user;
            }).catch(error => {
                console.log("An error ocurred while searching user in database. Error:", error);
            });
    }

    getUsersRanking() {
        let users = [];
        return firebase.database().ref().child("users")
            .orderByChild("achievedScore")
            .once("value")
            .then(snapshot => {
                snapshot.forEach((childSnapshot) => {
                    users.push(childSnapshot.val());
                });

                return users.reverse(); // We want the users ordered in descending order
            });
    }

    signOut() {
        firebase.auth().signOut();
    }
}

export default Login;