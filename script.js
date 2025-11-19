// Configurações
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "amoda2025";

// Mensagens de agradecimento
const MENSAGENS_AGRADECIMENTO = [
    "Obrigado por fazer parte do Fios que Contam Histórias & Festival AMODA 2025! ✨",
    "Sua presença torna estes eventos ainda mais especiais! 🌟",
    "Que honra tê-lo(a) conosco nesta experiência única! 💫",
    "Obrigado por tecer estas memórias conosco! 🧵🎪",
    "Sua energia positiva é contagiante! Obrigado! 🌈",
    "Que privilégio compartilhar estes momentos com você! 🎉",
    "Obrigado por ser parte do Fios + AMODA 2025! 🔥",
    "Sua presença ilumina nossos eventos! Obrigado! 💡",
    "Juntos criamos memórias inesquecíveis de moda! 📸",
    "Obrigado por fazer parte desta jornada única! 🎪✨"
];

// Elementos DOM
const toggleView = document.getElementById('toggleView');
const toggleText = document.getElementById('toggleText');
const registradorView = document.getElementById('registradorView');
const adminView = document.getElementById('adminView');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModal = document.getElementById('closeModal');
const loginError = document.getElementById('loginError');

// Elementos do Registrador
const btnRegistrar = document.getElementById('btnRegistrar');
const totalRegistros = document.getElementById('totalRegistros');
const feedback = document.getElementById('feedback');
const feedbackMessage = document.getElementById('feedbackMessage');
const registroInfo = document.getElementById('registroInfo');
const eventType = document.getElementById('eventType');

// Elementos do Admin
const adminCounter = document.getElementById('adminCounter');
const lastRegistration = document.getElementById('lastRegistration');
const registrosList = document.getElementById('registrosList');
const btnExportPDF = document.getElementById('btnExportPDF');
const btnExportCSV = document.getElementById('btnExportCSV');
const btnReset = document.getElementById('btnReset');
const confirmation = document.getElementById('confirmation');
const confirmationText = document.getElementById('confirmationText');
const btnConfirmReset = document.getElementById('btnConfirmReset');
const btnCancelReset = document.getElementById('btnCancelReset');

// Estado da aplicação
let isAdminMode = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Configurar eventos
    setupEventListeners();
    
    // Verificar login
    checkAuthentication();
    
    // Atualizar display inicial
    updateDisplay();
}

function setupEventListeners() {
    // Toggle entre views
    toggleView.addEventListener('click', handleToggleView);
    
    // Modal de login
    closeModal.addEventListener('click', closeLoginModal);
    loginForm.addEventListener('submit', handleLogin);
    
    // Registrador
    btnRegistrar.addEventListener('click', registrarPresenca);
    
    // Admin
    btnExportPDF.addEventListener('click', exportPDF);
    btnExportCSV.addEventListener('click', exportCSV);
    btnReset.addEventListener('click', showResetConfirmation);
    btnConfirmReset.addEventListener('click', resetCounter);
    btnCancelReset.addEventListener('click', hideResetConfirmation);
    
    // Fechar modal ao clicar fora
    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeLoginModal();
        }
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
        // Para acessar o admin, precisa fazer login
        showLoginModal();
    }
}

function switchToRegistrador() {
    isAdminMode = false;
    registradorView.classList.add('active');
    adminView.classList.remove('active');
    toggleText.textContent = 'Modo Admin';
    updateDisplay();
}

function switchToAdmin() {
    isAdminMode = true;
    registradorView.classList.remove('active');
    adminView.classList.add('active');
    toggleText.textContent = 'Modo Registro';
    updateAdminPanel();
}

function showLoginModal() {
    loginModal.classList.remove('hidden');
    loginError.classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function closeLoginModal() {
    loginModal.classList.add('hidden');
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
        loginError.classList.remove('hidden');
        // Animação de erro
        loginError.style.animation = 'none';
        setTimeout(() => {
            loginError.style.animation = 'shake 0.5s ease';
        }, 10);
    }
}

// Funções do Registrador
function registrarPresenca() {
    // Obter registros existentes
    let registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    // Criar novo registro para AMBOS os eventos
    const novoRegistro = {
        id: registros.length + 1,
        evento: 'ambos',
        timestamp: new Date().toISOString(),
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR'),
        mensagem: getRandomMensagem()
    };
    
    // Adicionar ao array
    registros.push(novoRegistro);
    
    // Salvar no localStorage
    localStorage.setItem('registrosPresenca', JSON.stringify(registros));
    
    // Atualizar display
    updateDisplay();
    
    // Mostrar feedback
    showFeedback(novoRegistro);
    
    // Animação do botão
    animateButton();
}

function getRandomMensagem() {
    return MENSAGENS_AGRADECIMENTO[Math.floor(Math.random() * MENSAGENS_AGRADECIMENTO.length)];
}

function updateDisplay() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    totalRegistros.textContent = registros.length;
}

function showFeedback(registro) {
    feedbackMessage.textContent = registro.mensagem;
    registroInfo.textContent = `Registro #${registro.id} - ${registro.data} às ${registro.hora}`;
    feedback.classList.remove('hidden');
    
    // Animação especial
    feedback.style.animation = 'none';
    setTimeout(() => {
        feedback.style.animation = 'fadeInUp 0.6s ease, pulse 2s ease 0.6s';
    }, 10);
    
    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 5000);
}

function animateButton() {
    btnRegistrar.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        btnRegistrar.style.transform = 'scale(1)';
    }, 150);
}

// Funções do Admin
function updateAdminPanel() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    // Atualizar contador
    adminCounter.textContent = registros.length;
    
    // Atualizar último registro
    if (registros.length > 0) {
        const ultimo = registros[registros.length - 1];
        lastRegistration.textContent = `${ultimo.data} ${ultimo.hora}`;
    } else {
        lastRegistration.textContent = 'Nenhum registro';
    }
    
    // Sempre mostrar "Ambos" já que é um único registro para os dois eventos
    eventType.textContent = 'Ambos';
    
    // Atualizar lista de registros
    updateRegistrosList(registros);
}

function updateRegistrosList(registros) {
    registrosList.innerHTML = '';
    
    if (registros.length === 0) {
        registrosList.innerHTML = '<div class="registro-item" style="justify-content: center; color: var(--light-gold);">Nenhum registro encontrado</div>';
        return;
    }
    
    // Mostrar últimos 15 registros (mais recentes primeiro)
    const registrosRecentes = [...registros].reverse().slice(0, 15);
    
    registrosRecentes.forEach(registro => {
        const item = document.createElement('div');
        item.className = 'registro-item';
        item.innerHTML = `
            <div class="registro-number">#${registro.id}</div>
            <div class="registro-time">${registro.data} ${registro.hora}</div>
        `;
        registrosList.appendChild(item);
    });
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    // Configurações iniciais
    doc.setFont('helvetica');
    
    // Cabeçalho
    doc.setFillColor(0, 0, 0);
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(20);
    doc.text('RELATÓRIO DE PRESENÇAS', 105, 25, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Fios que Contam Histórias & Festival AMODA 2025', 105, 35, { align: 'center' });
    
    // Linha decorativa
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 42, 190, 42);
    
    // Informações do relatório
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${new Date().toLocaleDateString('pt-BR')}`, 20, 55);
    doc.text(`Hora do relatório: ${new Date().toLocaleTimeString('pt-BR')}`, 20, 62);
    doc.text(`Total de registros: ${registros.length}`, 20, 69);
    
    // Estatísticas
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55);
    doc.text('EVENTOS:', 20, 85);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('• Fios que Contam Histórias & Festival AMODA 2025', 25, 95);
    doc.text('• Registro único para ambos os eventos', 25, 102);
    
    // Lista de registros
    let y = 120;
    doc.setFontSize(12);
    doc.setTextColor(212, 175, 55);
    doc.text('REGISTROS DETALHADOS:', 20, y);
    y += 10;
    
    // Cabeçalho da tabela
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('ID', 20, y);
    doc.text('Data', 40, y);
    doc.text('Hora', 80, y);
    doc.text('Eventos', 120, y);
    y += 5;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 8;
    
    // Dados
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    
    registros.forEach(registro => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.text(registro.id.toString(), 20, y);
        doc.text(registro.data, 40, y);
        doc.text(registro.hora, 80, y);
        doc.text('Fios + AMODA 2025', 120, y);
        y += 6;
    });
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Página ${i} de ${pageCount} - Fios que Contam Histórias & Festival AMODA 2025`, 105, 285, { align: 'center' });
    }
    
    // Salvar PDF
    doc.save(`relatorio_presencas_amoda_${new Date().toISOString().split('T')[0]}.pdf`);
}

function exportCSV() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    // Cabeçalho CSV
    let csvContent = "ID,Eventos,Data,Hora,Timestamp,Mensagem\n";
    
    // Dados
    registros.forEach(registro => {
        const linha = [
            registro.id,
            'Fios que Contam Histórias & Festival AMODA 2025',
            registro.data,
            registro.hora,
            registro.timestamp,
            `"${registro.mensagem.replace(/"/g, '""')}"`
        ].join(',');
        csvContent += linha + '\n';
    });
    
    // Criar e baixar arquivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `presencas_amoda_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showResetConfirmation() {
    const registros = JSON.parse(localStorage.getItem('registrosPresenca') || '[]');
    
    confirmationText.textContent = `Todos os ${registros.length} registros serão permanentemente excluídos.`;
    confirmation.classList.remove('hidden');
}

function hideResetConfirmation() {
    confirmation.classList.add('hidden');
}

function resetCounter() {
    // Limpar todos os dados
    localStorage.removeItem('registrosPresenca');
    
    // Atualizar painel
    updateAdminPanel();
    
    // Ocultar confirmação
    hideResetConfirmation();
    
    // Feedback
    showNotification('Contador zerado com sucesso!', 'success');
}

function showNotification(mensagem, tipo) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${tipo === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-text">${mensagem}</span>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}