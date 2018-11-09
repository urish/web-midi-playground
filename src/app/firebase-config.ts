import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAwkFM36ziQwD5k_xptntCPTFinCBqQU8E',
  authDomain: 'web-midi-playground.firebaseapp.com',
  databaseURL: 'https://web-midi-playground.firebaseio.com',
  projectId: 'web-midi-playground',
  storageBucket: 'web-midi-playground.appspot.com',
  messagingSenderId: '10621899462'
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true });

export { firebase };
