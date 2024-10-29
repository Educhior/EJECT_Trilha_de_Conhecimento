// Importe o Firebase e as configurações do seu projeto
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);

// Obtenha a instância do Auth
const auth = getAuth(app);

// Função para cadastrar um novo usuário
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("As senhas não correspondem!");
        return;
    }

    // Criando usuário com email e senha usando o método `createUserWithEmailAndPassword`
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Cadastro bem-sucedido
            alert('Cadastro realizado com sucesso!');

            // Redirecionar ou realizar outras ações após o cadastro
            window.location.href = 'index.html'; // Redireciona para a página de login
        })
        .catch((error) => {
            // Tratar erros de registro
            const errorMessage = error.message;
            alert(`Erro: ${errorMessage}`);
        });
});
