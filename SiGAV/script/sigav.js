        // Configuração do Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyCjYmouzj1x8pSuHVJ6s01vj-ubETBRJwQ",
            authDomain: "eject-trilha-de-conhecimento.firebaseapp.com",
            projectId: "eject-trilha-de-conhecimento",
            storageBucket: "eject-trilha-de-conhecimento.appspot.com",
            messagingSenderId: "339989029881",
            appId: "1:339989029881:web:8a0e91c6e068cad152d328",
            measurementId: "G-37E12ZK0X0",
            databaseURL: "https://eject-trilha-de-conhecimento-default-rtdb.firebaseio.com/"
          };
          
        // Inicializar o Firebase
        const app = firebase.initializeApp(firebaseConfig);
        const database = firebase.database();

        // Referências no banco de dados
        const usersRef = database.ref("users"); // Supondo que os dados de usuários estejam em 'users'

        // Função para buscar o total de usuários
        usersRef.once("value", snapshot => {
            const users = snapshot.val();
            const userCount = Object.keys(users).length;
            document.getElementById("user-count").textContent = userCount;
        });

        // Função para buscar os top 3 usuários por trilhas concluídas
        usersRef.orderByChild("trilhasConcluidas").limitToLast(3).once("value", snapshot => {
            const users = snapshot.val();
            const topUsersList = document.getElementById("top-users");

            // Limpar a lista antes de adicionar novos dados
            topUsersList.innerHTML = "";

            // Adicionar cada usuário ao top 3
            const topUsers = Object.values(users).sort((a, b) => b.trilhasConcluidas - a.trilhasConcluidas);
            topUsers.forEach(user => {
                const listItem = document.createElement("li");
                listItem.textContent = `${user.name} - ${user.trilhasConcluidas} trilhas concluídas`;
                topUsersList.appendChild(listItem);
            });
        });