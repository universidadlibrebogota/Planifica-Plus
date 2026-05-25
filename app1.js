// ================= ESTADO GLOBAL DE LA APLICACIÓN =================
let currentUser = null;
let currentAuthView = 'login'; // 'login', 'register', 'forgot'
let currentMainTab = 'lista';   // 'lista', 'calendario', 'logros', 'herramientas', 'perfil'

// Filtros globales para las actividades
let currentStatusFilter = 'todas';
let currentCategoryFilter = 'todas';
let searchQuery = '';

// Datos en Memoria (Simulación de Base de Datos)
let usersDB = [
    { name: 'Usuario Demo', email: 'demo@email.com', pass: '123456' }
];

let activitiesDB = [
    { id: 1, title: 'Rutina de Ejercicios', desc: '30 minutos de cardio y estiramiento diario.', date: '2026-05-24', category: 'salud', priority: 'media', completed: false },
    { id: 2, title: 'Revisión de Reporte Académico', desc: 'Ajustar las conclusiones del entregable final.', date: '2026-05-25', category: 'trabajo', priority: 'alta', completed: true },
    { id: 3, title: 'Cena Familiar', desc: 'Organizar reunión con los tíos y abuelos.', date: '2026-05-26', category: 'social', priority: 'baja', completed: false }
];

// Estado del Temporizador Pomodoro
let timerInterval = null;
let timerSeconds = 1500; // 25 minutos por defecto
let isTimerRunning = false;

// Estado del Calendario
let calendarDate = new Date();

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
    // Renderizado inicial (Vista de autenticación por defecto)
    renderAppRouter();
});

// ROUTER PRINCIPAL: Decide si muestra Auth o la App Principal
function renderAppRouter() {
    const viewport = document.getElementById("main-app-viewport");
    
    if (!currentUser) {
        viewport.innerHTML = renderAuthLayout();
        bindAuthEvents();
    } else {
        viewport.innerHTML = renderMainLayout();
        renderActiveSection();
    }
}

// ================= RENDERIZADORES DE PLANTILLAS INTERNAS =================

// 1. Plantilla de Autenticación Cohesiva
function renderAuthLayout() {
    return `
        <div class="auth-wrapper">
            <div class="auth-header">
                <div class="logo-icon">🍃</div>
                <h1>Planifica Plus</h1>
                <p>Organiza tu vida saludablemente</p>
            </div>

            <div class="auth-tabs">
                <button id="tab-login" class="tab-btn ${currentAuthView === 'login' ? 'active' : ''}" onclick="switchAuthTab('login')">Iniciar Sesión</button>
                <button id="tab-register" class="tab-btn ${currentAuthView === 'register' ? 'active' : ''}" onclick="switchAuthTab('register')">Registrarse</button>
            </div>

            <div class="auth-form-container">
                ${renderAuthForm()}
            </div>
        </div>
    `;
}

function renderAuthForm() {
    if (currentAuthView === 'login') {
        return `
            <form id="form-login">
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" id="login-email" placeholder="tu@email.com" required value="demo@email.com">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="login-pass" placeholder="••••••••" required value="123456">
                </div>
                <div class="forgot-link">
                    <a href="#" onclick="switchAuthTab('forgot')">¿Olvidaste tu contraseña?</a>
                </div>
                <button type="submit" class="btn btn-primary">Iniciar Sesión &nbsp; →</button>
            </form>
            <div class="demo-credentials">
                💡 <strong>Credenciales de prueba:</strong><br>
                demo@email.com / 123456
            </div>
        `;
    } else if (currentAuthView === 'register') {
        return `
            <form id="form-register">
                <div class="form-group">
                    <label>Nombre completo</label>
                    <input type="text" id="reg-name" placeholder="Tu nombre" required>
                </div>
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" id="reg-email" placeholder="tu@email.com" required>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="reg-pass" placeholder="••••••••" required>
                </div>
                <div class="form-group">
                    <label>Confirmar contraseña</label>
                    <input type="password" id="reg-pass-conf" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-primary">Crear Cuenta</button>
            </form>
            <p class="terms-text">Al registrarte aceptas nuestros Términos de Servicio.</p>
        `;
    } else {
        return `
            <div class="forgot-box">
                <h3 style="margin-bottom:8px;">Recuperar Contraseña</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:15px;">Ingresa tu correo para recibir las instrucciones de restablecimiento.</p>
                <form id="form-forgot">
                    <div class="form-group">
                        <label>Correo electrónico</label>
                        <input type="email" id="forgot-email" placeholder="tu@email.com" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar Instrucciones</button>
                </form>
                <div class="back-to-login" style="text-align:center; margin-top:15px;">
                    <a href="#" onclick="switchAuthTab('login')">← Volver al login</a>
                </div>
            </div>
        `;
    }
}

// 2. Plantilla General del Dashboard (Header + Contenido Vacío + Navbar)
function renderMainLayout() {
    return `
        <div class="view-wrapper">
            <header class="app-header">
                <div class="header-left">
                    <div class="app-logo">🍃</div>
                    <div>
                        <h2 id="app-header-title">Planifica Plus</h2>
                        <span class="header-date">Hoy, ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn logout-btn" onclick="handleLogout()" title="Cerrar Sesión">🚪</button>
                </div>
            </header>

            <main class="scrollable-content" id="app-dynamic-content"></main>

            <nav class="app-navbar">
                <button class="nav-item ${currentMainTab === 'lista' ? 'active' : ''}" onclick="switchMainTab('lista')">
                    <span class="nav-icon">📋</span><span class="nav-label">Lista</span>
                </button>
                <button class="nav-item ${currentMainTab === 'calendario' ? 'active' : ''}" onclick="switchMainTab('calendario')">
                    <span class="nav-icon">📅</span><span class="nav-label">Calendario</span>
                </button>
                <button class="nav-item ${currentMainTab === 'logros' ? 'active' : ''}" onclick="switchMainTab('logros')">
                    <span class="nav-icon">🏆</span><span class="nav-label">Logros</span>
                </button>
                <button class="nav-item ${currentMainTab === 'herramientas' ? 'active' : ''}" onclick="switchMainTab('herramientas')">
                    <span class="nav-icon">🔧</span><span class="nav-label">Herramientas</span>
                </button>
                <button class="nav-item ${currentMainTab === 'perfil' ? 'active' : ''}" onclick="switchMainTab('perfil')">
                    <span class="nav-icon">👤</span><span class="nav-label">Perfil</span>
                </button>
            </nav>
        </div>

        <div id="modal-container" class="modal-overlay hidden"></div>
    `;
}

// ================= GESTOR DE VISTAS (LOGICA DE SECCIONES) =================

function renderActiveSection() {
    const container = document.getElementById("app-dynamic-content");
    if (!container) return;

    if (currentMainTab === 'lista') {
        container.innerHTML = renderListaSection();
        renderActivitiesList();
    } else if (currentMainTab === 'calendario') {
        container.innerHTML = renderCalendarioSection();
        buildCalendar();
    } else if (currentMainTab === 'logros') {
        container.innerHTML = renderLogrosSection();
    } else if (currentMainTab === 'herramientas') {
        container.innerHTML = renderHerramientasSection();
        updateTimerDisplay();
    } else if (currentMainTab === 'perfil') {
        container.innerHTML = renderPerfilSection();
    }
}

// --- VISTA 1: LISTADO ---
function renderListaSection() {
    const total = activitiesDB.length;
    const pending = activitiesDB.filter(a => !a.completed).length;

    return `
        <div class="metrics-grid">
            <div class="metric-card card-total"><h3>Total</h3><span>${total}</span></div>
            <div class="metric-card card-upcoming"><h3>Pendientes</h3><span>${pending}</span></div>
        </div>

        <div class="search-bar-container">
            <input type="text" id="search-input" placeholder="🔍 Buscar actividades..." value="${searchQuery}" oninput="handleSearch(this.value)">
            <button class="btn btn-primary btn-add" onclick="openActivityModal()">＋ Nueva</button>
        </div>

        <div class="filter-tabs">
            <button class="filter-btn ${currentStatusFilter === 'todas' ? 'active' : ''}" onclick="setStatusFilter('todas')">Todas</button>
            <button class="filter-btn ${currentStatusFilter === 'pendientes' ? 'active' : ''}" onclick="setStatusFilter('pendientes')">Pendientes</button>
            <button class="filter-btn ${currentStatusFilter === 'completadas' ? 'active' : ''}" onclick="setStatusFilter('completadas')">Completadas</button>
        </div>

        <div class="category-tabs">
            <button class="cat-btn ${currentCategoryFilter === 'todas' ? 'active' : ''}" onclick="setCategoryFilter('todas')">Todas</button>
            <button class="cat-btn ${currentCategoryFilter === 'trabajo' ? 'active' : ''}" onclick="setCategoryFilter('trabajo')">Trabajo</button>
            <button class="cat-btn ${currentCategoryFilter === 'personal' ? 'active' : ''}" onclick="setCategoryFilter('personal')">Personal</button>
            <button class="cat-btn ${currentCategoryFilter === 'salud' ? 'active' : ''}" onclick="setCategoryFilter('salud')">Salud</button>
            <button class="cat-btn ${currentCategoryFilter === 'social' ? 'active' : ''}" onclick="setCategoryFilter('social')">Social</button>
        </div>

        <div class="activities-list" id="inner-activities-box"></div>
    `;
}

function renderActivitiesList() {
    const target = document.getElementById("inner-activities-box");
    if (!target) return;

    let filtered = activitiesDB.filter(act => {
        const matchesStatus = currentStatusFilter === 'todas' || 
            (currentStatusFilter === 'pendientes' && !act.completed) || 
            (currentStatusFilter === 'completadas' && act.completed);
        const matchesCategory = currentCategoryFilter === 'todas' || act.category === currentCategoryFilter;
        const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || act.desc.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        target.innerHTML = `<div class="no-activities"><p style="text-align:center; color:var(--text-muted); margin-top:20px;">No se encontraron actividades.</p></div>`;
        return;
    }

    target.innerHTML = filtered.map(act => `
        <div class="activity-card ${act.completed ? 'completed' : ''}">
            <div class="card-top">
                <div class="check-circle" onclick="toggleActivityComplete(${act.id})"></div>
                <div class="card-main-info">
                    <h4 class="act-text-title">${act.title}</h4>
                    <p class="act-text-desc">${act.desc}</p>
                    <div class="badges-row">
                        <span class="badge-priority ${act.priority}">${act.priority.toUpperCase()}</span>
                        <span class="badge-cat ${act.category}">${act.category.toUpperCase()}</span>
                    </div>
                </div>
            </div>
            <div class="meta-info-row">
                <span>📅 ${act.date}</span>
                <span style="color:#ef4444; cursor:pointer; margin-left:auto;" onclick="deleteActivity(${act.id})">Eliminar</span>
            </div>
        </div>
    `).join('');
}

// --- VISTA 2: CALENDARIO ---
function renderCalendarioSection() {
    return `
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <button onclick="shiftMonth(-1)">◀</button>
                <h3 id="cal-month-title">Mayo 2026</h3>
                <button onclick="shiftMonth(1)">▶</button>
            </div>
            <div class="calendar-weekdays">
                <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
            </div>
            <div class="calendar-days" id="cal-days-grid"></div>
        </div>
        <div class="calendar-day-details" style="margin-top:15px; padding:12px; background:white; border-radius:12px;">
            <p style="font-size:0.85rem; color:var(--text-muted); text-align:center;">Selecciona un día para ver tus pendientes mapeados.</p>
        </div>
    `;
}

// --- VISTA 3: LOGROS ---
function renderLogrosSection() {
    const completedCount = activitiesDB.filter(a => a.completed).length;
    return `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="metric-card card-total" style="text-align:center;">
                <h3>Actividades Concluidas</h3>
                <span style="font-size:2rem; font-weight:bold;">${completedCount}</span>
            </div>
            
            <div class="logro-item unlocked">
                <div class="logro-icon-box">⭐</div>
                <div class="logro-info">
                    <h4>Primeros Pasos</h4>
                    <p>Has iniciado tu control de hábitos con éxito.</p>
                </div>
            </div>
            <div class="logro-item ${completedCount >= 5 ? 'unlocked' : ''}">
                <div class="logro-icon-box">🎯</div>
                <div class="logro-info">
                    <h4>Constancia Saludable</h4>
                    <p>Completa al menos 5 actividades (Progreso: ${completedCount}/5)</p>
                </div>
            </div>
        </div>
    `;
}

// --- VISTA 4: HERRAMIENTAS ---
function renderHerramientasSection() {
    return `
        <div class="tools-container" style="text-align:center;">
            <h3 style="margin-bottom:15px;">Temporizador Pomodoro</h3>
            <div class="timer-display" id="timer-box" style="font-size:3.5rem; font-weight:bold; font-family:monospace; margin-bottom:15px;">25:00</div>
            <div class="timer-presets" style="margin-bottom:20px; display:flex; justify-content:center; gap:8px;">
                <button class="filter-btn" onclick="setTimerPreset(300)">5 min</button>
                <button class="filter-btn active" onclick="setTimerPreset(1500)">25 min</button>
            </div>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-primary" id="btn-timer-trigger" onclick="toggleTimer()">Iniciar</button>
                <button class="btn" style="background:#cbd5e1;" onclick="resetTimer()">Reiniciar</button>
            </div>
        </div>
    `;
}

// --- VISTA 5: PERFIL ---
function renderPerfilSection() {
    return `
        <div class="profile-card" style="text-align:center; padding:20px; background:white; border-radius:12px;">
            <div class="profile-avatar" style="font-size:4rem; margin-bottom:10px;">👤</div>
            <h2 style="font-size:1.3rem;">${currentUser.name}</h2>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:15px;">${currentUser.email}</p>
            <div style="border-top:1px solid var(--border-color); padding-top:15px;">
                <p style="font-size:0.75rem; color:var(--text-muted);">Planifica Plus — Versión Estable Móvil Premium 2026</p>
            </div>
        </div>
    `;
}

// ================= MANEJADORES DE ENLACES (LISTENERS & EVENTS) =================

function switchAuthTab(targetView) {
    currentAuthView = targetView;
    renderAppRouter();
}

function bindAuthEvents() {
    const loginForm = document.getElementById("form-login");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value;
            const pass = document.getElementById("login-pass").value;
            
            const user = usersDB.find(u => u.email === email && u.pass === pass);
            if (user) {
                currentUser = user;
                showToast("¡Sesión iniciada con éxito!", "success");
                renderAppRouter();
            } else {
                showToast("Credenciales incorrectas.", "error");
            }
        });
    }

    const regForm = document.getElementById("form-register");
    if (regForm) {
        regForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("reg-name").value;
            const email = document.getElementById("reg-email").value;
            const pass = document.getElementById("reg-pass").value;
            const conf = document.getElementById("reg-pass-conf").value;

            if (pass !== conf) {
                showToast("Las contraseñas no coinciden.", "error");
                return;
            }

            usersDB.push({ name, email, pass });
            showToast("Cuenta creada. Ya puedes iniciar sesión.", "success");
            currentAuthView = 'login';
            renderAppRouter();
        });
    }

    const forgotForm = document.getElementById("form-forgot");
    if (forgotForm) {
        forgotForm.addEventListener("submit", (e) => {
            e.preventDefault();
            showToast("Instrucciones enviadas al correo electrónico.", "success");
            currentAuthView = 'login';
            renderAppRouter();
        });
    }
}

function switchMainTab(targetTab) {
    currentMainTab = targetTab;
    renderAppRouter();
}

function handleLogout() {
    currentUser = null;
    currentMainTab = 'lista';
    showToast("Sesión finalizada.", "success");
    renderAppRouter();
}

// ================= ACCIONES DE LOGICA DE NEGOCIO =================

function handleSearch(val) {
    searchQuery = val;
    renderActivitiesList();
}

function setStatusFilter(filter) {
    currentStatusFilter = filter;
    renderActiveSection();
}

function setCategoryFilter(filter) {
    currentCategoryFilter = filter;
    renderActiveSection();
}

function toggleActivityComplete(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (act) {
        act.completed = !act.completed;
        showToast(act.completed ? "Actividad completada 🎉" : "Actividad reactivada", "success");
        renderActiveSection();
    }
}

function deleteActivity(id) {
    activitiesDB = activitiesDB.filter(a => a.id !== id);
    showToast("Actividad eliminada con éxito.", "success");
    renderActiveSection();
}

// Ventana Modal Dinámica para Añadir Actividades
function openActivityModal() {
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>Nueva Actividad</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <form id="modal-add-form">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" id="m-title" required placeholder="Ej. Ejercicio matutino">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="m-desc" rows="2" placeholder="Detalles específicos..."></textarea>
                </div>
                <div class="form-group">
                    <label>Fecha de Ejecución</label>
                    <input type="date" id="m-date" required value="2026-05-24">
                </div>
                <div class="form-row" style="display:flex; gap:10px;">
                    <div class="form-group" style="flex:1;">
                        <label>Categoría</label>
                        <select id="m-cat">
                            <option value="salud">Salud</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="personal">Personal</option>
                            <option value="social">Social</option>
                        </select>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Prioridad</label>
                        <select id="m-prio">
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Guardar Actividad</button>
            </form>
        </div>
    `;
    modal.classList.remove("hidden");

    document.getElementById("modal-add-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("m-title").value;
        const desc = document.getElementById("m-desc").value;
        const date = document.getElementById("m-date").value;
        const category = document.getElementById("m-cat").value;
        const priority = document.getElementById("m-prio").value;

        activitiesDB.push({
            id: Date.now(),
            title, desc, date, category, priority, completed: false
        });

        closeModal();
        showToast("Actividad creada exitosamente.", "success");
        renderActiveSection();
    });
}

function closeModal() {
    document.getElementById("modal-container").classList.add("hidden");
}

// ================= COMPONENTES ADICIONALES (RELOJ Y CALENDARIO) =================

function setTimerPreset(seconds) {
    timerSeconds = seconds;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const box = document.getElementById("timer-box");
    if (!box) return;
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    box.innerText = `${mins}:${secs}`;
}

function toggleTimer() {
    const triggerBtn = document.getElementById("btn-timer-trigger");
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        if(triggerBtn) triggerBtn.innerText = "Iniciar";
    } else {
        isTimerRunning = true;
        if(triggerBtn) triggerBtn.innerText = "Pausar";
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                showToast("¡Tiempo cumplido! Toma un descanso.", "success");
                if(triggerBtn) triggerBtn.innerText = "Iniciar";
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerSeconds = 1500;
    updateTimerDisplay();
    const triggerBtn = document.getElementById("btn-timer-trigger");
    if(triggerBtn) triggerBtn.innerText = "Iniciar";
}

function buildCalendar() {
    const title = document.getElementById("cal-month-title");
    const grid = document.getElementById("cal-days-grid");
    if (!title || !grid) return;

    title.innerText = calendarDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
    grid.innerHTML = "";

    // Renderizado simple de 30 días para maquetación estricta
    for (let i = 1; i <= 30; i++) {
        const isToday = i === 24; 
        grid.innerHTML += `<div class="day ${isToday ? 'today' : ''}" style="padding:8px; text-align:center; border-radius:6px; cursor:pointer; background:${isToday ? 'var(--primary-color)' : '#f8fafc'}; color:${isToday ? 'white' : 'black'}; font-weight:${isToday ? 'bold' : 'normal'}">${i}</div>`;
    }
}

function shiftMonth(dir) {
    calendarDate.setMonth(calendarDate.getMonth() + dir);
    buildCalendar();
}

// Alertas Flotantes (Toasts)
function showToast(msg, type = 'success') {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = msg;

    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}