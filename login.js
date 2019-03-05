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

initFirebase();
setAuthStateObserver();
