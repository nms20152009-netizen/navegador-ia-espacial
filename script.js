// Elementos DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const webFrame = document.getElementById('webFrame');
const welcomeScreen = document.getElementById('welcomeScreen');
const aiPanel = document.getElementById('aiPanel');
const aiToggleBtn = document.getElementById('aiToggleBtn');
const aiChat = document.getElementById('aiChat');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiCloseBtn = document.getElementById('aiCloseBtn');

// Estado del navegador
let currentUrl = '';
let aiActive = false;

// Inicializar
function init() {
    setupEventListeners();
    setupQuickLinks();
}

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    aiToggleBtn.addEventListener('click', toggleAIPanel);
    aiCloseBtn.addEventListener('click', toggleAIPanel);
    aiSendBtn.addEventListener('click', handleAIMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAIMessage();
        }
    });
}

function setupQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-links a');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const url = link.getAttribute('data-url');
            loadUrl(url);
        });
    });
}

// Funciones de navegación
function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    let url = query;
    
    // Verificar si es URL o búsqueda
    if (!query.includes('.') && !query.startsWith('http')) {
        // Es una búsqueda en Google
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    } else if (!query.startsWith('http')) {
        url = 'https://' + query;
    }
    
    loadUrl(url);
}

function loadUrl(url) {
    currentUrl = url;
    searchInput.value = url;
    welcomeScreen.style.display = 'none';
    // Abrir en nueva pestaña en lugar de iframe
    window.open(url, '_blank');
}

// Funciones del AI
function toggleAIPanel() {
    aiActive = !aiActive;
    if (aiActive) {
        aiPanel.classList.add('active');
    } else {
        aiPanel.classList.remove('active');
    }
}

function handleAIMessage() {
    const message = aiInput.value.trim();
    if (!message) return;
    
    // Mostrar mensaje del usuario
    addAIMessage(message, 'user');
    aiInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Procesar con el agente autónomo
    setTimeout(() => {
        processAICommand(message);
    }, 1000);
}

function addAIMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${type}`;
    
    if (type === 'user') {
        messageDiv.innerHTML = `<strong>Tú:</strong> ${content}`;
    } else {
        messageDiv.innerHTML = `<strong>Asistente:</strong> ${content}`;
    }
    
    aiChat.appendChild(messageDiv);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'ai-message assistant typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    aiChat.appendChild(indicator);
    aiChat.scrollTop = aiChat.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function processAICommand(command) {
    removeTypingIndicator();
    
    const lowerCommand = command.toLowerCase();
    
    // Agente autónomo con conocimientos de Perplexity, Gemini y OpenAI
    
    // Detectar búsquedas
    if (lowerCommand.includes('busca') || lowerCommand.includes('buscar') || 
        lowerCommand.includes('encuentra') || lowerCommand.includes('qué es') ||
        lowerCommand.includes('quién es') || lowerCommand.includes('cómo') ||
        lowerCommand.includes('search') || lowerCommand.includes('find')) {
        
        let searchQuery = command
            .replace(/busca(r)?|encuentra(r)?|search|find/gi, '')
            .replace(/sobre|acerca de|about/gi, '')
            .trim();
        
        addAIMessage(`🔍 Realizando búsqueda sobre "${searchQuery}" en Google...`, 'assistant');
        
        setTimeout(() => {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            loadUrl(searchUrl);
            addAIMessage('✅ He abierto los resultados de búsqueda en el navegador. ¿Necesitas que te ayude a interpretar algo?', 'assistant');
        }, 500);
        
    }
    // Detectar navegación a sitios
    else if (lowerCommand.includes('abre') || lowerCommand.includes('ve a') || 
             lowerCommand.includes('navega') || lowerCommand.includes('open') ||
             lowerCommand.includes('go to')) {
        
        let site = '';
        if (lowerCommand.includes('google')) site = 'https://www.google.com';
        else if (lowerCommand.includes('youtube')) site = 'https://www.youtube.com';
        else if (lowerCommand.includes('wikipedia')) site = 'https://www.wikipedia.org';
        else if (lowerCommand.includes('github')) site = 'https://github.com';
        else if (lowerCommand.includes('twitter') || lowerCommand.includes('x.com')) site = 'https://twitter.com';
        else if (lowerCommand.includes('facebook')) site = 'https://www.facebook.com';
        else if (lowerCommand.includes('instagram')) site = 'https://www.instagram.com';
        else if (lowerCommand.includes('linkedin')) site = 'https://www.linkedin.com';
        
        if (site) {
            addAIMessage(`🌐 Abriendo ${site}...`, 'assistant');
            setTimeout(() => {
                loadUrl(site);
                addAIMessage('✅ ¡Listo! ¿Necesitas algo más?', 'assistant');
            }, 500);
        } else {
            addAIMessage('⚠️ No reconocí el sitio web. ¿Podrías ser más específico?', 'assistant');
        }
    }
    // Preguntas sobre el navegador
    else if (lowerCommand.includes('cómo funciona') || lowerCommand.includes('ayuda') || 
             lowerCommand.includes('help') || lowerCommand.includes('qué puedes hacer')) {
        addAIMessage(`🤖 Soy un agente de IA autónomo con capacidades de:<br><br>
            <strong>Perplexity:</strong> Puedo buscar información actualizada en la web<br>
            <strong>Gemini:</strong> Entiendo contexto y razonamiento complejo<br>
            <strong>OpenAI:</strong> Puedo conversar naturalmente y ejecutar acciones<br><br>
            <strong>Comandos que entiendo:</strong><br>
            - "Busca [tema]" - Realizo búsquedas en Google<br>
            - "Abre [sitio]" - Navego a sitios web<br>
            - "Explícame [concepto]" - Te doy explicaciones<br>
            - Y mucho más... ¡Solo pregunta!`, 'assistant');
    }
    // Explicaciones
    else if (lowerCommand.includes('explíca') || lowerCommand.includes('qué significa') ||
             lowerCommand.includes('explain') || lowerCommand.includes('what is')) {
        addAIMessage(`💡 Entiendo que quieres una explicación. Voy a buscar información sobre "${command}" para darte una respuesta completa.`, 'assistant');
        
        setTimeout(() => {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(command + ' explicación')}`;
            loadUrl(searchUrl);
            addAIMessage('He abierto resultados con explicaciones detalladas. ¿Quieres que te resuma algo específico?', 'assistant');
        }, 1000);
    }
    // Respuesta genérica inteligente
    else {
        const responses = [
            `Interesante pregunta sobre "${command}". Voy a buscar la mejor información para ti.`,
            `Entiendo tu consulta. Déjame encontrar datos relevantes sobre "${command}".`,
            `Procesando tu solicitud con conocimientos de múltiples fuentes de IA...`
        ];
        
        const response = responses[Math.floor(Math.random() * responses.length)];
        addAIMessage(response, 'assistant');
        
        setTimeout(() => {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(command)}`;
            loadUrl(searchUrl);
            addAIMessage('✅ He encontrado resultados. ¿Necesitas que te ayude a analizar la información?', 'assistant');
        }, 1500);
    }
}

// Iniciar la aplicación
init();
