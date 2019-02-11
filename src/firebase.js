import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyC_GxBp7Jl2BTjIGdPKgnOpIPmsX22XfuY",
    authDomain: "slack-messanger.firebaseapp.com",
    databaseURL: "https://slack-messanger.firebaseio.com",
    projectId: "slack-messanger",
    storageBucket: "slack-messanger.appspot.com",
    messagingSenderId: "1006195291841"
};
firebase.initializeApp(config);

export default firebase;