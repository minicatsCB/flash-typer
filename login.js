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
  if (user) {
      console.log("User is signed in");
  } else {
      console.log("User is signed out");
  }
}

function signInWithGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("User signed up with Github succesfully");
    }).catch(function(error) {
        console.log("An error ocurred while signing in with Github. Error:", error);
    });
}

function signOut() {
    firebase.auth().signOut();
}

initFirebase();
setAuthStateObserver();
