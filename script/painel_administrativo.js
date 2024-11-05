// Função para buscar usuários na tabela
function searchUser() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toLowerCase();
    let table = document.getElementById('userTable');
    let tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[0]; // Nome
        if (td) {
            let txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}

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

// Verifica se o usuário está logado
auth.onAuthStateChanged((user) => {
    if (!user) {
        alert('Você não está logado. Redirecionando para o login...');
        window.location.href = '/EJECT_Trilha_de_Conhecimento/login';  // Redireciona para a página de login
    }
});

// Logout
document.getElementById('logout').addEventListener('click', function(event) {
    event.preventDefault();
    auth.signOut().then(() => {
        alert('Você saiu!');
        window.location.href = '/EJECT_Trilha_de_Conhecimento/login';  // Redireciona para a página de login após logout
    });
});
