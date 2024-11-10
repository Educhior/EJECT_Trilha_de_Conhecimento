// Importar as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js"; // Importar o módulo do Realtime Database

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
const db = getDatabase(app); // Inicializa o Realtime Database

document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos
    const logoutModal = document.getElementById('logout-modal');
    const closeModalButton = document.getElementById('close-modal');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutContainer = document.getElementById('logout-container');
    const logoutButtonModal = document.getElementById('logout-button-modal');

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

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const userId = user.uid;
                const userRef = ref(db, `users/${userId}`); // Usar a nova referência do Realtime Database
                const snapshot = await get(userRef); // Usar get() para obter os dados

                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const username = userData.username; // Acessa o username

                    await updateProfile(user, { // Atualiza o displayName do usuário autenticado
                        displayName: username,
                    });

                    console.log("Nome de exibição atualizado com sucesso:", username);
                    welcomeMessage.innerHTML = `Boas-vindas, ${user.displayName}!`;
                    welcomeMessage.style.display = 'block';
                } else {
                    console.log('Usuário não encontrado no banco de dados.');
                }
            } catch (error) {
                console.error("Erro ao atualizar o nome de exibição:", error);
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
