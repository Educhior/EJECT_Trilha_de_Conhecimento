// gemini_features.js

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM para sugestão de trilha
    const interestInput = document.getElementById('gemini-interest-input');
    const suggestTrackButton = document.getElementById('gemini-suggest-track-button');

    // Elementos do Modal Gemini
    const geminiModal = document.getElementById('gemini-modal');
    const geminiModalTitle = document.getElementById('gemini-modal-title');
    const geminiModalContentArea = document.getElementById('gemini-modal-content-area');
    const geminiLoadingIndicator = document.getElementById('gemini-loading-indicator');
    const closeGeminiModalButton = document.getElementById('close-gemini-modal');
    const okGeminiModalButton = document.getElementById('ok-gemini-modal-button');

    // Container dos cards para delegação de eventos (botões de resumir)
    const cardContainer = document.getElementById('cardContainer');

    // Chave da API (deixar em branco para o ambiente injetar)
    const apiKey = ""; // Se precisar de uma chave para testes locais, coloque-a aqui.
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Mapeamento simples de descrições de trilhas para resumos mais direcionados
    // Adicione mais descrições conforme necessário
    const trackDescriptions = {
        "EJECT 15 Anos": "Conteúdo especial comemorativo dos 15 anos da EJECT, celebrando conquistas e a jornada da empresa júnior.",
        "GIT e Github": "Aprenda os fundamentos do sistema de controlo de versão Git e como usar o GitHub para alojar os seus projetos, colaborar com outros programadores e gerir o seu código de forma eficiente.",
        "Gestão de Tempo": "Descubra técnicas e ferramentas para otimizar o seu tempo, aumentar a produtividade, definir prioridades e alcançar os seus objetivos de forma mais eficaz.",
        "Gestão de Pessoas": "Explore os princípios da liderança, motivação de equipas, desenvolvimento de talentos, comunicação interpessoal e criação de um ambiente de trabalho positivo e produtivo.",
        "Marketing Comercial": "Entenda as estratégias de marketing e vendas, como identificar o seu público-alvo, criar campanhas eficazes, promover produtos ou serviços e construir uma marca forte.",
        "Scrum": "Conheça a metodologia ágil Scrum para gestão de projetos, focada em entregas incrementais, colaboração em equipa, flexibilidade e adaptação a mudanças.",
        "Financeiro": "Domine os conceitos básicos de finanças pessoais e empresariais, incluindo orçamento, controlo de despesas, investimentos e planeamento financeiro.",
        "História da EJECT": "Mergulhe na trajetória da EJECT, desde a sua fundação, principais projetos, desafios superados e o impacto gerado ao longo dos anos.",
        "HTML e CSS": "Aprenda as linguagens fundamentais para a construção de páginas web: HTML para a estrutura e CSS para a estilização e design visual.",
        "Vue.js": "Descubra o Vue.js, um framework JavaScript progressivo para construir interfaces de utilizador interativas e dinâmicas de forma eficiente.",
        "OKRs, KPIs e BPMN": "Entenda como definir Objetivos e Resultados Chave (OKRs), acompanhar Indicadores Chave de Desempenho (KPIs) e modelar processos de negócio com BPMN para melhorar a gestão e os resultados.",
        "Wordpress": "Aprenda a criar e gerir websites e blogs utilizando o WordPress, a plataforma de gestão de conteúdo mais popular do mundo, sem precisar de saber programar.",
        "JavaScript": "Domine o JavaScript, a linguagem de programação essencial para adicionar interatividade, dinamismo e funcionalidades avançadas a websites e aplicações web.",
        "TypeScript": "Explore o TypeScript, um superset do JavaScript que adiciona tipagem estática opcional e outras funcionalidades para desenvolver aplicações mais robustas e escaláveis.",
        "UX e UI": "Compreenda os princípios de User Experience (UX) para criar produtos digitais intuitivos e agradáveis de usar, e User Interface (UI) para desenhar interfaces visualmente atraentes e funcionais.",
        "Python": "Inicie na programação com Python, uma linguagem versátil, poderosa e de fácil aprendizagem, amplamente utilizada em desenvolvimento web, ciência de dados, inteligência artificial e mais.",
        "Django & Rest": "Aprenda a desenvolver aplicações web robustas e APIs RESTful utilizando Django, um framework Python de alto nível que incentiva o desenvolvimento rápido e o design limpo e pragmático.",
        "Data Studio": "Descubra como usar o Google Data Studio (agora Looker Studio) para criar relatórios e dashboards interativos e visualmente apelativos, transformando dados brutos em informações valiosas."
    };

    /**
     * Mostra o modal Gemini.
     * @param {string} title - O título do modal.
     */
    function openGeminiModal(title = "Informação da IA ✨") {
        if (geminiModalTitle) geminiModalTitle.textContent = title;
        if (geminiModal) geminiModal.classList.add('show');
        if (geminiModalContentArea) geminiModalContentArea.innerHTML = ''; // Limpa conteúdo anterior
        if (geminiLoadingIndicator) geminiLoadingIndicator.style.display = 'none'; // Esconde por defeito
    }

    /**
     * Fecha o modal Gemini.
     */
    function closeGeminiModal() {
        if (geminiModal) geminiModal.classList.remove('show');
    }

    /**
     * Mostra o indicador de carregamento no modal.
     */
    function showLoading() {
        if (geminiModalContentArea) geminiModalContentArea.style.display = 'none';
        if (geminiLoadingIndicator) geminiLoadingIndicator.style.display = 'block';
    }

    /**
     * Esconde o indicador de carregamento e mostra a área de conteúdo.
     */
    function hideLoading() {
        if (geminiLoadingIndicator) geminiLoadingIndicator.style.display = 'none';
        if (geminiModalContentArea) geminiModalContentArea.style.display = 'block';
    }

    /**
     * Formata o texto de resposta da Gemini para HTML (parágrafos e listas).
     * @param {string} text - O texto plano da Gemini.
     * @returns {string} - O texto formatado como HTML.
     */
    function formatGeminiResponse(text) {
        if (!text) return "<p>Não foi possível obter uma resposta.</p>";
        // Substitui múltiplos newlines por um só, depois newlines por <br>
        // Uma abordagem mais robusta poderia identificar listas marcadas com '*' ou '-'
        let html = text.replace(/\n\s*\n/g, '\n').replace(/\n/g, '<br>');

        // Tenta formatar listas simples (linhas que começam com * ou -)
        html = html.replace(/^\s*([*-])\s*(.+?)(<br>|$)/gm, (_, __, content) => {
            return `<li>${content.trim()}</li>`;
        });
        // Envolve blocos de <li> em <ul>
        if (html.includes("<li>")) {
            html = html.replace(/(<li>.*?<\/li>)/gs, "<ul>$1</ul>");
            // Corrige múltiplos <ul> se estiverem aninhados incorretamente por substituições simples
            html = html.replace(/<\/ul>\s*<ul>/g, "");
        }
        // Envolve o conteúdo geral em parágrafos se não for uma lista
        if (!html.trim().startsWith("<ul>") && !html.trim().startsWith("<p>")) {
           html = `<p>${html}</p>`;
        }
        return html;
    }


    /**
     * Chama a API Gemini.
     * @param {string} promptText - O prompt para enviar à API.
     * @returns {Promise<string|null>} - O texto da resposta ou null em caso de erro.
     */
    async function callGeminiAPI(promptText) {
        showLoading();
        try {
            const payload = {
                contents: [{
                    role: "user",
                    parts: [{ text: promptText }]
                }],
                generationConfig: {
                    temperature: 0.7, // Ajuste para mais ou menos criatividade
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 512, // Limite de tokens da resposta
                }
            };

            const response = await fetch(geminiApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Erro da API Gemini:", response.status, errorBody);
                return `Erro ao comunicar com a IA: ${errorBody.error?.message || response.statusText}. Por favor, tente novamente mais tarde.`;
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                return result.candidates[0].content.parts[0].text;
            } else if (result.promptFeedback && result.promptFeedback.blockReason) {
                 console.warn("Prompt bloqueado pela API Gemini:", result.promptFeedback.blockReason, result.promptFeedback.safetyRatings);
                return `O seu pedido não pôde ser processado devido a restrições de conteúdo (${result.promptFeedback.blockReason}). Por favor, reformule o seu pedido.`;
            }
             else {
                console.warn("Resposta da API Gemini em formato inesperado:", result);
                return "A IA retornou uma resposta num formato inesperado. Tente novamente.";
            }
        } catch (error) {
            console.error("Erro ao chamar a API Gemini:", error);
            return "Ocorreu um erro de rede ou ao processar o seu pedido. Verifique a sua ligação e tente novamente.";
        } finally {
            hideLoading();
        }
    }

    // Event listener para o botão "Sugerir Trilha"
    if (suggestTrackButton && interestInput) {
        suggestTrackButton.addEventListener('click', async () => {
            const interests = interestInput.value.trim();
            if (!interests) {
                openGeminiModal("Sugestão de Trilha");
                if (geminiModalContentArea) geminiModalContentArea.innerHTML = "<p>Por favor, insira os seus interesses para receber uma sugestão.</p>";
                return;
            }

            openGeminiModal("A Sugerir Trilhas...");

            // Coletar títulos das trilhas disponíveis na página
            const availableTrackTitles = Array.from(document.querySelectorAll('#cardContainer .ds-card .titulo-trilha'))
                                           .map(el => el.textContent.trim())
                                           .filter(title => title); // Filtra títulos vazios

            let prompt;
            if (availableTrackTitles.length > 0) {
                const trackListString = availableTrackTitles.join(", ");
                prompt = `Sou um utilizador do Hub de Conhecimentos da EJECT e estou interessado em aprender sobre: "${interests}".
                As trilhas de conhecimento atualmente disponíveis no hub são: ${trackListString}.
                Com base nos meus interesses, quais destas trilhas você me recomendaria (até 3)?
                Para cada trilha recomendada, explique brevemente (1-2 frases) por que ela seria relevante para os meus interesses.
                Se nenhuma das trilhas disponíveis parecer diretamente relevante, pode sugerir áreas de estudo relacionadas que eu poderia procurar.
                Responda em português de Portugal.`;
            } else {
                prompt = `Sou um utilizador interessado em aprender sobre: "${interests}".
                Quais áreas gerais de estudo ou tipos de trilhas de conhecimento seriam relevantes para mim?
                Explique brevemente (1-2 frases por sugestão).
                Responda em português de Portugal.`;
            }


            const suggestion = await callGeminiAPI(prompt);
            if (geminiModalTitle) geminiModalTitle.textContent = "Sugestões de Trilhas ✨";
            if (geminiModalContentArea) geminiModalContentArea.innerHTML = formatGeminiResponse(suggestion);
        });
    }

    // Event listener para os botões "Resumir Trilha" (delegação de evento)
    if (cardContainer) {
        cardContainer.addEventListener('click', async (event) => {
            const summarizeButton = event.target.closest('.gemini-summarize-btn');
            if (summarizeButton) {
                const card = summarizeButton.closest('.ds-card');
                const trackTitle = card ? card.dataset.trackTitle : null;

                if (!trackTitle) {
                    console.warn("Título da trilha não encontrado para resumo.");
                    return;
                }

                openGeminiModal(`A Resumir: ${trackTitle}...`);

                const predefinedDescription = trackDescriptions[trackTitle];
                let prompt;

                if (predefinedDescription) {
                    prompt = `Faça um resumo conciso (cerca de 2-3 frases) da seguinte trilha de conhecimento chamada "${trackTitle}" para um iniciante. A descrição base é: "${predefinedDescription}".
                    Destaque os principais tópicos que alguém aprenderia e os benefícios.
                    Responda em português de Portugal.`;
                } else {
                    // Fallback se não houver descrição predefinida
                    prompt = `Descreva em poucas palavras (2-3 frases) o que geralmente se aprende numa trilha de conhecimento sobre "${trackTitle}" e quais os seus benefícios para um iniciante.
                    Responda em português de Portugal.`;
                }

                const summary = await callGeminiAPI(prompt);
                if (geminiModalTitle) geminiModalTitle.textContent = `Resumo de ${trackTitle} ✨`;
                if (geminiModalContentArea) geminiModalContentArea.innerHTML = formatGeminiResponse(summary);
            }
        });
    }


    // Event listeners para fechar o modal Gemini
    if (closeGeminiModalButton) {
        closeGeminiModalButton.addEventListener('click', closeGeminiModal);
    }
    if (okGeminiModalButton) {
        okGeminiModalButton.addEventListener('click', closeGeminiModal);
    }
    if (geminiModal) {
        geminiModal.addEventListener('click', (event) => {
            if (event.target === geminiModal) { // Clicou no fundo do modal
                closeGeminiModal();
            }
        });
    }

    // Lógica para o modal de logout (se existir no HTML, para não quebrar se for removido)
    const logoutButtonHeaderEl = document.getElementById('logout-button-header');
    const logoutConfirmationModalEl = document.getElementById('logout-confirmation-modal');
    const closeLogoutModalButtonEl = document.getElementById('close-logout-modal');
    const confirmLogoutButtonEl = document.getElementById('confirm-logout-button');
    const cancelLogoutButtonEl = document.getElementById('cancel-logout-button');

    function openLogoutModal() {
        if (logoutConfirmationModalEl) logoutConfirmationModalEl.style.display = 'flex';
    }
    function closeLogoutModal() {
        if (logoutConfirmationModalEl) logoutConfirmationModalEl.style.display = 'none';
    }

    if (logoutButtonHeaderEl) {
        logoutButtonHeaderEl.addEventListener('click', (event) => {
            event.preventDefault();
            openLogoutModal();
        });
    }
    if (confirmLogoutButtonEl) {
        confirmLogoutButtonEl.addEventListener('click', () => {
            // A lógica de logout do Firebase seria chamada aqui se estivesse presente.
            console.log('Logout confirmado (simulação).');
            closeLogoutModal();
            // Exemplo: window.location.href = '/logout';
        });
    }
    if (cancelLogoutButtonEl) cancelLogoutButtonEl.addEventListener('click', closeLogoutModal);
    if (closeLogoutModalButtonEl) closeLogoutModalButtonEl.addEventListener('click', closeLogoutModal);

    if (logoutConfirmationModalEl) {
        logoutConfirmationModalEl.addEventListener('click', (event) => {
            if (event.target === logoutConfirmationModalEl) {
                closeLogoutModal();
            }
        });
    }
});
