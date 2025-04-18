// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getDatabase, ref, child, get, push } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js'

const LEDGER = 'ledger'
const LEDGER_FORM = 'ledger-form-container'

let dbRef = null
let canvas = null

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
    document.getElementById('cancel-ledger').addEventListener('click', () => unpop(LEDGER_FORM))
    document.getElementById('send-ledger').addEventListener('click', () => readLedgerForm())
    //document.getElementById('button4').addEventListener('click', writeLedger)
}

const ledger = () => {
    get(child(dbRef, LEDGER))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            window.myAux = snapshot.val()

            canvas.innerHTML = ''

            const addButton = document.createElement('button')

            addButton.innerHTML = '<i class="material-icons" style="font-size:3em;">add_box</i>'
            addButton.classList.add('add-button')
            addButton.addEventListener('click', editLedger)

            const grid = document.createElement('div')

            grid.classList.add('grid', 'ledger')

            let acc = 0
            Object.values(window.myAux).forEach((o, i) => {
                acc += o.in - o.out
                const date = formatDate(o.time)
                insertLedgerGrid(grid, acc, o.out, o.in, o.concept, date)
            })

            spawnHeader(grid, 'money', 'arrowred', 'arrowdown', 'pen', 'calendar')

            canvas.appendChild(addButton)
            canvas.appendChild(grid)
        })
        .catch((error) => console.error(error))

}

const girls = () => {
    get(child(dbRef, 'girls'))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                console.log('No data available')
                return
            }

            document.getElementById('canvas').innerHTML = JSON.stringify(snapshot.val())


        })
        .catch((error) => console.error(error))
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

const readLedgerForm = () => {
    const concept = document.getElementById('concept').value;
    const inValue = document.getElementById('in').value;
    const outValue = document.getElementById('out').value;

    writeLedger(concept, inValue, outValue)
};

const unpop = (id) => {
    document.getElementById(id).classList.remove('visible')
}

const editLedger = () => {
    document.getElementById(LEDGER_FORM).classList.add('visible')
}

const writeLedger = (concept, valueIn, valueOut) => {
    push(child(dbRef, LEDGER), {
        time: new Date().toISOString(),
        concept: concept,
        in: valueIn,
        out: valueOut
    })

    setTimeout(() => {
        ledger()
        setTimeout(() => unpop(LEDGER_FORM), 500)
    }, 500)

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

        grid.prepend(span)
    })

}

const insertLedgerGrid = (grid, ...str) => {
    str.forEach((v, i) => {
        const span = document.createElement('span')
        span.textContent = v

        if (i % 4 === 0 && v < 0) span.style.backgroundColor = 'darkred'
        grid.prepend(span)
    })
}

init()