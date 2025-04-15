// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getDatabase, ref, child, get, push } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'

const LEDGER = 'ledger'
let dbRef = null

const init = () => {
    const firebaseConfig = {
        apiKey: 'AIzaSyBt1TEBIiw9QyvGhkNpd_vL3q0RYM0l2Lc',
        authDomain: 'dona-reporter.firebaseapp.com',
        databaseURL: 'https://dona-reporter-default-rtdb.firebaseio.com',
        projectId: 'dona-reporter',
        storageBucket: 'dona-reporter.firebasestorage.app',
        messagingSenderId: '1084532542735',
        appId: '1:1084532542735:web:0b9f80861abdd52b13427a'
    }

    initializeApp(firebaseConfig);
    signInWithEmailAndPassword(getAuth(), 'admin@fudan.com', 'kokokoko')
        .then(console.log('signed in!'))
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log({ errorCode, errorMessage })
        });

    dbRef = ref(getDatabase());

    // Listeners
    document.getElementById('button1').addEventListener('click', book)
    document.getElementById('button2').addEventListener('click', girls)
    document.getElementById('button3').addEventListener('click', me)
    document.getElementById('button4').addEventListener('click', writeLedger)
}

const book = () => {
    get(child(dbRef, LEDGER))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            document.getElementById('ledger-form').classList.add('visible')


        }).catch((error) => {
            console.error(error);
        });

}
const girls = () => {


    get(child(dbRef, 'girls'))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            document.getElementById('canvas').innerHTML = JSON.stringify(snapshot.val())


        }).catch((error) => {
            console.error(error);
        });

}
const me = () => {
    get(child(dbRef, 'dona'))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            document.getElementById('canvas').innerHTML = JSON.stringify(snapshot.val())


        }).catch((error) => {
            console.error(error);
        });

}

const writeLedger = () => {
    push(child(dbRef, LEDGER), {
        time: new Date().toISOString(),
        concept: 'plancha',
        in: 15,
        out: 45
    })

}

init()