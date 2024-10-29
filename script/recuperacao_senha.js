// Recuperacao_senha.js

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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Função para enviar o e-mail de recuperação de senha
document.getElementById('resetPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    const email = document.getElementById('email').value;

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('E-mail de redefinição de senha enviado! Verifique sua caixa de entrada.');
        })
        .catch((error) => {
            console.error(error);
            alert('Erro: ' + error.message);
        });
});
