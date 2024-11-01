// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
    if (logoutModal) logoutModal.style.display = 'none';

    // Função de cadastro com atualização de perfil
    const signUp = (email, password, displayName) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
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

    // Função de login (opcional para testes)
    const signIn = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Usuário logado:", userCredential.user);
            })
            .catch((error) => {
                console.error("Erro ao logar:", error);
            });
    };

    // Verificar o estado de autenticação do usuário
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userName = user.displayName || user.email; // Usar o displayName se existir, caso contrário, usar o e-mail
            if (welcomeMessage) {
                welcomeMessage.innerHTML = `Boas-vindas, ${userName}!`;
                welcomeMessage.style.display = 'block';
            }
            if (logoutContainer) logoutContainer.style.display = 'block';
            if (loginButton) loginButton.style.display = 'none';
        } else {
            if (welcomeMessage) welcomeMessage.style.display = 'none';
            if (logoutContainer) logoutContainer.style.display = 'none';
            if (loginButton) loginButton.style.display = 'block';
        }
    });

    // Exibir modal ao clicar no botão de logout
    if (logoutButtonModal) {
        logoutButtonModal.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'block'; // Exibe o modal
            }
        });
    }

    // Fechar o modal ao clicar no botão "x"
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (logoutModal) {
                logoutModal.style.display = 'none'; // Esconde o modal
            }
        });
    }

    // Fechar o modal se o usuário clicar fora da área do modal
    window.addEventListener('click', (event) => {
        if (event.target === logoutModal) {
            if (logoutModal) {
                logoutModal.style.display = 'none'; // Esconde o modal
            }
        }
    });

    // Função para deslogar o usuário
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault();
            signOut(auth)
                .then(() => {
                    window.location.href = '/EJECT_Trilha_de_Conhecimento/login'; // Redirecionar após deslogar
                })
                .catch((error) => {
                    console.error('Erro ao deslogar:', error);
                });
        });
    }
});
