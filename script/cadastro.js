// Importa o Firebase e as configurações do seu projeto
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Configurações do Firebase
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

// Função para salvar o nome do usuário no Realtime Database
function saveUserName(userId, name) {
    set(ref(database, 'users/' + userId), {
        username: name
    }).then(() => {
        console.log("Nome salvo com sucesso no Firebase!");
    }).catch((error) => {
        console.error("Erro ao salvar o nome:", error);
    });
}

// Função para cadastrar um novo usuário
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const name = document.getElementById('name').value; // Nome do usuário

    if (password !== confirmPassword) {
        alert("As senhas não correspondem!");
        return;
    }

    // Criando usuário com email e senha usando o método `createUserWithEmailAndPassword`
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Cadastro bem-sucedido
            
            // Salva o nome do usuário no Firebase
            const user = userCredential.user;
            saveUserName(user.uid, name);

            // Redireciona para a página de login
            window.location.href = '/EJECT_Trilha_de_Conhecimento/login';
        })
        .catch((error) => {
            // Tratar erros de registro
            const errorMessage = error.message;
            alert(`Erro: ${errorMessage}`);
        });
});
