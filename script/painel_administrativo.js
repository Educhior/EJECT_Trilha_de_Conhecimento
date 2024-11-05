// Inicialize o Firebase no navegador utilizando a versão compatível
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
  
  // Importação do Firebase Compatível
  firebase.initializeApp(firebaseConfig);
  
  // Referência ao Firebase Realtime Database
  const database = firebase.database();
  
  // Função para buscar todos os usuários
  function getAllUsers() {
    const usersRef = database.ref('users/');
    usersRef.once('value', snapshot => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        console.log(usersData);  // Para visualizar os dados recebidos do Firebase
        if (usersData) {
          Object.values(usersData).forEach(userData => {
            displayUserData(userData);
          });
        } else {
          document.getElementById('noUsersMessage').style.display = 'block';
        }
      } else {
        console.error('No data available for users');
      }
    }).catch(error => {
      console.error('Error getting users data:', error);
    });
  }
  
  function displayUserData(userData) {
    const tableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];
    const row = tableBody.insertRow();
  
    // Adiciona o nome e o email
    row.insertCell(0).textContent = userData.username;
    row.insertCell(1).textContent = userData.email;
  
    // Cálculo do progresso das trilhas
    const trilhas = userData.trilhas;
    const totalTrilhas = Object.keys(trilhas).length;
    let trilhasCompletas = 0;
    let progressoGeral = 0;
  
    // Progresso Geral (coluna 2)
    const progressoCell = row.insertCell(2);
    const progressoText = document.createElement('div');
  
    for (const [trilha, dadosTrilha] of Object.entries(trilhas)) {
      const { completa, progresso } = dadosTrilha;
  
      if (completa) {
        trilhasCompletas++;
      }
  
      const totalEtapas = progresso.length;
      const etapasCompletas = progresso.filter(Boolean).length;
      const progressoTrilha = (etapasCompletas / totalEtapas) * 100;
  
      progressoGeral += progressoTrilha;
  
      const progressoBar = document.createElement('div');
      progressoBar.classList.add('progresso-bar');
  
      const progressoContent = document.createElement('div');
      progressoContent.style.width = `${progressoTrilha}%`;
      progressoContent.classList.add(progressoTrilha === 100 ? 'progresso' : 'incompleta');
      
      progressoBar.appendChild(progressoContent);
  
      const trilhaInfo = document.createElement('div');
      trilhaInfo.textContent = `${trilha}: ${Math.round(progressoTrilha)}%`;
      progressoText.appendChild(trilhaInfo);
      progressoText.appendChild(progressoBar);
    }
  
    const progressoGeralFinal = (progressoGeral / totalTrilhas);
    row.insertCell(2).textContent = `${trilhasCompletas} de ${totalTrilhas} (${Math.round(progressoGeralFinal)}%)`;
  
    // Progresso das Trilhas (coluna 3)
    const progressoTrilhasCell = row.insertCell(3);
    progressoTrilhasCell.appendChild(progressoText);
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Seleciona o input da barra de busca
    const searchInput = document.getElementById("searchInput");
    // Seleciona a tabela de usuários
    const userTable = document.getElementById("userTable");

    // Função para filtrar os dados da tabela com base na busca
    searchInput.addEventListener("input", function () {
        const searchText = searchInput.value.toLowerCase();
        const rows = userTable.getElementsByTagName("tr");

        // Itera sobre todas as linhas da tabela
        for (let i = 1; i < rows.length; i++) { // Começando de 1 para pular o cabeçalho
            const cells = rows[i].getElementsByTagName("td");
            let matchFound = false;

            // Verifica se alguma célula da linha contém o texto pesquisado
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].textContent.toLowerCase().includes(searchText)) {
                    matchFound = true;
                    break;
                }
            }

            // Exibe ou esconde a linha com base na busca
            if (matchFound) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    });
});

  
  // Chama a função para carregar dados ao iniciar
  getAllUsers();
  