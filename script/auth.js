  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCjYmouzj1x8pSuHVJ6s01vj-ubETBRJwQ",
    authDomain: "eject-trilha-de-conhecimento.firebaseapp.com",
    projectId: "eject-trilha-de-conhecimento",
    storageBucket: "eject-trilha-de-conhecimento.appspot.com",
    messagingSenderId: "339989029881",
    appId: "1:339989029881:web:8a0e91c6e068cad152d328",
    measurementId: "G-37E12ZK0X0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app); // Removed unused variable


// Função de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => { // Removed unused parameter
            alert('Login bem-sucedido!');
            window.location.href = 'pagina-protegida.html';  // Redireciona para a página protegida
        })
        .catch((error) => {
            alert('Erro: ' + error.message);
        });
});


// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);

// Função para cadastrar um novo usuário
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // const name = document.getElementById('name').value; // Removed unused variable
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("As senhas não correspondem!");
        return;
    }

    // Criando usuário com email e senha
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Cadastro bem-sucedido
            // const user = userCredential.user; // Removed unused variable
            alert('Cadastro realizado com sucesso!');

            // Opcional: Armazene o nome do usuário em uma base de dados, se necessário

            // Redirecionar ou realizar outras ações após o cadastro
            window.location.href = 'login.html'; // Redireciona para a página de login
        })
        .catch((error) => {
            // Tratar erros de registro
            // const errorCode = error.code; // Removed unused variable
            const errorMessage = error.message;
            alert(`Erro: ${errorMessage}`);
        });
});
