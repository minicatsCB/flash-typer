class Login {
    constructor(){
        this.loggedInUsername = "Not logged in";
        this.isUserLoggedIn = false;
        this.hasAuthStateChanged = false;

        this.initFirebase();
        this.setAuthStateObserver();
        this.setDatabaseListeners();
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
            apiKey: "yourApiKey",
            authDomain: "yourAuthDomain",
            databaseURL: "yourDatabaseURL",
            projectId: "yourProjectId",
        };

        firebase.initializeApp(config);
    }

    setAuthStateObserver() {
        firebase.auth().onAuthStateChanged(this.authStateObserver.bind(this));
    }

    authStateObserver(user) {
        this.hasAuthStateChanged = true;
        if (user) {
            this.loggedInUsername = user.displayName;
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
            displayName: userData.displayName,
            photoURL: userData.photoURL
        }).then(() => {
            console.log("Profile update succesful");
        }).catch(error => {
            console.log("An error ocurrer while updating user profile. Error:", error);
        });
    }

    saveUserDataInDatabase(userData) {
        firebase.database().ref().child("users").push(userData).then(() => {
            console.log("User data saved in database succesfully");
        }).catch(error => {
            console.log("An error ocurred while saving user data in database. Error:", error);
        });
    }

    signOut() {
        firebase.auth().signOut();
    }

    setDatabaseListeners() {
        firebase.database().ref().child("users").on('child_added', this.addUserToList);
        firebase.database().ref().child("users").on('child_removed', this.removeUserFromList);
    }

    addUserToList(user) {
        console.log("Adding user to database");
    }

    removeUserFromList(user) {
        console.log("Removing user from database");
    }
}

export default Login;