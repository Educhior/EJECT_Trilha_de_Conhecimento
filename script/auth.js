// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);

// Função de login
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
      .then(() => { // Removed unused parameter
          window.location.href = 'EJECT_Trilha_de_Conhecimento/perfil';  // Redireciona para a página protegida
      })
      .catch((error) => {
          alert('Erro: ' + error.message);
      });
});

// Verifica o estado de autenticação do usuário
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Se o usuário estiver logado, redirecione para a página de login
    window.location.href = 'EJECT_Trilha_de_Conhecimento/perfil'; // Redireciona para a página protegida
  } else {
    // Usuário não está logado, permanece na página de login ou executa outra lógica
    console.log("Usuário não autenticado");
  }
});

const forms = document.querySelector('.forms_cadastro');
console.log(forms);
