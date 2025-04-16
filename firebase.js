// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getDatabase, ref, child, get, push } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'

const LEDGER = 'ledger'
let dbRef = null
let canvas = null
let aux = null

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
    canvas = document.getElementById('canvas')

    // Listeners
    document.getElementById('button1').addEventListener('click', ledger)
    document.getElementById('button2').addEventListener('click', girls)
    document.getElementById('button3').addEventListener('click', me)
    //document.getElementById('button4').addEventListener('click', writeLedger)
}

const ledger = () => {
    get(child(dbRef, LEDGER))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            aux = snapshot.val()
            // document.getElementById('ledger-form').classList.add('visible')

            canvas.innerHTML = ''

            const grid = document.createElement('div')
            grid.classList.add('grid', 'ledger')

            spawnHeader(grid, 'calendar', 'pen', 'arrowdown', 'arrowred', 'money')

            let acc = 0
            Object.values(aux).forEach((o, i) => {
                acc += o.in - o.out
                const date = formatDate(o.time)
                insertLedgerGrid(grid, date, o.concept, o.in, o.out, acc)
            })


            canvas.appendChild(grid)
        }




        ).catch((error) => {
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
        in: 500,
        out: Math.floor(Math.random() * 50)
    })

}

const formatDate = (str) => {
    const date = new Date(str);

    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = String(date.getFullYear()).slice(-2);

    return `${d}/${m}/${y}`;
};

const insertGrid = (grid, ...str) => {
    str.forEach((text) => grid.appendChild(Object.assign(document.createElement('span'), { textContent: text })))
}

const spawnHeader = (grid, ...headers) => {

    headers.forEach((img) => {
        const span = document.createElement('span')
        span.className = 'grid-header'
        span.style.backgroundImage = `url(assets/${img}.png)`
        span.textContent = 'H'

        grid.appendChild(span)
    })

}

const insertLedgerGrid = (grid, ...str) => {
    str.forEach((v, i) => {
        const span = document.createElement('span')
        span.textContent = v

        if (i % 4 === 0 && v < 0) span.style.backgroundColor = 'darkred'
        grid.appendChild(span)
    })
}

init()