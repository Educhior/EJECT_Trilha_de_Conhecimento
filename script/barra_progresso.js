// Importa as funções necessárias do Firebase
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

// Seleciona o campo de entrada para o nome da trilha
const trilhaInput = document.getElementById('trilha-nome');

// Variável para armazenar o ID do usuário
let userId = '';

// Observa mudanças de estado na autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid; // Armazena o ID do usuário autenticado
        console.log("Usuário autenticado:", user.email);

        // Chama as funções para carregar o progresso e o estado de conclusão
        loadProgressFromFirebase();
        loadTrilhaCompleta();
    } else {
        console.log("Nenhum usuário autenticado.");
    }
});

// Função para atualizar a barra de progresso
function updateProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.topic-checkbox:checked').length;
    const percentage = (checked / total) * 100;

    setProgress(percentage);
    saveProgress(); // Salva progresso toda vez que a barra é atualizada
}

// Função para definir a largura e o texto da barra de progresso
function setProgress(percentage) {
    progressBar.style.width = percentage + '%';
    progressBar.textContent = Math.round(percentage) + '%';

    // Verifica se a trilha está 100% completa
    if (percentage === 100) {
        const trilhaId = trilhaInput.value.trim();
        if (userId && trilhaId) {
            const completeRef = ref(database, `users/${userId}/trilhas/${trilhaId}/completa`);
            set(completeRef, true)
                .then(() => {
                    console.log("Trilha marcada como completa no Firebase.");
                })
                .catch((error) => {
                    console.error("Erro ao marcar trilha como completa:", error);
                });
        }
    }
}

// Função para salvar o progresso no Firebase
function saveProgress() {
    const progressState = Array.from(checkboxes).map(checkbox => checkbox.checked);
    const trilhaId = trilhaInput.value.trim();

    if (!trilhaId) {
        alert("Por favor, insira o nome da trilha.");
        return;
    }

    if (userId) {
        const progressRef = ref(database, `users/${userId}/trilhas/${trilhaId}/progresso`);
        set(progressRef, progressState)
            .then(() => {
                console.log("Progresso salvo no Firebase com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao salvar progresso no Firebase:", error);
                alert("Ocorreu um erro ao salvar o progresso. Tente novamente mais tarde.");
            });
    } else {
        console.error("Usuário não autenticado. Não foi possível salvar o progresso.");
        alert("Você precisa estar logado para salvar o progresso.");
    }
}

// Função para carregar o progresso do Firebase
function loadProgressFromFirebase() {
    const trilhaId = trilhaInput.value.trim();

    if (!trilhaId) {
        console.error("Por favor, insira o nome da trilha para carregar o progresso.");
        return;
    }

    if (userId) {
        const progressRef = ref(database, `users/${userId}/trilhas/${trilhaId}/progresso`);
        get(progressRef).then((snapshot) => {
            if (snapshot.exists()) {
                const savedProgress = snapshot.val();
                console.log("Dados carregados do Firebase:", savedProgress);
                if (Array.isArray(savedProgress)) {
                    checkboxes.forEach((checkbox, index) => {
                        checkbox.checked = savedProgress[index];
                    });
                    updateProgress(); // Atualiza a barra de progresso
                    console.log("Progresso carregado do Firebase com sucesso!");
                } else {
                    console.error("O progresso carregado não está no formato esperado.");
                }
            } else {
                console.log("Nenhum progresso salvo encontrado no Firebase.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar progresso do Firebase:", error);
            alert("Ocorreu um erro ao carregar o progresso. Tente novamente mais tarde.");
        });
    } else {
        console.error("Usuário não autenticado. Não foi possível carregar o progresso.");
        alert("Você precisa estar logado para carregar o progresso.");
    }
}

// Função para carregar o estado de conclusão da trilha
function loadTrilhaCompleta() {
    const trilhaId = trilhaInput.value.trim();
    console.log("Tentando carregar trilha:", trilhaId, "para o usuário:", userId);

    if (!trilhaId) {
        console.error("Por favor, insira o nome da trilha para carregar o estado de conclusão.");
        return;
    }

    if (userId) {
        const completeRef = ref(database, `users/${userId}/trilhas/${trilhaId}/completa`);
        get(completeRef).then((snapshot) => {
            if (snapshot.exists() && snapshot.val() === true) {
                console.log("Trilha está completa.");
                // Exibir "completa" no perfil ou interface
            } else {
                console.log("Trilha não está completa ou não foi encontrada.");
            }
        }).catch((error) => {
            console.error("Erro ao carregar estado de conclusão da trilha:", error);
        });
    } else {
        console.error("Usuário não autenticado. Não foi possível carregar o estado de conclusão.");
    }
}

// Adiciona o evento de mudança a cada checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateProgress);
});

// Pegar os elementos do modal e do botão
const modal = document.getElementById("betaModal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("close")[0];

// Certifique-se de que o modal está escondido ao carregar a página
modal.style.display = "none"; // Garante que o modal não esteja visível

// Quando o usuário clicar no botão "BETA", abrir o modal
btn.onclick = function() {
    console.log("Botão BETA clicado");
    modal.style.display = "flex"; // Mostrar o modal como flexbox
}

// Quando o usuário clicar no "X", fechar o modal
span.onclick = function() {
    console.log("Modal fechado");
    modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, também fechar
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
