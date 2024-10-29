// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjYmouzj1x8pSuHVJ6s01vj-ubETBRJwQ",
  authDomain: "eject-trilha-de-conhecimento.firebaseapp.com",
  projectId: "eject-trilha-de-conhecimento",
  storageBucket: "eject-trilha-de-conhecimento.appspot.com",
  messagingSenderId: "339989029881",
  appId: "1:339989029881:web:8a0e91c6e068cad152d328",
  measurementId: "G-37E12ZK0X0"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Seleciona todos os checkboxes e a barra de progresso
const checkboxes = document.querySelectorAll('.topic-checkbox');
const progressBar = document.getElementById('progress-bar');

// Obtém o usuário autenticado
let userId = '';
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid; // Armazena o ID do usuário autenticado
        console.log("Usuário autenticado:", user.email);
    } else {
        console.log("Nenhum usuário autenticado.");
    }
});

// Seleciona o campo de entrada para o nome da trilha
const trilhaInput = document.getElementById('trilha-nome');

// Função para atualizar a barra de progresso
function updateProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.topic-checkbox:checked').length;
    const percentage = (checked / total) * 100;

    // Atualiza a barra de progresso
    setProgress(percentage);

    // Salvar estado das checkboxes no localStorage e no Firebase
    saveProgress();
}

// Função para definir a largura e o texto da barra de progresso
function setProgress(percentage) {
    progressBar.style.width = percentage + '%';
    progressBar.textContent = Math.round(percentage) + '%';
}

// Função para salvar o progresso no localStorage e Firebase
function saveProgress() {
    const progressState = Array.from(checkboxes).map(checkbox => checkbox.checked);
    const trilhaId = trilhaInput.value.trim(); // Pega o nome da trilha

    if (!trilhaId) {
        console.error("Por favor, insira o nome da trilha.");
        return;
    }

    // Salvar no localStorage
    localStorage.setItem('progress', JSON.stringify(progressState));

    // Salvar no Firebase
    if (userId) {
        const progressRef = ref(database, `users/${userId}/trilhas/${trilhaId}/progresso`); // Referência para o caminho onde você quer salvar
        set(progressRef, progressState)
            .then(() => {
                console.log("Progresso salvo no Firebase com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao salvar progresso no Firebase:", error);
            });
    } else {
        console.error("Usuário não autenticado. Não foi possível salvar o progresso.");
    }
}

// Função para carregar o progresso do Firebase
function loadProgressFromFirebase() {
    const trilhaId = trilhaInput.value.trim(); // Pega o nome da trilha

    if (!trilhaId) {
        console.error("Por favor, insira o nome da trilha para carregar o progresso.");
        return;
    }

    if (userId) {
        const progressRef = ref(database, `users/${userId}/trilhas/${trilhaId}/progresso`); // Referência para o caminho onde os dados estão
        get(progressRef).then((snapshot) => {
            if (snapshot.exists()) {
                const savedProgress = snapshot.val();

                checkboxes.forEach((checkbox, index) => {
                    checkbox.checked = savedProgress[index];
                });

                updateProgress(); // Atualiza a barra de progresso
                console.log("Progresso carregado do Firebase com sucesso!");
            } else {
                console.log("Nenhum progresso salvo encontrado no Firebase.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar progresso do Firebase:", error);
        });
    } else {
        console.error("Usuário não autenticado. Não foi possível carregar o progresso.");
    }
}

// Adiciona o evento de mudança a cada checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateProgress);
});

// Carrega o progresso salvo do Firebase ou localStorage ao carregar a página
window.addEventListener('load', () => {
    loadProgressFromFirebase();
});

// Pegar os elementos do modal e do botão
const modal = document.getElementById("betaModal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("close")[0];

// Certifique-se de que o modal está escondido ao carregar a página
modal.style.display = "none"; // Garante que o modal não esteja visível

// Quando o usuário clicar no botão "BETA", abrir o modal
btn.onclick = function() {
    console.log("Botão BETA clicado"); // Log para verificar se o botão está funcionando
    modal.style.display = "flex"; // Mostrar o modal como flexbox
}

// Quando o usuário clicar no "X", fechar o modal
span.onclick = function() {
    console.log("Modal fechado"); // Log para verificar se o modal está sendo fechado
    modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, também fechar
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
