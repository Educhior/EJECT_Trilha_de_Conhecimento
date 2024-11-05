import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// Sua configuração do Firebase
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
const db = getDatabase(app);
const auth = getAuth(app);

// Função para carregar as trilhas do usuário
async function loadUserTrails(userId) {
    const userRef = ref(db, 'users/' + userId + '/trilhas'); // Verifique o caminho correto
    try {
        const snapshot = await get(userRef);
        const trailsList = document.querySelector('.list-group-flush');
        trailsList.innerHTML = ''; // Limpa a lista existente

        if (snapshot.exists()) {
            const trails = snapshot.val();

            for (const trailName in trails) {
                const trail = trails[trailName];
                const totalSteps = Object.keys(trail.progresso).length;
                const completedSteps = Object.values(trail.progresso).filter(Boolean).length;
                const percentage = (completedSteps / totalSteps) * 100;

                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';

                // Cria a tag de conclusão apenas se a porcentagem for 100%
                const statusBadge = percentage === 100 
                    ? '<span class="badge bg-success">Concluída</span>' 
                    : '<span class="badge bg-warning">Em Andamento</span>'; // ou outro texto/estilo conforme sua preferência

                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${trailName.charAt(0).toUpperCase() + trailName.slice(1).replace(/_/g, ' ')}</span>
                        ${statusBadge}
                    </div>
                    <div class="progress mt-2">
                        <div class="progress-bar" role="progressbar" style="width: ${percentage}%;"
                            aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">${percentage.toFixed(0)}%</div>
                    </div>
                `;
                trailsList.appendChild(listItem);
            }
        } else {
            console.log("Nenhuma trilha encontrada.");
            trailsList.innerHTML = '<li class="list-group-item">Nenhuma trilha encontrada.</li>';
        }
    } catch (error) {
        console.error("Erro ao carregar as trilhas:", error);
        // Exiba uma mensagem de erro amigável
        const trailsList = document.querySelector('.list-group-flush');
        trailsList.innerHTML = '<li class="list-group-item">Erro ao carregar as trilhas. Tente novamente mais tarde.</li>';
    }
}

// Função para carregar o perfil do usuário
async function loadUserProfile(userId) {
    const userRef = ref(db, 'users/' + userId);

    try {
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            
            // Verifica e preenche o nome e o email do banco de dados
            nameField.value = userData.name || '';
            emailField.value = userData.email || '';

            // Se o nome no banco de dados estiver vazio, usa o displayName do Firebase Auth
            onAuthStateChanged(auth, (user) => {
                if (user && !nameField.value) {
                    nameField.value = user.displayName || '';
                }
                if (user && !emailField.value) {
                    emailField.value = user.email || '';
                }
            });
        } else {
            console.log("Usuário não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao carregar perfil do usuário:", error);
    }
}


// Função para deslogar o usuário
function logout() {
    signOut(auth).then(() => {
        console.log("Usuário deslogado com sucesso.");
        window.location.href = '/EJECT_Trilha_de_Conhecimento/login'; // Exemplo de redirecionamento para a página de login
    }).catch((error) => {
        console.error("Erro ao deslogar:", error);
        // Exiba uma mensagem de erro se necessário
    });
}

// Adiciona o evento de clique ao botão de deslogar após o DOM ser carregado
document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById('logout-button'); // ID corrigido
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error("O botão de logout não foi encontrado.");
    }

    // Evento para atualizar o perfil do usuário
    document.querySelector('.forms_perfil').addEventListener('submit', async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário
        const userId = auth.currentUser.uid;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const userRef = ref(db, 'users/' + userId);
            await set(userRef, {
                name,
                email
            });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar perfil. Tente novamente.");
        }
    });
});

// Verifica o estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário autenticado:", user.uid);
        loadUserProfile(user.uid); // Carrega o perfil do usuário
        loadUserTrails(user.uid); // Chama a função para carregar as trilhas
    } else {
        console.log("Usuário não autenticado.");
        window.location.href = '/EJECT_Trilha_de_Conhecimento/login'; // Redirecionar para a página de login
    }
});
