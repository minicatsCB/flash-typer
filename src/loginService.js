let instance = null;

class LoginService {
    constructor(){
        if (!instance) {
            instance = this;

            this.user;
        }

        return instance;
    }

    get user() {
        return this._user;
    }

    set user(user) {
        this._user = user;
    }

    setAuthStateObserver(handler) {
        firebase.auth().onAuthStateChanged(handler);
    }

    signInWithGithub() {
        var provider = new firebase.auth.GithubAuthProvider();
        firebase.auth().signInWithPopup(provider).then(result => {
            console.log("User signed in with Github succesfully");
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
            console.error("An error ocurred while signing in with Github. Error:", error);
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
            console.error("An error ocurrer while updating user profile. Error:", error);
        });
    }

    saveUserDataInDatabase(userData) {
        firebase.database().ref().child("users").push(userData).then(() => {
            console.log("User data saved in database succesfully");
        }).catch(error => {
            console.error("An error ocurred while saving user data in database. Error:", error);
        });

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
                        console.error("An error ocurred while updating user score. Error:", error);
                    });
                } else {
                    console.log("User not found in database. Can't save its score");
                }
            });
        }
    }

    getUserByEmail(email) {
        return firebase.database().ref().child("users")
            .orderByChild("email")
            .equalTo(email)
            .once("value")
            .then(snapshot => {
                let user;
                snapshot.forEach((childSnapshot) => {
                    user = childSnapshot;
                });

                return user;
            }).catch(error => {
                console.error("An error ocurred while searching user in database. Error:", error);
            });
    }

    getUsersRanking() {
        return firebase.database().ref().child("users")
            .orderByChild("achievedScore")
            .once("value")
            .then(snapshot => {
                let users = [];
                snapshot.forEach((childSnapshot) => {
                    users.push(childSnapshot.val());
                });

                return users.reverse(); // We want the users ordered in descending order
            }).catch(error => {
                console.error("An error ocurred while getting users ranking. Error:", error);
            });
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            console.log("User signed out from Github succesfully");
        }).catch(err => {
            console.error("An error ocurred while signing out from Github. Error:", err);
        });
    }
}

export default LoginService;
