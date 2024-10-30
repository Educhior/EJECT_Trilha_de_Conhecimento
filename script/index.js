// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos
    const logoutModal = document.getElementById('logout-modal');
    const closeModalButton = document.getElementById('close-modal');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutContainer = document.getElementById('logout-container');
    const logoutButtonModal = document.getElementById('logout-button-modal');

    // Esconder o modal inicialmente
    logoutModal.style.display = 'none';

    const signUp = (email, password, displayName) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Atualiza o perfil do usuário
                return updateProfile(userCredential.user, {
                    displayName: displayName
                });
            })
            .then(() => {
                console.log("Usuário cadastrado e nome definido!");
            })
            .catch((error) => {
                console.error("Erro ao cadastrar usuário:", error);
            });
    };

    // Verificar o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está logado
        const userName = user.displayName || user.email; // Usar o displayName se existir, caso contrário, usar o e-mail
        welcomeMessage.innerHTML = `Bem-vindo, ${userName}!`;
        welcomeMessage.style.display = 'block';
        logoutContainer.style.display = 'block'; // Mostrar o botão de logout
        loginButton.style.display = 'none'; // Ocultar o botão de login
    } else {
        // Usuário não está logado
        welcomeMessage.style.display = 'none';
        logoutContainer.style.display = 'none'; // Esconder o botão de logout
        loginButton.style.display = 'block'; // Mostrar o botão de login
    }
});

    // Exibir modal ao clicar no botão de logout
    logoutButtonModal.addEventListener('click', () => {
        logoutModal.style.display = 'block'; // Mostra o modal
    });

    // Fechar o modal quando o usuário clicar no "x"
    closeModalButton.addEventListener('click', () => {
        logoutModal.style.display = 'none'; // Esconde o modal
    });

    // Fechar o modal se o usuário clicar fora da área do modal
    window.addEventListener('click', (event) => {
        if (event.target === logoutModal) {
            logoutModal.style.display = 'none'; // Esconde o modal
        }
    });

    // Função para deslogar o usuário
    logoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do botão
        signOut(auth).then(() => {
            alert('Deslogado com sucesso!');
            window.location.href = '/login';
        }).catch((error) => {
            console.error('Erro ao deslogar:', error);
        });
    });
});
