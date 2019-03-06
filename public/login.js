function initFirebase(){
    var config = {
      apiKey: "yourApiKey",
      authDomain: "yourAuthDomain",
      databaseURL: "yourDatabaseURL",
      projectId: "yourProjectId",
  };

  firebase.initializeApp(config);
}

function setAuthStateObserver() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

function authStateObserver(user) {
  hasAuthStateChanged = true;
  if (user) {
      loggedInUsername = user.displayName;
      console.log("User is signed in as:", loggedInUsername);
  } else {
      loggedInUsername = "Not logged in";
      console.log("User is signed out as:", loggedInUsername);
  }
}

function signInWithGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("User signed up with Github succesfully");
        if(result.additionalUserInfo.isNewUser) {
            let userData = {
                displayName: result.additionalUserInfo.profile.login,
                photoURL: result.additionalUserInfo.profile.avatar_url
            };
            updateCurrentUserAuthProfile(userData);
            saveUserDataInDatabase(userData);
        }

        loggedInUsername = result.additionalUserInfo.profile.login;
    }).catch(function(error) {
        console.log("An error ocurred while signing in with Github. Error:", error);
    });
}

function updateCurrentUserAuthProfile(userData) {
    firebase.auth().currentUser.updateProfile({
        displayName: userData.displayName,
        photoURL: userData.photoURL
    }).then(() => {
        console.log("Profile update succesful");
    }).catch(error => {
        console.log("An error ocurrer while updating user profile. Error:", error);
    });
}

function saveUserDataInDatabase(userData){
    firebase.database().ref().child("users").push(userData).then(() => {
        console.log("User data saved in database succesfully");
    }).catch(error => {
        console.log("An error ocurred while saving user data in database. Error:", error);
    });
}

function signOut() {
    firebase.auth().signOut();
}

function setDatabaseListeners() {
    firebase.database().ref().child("users").on('child_added', addUserToList);
    firebase.database().ref().child("users").on('child_removed', removeUserFromList);
}

function addUserToList(user) {
    console.log("Adding user to database");
}

function removeUserFromList(user){
    console.log("Removing user from database");
}

let loggedInUsername;
let hasAuthStateChanged = false;

initFirebase();
setAuthStateObserver();
setDatabaseListeners();
