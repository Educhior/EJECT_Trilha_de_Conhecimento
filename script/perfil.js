import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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

        if (snapshot.exists()) {
            const trails = snapshot.val();
            const trailsList = document.querySelector('.list-group-flush');
            trailsList.innerHTML = ''; // Limpa a lista existente

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
            const trailsList = document.querySelector('.list-group-flush');
            trailsList.innerHTML = '<li class="list-group-item">Nenhuma trilha encontrada.</li>';
        }
    } catch (error) {
        console.error("Erro ao carregar as trilhas:", error);
    }
}

// Função para deslogar o usuário
function logout() {
    signOut(auth).then(() => {
        console.log("Usuário deslogado com sucesso.");
        // Redirecionar para a página de login ou limpar a interface, conforme necessário
        window.location.href = 'login.html'; // Exemplo de redirecionamento
    }).catch((error) => {
        console.error("Erro ao deslogar:", error);
    });
}

// Adiciona o evento de clique ao botão de deslogar
document.getElementById('logoutButton').addEventListener('click', logout);

// Verifica o estado de autenticação
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuário autenticado:", user.uid);
        loadUserTrails(user.uid); // Chama a função com o UID do usuário autenticado
    } else {
        console.log("Usuário não autenticado.");
        // Redirecionar para a página de login se o usuário não estiver autenticado
        window.location.href = '/login'; // Exemplo de redirecionamento
    }
});
