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

// function saveUserName(userId, name, email) {
function saveUserName(userId, name, email) {
    set(ref(database, 'users/' + userId), {
        username: name,
        email: email,
        createdAt: new Date().toISOString() // Adiciona a data de criação
    }).then(() => {
        alert("Nome e informações salvos com sucesso!");
        window.location.href = '/index.html'; // Redireciona para a página inicial
    }).catch((error) => {
        console.error("Erro ao salvar o nome:", error);
        alert("Erro ao salvar suas informações. Tente novamente.");
    });
}
    


// Função para validar e cadastrar um novo usuário
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const name = document.getElementById('name').value; // Nome do usuário

    // Validações
    if (!email || !password || !confirmPassword || !name) {
        alert("Todos os campos são obrigatórios!");
        return;
    }

    if (password !== confirmPassword) {
        alert("As senhas não correspondem!");
        return;
    }

    // Criando usuário com email e senha usando o método `createUserWithEmailAndPassword`
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Cadastro bem-sucedido
            const user = userCredential.user;
            console.log("Usuário criado:", user.uid); // Verifique se o UID do usuário está sendo impresso
            console.log("Nome do usuário:", name); // Verifique se o nome está correto
            saveUserName(user.uid, name, email); // Passando o e-mail também
                        
        })
        .catch((error) => {
            // Tratar erros de registro
            const errorMessage = error.message;
            alert(`Erro: ${errorMessage}`);
        });
});
