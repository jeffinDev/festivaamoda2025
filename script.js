// Configurações
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "amoda2025";

// Mensagens de agradecimento
const MENSAGENS_AGRADECIMENTO = [
    "Obrigado por participar! ✨",
    "Presença registrada! 🌟",
    "Obrigado por vir! 💫",
    "Registro confirmado! 🎪",
    "Bem-vindo(a)! 🔥",
    "Obrigado! 📸",
    "Presença confirmada! 💡",
    "Obrigado por comparecer! 🌈",
    "Registro realizado! 🎉",
    "Obrigado pela presença! ✨"
];

// Elementos DOM
const elements = {
    toggleView: document.getElementById('toggleView'),
    toggleText: document.getElementById('toggleText'),
    registradorView: document.getElementById('registradorView'),
    adminView: document.getElementById('adminView'),
    loginModal: document.getElementById('loginModal'),
    loginForm: document.getElementById('loginForm'),
    closeModal: document.getElementById('closeModal'),
    loginError: document.getElementById('loginError'),
    btnRegistrar: document.getElementById('btnRegistrar'),
    totalRegistros: document.getElementById('totalRegistros'),
    feedback: document.getElementById('feedback'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    registroInfo: document.getElementById('registroInfo'),
    adminCounter: document.getElementById('adminCounter'),
    lastRegistration: document.getElementById('lastRegistration'),
    registrosList: document.getElementById('registrosList'),
    btnExportPDF: document.getElementById('btnExportPDF'),
    btnExportCSV: document.getElementById('btnExportCSV'),
    btnReset: document.getElementById('btnReset'),
    confirmation: document.getElementById('confirmation'),
    confirmationText: document.getElementById('confirmationText'),
    btnConfirmReset: document.getElementById('btnConfirmReset'),
    btnCancelReset: document.getElementById('btnCancelReset')
};

// Estado da aplicação
let isAdminMode = false;
let feedbackTimeout = null;

// Inicialização
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    setupEventListeners();
    checkAuthentication();
    updateDisplay();
}

function setupEventListeners() {
    // Eventos básicos
    elements.toggleView.addEventListener('click', handleToggleView);
    elements.closeModal.addEventListener('click', closeLoginModal);
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.btnRegistrar.addEventListener('click', registrarPresenca);
    elements.btnExportPDF.addEventListener('click', exportPDF);
    elements.btnExportCSV.addEventListener('click', exportCSV);
    elements.btnReset.addEventListener('click', showResetConfirmation);
    elements.btnConfirmReset.addEventListener('click', resetCounter);
    elements.btnCancelReset.addEventListener('click', hideResetConfirmation);
    
    // Fechar modal ao clicar fora
    elements.loginModal.addEventListener('click', (e) => {
        if (e.target === elements.loginModal) closeLoginModal();
    });
}

function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        switchToAdmin();
    } else {
        switchToRegistrador();
    }
}

function handleToggleView() {
    if (isAdminMode) {
        switchToRegistrador();
    } else {
        showLoginModal();
    }
}

function switchToRegistrador() {
    isAdminMode = false;
    elements.registradorView.classList.add('active');
    elements.adminView.classList.remove('active');
    elements.toggleText.textContent = 'Modo Admin';
    updateDisplay();
}

function switchToAdmin() {
    isAdminMode = true;
    elements.registradorView.classList.remove('active');
    elements.adminView.classList.add('active');
    elements.toggleText.textContent = 'Modo Registro';
    updateAdminPanel();
}

function showLoginModal() {
    elements.loginModal.classList.remove('hidden');
    elements.loginError.classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function closeLoginModal() {
    elements.loginModal.classList.add('hidden');
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminLoggedIn', 'true');
        closeLoginModal();
        switchToAdmin();
    } else {
        elements.loginError.classList.remove('hidden');
    }
}

// Funções do Registrador
function registrarPresenca() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    const novoRegistro = {
        id: registros.length + 1,
        evento: 'ambos',
        timestamp: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        mensagem: getRandomMensagem()
    };
    
    registros.push(novoRegistro);
    localStorage.setItem('registrosPresenca', JSON.stringify(registros));
    
    updateDisplay();
    showFeedback(novoRegistro);
}

function getRandomMensagem() {
    return MENSAGENS_AGRADECIMENTO[Math.floor(Math.random() * MENSAGENS_AGRADECIMENTO.length)];
}

function updateDisplay() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    elements.totalRegistros.textContent = registros.length;
}

function showFeedback(registro) {
    // Limpar timeout anterior se existir
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
        feedbackTimeout = null;
    }
    
    elements.feedbackMessage.textContent = registro.mensagem;
    elements.registroInfo.textContent = `Registro #${registro.id} - ${registro.data} às ${registro.hora}`;
    elements.feedback.classList.remove('hidden');
    elements.feedback.classList.add('fade-in');
    
    // Garantir que a mensagem fique visível por 4 segundos
    feedbackTimeout = setTimeout(() => {
        elements.feedback.classList.add('hidden');
        elements.feedback.classList.remove('fade-in');
        feedbackTimeout = null;
    }, 4000);
}

// Funções do Admin
function updateAdminPanel() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    elements.adminCounter.textContent = registros.length;
    
    if (registros.length > 0) {
        const ultimo = registros[registros.length - 1];
        elements.lastRegistration.textContent = `${ultimo.data} ${ultimo.hora}`;
    } else {
        elements.lastRegistration.textContent = 'Nenhum registro';
    }
    
    updateRegistrosList(registros);
}

function updateRegistrosList(registros) {
    elements.registrosList.innerHTML = '';
    
    if (registros.length === 0) {
        elements.registrosList.innerHTML = '<div class="registro-item" style="justify-content: center; color: var(--light-gold);">Nenhum registro encontrado</div>';
        return;
    }
    
    const registrosRecentes = [...registros].reverse().slice(0, 10);
    
    registrosRecentes.forEach(registro => {
        const item = document.createElement('div');
        item.className = 'registro-item fade-in';
        item.innerHTML = `
            <div class="registro-number">#${registro.id}</div>
            <div class="registro-time">${registro.data} ${registro.hora}</div>
        `;
        elements.registrosList.appendChild(item);
    });
}

function exportPDF() {
    // PDF simplificado - sem biblioteca externa
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    const data = [
        'Relatório de Presenças - Fios que Contam Histórias & Festival AMODA 2025',
        `Data: ${new Date().toLocaleDateString('pt-BR')}`,
        `Total: ${registros.length} registros`,
        '',
        'Registros:',
        ...registros.map(r => `#${r.id} - ${r.data} ${r.hora}`)
    ].join('\n');
    
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presencas_amoda_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
}

function exportCSV() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    let csvContent = "ID,Data,Hora\n";
    registros.forEach(registro => {
        csvContent += `${registro.id},${registro.data},${registro.hora}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `presencas_amoda_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function showResetConfirmation() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    elements.confirmationText.textContent = `Todos os ${registros.length} registros serão excluídos.`;
    elements.confirmation.classList.remove('hidden');
}

function hideResetConfirmation() {
    elements.confirmation.classList.add('hidden');
}

function resetCounter() {
    localStorage.removeItem('registrosPresenca');
    updateAdminPanel();
    hideResetConfirmation();
    showNotification('Contador zerado com sucesso!');
}

function showNotification(mensagem) {
    // Notificação simples
    alert(mensagem);
}
