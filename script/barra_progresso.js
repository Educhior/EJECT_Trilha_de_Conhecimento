// Define a chave única para o localStorage com base no conteúdo da página
const trailKey = document.title; // Ou use um identificador específico para a trilha

// Seleciona todos os checkboxes e a barra de progresso
const checkboxes = document.querySelectorAll('.topic-checkbox');
const progressBar = document.getElementById('progress-bar');
const confetti = document.getElementById('confetti');

// Função para atualizar a barra de progresso
function updateProgress() {
    const total = checkboxes.length;
    const checked = document.querySelectorAll('.topic-checkbox:checked').length;
    const percentage = (checked / total) * 100;

    // Atualiza a barra de progresso
    setProgress(percentage);

    // Salvar estado das checkboxes no localStorage
    saveProgress();
}

// Função para definir a largura e o texto da barra de progresso
function setProgress(percentage) {
    progressBar.style.width = percentage + '%';
    progressBar.textContent = Math.round(percentage) + '%';

    if (percentage >= 100) {
        triggerConfetti();
    }
}

// Função para salvar o progresso no localStorage
function saveProgress() {
    const progressState = Array.from(checkboxes).map(checkbox => checkbox.checked);
    localStorage.setItem(`progress_${trailKey}`, JSON.stringify(progressState)); // Salva com a chave única
}

// Função para carregar o progresso do localStorage
function loadProgress() {
    const savedProgress = JSON.parse(localStorage.getItem(`progress_${trailKey}`)); // Carrega com a chave única

    if (savedProgress) {
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = savedProgress[index];
        });
    }

    // Atualiza a barra de progresso com os dados carregados
    updateProgress();
}

// Adiciona o evento de mudança a cada checkbox
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateProgress);
});

// Carrega o progresso salvo ao carregar a página
window.addEventListener('load', loadProgress);

// Função para disparar confetes
function triggerConfetti() {
    confetti.style.display = 'block';
    for (let i = 0; i < 100; i++) {
        createConfettiPiece();
    }
}

// Função para criar peças de confete
function createConfettiPiece() {
    const piece = document.createElement('div');
    piece.classList.add('confetti-piece');

    // Gerar formas e cores aleatórias
    piece.style.left = `${Math.random() * 100}vw`; // Largura aleatória da tela
    piece.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;

    // Variar tamanho do confete
    const size = Math.random() * 10 + 5; // Tamanho entre 5px e 15px
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;

    // Adicionar forma aleatória (círculo ou quadrado)
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';

    confetti.appendChild(piece);

    // Remove o confete após a animação
    piece.addEventListener('animationend', () => {
        piece.remove();
    });
}

// Pegar os elementos do modal e do botão
const modal = document.getElementById("betaModal");
const btn = document.getElementById("open-modal");
const span = document.getElementsByClassName("close")[0];

// Certifique-se de que o modal está escondido ao carregar a página
modal.style.display = "none"; // Garante que o modal não esteja visível

// Quando o usuário clicar no botão "BETA", abrir o modal
btn.onclick = function() {
    console.log("Botão BETA clicado"); // Log para verificar se o botão está funcionando
    modal.style.display = "flex"; // Mostrar o modal como flexbox
}

// Quando o usuário clicar no "X", fechar o modal
span.onclick = function() {
    console.log("Modal fechado"); // Log para verificar se o modal está sendo fechado
    modal.style.display = "none";
}

// Quando o usuário clicar fora do modal, também fechar
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
