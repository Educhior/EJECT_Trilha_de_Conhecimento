

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

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Evento de submissão do formulário
document.addEventListener("DOMContentLoaded", function () {
    const resetForm = document.getElementById("resetPasswordForm");

    if (resetForm) {
        resetForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const email = document.getElementById("email").value;

            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
                    window.location.href = "/EJECT_Trilha_de_Conhecimento/login"; // Redireciona para o login
                })
                .catch(error => {
                    console.error("Erro ao enviar e-mail:", error);
                    alert("Erro ao enviar e-mail: " + error.message);
                });
        });
    }
});