// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js'; // Importação corrigida

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjYmouzj1x8pSuHVJ6s01vj-ubETBRJwQ",
    authDomain: "eject-trilha-de-conhecimento.firebaseapp.com",
    projectId: "eject-trilha-de-conhecimento",
    storageBucket: "eject-trilha-de-conhecimento.appspot.com",
    messagingSenderId: "339989029881",
    appId: "1:339989029881:web:8a0e91c6e068cad152d328",
    measurementId: "G-37E12ZK0X0",
    databaseURL: "https://eject-trilha-de-conhecimento-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const saldoEl = document.getElementById("saldo");
const gastosFixosEl = document.getElementById("gastos-fixos");
const gastosVariaveisEl = document.getElementById("gastos-variaveis");

// Fetch data from Firebase
const saldoRef = ref(database, "financeiro/saldo");
const gastosFixosRef = ref(database, "financeiro/gastosFixos");
const gastosVariaveisRef = ref(database, "financeiro/gastosVariaveis");

onValue(saldoRef, (snapshot) => {
    saldoEl.textContent = `R$ ${snapshot.val()}`;
});

onValue(gastosFixosRef, (snapshot) => {
    gastosFixosEl.textContent = `R$ ${snapshot.val()}`;
});

onValue(gastosVariaveisRef, (snapshot) => {
    gastosVariaveisEl.textContent = `R$ ${snapshot.val()}`;
});

// Gráficos usando Chart.js
const ctxEntradasSaidas = document.getElementById("chartEntradasSaidas").getContext("2d");
const ctxProjecao = document.getElementById("chartProjecao").getContext("2d");

const chartEntradasSaidas = new Chart(ctxEntradasSaidas, {
    type: "bar",
    data: {
        labels: ["Jan", "Fev", "Mar"],
        datasets: [
            {
                label: "Entradas",
                data: [1000, 1500, 2000],
                backgroundColor: "green",
            },
            {
                label: "Saídas",
                data: [800, 1000, 1200],
                backgroundColor: "red",
            },
        ],
    },
});

const chartProjecao = new Chart(ctxProjecao, {
    type: "line",
    data: {
        labels: ["Dia 1", "Dia 2", "Dia 3"],
        datasets: [
            {
                label: "Projeção de Saldo",
                data: [1500, 1400, 1300],
                backgroundColor: "blue",
                borderColor: "blue",
                fill: false,
            },
        ],
    },
});
