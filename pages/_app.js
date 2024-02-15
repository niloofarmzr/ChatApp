import '../styles/globals.css'
import React, {useEffect} from "react";
import{auth, db} from '../firebase'
import firebase from "firebase"
import {useAuthState} from "react-firebase-hooks/auth";
import Loading from "../components/Loading";
import Login from "./login";
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      console.log(user);
      db.collection('users').doc(user.uid).set({
        email: user.email,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        photoURL: user.photoURL
      }, {merge: true});
    }
  }, [user]);

  if(loading) return <Loading/>;
  if(!user) return <Login/>;
  return <Component {...pageProps} />
}

export default MyApp
