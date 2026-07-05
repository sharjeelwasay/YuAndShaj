const firebaseConfig = {
  apiKey: "AIzaSyCYB4nh30eVCuxTNG27Dw9KdJCesNGcyhQ",
  authDomain: "yuandshaj.firebaseapp.com",
  projectId: "yuandshaj",
  storageBucket: "yuandshaj.firebasestorage.app",
  messagingSenderId: "836659323329",
  appId: "1:836659323329:web:27dafd978810fbb09fcf40",
  measurementId: "G-9M483HP3GK"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
