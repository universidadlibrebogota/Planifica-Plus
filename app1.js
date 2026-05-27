// ================= BASE DE DATOS DE LOGROS DINÁMICOS =================
let achievementsDB = [
    { id: 1, title: "Primera Actividad", description: "Completa tu primera actividad", max: 1, iconOn: "img/logro1-on.png", iconOff: "img/logro1-off.png" },
    { id: 2, title: "Primeros Pasos", description: "Completa 5 actividades", max: 5, iconOn: "img/logro2-on.png", iconOff: "img/logro2-off.png" },
    { id: 3, title: "Productivo", description: "Completa 10 actividades", max: 10, iconOn: "img/logro3-on.png", iconOff: "img/logro3-off.png" },
    { id: 4, title: "Constante", description: "Completa 30 actividades", max: 30, iconOn: "img/logro4-on.png", iconOff: "img/logro4-off.png" },
    { id: 5, title: "Maestro de Tareas", description: "Completa 50 actividades", max: 50, iconOn: "img/logro5-on.png", iconOff: "img/logro5-off.png" },
    { id: 6, title: "Leyenda", description: "Completa 100 Actividades", max: 100, iconOn: "img/logro6-on.png", iconOff: "img/logro6-off.png" },
    { id: 7, title: "Racha de Fuego", description: "Mantén una racha de 7 días", max: 7, iconOn: "img/logro7-on.png", iconOff: "img/logro7-off.png" },
    { id: 8, title: "Prioridades Claras", description: "Completa 5 actividades de alta prioridad", max: 5, iconOn: "img/logro8-on.png", iconOff: "img/logro8-off.png" },
    { id: 9, title: "Equilibrio Total", description: "Usa todas las categorías disponibles", max: 4, iconOn: "img/logro9-on.png", iconOff: "img/logro9-off.png" },
    { id: 10, title: "Planificador Élite", description: "Completa 15 actividades de alta prioridad", max: 15, iconOn: "img/logro10-on.png", iconOff: "img/logro10-off.png" }
];

// ================= ESTADO GLOBAL DE LA APLICACIÓN =================
let currentUser = null;
let currentAuthView = 'login'; // 'login', 'register', 'forgot'
let currentMainTab = 'lista';   // 'lista', 'calendario', 'logros', 'herramientas', 'perfil'

// Filtros globales para las actividades
let currentStatusFilter = 'todas';
let currentCategoryFilter = 'todas';
let searchQuery = '';

// Modo oscuro
let darkMode = false;

// Stack para Deshacer (última acción)
let undoStack = []; // cada item: { type: 'delete'|'add'|'edit', data: {...} }

// Menú desplegable de herramientas
let toolsMenuOpen = false;

// Sección activa del perfil
let profileSection = 'info'; // 'info' | 'ajustes' | 'estadisticas'

// Datos en Memoria (Simulación de Base de Datos)
let usersDB = [
    { name: 'Usuario Demo', email: 'demo@email.com',      pass: '123456', avatar: '🧑', phone: '3001234567', bio: 'Amante de la productividad', avatarImg: null },
    { name: 'Santiago',     email: 'santiago@gmail.com',  pass: '123456', avatar: '👨‍💻', phone: '3109876543', bio: '', avatarImg: null },
    { name: 'Kiven',        email: 'kiven@gmail.com',      pass: '123456', avatar: '🧑‍🎤', phone: '3205551234', bio: '', avatarImg: null }
];

let activitiesDB = [
    { id: 1, title: 'Rutina de Ejercicios',         desc: '30 minutos de cardio y estiramiento diario.',     date: '2026-05-24', time: '07:00', category: 'salud',    priority: 'media', completed: false, owner: 'demo@email.com' },
    { id: 2, title: 'Revisión de Reporte Académico',desc: 'Ajustar las conclusiones del entregable final.',  date: '2026-05-25', time: '10:00', category: 'trabajo',  priority: 'alta',  completed: true,  owner: 'demo@email.com' },
    { id: 3, title: 'Cena Familiar',                desc: 'Organizar reunión con los tíos y abuelos.',       date: '2026-05-26', time: '19:00', category: 'social',   priority: 'baja',  completed: false, owner: 'demo@email.com' },
    { id: 4, title: 'Sesión de Estudio',            desc: 'Repasar temas de algoritmos.',                    date: '2026-05-27', time: '08:00', category: 'trabajo',  priority: 'alta',  completed: false, owner: 'santiago@gmail.com' },
    { id: 5, title: 'Entrenamiento en Gimnasio',    desc: 'Rutina de fuerza 45 minutos.',                    date: '2026-05-27', time: '08:00', category: 'salud',    priority: 'media', completed: false, owner: 'kiven@gmail.com' },
    { id: 6, title: 'Proyecto Grupal',              desc: 'Avanzar el módulo de frontend del proyecto.',     date: '2026-05-27', time: '15:00', category: 'trabajo',  priority: 'alta',  completed: false, owner: 'kiven@gmail.com' },
];

// ================= SISTEMA DE AMIGOS =================
// friendsDB: { from, to, status: 'pending'|'accepted' }
let friendsDB = [
    { from: 'demo@email.com', to: 'kiven@gmail.com',     status: 'accepted' },
    { from: 'demo@email.com', to: 'santiago@gmail.com',  status: 'pending'  },
];

// sharedActivitiesDB: actividades vinculadas entre usuarios { id, title, date, time, participants:[email,...], completedBy:[email,...] }
let sharedActivitiesDB = [
    {
        id: 'sa1',
        title: 'Entrenamiento Sincronizado',
        desc: 'Ambos hacemos ejercicio a la misma hora para motivarnos.',
        date: '2026-05-27',
        time: '08:00',
        category: 'salud',
        priority: 'alta',
        participants: ['demo@email.com', 'kiven@gmail.com'],
        completedBy: []
    }
];

// Estado del Temporizador Pomodoro
let timerInterval = null;
let timerSeconds = 1500; // 25 minutos por defecto
let isTimerRunning = false;

// Estado del Cronómetro
let swInterval = null;
let swElapsed = 0;       // milisegundos acumulados
let swRunning = false;
let swLaps = [];

// Estado de Herramientas (tab activo)
let currentToolTab = 'pomodoro'; // 'pomodoro' | 'stopwatch' | 'notes'

// Estado de Notas
let notesDB = [
    { id: 1, title: 'Idea de proyecto', body: 'Crear una app para seguimiento de hábitos con IA.', date: '2026-05-24' },
    { id: 2, title: 'Compras pendientes', body: 'Leche, avena, frutas, proteína en polvo.', date: '2026-05-25' }
];

// Estado del Calendario
let calendarDate = new Date();

// ================= ESTADO DE ACCESIBILIDAD =================
let a11y = {
    voiceControl: false,       // Control por voz activo
    ttsActive: false,          // Lectura en voz alta activa
    fontSize: 'normal',        // 'small' | 'normal' | 'large' | 'xlarge'
    recognition: null,         // instancia SpeechRecognition
    synthesis: window.speechSynthesis || null
};

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
    // Cargar modo oscuro guardado
    const savedDark = localStorage.getItem('darkMode');
    if (savedDark === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
    }
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
                <div class="logo-icon">
                    <img src="img/logo.png" alt="Logo Planifica Plus">
                </div>
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

                    <div class="input-icon-box">
                        <img src="img/mail.png" class="input-icon" alt="Correo">

                        <input 
                            type="email" 
                            id="login-email" 
                            placeholder="tu@email.com"
                            required
                            value="demo@email.com"

                        >
                    </div>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>

                    <div class="input-icon-box">

                        <img src="img/lock.png" class="input-icon">

                        <input 
                            type="password"
                            id="login-pass"
                            placeholder="••••••••"
                            required
                            value="123456"
                        >

                    </div>
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
                    <div class="input-icon-box">
                        <img src="img/mail.png" class="input-icon" alt="Correo">
                        <input type="email" id="reg-email" placeholder="tu@email.com" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Número de teléfono</label>
                    <div class="input-icon-box">
                        <span class="input-icon" style="font-size:16px;opacity:0.65;">📱</span>
                        <input type="tel" id="reg-phone" placeholder="Ej. 3001234567" required style="padding-left:42px;">
                    </div>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <div class="input-icon-box">
                        <img src="img/lock.png" class="input-icon" alt="Contraseña">
                        <input type="password" id="reg-pass" placeholder="Mínimo 6 caracteres" required minlength="6">
                    </div>
                </div>
                <div class="form-group">
                    <label>Confirmar contraseña</label>
                    <div class="input-icon-box">
                        <img src="img/lock.png" class="input-icon" alt="Confirmar contraseña">
                        <input type="password" id="reg-pass-confirm" placeholder="Repite tu contraseña" required minlength="6">
                    </div>
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
                    <div class="app-logo">

                        <img 
                            src="${
                                currentMainTab === 'lista'
                                ? 'img/header-lista.png'

                                : currentMainTab === 'amigos'
                                ? 'img/header-friends.png'

                                : currentMainTab === 'calendario'
                                ? 'img/header-calendar.png'

                                : currentMainTab === 'logros'
                                ? 'img/header-logros.png'

                                : currentMainTab === 'herramientas'
                                ? 'img/header-tools.png'

                                : 'img/header-profile.png'
                            }"

                            alt="Header Icon"
                        >

                    </div>
                    <div>
                        <h2 id="app-header-title">

                            ${
                                currentMainTab === 'lista'
                                ? 'Lista'

                                : currentMainTab === 'amigos'
                                ? 'Amigos'

                                : currentMainTab === 'calendario'
                                ? 'Calendario'

                                : currentMainTab === 'logros'
                                ? 'Logros'

                                : currentMainTab === 'herramientas'
                                ? 'Herramientas'

                                : 'Perfil'
                            }

                        </h2>
                        <span class="header-date">

                            ${
                                currentMainTab === 'lista'
                                ? 'Tus actividades organizadas'

                                : currentMainTab === 'amigos'
                                ? 'Colabora con tus amigos'

                                : currentMainTab === 'calendario'
                                ? 'Visualiza tus eventos'

                                : currentMainTab === 'logros'
                                ? 'Tu progreso personal'

                                : currentMainTab === 'herramientas'
                                ? 'Mejora tu productividad'

                                : 'Información de usuario'
                            }

                        </span>
                    </div>
                </div>
                <div class="header-actions">
                    <button class="icon-btn" onclick="toggleDarkMode()" title="${darkMode ? 'Modo claro' : 'Modo oscuro'}">${darkMode ? '☀️' : '🌙'}</button>
                    <button class="icon-btn" onclick="undoLastAction()" title="Deshacer última acción">↩️</button>
                    <button class="icon-btn logout-btn" onclick="handleLogout()" title="Cerrar Sesión">🚪</button>
                </div>
            </header>

            <main class="scrollable-content" id="app-dynamic-content"></main>

            <nav class="app-navbar">

                <button class="nav-item ${currentMainTab === 'lista' ? 'active' : ''}" onclick="switchMainTab('lista')">

                    <img 
                        src="${currentMainTab === 'lista' ? 'img/lista-active.png' : 'img/lista.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">Lista</span>

                </button>

                <button class="nav-item ${currentMainTab === 'amigos' ? 'active' : ''}" onclick="switchMainTab('amigos')">

                    <img 
                        src="${currentMainTab === 'amigos' ? 'img/friends-active.png' : 'img/friends.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">amigos</span>

                </button>

                <button class="nav-item ${currentMainTab === 'calendario' ? 'active' : ''}" onclick="switchMainTab('calendario')">

                    <img 
                        src="${currentMainTab === 'calendario' ? 'img/calendar-active.png' : 'img/calendar.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">Calendario</span>

                </button>

                <button class="nav-item ${currentMainTab === 'logros' ? 'active' : ''}" onclick="switchMainTab('logros')">

                    <img 
                        src="${currentMainTab === 'logros' ? 'img/logros-active.png' : 'img/logros.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">Logros</span>

                </button>

                <button class="nav-item ${currentMainTab === 'herramientas' ? 'active' : ''}" onclick="switchMainTab('herramientas')">

                    <img 
                        src="${currentMainTab === 'herramientas' ? 'img/tools-active.png' : 'img/tools.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">Herramientas</span>

                </button>

                <button class="nav-item ${currentMainTab === 'perfil' ? 'active' : ''}" onclick="switchMainTab('perfil')">

                    <img 
                        src="${currentMainTab === 'perfil' ? 'img/profile-active.png' : 'img/profile.png'}"
                        class="nav-img"
                    >

                    <span class="nav-label">Perfil</span>

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
        if (currentToolTab === 'pomodoro')  updateTimerDisplay();
        if (currentToolTab === 'stopwatch') updateStopwatchDisplay();
    } else if (currentMainTab === 'amigos') {
        container.innerHTML = renderAmigosSection();
    } else if (currentMainTab === 'perfil') {
        container.innerHTML = renderPerfilSection();
    }

    // Si TTS por clic está activo, registrar listeners
    if (a11y.ttsActive) bindClickToSpeak(container);
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

    target.innerHTML = filtered.map(act => {
        const endTime = act.time && act.duration
            ? minutesToTime(timeToMinutes(act.time) + parseInt(act.duration, 10))
            : null;
        return `
        <div class="activity-card ${act.completed ? 'completed' : ''}">
            <div class="card-top">
                <div class="check-circle" onclick="toggleActivityComplete(${act.id})">
                    ${act.completed ? '✓' : ''}
                </div>
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
                ${act.time ? `<span>⏰ ${act.time}${endTime ? ` – ${endTime}` : ''}</span>` : ''}
                ${act.duration ? `<span>⏱ ${act.duration} min</span>` : ''}
            </div>
            <div class="card-actions-row">
                <button class="card-action-btn edit" onclick="openEditActivityModal(${act.id})" title="Editar">✏️</button>
                <button class="card-action-btn duplicate" onclick="openDuplicateActivityModal(${act.id})" title="Duplicar con nueva fecha">📋</button>
                <button class="card-action-btn share" onclick="openShareActivityModal(${act.id})" title="Compartir con amigo">📤</button>
                <button class="card-action-btn delete" onclick="deleteActivity(${act.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
        `;
    }).join('');
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
        <div class="calendar-action-btns">
            <button class="cal-action-btn" onclick="downloadCalendar()" title="Descargar calendario">
                <span>⬇️</span><span>Descargar</span>
            </button>
            <button class="cal-action-btn" onclick="undoLastAction()" title="Deshacer última acción">
                <span>↩️</span><span>Deshacer</span>
            </button>
            <button class="cal-action-btn" onclick="openFAQModal()" title="Preguntas frecuentes">
                <span>❓</span><span>FAQ</span>
            </button>
        </div>
        <div class="calendar-day-details" id="cal-day-details" style="margin-top:15px; padding:12px; background:white; border-radius:12px;">
            <p style="font-size:0.85rem; color:var(--text-muted); text-align:center;">Selecciona un día para ver tus pendientes mapeados.</p>
        </div>
    `;
}

// --- VISTA 3: LOGROS ---
function renderLogrosSection() {
    // Obtener las actividades completadas por el usuario actual
    const misActividadesCompletas = activitiesDB.filter(a => a.completed && a.owner === (currentUser ? currentUser.email : 'demo@email.com'));
    
    const totalCompletadas = misActividadesCompletas.length;
    const completadasAltaPrioridad = misActividadesCompletas.filter(a => a.priority === 'alta').length;
    
    // Contar categorías únicas completadas (ej: salud, trabajo, personal, social)
    const categoriasUnicas = [...new Set(misActividadesCompletas.map(a => a.category))].length;

    // Calcular el progreso real para cada logro
    achievementsDB.forEach(logro => {
        let actual = 0;
        
        if (logro.id >= 1 && logro.id <= 6) {
            actual = totalCompletadas; // Logros por volumen de tareas completadas
        } else if (logro.id === 7) {
            actual = totalCompletadas >= 7 ? 7 : totalCompletadas; // Simulación de racha basado en actividades
        } else if (logro.id === 8 || logro.id === 10) {
            actual = completadasAltaPrioridad; // Logros de alta prioridad
        } else if (logro.id === 9) {
            actual = categoriasUnicas; // Logro de usar todas las categorías
        }

        // Guardar valores calculados en tiempo real
        logro.progress = logro.max > 0 ? Math.min(Math.round((actual / logro.max) * 100), 100) : 0;
        logro.completed = actual >= logro.max;
    });

    // Estadísticas del encabezado superior
    const totalLogros = achievementsDB.length;
    const completadosCount = achievementsDB.filter(l => l.completed).length;
    const progresoGeneral = totalLogros > 0 ? Math.round((completadosCount / totalLogros) * 100) : 0;

    let html = `
        <div class="logros-top-header" style="padding: 10px 4px; margin-bottom: 15px;">
            <h2 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 4px;">🏆 Mis Logros y Medallas</h2>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Supera tus metas para desbloquear recompensas y mejorar tu productividad.</p>
        </div>

        <div class="logros-stats-grid" style="display: flex; gap: 10px; margin-bottom: 1.2rem;">
            <div class="logro-stat-card" style="flex: 1; padding: 12px; border-radius: 14px; background: white; text-align: center; border: 1px solid var(--border-color);">
                <h3 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Total</h3>
                <span style="font-size: 1.3rem; font-weight: 800;">${totalLogros}</span>
            </div>
            <div class="logro-stat-card" style="flex: 1; padding: 12px; border-radius: 14px; background: white; text-align: center; border: 1px solid var(--border-color);">
                <h3 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Completados</h3>
                <span style="font-size: 1.3rem; font-weight: 800; color: #00aa4f;">${completadosCount}</span>
            </div>
            <div class="logro-stat-card" style="flex: 1; padding: 12px; border-radius: 14px; background: white; text-align: center; border: 1px solid var(--border-color);">
                <h3 style="font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Progreso</h3>
                <span style="font-size: 1.3rem; font-weight: 800;">${progresoGeneral}%</span>
            </div>
        </div>

        <div class="achievements-list" style="display: flex; flex-direction: column; gap: 10px;">
    `;

    achievementsDB.forEach(logro => {
        const rutaImagen = logro.completed ? logro.iconOn : logro.iconOff;
        const claseCompletado = logro.completed ? 'completed' : '';

        html += `
            <div class="achievement-card ${claseCompletado}">
                <div class="achievement-icon">
                    <img src="${rutaImagen}" alt="${logro.title}" onerror="this.onerror=null; this.parentElement.innerHTML='🏆';">
                </div>
                <div class="achievement-info">
                    <h4>${logro.title}</h4>
                    <p>${logro.description}</p>
                    <div class="achievement-progress">
                        <div class="achievement-progress-fill" style="width: ${logro.progress}%"></div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    // Retornamos el HTML para que sea inyectado en el contenedor dinámico de pestañas correctamente
    return html; 
}

// --- VISTA 4: HERRAMIENTAS ---
function renderHerramientasSection() {
    return `
        <div>
            <!-- SELECTOR DESPLEGABLE DE HERRAMIENTAS -->
            <div class="tools-dropdown-wrapper">
                <button class="tools-dropdown-trigger" onclick="toggleToolsMenu()">
                    <span>${currentToolTab === 'pomodoro' ? '⏱ Pomodoro' : currentToolTab === 'stopwatch' ? '⏱ Cronómetro' : '📝 Notas'}</span>
                    <span class="dropdown-arrow ${toolsMenuOpen ? 'open' : ''}">▾</span>
                </button>
                <div class="tools-dropdown-menu ${toolsMenuOpen ? 'open' : ''}">
                    <button class="tools-dropdown-item ${currentToolTab === 'pomodoro' ? 'active' : ''}" onclick="switchToolTab('pomodoro')">
                        <span>⏱</span> Pomodoro
                        <small>Temporizador de trabajo</small>
                    </button>
                    <button class="tools-dropdown-item ${currentToolTab === 'stopwatch' ? 'active' : ''}" onclick="switchToolTab('stopwatch')">
                        <span>🕐</span> Cronómetro
                        <small>Mide tiempos con precisión</small>
                    </button>
                    <button class="tools-dropdown-item ${currentToolTab === 'notes' ? 'active' : ''}" onclick="switchToolTab('notes')">
                        <span>📝</span> Notas
                        <small>Apuntes rápidos</small>
                    </button>
                </div>
            </div>

            <!-- PANEL ACTIVO -->
            <div id="tool-panel-content">
                ${renderActiveToolPanel()}
            </div>
        </div>
    `;
}

function toggleToolsMenu() {
    toolsMenuOpen = !toolsMenuOpen;
    const menu = document.querySelector('.tools-dropdown-menu');
    const arrow = document.querySelector('.dropdown-arrow');
    if (menu) menu.classList.toggle('open', toolsMenuOpen);
    if (arrow) arrow.classList.toggle('open', toolsMenuOpen);
    const trigger = document.querySelector('.tools-dropdown-trigger span:last-child');
}

function switchToolTab(tab) {
    currentToolTab = tab;
    toolsMenuOpen = false;
    const panel = document.getElementById('tool-panel-content');
    if (panel) {
        panel.innerHTML = renderActiveToolPanel();
        if (tab === 'pomodoro')  updateTimerDisplay();
        if (tab === 'stopwatch') updateStopwatchDisplay();
        if (tab === 'notes')     bindNoteFormEvents();
    }
    // Actualizar trigger del dropdown
    const trigger = document.querySelector('.tools-dropdown-trigger span:first-child');
    if (trigger) trigger.textContent = tab === 'pomodoro' ? '⏱ Pomodoro' : tab === 'stopwatch' ? '⏱ Cronómetro' : '📝 Notas';
    const menu = document.querySelector('.tools-dropdown-menu');
    const arrow = document.querySelector('.dropdown-arrow');
    if (menu) menu.classList.remove('open');
    if (arrow) arrow.classList.remove('open');
}

function renderActiveToolPanel() {
    if (currentToolTab === 'pomodoro')  return renderPomodoroPanel();
    if (currentToolTab === 'stopwatch') return renderStopwatchPanel();
    if (currentToolTab === 'notes')     return renderNotesPanel();
    return '';
}

// ---- POMODORO ----
function renderPomodoroPanel() {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    const display = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    return `
        <div class="tools-container" style="text-align:center;">
            <h3 style="margin-bottom:4px; font-size:1rem;">Temporizador Pomodoro</h3>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">Ajusta el tiempo con los botones de preset o ingresa minutos manualmente.</p>
            <div class="timer-display" id="timer-box">${display}</div>
            <div style="display:flex; gap:8px; justify-content:center; margin-bottom:12px; flex-wrap:wrap;">
                <button class="filter-btn" onclick="setTimerPreset(300)">5 min</button>
                <button class="filter-btn" onclick="setTimerPreset(600)">10 min</button>
                <button class="filter-btn active" onclick="setTimerPreset(1500)">25 min</button>
                <button class="filter-btn" onclick="setTimerPreset(2700)">45 min</button>
            </div>
            <div style="display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:16px;">
                <label style="font-size:0.8rem; color:var(--text-muted);">Personalizar:</label>
                <input type="number" id="custom-timer-input" min="1" max="180" placeholder="min"
                    style="width:70px; padding:6px 10px; border:1px solid var(--border-color); border-radius:8px; font-size:0.9rem; text-align:center;"
                    onchange="applyCustomTimer(this.value)">
            </div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button class="btn btn-primary" id="btn-timer-trigger" style="max-width:130px;" onclick="toggleTimer()">${isTimerRunning ? 'Pausar' : 'Iniciar'}</button>
                <button class="btn" style="background:#cbd5e1; max-width:130px;" onclick="resetTimer()">Reiniciar</button>
            </div>
        </div>
    `;
}

// ---- CRONÓMETRO ----
function renderStopwatchPanel() {
    return `
        <div class="tools-container" style="text-align:center;">
            <h3 style="margin-bottom:4px; font-size:1rem;">Cronómetro</h3>
            <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px;">Mide tiempos y registra vueltas.</p>
            <div class="stopwatch-display" id="sw-display">${formatStopwatch(swElapsed)}</div>
            <div style="display:flex; gap:10px; justify-content:center; margin-bottom:12px;">
                <button class="btn btn-primary" id="btn-sw-trigger" style="max-width:130px;" onclick="toggleStopwatch()">${swRunning ? 'Pausar' : 'Iniciar'}</button>
                <button class="btn" style="background:#cbd5e1; max-width:80px;" onclick="lapStopwatch()" ${!swRunning ? 'disabled' : ''}>Vuelta</button>
                <button class="btn" style="background:#fee2e2; color:#dc2626; max-width:80px;" onclick="resetStopwatch()">Reset</button>
            </div>
            ${swLaps.length > 0 ? `
                <div class="laps-list" id="sw-laps">
                    ${swLaps.map((t, i) => `
                        <div class="lap-item">
                            <span class="lap-num">Vuelta ${i + 1}</span>
                            <span class="lap-time">${formatStopwatch(t)}</span>
                        </div>
                    `).reverse().join('')}
                </div>` : ''}
        </div>
    `;
}

function formatStopwatch(ms) {
    const h   = Math.floor(ms / 3600000);
    const m   = Math.floor((ms % 3600000) / 60000);
    const s   = Math.floor((ms % 60000) / 1000);
    const cs  = Math.floor((ms % 1000) / 10);
    const hPart = h > 0 ? `${String(h).padStart(2,'0')}:` : '';
    return `${hPart}${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}<span class="stopwatch-ms">.${String(cs).padStart(2,'0')}</span>`;
}

function updateStopwatchDisplay() {
    const el = document.getElementById('sw-display');
    if (el) el.innerHTML = formatStopwatch(swElapsed);
}

function toggleStopwatch() {
    const btn = document.getElementById('btn-sw-trigger');
    if (swRunning) {
        clearInterval(swInterval);
        swRunning = false;
        if (btn) btn.textContent = 'Iniciar';
    } else {
        const start = Date.now() - swElapsed;
        swRunning = true;
        if (btn) btn.textContent = 'Pausar';
        swInterval = setInterval(() => {
            swElapsed = Date.now() - start;
            updateStopwatchDisplay();
        }, 50);
    }
    // Habilitar/deshabilitar botón Vuelta
    const lapBtn = document.querySelector('#tool-panel-content .btn[onclick="lapStopwatch()"]');
    if (lapBtn) lapBtn.disabled = !swRunning;
}

function lapStopwatch() {
    if (!swRunning) return;
    swLaps.push(swElapsed);
    // Re-renderizar solo las vueltas para no interrumpir el intervalo
    const lapsContainer = document.getElementById('sw-laps');
    if (lapsContainer) {
        lapsContainer.innerHTML = swLaps.map((t, i) => `
            <div class="lap-item">
                <span class="lap-num">Vuelta ${i + 1}</span>
                <span class="lap-time">${formatStopwatch(t)}</span>
            </div>
        `).reverse().join('');
    } else {
        // Si no existía el contenedor todavía, re-render del panel
        const panel = document.getElementById('tool-panel-content');
        if (panel) {
            const wasRunning = swRunning;
            clearInterval(swInterval);
            swRunning = false;
            panel.innerHTML = renderActiveToolPanel();
            if (wasRunning) toggleStopwatch();
        }
    }
}

function resetStopwatch() {
    clearInterval(swInterval);
    swRunning = false;
    swElapsed = 0;
    swLaps = [];
    const panel = document.getElementById('tool-panel-content');
    if (panel) panel.innerHTML = renderActiveToolPanel();
}

// ---- NOTAS ----
function renderNotesPanel() {
    const notesHTML = notesDB.length === 0
        ? `<div class="no-notes">No tienes notas aún. ¡Crea una arriba!</div>`
        : notesDB.slice().reverse().map(n => `
            <div class="note-card">
                <div class="note-card-header">
                    <span class="note-card-title">${n.title || 'Sin título'}</span>
                    <span class="note-card-date">${n.date}</span>
                    <button class="note-delete-btn" onclick="deleteNote(${n.id})">✕</button>
                </div>
                <div class="note-card-body">${n.body}</div>
            </div>
        `).join('');

    return `
        <div>
            <div class="note-add-area">
                <input type="text" id="note-title-inp" class="note-title-input" placeholder="Título de la nota..." maxlength="80">
                <textarea id="note-body-inp" class="note-body-input" rows="3" placeholder="Escribe aquí tu nota..."></textarea>
                <button class="btn btn-primary" onclick="saveNote()" style="width:100%;">＋ Guardar nota</button>
            </div>
            <div class="notes-list" id="notes-list-box">
                ${notesHTML}
            </div>
        </div>
    `;
}

function bindNoteFormEvents() {
    // Sin lógica extra requerida; los onclick inline son suficientes
}

function saveNote() {
    const titleEl = document.getElementById('note-title-inp');
    const bodyEl  = document.getElementById('note-body-inp');
    const title   = titleEl ? titleEl.value.trim() : '';
    const body    = bodyEl  ? bodyEl.value.trim()  : '';

    if (!body && !title) {
        showToast('Escribe algo antes de guardar.', 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    notesDB.push({ id: Date.now(), title: title || 'Sin título', body, date: today });

    showToast('Nota guardada ✅', 'success');
    // Limpiar campos
    if (titleEl) titleEl.value = '';
    if (bodyEl)  bodyEl.value  = '';
    // Actualizar lista
    const listBox = document.getElementById('notes-list-box');
    if (listBox) {
        listBox.innerHTML = notesDB.slice().reverse().map(n => `
            <div class="note-card">
                <div class="note-card-header">
                    <span class="note-card-title">${n.title || 'Sin título'}</span>
                    <span class="note-card-date">${n.date}</span>
                    <button class="note-delete-btn" onclick="deleteNote(${n.id})">✕</button>
                </div>
                <div class="note-card-body">${n.body}</div>
            </div>
        `).join('');
    }
}

function deleteNote(id) {
    notesDB = notesDB.filter(n => n.id !== id);
    showToast('Nota eliminada.', 'success');
    const listBox = document.getElementById('notes-list-box');
    if (listBox) {
        if (notesDB.length === 0) {
            listBox.innerHTML = `<div class="no-notes">No tienes notas aún. ¡Crea una arriba!</div>`;
        } else {
            listBox.innerHTML = notesDB.slice().reverse().map(n => `
                <div class="note-card">
                    <div class="note-card-header">
                        <span class="note-card-title">${n.title || 'Sin título'}</span>
                        <span class="note-card-date">${n.date}</span>
                        <button class="note-delete-btn" onclick="deleteNote(${n.id})">✕</button>
                    </div>
                    <div class="note-card-body">${n.body}</div>
                </div>
            `).join('');
        }
    }
}

// --- VISTA 5: PERFIL ---
function renderPerfilSection() {
    const fontLabels = { small: 'Pequeña', normal: 'Normal', large: 'Grande', xlarge: 'Muy grande' };
    const userActs = activitiesDB.filter(a => a.owner === currentUser.email);
    const completed = userActs.filter(a => a.completed).length;
    const pending = userActs.filter(a => !a.completed).length;
    const categories = {};
    userActs.forEach(a => { categories[a.category] = (categories[a.category] || 0) + 1; });
    const topCat = Object.entries(categories).sort((a,b) => b[1]-a[1])[0];

    const avatarContent = currentUser.avatarImg
        ? `<img src="${currentUser.avatarImg}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" alt="foto de perfil">`
        : `<span style="font-size:3.5rem;">${currentUser.avatar || '👤'}</span>`;

    return `
        <!-- TARJETA DE PERFIL PRINCIPAL -->
        <div class="profile-card">
            <div class="profile-avatar-wrapper">
                <div class="profile-avatar" id="profile-avatar-display">${avatarContent}</div>
                <label class="profile-avatar-edit" title="Cambiar foto" for="avatar-file-input">📷</label>
                <input type="file" id="avatar-file-input" accept="image/*" style="display:none;" onchange="changeProfilePhoto(this)">
            </div>
            <h2 style="font-size:1.3rem;margin-top:10px;">${currentUser.name}</h2>
            <p style="color:var(--text-muted); font-size:0.9rem;">${currentUser.email}</p>
            ${currentUser.phone ? `<p style="color:var(--text-muted); font-size:0.82rem;">📱 ${currentUser.phone}</p>` : ''}
            ${currentUser.bio ? `<p style="font-size:0.82rem;margin-top:4px;color:var(--text-main);">${currentUser.bio}</p>` : ''}
        </div>

        <!-- TABS DEBAJO DE LA IMAGEN -->
        <div class="profile-tabs">
            <button class="profile-tab-btn ${profileSection==='info'?'active':''}" onclick="setProfileSection('info')">📋 Datos</button>
            <button class="profile-tab-btn ${profileSection==='estadisticas'?'active':''}" onclick="setProfileSection('estadisticas')">📊 Stats</button>
            <button class="profile-tab-btn ${profileSection==='ajustes'?'active':''}" onclick="setProfileSection('ajustes')">⚙️ Ajustes</button>
        </div>

        <div id="profile-section-content">
            ${renderProfileSectionContent(fontLabels, completed, pending, topCat)}
        </div>
    `;
}

function setProfileSection(section) {
    profileSection = section;
    const el = document.getElementById('profile-section-content');
    if (el) {
        const userActs = activitiesDB.filter(a => a.owner === currentUser.email);
        const completed = userActs.filter(a => a.completed).length;
        const pending = userActs.filter(a => !a.completed).length;
        const categories = {};
        userActs.forEach(a => { categories[a.category] = (categories[a.category] || 0) + 1; });
        const topCat = Object.entries(categories).sort((a,b) => b[1]-a[1])[0];
        const fontLabels = { small: 'Pequeña', normal: 'Normal', large: 'Grande', xlarge: 'Muy grande' };
        el.innerHTML = renderProfileSectionContent(fontLabels, completed, pending, topCat);
        document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
        const active = [...document.querySelectorAll('.profile-tab-btn')].find(b => b.textContent.toLowerCase().includes(section === 'info' ? 'datos' : section === 'estadisticas' ? 'stats' : 'ajustes'));
        if (active) active.classList.add('active');
    }
}

function renderProfileSectionContent(fontLabels, completed, pending, topCat) {
    if (profileSection === 'info') {
        return `
        <div class="profile-info-section">
            <div class="profile-info-header">
                <span class="a11y-panel-title" style="border:none;margin:0;">✏️ Mis Datos Personales</span>
                <button class="edit-profile-btn" onclick="openEditProfileModal()">Editar</button>
            </div>
            <div class="profile-info-card">
                <div class="profile-info-row">
                    <span class="profile-info-label">👤 Nombre</span>
                    <span class="profile-info-value">${currentUser.name}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">📧 Correo</span>
                    <span class="profile-info-value">${currentUser.email}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">📱 Teléfono</span>
                    <span class="profile-info-value">${currentUser.phone || 'No registrado'}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">💬 Bio</span>
                    <span class="profile-info-value">${currentUser.bio || 'Sin descripción'}</span>
                </div>
            </div>

            <!-- DESCRIPCION E INFO DE CONTACTO -->
            <div class="profile-about-card">
                <div class="a11y-panel-title" style="border:none;margin-bottom:8px;">ℹ️ Acerca de Planifica Plus</div>
                <p style="font-size:0.82rem;color:var(--text-muted);line-height:1.5;">Planifica Plus es tu compañero de productividad personal. Organiza actividades, sincroniza con amigos, usa el Pomodoro y alcanza tus logros diarios.</p>
                <div style="margin-top:10px;">
                    <p style="font-size:0.78rem;color:var(--text-muted);">📧 soporte@planificaplus.app</p>
                    <p style="font-size:0.78rem;color:var(--text-muted);">🌐 www.planificaplus.app</p>
                    <p style="font-size:0.78rem;color:var(--text-muted);">📞 +57 300 000 0000</p>
                </div>
            </div>
        </div>`;
    } else if (profileSection === 'estadisticas') {
        return `
        <div class="profile-stats-section">
            <div class="a11y-panel-title" style="border:none;">📊 Mis Estadísticas</div>
            <div class="stats-grid">
                <div class="stat-card green">
                    <span class="stat-number">${completed}</span>
                    <span class="stat-label">Completadas</span>
                </div>
                <div class="stat-card purple">
                    <span class="stat-number">${pending}</span>
                    <span class="stat-label">Pendientes</span>
                </div>
                <div class="stat-card blue">
                    <span class="stat-number">${completed + pending}</span>
                    <span class="stat-label">Total</span>
                </div>
                <div class="stat-card orange">
                    <span class="stat-number">${completed + pending > 0 ? Math.round((completed/(completed+pending))*100) : 0}%</span>
                    <span class="stat-label">Éxito</span>
                </div>
            </div>
            ${topCat ? `<div class="profile-info-card" style="margin-top:10px;">
                <div class="profile-info-row">
                    <span class="profile-info-label">🏆 Categoría top</span>
                    <span class="profile-info-value">${topCat[0].toUpperCase()} (${topCat[1]})</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">👥 Amigos</span>
                    <span class="profile-info-value">${friendsDB.filter(f=>f.status==='accepted'&&(f.from===currentUser.email||f.to===currentUser.email)).length}</span>
                </div>
                <div class="profile-info-row">
                    <span class="profile-info-label">🔗 Actividades Sync</span>
                    <span class="profile-info-value">${sharedActivitiesDB.filter(s=>s.participants.includes(currentUser.email)).length}</span>
                </div>
            </div>` : ''}
        </div>`;
    } else {
        // AJUSTES
        return `
        <div class="a11y-panel">
            <!-- MODO OSCURO -->
            <div class="a11y-option-card">
                <div class="a11y-option-header">
                    <div class="a11y-option-icon">${darkMode ? '🌙' : '☀️'}</div>
                    <div class="a11y-option-info">
                        <h4>Modo Oscuro</h4>
                        <p>Cambia la apariencia de la app e iconos.</p>
                    </div>
                    <button class="a11y-toggle ${darkMode ? 'on' : ''}" onclick="toggleDarkMode()">
                        <span class="a11y-toggle-knob"></span>
                    </button>
                </div>
            </div>

            <!-- 1. CONTROL POR VOZ -->
            <div class="a11y-option-card" id="a11y-voice-card">
                <div class="a11y-option-header">
                    <div class="a11y-option-icon">🎙️</div>
                    <div class="a11y-option-info">
                        <h4>Control por voz</h4>
                        <p>Navega y gestiona la app con comandos de voz.</p>
                    </div>
                    <button class="a11y-toggle ${a11y.voiceControl ? 'on' : ''}" onclick="toggleVoiceControl()">
                        <span class="a11y-toggle-knob"></span>
                    </button>
                </div>
                <div class="a11y-voice-status ${a11y.voiceControl ? '' : 'hidden'}">
                    <div class="voice-listening-indicator">
                        <span class="voice-dot"></span>
                        <span id="voice-status-text">Escuchando…</span>
                    </div>
                    <div class="voice-commands-hint">
                        <strong>Comandos disponibles:</strong><br>
                        "ir a lista" · "ir a calendario" · "ir a logros"<br>
                        "ir a herramientas" · "nueva actividad" · "cerrar sesión"
                    </div>
                </div>
            </div>

            <!-- 2. LECTURA EN VOZ ALTA -->
            <div class="a11y-option-card">
                <div class="a11y-option-header">
                    <div class="a11y-option-icon">🔊</div>
                    <div class="a11y-option-info">
                        <h4>Lectura en voz alta</h4>
                        <p>${a11y.ttsActive ? '🔊 Activo — toca cualquier elemento.' : 'Lee en voz alta lo que tocas.'}</p>
                    </div>
                    <button class="a11y-toggle ${a11y.ttsActive ? 'on' : ''}" onclick="toggleTTS()">
                        <span class="a11y-toggle-knob"></span>
                    </button>
                </div>
                <div class="a11y-tts-controls ${a11y.ttsActive ? '' : 'hidden'}">
                    <button class="a11y-action-btn" onclick="speakCurrentContent()">▶ Leer pantalla</button>
                    <button class="a11y-action-btn secondary" onclick="stopSpeaking()">⏹ Detener</button>
                </div>
            </div>

            <!-- 3. TAMAÑO DE FUENTE -->
            <div class="a11y-option-card">
                <div class="a11y-option-header">
                    <div class="a11y-option-icon">🔡</div>
                    <div class="a11y-option-info">
                        <h4>Tamaño de fuente</h4>
                        <p>Ajusta el texto para mayor comodidad.</p>
                    </div>
                </div>
                <div class="a11y-font-controls">
                    ${['small','normal','large','xlarge'].map(size => `
                        <button class="a11y-font-btn ${a11y.fontSize === size ? 'active' : ''}" onclick="setFontSize('${size}')">
                            <span class="font-preview-${size}">Aa</span>
                            <span class="font-size-label">${fontLabels[size]}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>

        <p style="font-size:0.72rem; color:var(--text-muted); text-align:center; margin-top:12px;">
            Planifica Plus — Versión Estable Móvil Premium 2026
        </p>`;
    }
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
            const name        = document.getElementById("reg-name").value.trim();
            const email       = document.getElementById("reg-email").value.trim().toLowerCase();
            const phone       = document.getElementById("reg-phone").value.trim();
            const pass        = document.getElementById("reg-pass").value;
            const passConfirm = document.getElementById("reg-pass-confirm").value;

            if (!name)  { showToast("Ingresa tu nombre.", "error"); return; }
            if (!email) { showToast("Ingresa tu correo electrónico.", "error"); return; }
            if (!phone) { showToast("Ingresa tu número de teléfono.", "error"); return; }
            if (pass.length < 6) { showToast("La contraseña debe tener al menos 6 caracteres.", "error"); return; }
            if (pass !== passConfirm) { showToast("Las contraseñas no coinciden. Verifica e intenta de nuevo.", "error"); return; }

            // Verificar que el correo no esté registrado
            if (usersDB.find(u => u.email === email)) {
                showToast("Este correo ya está registrado. Intenta iniciar sesión.", "error");
                return;
            }

            usersDB.push({ name, email, pass, phone, avatar: '👤', bio: '', avatarImg: null });
            showToast("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.", "success");
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
    const act = activitiesDB.find(a => a.id === id);
    if (act) {
        undoStack.push({ type: 'delete', data: { ...act } });
    }
    activitiesDB = activitiesDB.filter(a => a.id !== id);
    showToast("Actividad eliminada. Toca ↩️ para deshacer.", "success");
    renderActiveSection();
}

// ================= VALIDACIÓN DE CONFLICTOS DE HORARIO =================
// Retorna actividad conflictiva o null
function getConflict(date, time, durationMin, excludeId = null) {
    const newStart = timeToMinutes(time);
    const newEnd   = newStart + parseInt(durationMin, 10);

    return activitiesDB.find(a => {
        if (a.owner !== currentUser.email) return false;
        if (a.id === excludeId) return false;
        if (a.date !== date) return false;
        const aStart = timeToMinutes(a.time || '00:00');
        const aEnd   = aStart + parseInt(a.duration || 60, 10);
        // Solapamiento: los rangos se intersectan si newStart < aEnd && newEnd > aStart
        return newStart < aEnd && newEnd > aStart;
    });
}

function timeToMinutes(t) {
    const [h, m] = (t || '00:00').split(':').map(Number);
    return h * 60 + m;
}

function minutesToTime(m) {
    const h = Math.floor(m / 60) % 24;
    const min = m % 60;
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
}

// Ventana Modal Dinámica para Añadir Actividades
function openActivityModal() {
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box" style="max-height:80vh;overflow-y:auto;">
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
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" id="m-date" required value="${new Date().toISOString().split('T')[0]}"
                            oninput="checkConflictPreview()">
                    </div>
                    <div class="form-group">
                        <label>Hora de inicio</label>
                        <input type="time" id="m-time" required value="08:00"
                            oninput="checkConflictPreview()">
                    </div>
                </div>
                <div class="form-group">
                    <label>Duración (minutos)</label>
                    <div style="display:flex;gap:6px;align-items:center;">
                        <input type="number" id="m-duration" required value="60" min="5" max="480" step="5"
                            style="width:90px;" oninput="checkConflictPreview()">
                        <span style="font-size:0.8rem;color:var(--text-muted);" id="m-endtime-label">→ termina ~09:00</span>
                    </div>
                </div>
                <!-- Banner de conflicto -->
                <div id="conflict-banner" class="conflict-banner hidden"></div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="m-cat">
                            <option value="salud">Salud</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="personal">Personal</option>
                            <option value="social">Social</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Prioridad</label>
                        <select id="m-prio">
                            <option value="baja">Baja</option>
                            <option value="media" selected>Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;" id="m-submit-btn">
                    Guardar Actividad
                </button>
            </form>
        </div>
    `;
    modal.classList.remove("hidden");
    checkConflictPreview(); // Calcular hora fin inicial

    document.getElementById("modal-add-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const title    = document.getElementById("m-title").value.trim();
        const desc     = document.getElementById("m-desc").value.trim();
        const date     = document.getElementById("m-date").value;
        const time     = document.getElementById("m-time").value;
        const duration = parseInt(document.getElementById("m-duration").value, 10) || 60;
        const category = document.getElementById("m-cat").value;
        const priority = document.getElementById("m-prio").value;

        // Verificar conflicto antes de guardar
        const conflict = getConflict(date, time, duration);
        if (conflict) {
            showToast(`⚠️ Conflicto con "${conflict.title}" (${conflict.time}, ${conflict.duration} min)`, 'error');
            return;
        }

        activitiesDB.push({
            id: Date.now(),
            title, desc, date, time, duration,
            category, priority,
            completed: false,
            owner: currentUser.email
        });

        closeModal();
        showToast("Actividad creada exitosamente ✅", "success");
        renderActiveSection();
    });
}

// Preview en tiempo real del conflicto mientras el usuario llena el form
function checkConflictPreview() {
    const dateEl     = document.getElementById("m-date");
    const timeEl     = document.getElementById("m-time");
    const durEl      = document.getElementById("m-duration");
    const banner     = document.getElementById("conflict-banner");
    const endLabel   = document.getElementById("m-endtime-label");
    const submitBtn  = document.getElementById("m-submit-btn");
    if (!dateEl || !timeEl || !durEl) return;

    const date     = dateEl.value;
    const time     = timeEl.value;
    const duration = parseInt(durEl.value, 10) || 60;

    // Actualizar etiqueta de hora fin
    if (endLabel && time) {
        const endMin = timeToMinutes(time) + duration;
        endLabel.textContent = `→ termina ~${minutesToTime(endMin)}`;
    }

    if (!date || !time) return;

    const conflict = getConflict(date, time, duration);
    if (conflict) {
        const cEnd = minutesToTime(timeToMinutes(conflict.time || '00:00') + parseInt(conflict.duration || 60, 10));
        banner.innerHTML = `⚠️ <strong>Conflicto de horario</strong> con <em>"${conflict.title}"</em> programada de ${conflict.time || '--'} a ${cEnd}. Ajusta la hora o duración.`;
        banner.classList.remove("hidden");
        if (submitBtn) submitBtn.disabled = true;
    } else {
        banner.classList.add("hidden");
        if (submitBtn) submitBtn.disabled = false;
    }
}

function closeModal() {
    document.getElementById("modal-container").classList.add("hidden");
}

// ================= COMPONENTES ADICIONALES (RELOJ Y CALENDARIO) =================

function setTimerPreset(seconds) {
    timerSeconds = seconds;
    isTimerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
    const btn = document.getElementById('btn-timer-trigger');
    if (btn) btn.textContent = 'Iniciar';
}

function applyCustomTimer(val) {
    const mins = parseInt(val, 10);
    if (!mins || mins < 1) return;
    timerSeconds = mins * 60;
    isTimerRunning = false;
    clearInterval(timerInterval);
    updateTimerDisplay();
    const btn = document.getElementById('btn-timer-trigger');
    if (btn) btn.textContent = 'Iniciar';
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

    const year  = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const isToday = dateStr === todayStr;
        const hasTasks = activitiesDB.some(a => a.owner === currentUser.email && a.date === dateStr);
        grid.innerHTML += `
            <div class="day ${isToday ? 'today' : ''}" 
                onclick="selectCalendarDay('${dateStr}')"
                style="padding:8px 0; text-align:center; border-radius:8px; cursor:pointer; position:relative;
                background:${isToday ? 'var(--primary-color)' : '#f8fafc'}; 
                color:${isToday ? 'white' : 'var(--text-main)'};
                font-weight:${isToday ? 'bold' : 'normal'};">
                ${d}
                ${hasTasks ? `<span style="display:block;width:5px;height:5px;border-radius:50%;background:${isToday?'white':'var(--primary-color)'};margin:1px auto 0;"></span>` : ''}
            </div>`;
    }
}

function selectCalendarDay(dateStr) {
    const acts = activitiesDB.filter(a => a.owner === currentUser.email && a.date === dateStr);
    const details = document.getElementById('cal-day-details');
    if (!details) return;
    if (acts.length === 0) {
        details.innerHTML = `<p style="font-size:0.85rem;color:var(--text-muted);text-align:center;">Sin actividades el ${dateStr}.</p>`;
        return;
    }
    details.innerHTML = `
        <p style="font-size:0.8rem;font-weight:700;margin-bottom:8px;">📅 ${dateStr}</p>
        ${acts.map(a => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;font-size:0.82rem;">
                <span>${a.completed ? '✅' : '⏳'} ${a.title}</span>
                <span style="color:var(--text-muted);">${a.time || ''}</span>
            </div>
        `).join('')}
    `;
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

// ================= MÓDULO DE AMIGOS =================

function getFriends() {
    // Retorna lista de usuarios aceptados como amigos del usuario actual
    return friendsDB
        .filter(f => f.status === 'accepted' && (f.from === currentUser.email || f.to === currentUser.email))
        .map(f => {
            const friendEmail = f.from === currentUser.email ? f.to : f.from;
            return usersDB.find(u => u.email === friendEmail);
        })
        .filter(Boolean);
}

function getPendingRequests() {
    return friendsDB.filter(f => f.status === 'pending' && f.to === currentUser.email);
}

function getSharedActivitiesWithFriend(friendEmail) {
    return sharedActivitiesDB.filter(sa =>
        sa.participants.includes(currentUser.email) && sa.participants.includes(friendEmail)
    );
}

function renderAmigosSection() {
    const friends = getFriends();
    const pending = getPendingRequests();

    const friendsHTML = friends.length === 0
        ? `<p class="no-activities">Aún no tienes amigos agregados. ¡Busca uno abajo!</p>`
        : friends.map(f => {
            const shared = getSharedActivitiesWithFriend(f.email);
            const completedShared = shared.filter(s => s.completedBy.includes(currentUser.email) && s.completedBy.includes(f.email)).length;
            return `
            <div class="friend-card" onclick="openFriendDetail('${f.email}')">
                <div class="friend-avatar">${f.avatar || '👤'}</div>
                <div class="friend-info">
                    <h4>${f.name}</h4>
                    <p>${f.email}</p>
                    ${shared.length > 0
                        ? `<span class="friend-shared-badge">${shared.length} actividad${shared.length > 1 ? 'es' : ''} sincronizada${shared.length > 1 ? 's' : ''}</span>`
                        : ''}
                </div>
                <div class="friend-sync-indicator">
                    ${shared.length > 0 ? `<span class="sync-dot active"></span>` : `<span class="sync-dot"></span>`}
                </div>
            </div>
            `;
        }).join('');

    const pendingHTML = pending.length === 0 ? '' : `
        <div class="a11y-panel-title" style="margin-bottom:8px;">📨 Solicitudes pendientes</div>
        ${pending.map(req => {
            const sender = usersDB.find(u => u.email === req.from);
            return `
            <div class="friend-request-card">
                <span>${sender?.avatar || '👤'} <strong>${sender?.name}</strong> quiere ser tu amigo</span>
                <div style="display:flex;gap:6px;margin-top:8px;">
                    <button class="a11y-action-btn" style="flex:1;font-size:0.78rem;" onclick="acceptFriend('${req.from}')">✓ Aceptar</button>
                    <button class="a11y-action-btn secondary" style="flex:1;font-size:0.78rem;" onclick="rejectFriend('${req.from}')">✗ Rechazar</button>
                </div>
            </div>
            `;
        }).join('')}
    `;

    return `
        <div style="display:flex;flex-direction:column;gap:12px;">
            ${pendingHTML}

            <div class="a11y-panel-title">👥 Mis amigos</div>
            <div id="friends-list-box">${friendsHTML}</div>

            <div class="a11y-panel-title" style="margin-top:4px;">🔍 Agregar amigo</div>
            <div style="display:flex;gap:8px;">
                <input type="email" id="add-friend-input" placeholder="correo@ejemplo.com"
                    style="flex:1;padding:10px 12px;border:1px solid var(--border-color);border-radius:10px;font-size:0.9rem;">
                <button class="btn btn-primary btn-add" onclick="sendFriendRequest()">Agregar</button>
            </div>

            <div class="a11y-panel-title" style="margin-top:4px;">🔗 Actividades sincronizadas</div>
            ${renderSharedActivities()}
            <button class="btn btn-primary" onclick="openSharedActivityModal()" style="margin-top:4px;">＋ Nueva actividad sincronizada</button>
        </div>
    `;
}

function renderSharedActivities() {
    const myShared = sharedActivitiesDB.filter(sa => sa.participants.includes(currentUser.email));
    if (myShared.length === 0) return `<p class="no-activities">No tienes actividades sincronizadas aún.</p>`;

    return myShared.map(sa => {
        const partners = sa.participants.filter(e => e !== currentUser.email);
        const partnerUsers = partners.map(e => usersDB.find(u => u.email === e)).filter(Boolean);
        const myDone = sa.completedBy.includes(currentUser.email);
        const allDone = sa.participants.every(e => sa.completedBy.includes(e));

        const progressBars = sa.participants.map(email => {
            const u = usersDB.find(x => x.email === email);
            const done = sa.completedBy.includes(email);
            return `
            <div class="sync-progress-row">
                <span class="sync-user-label">${u?.avatar || '👤'} ${email === currentUser.email ? 'Tú' : u?.name}</span>
                <div class="sync-bar-wrap">
                    <div class="sync-bar-fill ${done ? 'done' : ''}"></div>
                </div>
                <span class="sync-status-chip ${done ? 'done' : 'pending'}">${done ? '✓' : '⏳'}</span>
            </div>
            `;
        }).join('');

        return `
        <div class="shared-activity-card ${allDone ? 'all-done' : ''}">
            <div class="shared-card-header">
                <div>
                    <h4>${sa.title}</h4>
                    <p style="font-size:0.78rem;color:var(--text-muted);">${sa.desc}</p>
                    <div style="display:flex;gap:6px;margin-top:4px;font-size:0.73rem;color:var(--text-muted);">
                        <span>📅 ${sa.date}</span>
                        <span>⏰ ${sa.time}</span>
                        <span class="badge-cat ${sa.category}">${sa.category.toUpperCase()}</span>
                    </div>
                </div>
                ${allDone ? '<span class="all-done-badge">✅ Todos listo</span>' : ''}
            </div>
            <div class="sync-progress-box">${progressBars}</div>
            ${!myDone
                ? `<button class="a11y-action-btn" style="margin-top:8px;" onclick="markSharedDone('${sa.id}')">
                    ✓ Marcar mi parte como completada
                   </button>`
                : `<p style="font-size:0.78rem;color:#16a34a;text-align:center;margin-top:6px;font-weight:700;">¡Ya completaste tu parte! 🎉</p>`
            }
        </div>
        `;
    }).join('');
}

function openFriendDetail(friendEmail) {
    const friend = usersDB.find(u => u.email === friendEmail);
    const shared = getSharedActivitiesWithFriend(friendEmail);
    const friendActs = activitiesDB.filter(a => a.owner === friendEmail);

    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>${friend?.avatar || '👤'} ${friend?.name}</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:12px;">${friendEmail}</p>

            <div class="a11y-panel-title" style="margin-bottom:8px;">📋 Sus actividades próximas</div>
            ${friendActs.length === 0
                ? `<p style="font-size:0.82rem;color:var(--text-muted);">Sin actividades registradas.</p>`
                : friendActs.slice(0, 4).map(a => `
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:#f8fafc;border-radius:8px;margin-bottom:6px;">
                        <div>
                            <p style="font-size:0.85rem;font-weight:700;">${a.title}</p>
                            <p style="font-size:0.73rem;color:var(--text-muted);">📅 ${a.date} ⏰ ${a.time || '--'}</p>
                        </div>
                        <span class="badge-cat ${a.category}">${a.category.toUpperCase()}</span>
                    </div>
                `).join('')}

            <div class="a11y-panel-title" style="margin:10px 0 8px;">🔗 Actividades sincronizadas juntos</div>
            ${shared.length === 0
                ? `<p style="font-size:0.82rem;color:var(--text-muted);">Ninguna aún. ¡Crea una!</p>`
                : shared.map(s => `
                    <div style="padding:8px;background:#f0fdf4;border-radius:8px;margin-bottom:6px;border-left:4px solid var(--primary-color);">
                        <p style="font-size:0.85rem;font-weight:700;">${s.title}</p>
                        <p style="font-size:0.73rem;color:var(--text-muted);">📅 ${s.date} ⏰ ${s.time}</p>
                        <p style="font-size:0.73rem;margin-top:4px;">
                            Tú: ${s.completedBy.includes(currentUser.email) ? '✅' : '⏳'} &nbsp;
                            ${friend?.name}: ${s.completedBy.includes(friendEmail) ? '✅' : '⏳'}
                        </p>
                    </div>
                `).join('')}
        </div>
    `;
    modal.classList.remove("hidden");
}

function sendFriendRequest() {
    const input = document.getElementById("add-friend-input");
    const email = input ? input.value.trim().toLowerCase() : '';
    if (!email) { showToast('Ingresa un correo.', 'error'); return; }
    if (email === currentUser.email) { showToast('No puedes agregarte a ti mismo.', 'error'); return; }

    const target = usersDB.find(u => u.email === email);
    if (!target) { showToast('Usuario no encontrado.', 'error'); return; }

    const exists = friendsDB.find(f =>
        (f.from === currentUser.email && f.to === email) ||
        (f.from === email && f.to === currentUser.email)
    );
    if (exists) { showToast('Ya existe una relación con este usuario.', 'error'); return; }

    friendsDB.push({ from: currentUser.email, to: email, status: 'pending' });
    showToast(`Solicitud enviada a ${target.name} 📨`, 'success');
    renderActiveSection();
}

function acceptFriend(fromEmail) {
    const req = friendsDB.find(f => f.from === fromEmail && f.to === currentUser.email);
    if (req) {
        req.status = 'accepted';
        const sender = usersDB.find(u => u.email === fromEmail);
        showToast(`¡${sender?.name} ahora es tu amigo! 🎉`, 'success');
        renderActiveSection();
    }
}

function rejectFriend(fromEmail) {
    friendsDB = friendsDB.filter(f => !(f.from === fromEmail && f.to === currentUser.email));
    showToast('Solicitud rechazada.', 'success');
    renderActiveSection();
}

function markSharedDone(sharedId) {
    const sa = sharedActivitiesDB.find(s => s.id === sharedId);
    if (sa && !sa.completedBy.includes(currentUser.email)) {
        sa.completedBy.push(currentUser.email);
        const allDone = sa.participants.every(e => sa.completedBy.includes(e));
        if (allDone) {
            showToast('¡Actividad completada por todos! 🎉🎉', 'success');
        } else {
            showToast('Tu parte marcada. Esperando al resto... ⏳', 'success');
        }
        renderActiveSection();
    }
}

function openSharedActivityModal() {
    const friends = getFriends();
    if (friends.length === 0) {
        showToast('Primero agrega amigos para sincronizar actividades.', 'error');
        return;
    }
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>🔗 Nueva Actividad Sincronizada</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <form id="shared-act-form">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" id="sa-title" required placeholder="Ej. Entrenamiento conjunto">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="sa-desc" rows="2" placeholder="Qué van a hacer juntos..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" id="sa-date" required value="2026-05-27">
                    </div>
                    <div class="form-group">
                        <label>Hora</label>
                        <input type="time" id="sa-time" required value="08:00">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="sa-cat">
                            <option value="salud">Salud</option>
                            <option value="trabajo">Trabajo</option>
                            <option value="personal">Personal</option>
                            <option value="social">Social</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Prioridad</label>
                        <select id="sa-prio">
                            <option value="baja">Baja</option>
                            <option value="media" selected>Media</option>
                            <option value="alta">Alta</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Amigos participantes</label>
                    <div id="friends-checkboxes" style="display:flex;flex-direction:column;gap:6px;padding:8px;background:#f8fafc;border-radius:10px;border:1px solid var(--border-color);">
                        ${friends.map(f => `
                            <label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;cursor:pointer;">
                                <input type="checkbox" name="friend-check" value="${f.email}" checked>
                                ${f.avatar || '👤'} ${f.name} <span style="color:var(--text-muted);font-size:0.76rem;">(${f.email})</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Crear y sincronizar</button>
            </form>
        </div>
    `;
    modal.classList.remove("hidden");

    document.getElementById("shared-act-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const title    = document.getElementById("sa-title").value;
        const desc     = document.getElementById("sa-desc").value;
        const date     = document.getElementById("sa-date").value;
        const time     = document.getElementById("sa-time").value;
        const category = document.getElementById("sa-cat").value;
        const priority = document.getElementById("sa-prio").value;
        const checked  = [...document.querySelectorAll('input[name="friend-check"]:checked')].map(cb => cb.value);
        const participants = [currentUser.email, ...checked];

        sharedActivitiesDB.push({
            id: 'sa' + Date.now(),
            title, desc, date, time, category, priority,
            participants,
            completedBy: []
        });
        closeModal();
        showToast('Actividad sincronizada creada 🔗', 'success');
        renderActiveSection();
    });
}

// ================= MODO OSCURO =================
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    showToast(darkMode ? '🌙 Modo oscuro activado' : '☀️ Modo claro activado', 'success');
    renderAppRouter();
}

// ================= DESHACER ÚLTIMA ACCIÓN =================
function undoLastAction() {
    if (undoStack.length === 0) {
        showToast('No hay acciones para deshacer.', 'error');
        return;
    }
    const last = undoStack.pop();
    if (last.type === 'delete') {
        activitiesDB.push(last.data);
        showToast(`Actividad "${last.data.title}" restaurada ↩️`, 'success');
        renderActiveSection();
    } else if (last.type === 'edit') {
        const idx = activitiesDB.findIndex(a => a.id === last.data.id);
        if (idx !== -1) activitiesDB[idx] = last.data;
        showToast('Edición deshecha ↩️', 'success');
        renderActiveSection();
    }
}

// ================= EDITAR ACTIVIDAD =================
function openEditActivityModal(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (!act) return;
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box" style="max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3>✏️ Editar Actividad</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <form id="modal-edit-form">
                <div class="form-group">
                    <label>Título</label>
                    <input type="text" id="e-title" required value="${act.title}">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea id="e-desc" rows="2">${act.desc}</textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fecha</label>
                        <input type="date" id="e-date" required value="${act.date}">
                    </div>
                    <div class="form-group">
                        <label>Hora</label>
                        <input type="time" id="e-time" required value="${act.time || '08:00'}">
                    </div>
                </div>
                <div class="form-group">
                    <label>Duración (min)</label>
                    <input type="number" id="e-duration" value="${act.duration || 60}" min="5" max="480">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="e-cat">
                            <option value="salud" ${act.category==='salud'?'selected':''}>Salud</option>
                            <option value="trabajo" ${act.category==='trabajo'?'selected':''}>Trabajo</option>
                            <option value="personal" ${act.category==='personal'?'selected':''}>Personal</option>
                            <option value="social" ${act.category==='social'?'selected':''}>Social</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Prioridad</label>
                        <select id="e-prio">
                            <option value="baja" ${act.priority==='baja'?'selected':''}>Baja</option>
                            <option value="media" ${act.priority==='media'?'selected':''}>Media</option>
                            <option value="alta" ${act.priority==='alta'?'selected':''}>Alta</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:10px;">Guardar Cambios</button>
            </form>
        </div>
    `;
    modal.classList.remove("hidden");
    document.getElementById("modal-edit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const idx = activitiesDB.findIndex(a => a.id === id);
        if (idx === -1) return;
        // Guardar estado anterior para undo
        undoStack.push({ type: 'edit', data: { ...activitiesDB[idx] } });
        activitiesDB[idx] = {
            ...activitiesDB[idx],
            title:    document.getElementById("e-title").value.trim(),
            desc:     document.getElementById("e-desc").value.trim(),
            date:     document.getElementById("e-date").value,
            time:     document.getElementById("e-time").value,
            duration: parseInt(document.getElementById("e-duration").value, 10) || 60,
            category: document.getElementById("e-cat").value,
            priority: document.getElementById("e-prio").value,
        };
        closeModal();
        showToast("Actividad actualizada ✅", "success");
        renderActiveSection();
    });
}

// ================= DUPLICAR ACTIVIDAD (CON FECHA) =================
function openDuplicateActivityModal(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (!act) return;
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>📋 Duplicar Actividad</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:14px;">
                Vas a duplicar <strong>"${act.title}"</strong>. Elige la nueva fecha para la copia.
            </p>
            <div class="form-group">
                <label>Nueva fecha</label>
                <input type="date" id="dup-date" value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group">
                <label>¿Repetir cada?</label>
                <select id="dup-repeat">
                    <option value="none">Solo esta fecha</option>
                    <option value="weekly">Todos los lunes (semanal)</option>
                    <option value="daily">Todos los días (7 días)</option>
                    <option value="custom">Múltiples fechas específicas</option>
                </select>
            </div>
            <div id="dup-custom-dates" style="display:none;">
                <label style="font-size:0.82rem;font-weight:600;">Fechas adicionales (una por línea YYYY-MM-DD):</label>
                <textarea id="dup-extra-dates" rows="3" style="width:100%;padding:8px;border:1px solid var(--border-color);border-radius:8px;font-size:0.85rem;margin-top:4px;" placeholder="2026-05-27&#10;2026-06-03&#10;2026-06-10"></textarea>
            </div>
            <button class="btn btn-primary" style="margin-top:14px;" onclick="confirmDuplicate(${id})">Duplicar</button>
        </div>
    `;
    modal.classList.remove("hidden");
    document.getElementById("dup-repeat").addEventListener("change", function() {
        document.getElementById("dup-custom-dates").style.display = this.value === 'custom' ? 'block' : 'none';
    });
}

function confirmDuplicate(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (!act) return;
    const baseDate = document.getElementById("dup-date").value;
    const repeat   = document.getElementById("dup-repeat").value;
    let dates = [baseDate];

    if (repeat === 'weekly') {
        // Generar los próximos 4 lunes desde baseDate
        const d = new Date(baseDate + 'T12:00:00');
        for (let i = 1; i < 4; i++) {
            d.setDate(d.getDate() + 7);
            dates.push(d.toISOString().split('T')[0]);
        }
    } else if (repeat === 'daily') {
        const d = new Date(baseDate + 'T12:00:00');
        for (let i = 1; i < 7; i++) {
            d.setDate(d.getDate() + 1);
            dates.push(d.toISOString().split('T')[0]);
        }
    } else if (repeat === 'custom') {
        const extra = document.getElementById("dup-extra-dates").value.trim().split('\n').map(s=>s.trim()).filter(s=>s.match(/^\d{4}-\d{2}-\d{2}$/));
        dates = [baseDate, ...extra];
    }

    dates.forEach(date => {
        activitiesDB.push({
            ...act,
            id: Date.now() + Math.random(),
            date,
            completed: false
        });
    });
    closeModal();
    showToast(`Duplicada en ${dates.length} fecha(s) ✅`, "success");
    renderActiveSection();
}

// ================= COMPARTIR ACTIVIDAD =================
function openShareActivityModal(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (!act) return;
    const friends = getFriends();
    if (friends.length === 0) {
        showToast('Primero agrega amigos para compartir.', 'error');
        return;
    }
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>📤 Compartir con Amigos</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:12px;">
                Selecciona con quién compartir <strong>"${act.title}"</strong>
            </p>
            <div id="share-friends-list" style="display:flex;flex-direction:column;gap:8px;">
                ${friends.map(f => `
                    <label style="display:flex;align-items:center;gap:10px;background:#f8fafc;border:1px solid var(--border-color);border-radius:10px;padding:10px;cursor:pointer;">
                        <input type="checkbox" name="share-friend" value="${f.email}">
                        <span style="font-size:1.5rem;">${f.avatar || '👤'}</span>
                        <span style="font-weight:600;font-size:0.9rem;">${f.name}</span>
                    </label>
                `).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top:14px;" onclick="confirmShare(${id})">📤 Compartir</button>
        </div>
    `;
    modal.classList.remove("hidden");
}

function confirmShare(id) {
    const act = activitiesDB.find(a => a.id === id);
    if (!act) return;
    const checked = [...document.querySelectorAll('input[name="share-friend"]:checked')].map(cb => cb.value);
    if (checked.length === 0) { showToast('Selecciona al menos un amigo.', 'error'); return; }

    checked.forEach(email => {
        sharedActivitiesDB.push({
            id: 'sa' + Date.now() + Math.random(),
            title: act.title,
            desc: act.desc,
            date: act.date,
            time: act.time,
            category: act.category,
            priority: act.priority,
            participants: [currentUser.email, email],
            completedBy: []
        });
    });
    closeModal();
    showToast(`Actividad compartida con ${checked.length} amigo(s) 🔗`, 'success');
}

// ================= EDITAR PERFIL MODAL =================
function openEditProfileModal() {
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h3>✏️ Editar Datos Personales</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <form id="edit-profile-form">
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="ep-name" value="${currentUser.name}" required>
                </div>
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" id="ep-email" value="${currentUser.email}" required>
                </div>
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="tel" id="ep-phone" value="${currentUser.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Descripción (Bio)</label>
                    <textarea id="ep-bio" rows="2" placeholder="Cuéntanos algo sobre ti...">${currentUser.bio || ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Nueva contraseña (dejar vacío = no cambiar)</label>
                    <input type="password" id="ep-pass" placeholder="••••••••">
                </div>
                <button type="submit" class="btn btn-primary" style="margin-top:8px;">Guardar</button>
            </form>
        </div>
    `;
    modal.classList.remove("hidden");
    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const oldEmail = currentUser.email;
        const newEmail = document.getElementById("ep-email").value.trim();
        const newPass  = document.getElementById("ep-pass").value;
        currentUser.name  = document.getElementById("ep-name").value.trim();
        currentUser.email = newEmail;
        currentUser.phone = document.getElementById("ep-phone").value.trim();
        currentUser.bio   = document.getElementById("ep-bio").value.trim();
        if (newPass) currentUser.pass = newPass;
        // Sincronizar en usersDB
        const idx = usersDB.findIndex(u => u.email === oldEmail);
        if (idx !== -1) usersDB[idx] = { ...currentUser };
        closeModal();
        showToast("Perfil actualizado ✅", "success");
        renderActiveSection();
    });
}

// ================= CAMBIAR FOTO DE PERFIL =================
function changeProfilePhoto(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        currentUser.avatarImg = e.target.result;
        // Actualizar en usersDB
        const idx = usersDB.findIndex(u => u.email === currentUser.email);
        if (idx !== -1) usersDB[idx].avatarImg = e.target.result;
        // Actualizar solo el avatar en pantalla sin re-render completo
        const el = document.getElementById('profile-avatar-display');
        if (el) el.innerHTML = `<img src="${e.target.result}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;" alt="foto">`;
        showToast('Foto actualizada 📷', 'success');
    };
    reader.readAsDataURL(file);
}

// ================= DESCARGAR CALENDARIO =================
function downloadCalendar() {
    const userActs = activitiesDB.filter(a => a.owner === currentUser.email);
    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PlanificaPlus//ES\n`;
    userActs.forEach(act => {
        const dt = (act.date || '2026-01-01').replace(/-/g,'');
        const tm = (act.time || '08:00').replace(':','') + '00';
        ics += `BEGIN:VEVENT\nSUMMARY:${act.title}\nDTSTART:${dt}T${tm}\nDESCRIPTION:${act.desc}\nEND:VEVENT\n`;
    });
    ics += `END:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'planifica_plus_calendario.ics';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calendario descargado ⬇️', 'success');
}

// ================= FAQ MODAL =================
const faqData = [
    { q: '¿Cómo edito una actividad?', a: 'En la lista de actividades, pulsa el ícono ✏️ en la tarjeta que deseas editar. Se abrirá un formulario con todos sus datos listos para modificar.' },
    { q: '¿Qué hace el botón de duplicar 📋?', a: 'Crea una copia de la actividad en una nueva fecha que tú eliges. También puedes repetirla semanalmente, diario por 7 días, o en múltiples fechas específicas. Ideal para actividades que haces todos los lunes.' },
    { q: '¿Cómo comparto una actividad con un amigo?', a: 'Pulsa el ícono 📤 en la tarjeta de actividad. Se mostrarán tus amigos aceptados para que elijas con quién compartirla. La actividad aparecerá como sincronizada en la sección Amigos.' },
    { q: '¿Cómo agrego amigos?', a: 'Ve a la pestaña Amigos y escribe el correo de tu amigo en el campo "Agregar amigo". El sistema enviará una solicitud; cuando la acepte aparecerá en tu lista.' },
    { q: '¿Cómo descargo el calendario?', a: 'En la sección Calendario, pulsa el botón ⬇️ Descargar. Se descargará un archivo .ics compatible con Google Calendar, Apple Calendar y Outlook.' },
    { q: '¿Cómo activo el modo oscuro?', a: 'Pulsa el ícono 🌙 en la parte superior derecha del encabezado. El modo se guardará para tu próxima visita.' },
    { q: '¿Puedo deshacer la eliminación de una actividad?', a: 'Sí. Pulsa el botón ↩️ (Deshacer) en el encabezado inmediatamente después de eliminar. Se restaurará la actividad con todos sus datos.' },
    { q: '¿Cómo cambio mi foto de perfil?', a: 'En la sección Perfil, pulsa el ícono 📷 que aparece sobre tu avatar. Puedes seleccionar cualquier imagen de tu dispositivo.' },
    { q: '¿Qué son las actividades sincronizadas?', a: 'Son actividades compartidas con amigos donde ambos marcan su progreso. Puedes ver en tiempo real si tu amigo completó su parte o no.' },
    { q: '¿El cronómetro y Pomodoro siguen funcionando si cambio de sección?', a: 'Sí, el estado del temporizador se mantiene en memoria mientras la app está abierta. Si recargas la página se reiniciará.' },
];

function openFAQModal() {
    const modal = document.getElementById("modal-container");
    modal.innerHTML = `
        <div class="modal-box" style="max-height:80vh;overflow-y:auto;">
            <div class="modal-header">
                <h3>❓ Preguntas Frecuentes</h3>
                <button class="close-modal" onclick="closeModal()">×</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:4px;">
                ${faqData.map((item, i) => `
                    <div class="faq-item" onclick="toggleFAQ(${i})">
                        <div class="faq-question">
                            <span>${item.q}</span>
                            <span class="faq-arrow" id="faq-arrow-${i}">▾</span>
                        </div>
                        <div class="faq-answer hidden" id="faq-answer-${i}">${item.a}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    modal.classList.remove("hidden");
}

function toggleFAQ(i) {
    const answer = document.getElementById(`faq-answer-${i}`);
    const arrow  = document.getElementById(`faq-arrow-${i}`);
    if (answer) {
        const isHidden = answer.classList.toggle('hidden');
        if (arrow) arrow.style.transform = isHidden ? '' : 'rotate(180deg)';
    }
}

// ================= MÓDULO DE ACCESIBILIDAD =================

// ---- TAMAÑO DE FUENTE ----
function setFontSize(size) {
    a11y.fontSize = size;
    // Aplicar font-size base al contenedor raíz de la app.
    // Todos los tamaños internos que usan rem/em lo heredarán.
    const scaleMap = { small: '13px', normal: '16px', large: '19px', xlarge: '22px' };
    const px = scaleMap[size] || '16px';
    const viewport = document.getElementById('main-app-viewport');
    if (viewport) {
        viewport.style.fontSize = px;
        // Forzar herencia en todos los hijos que usan rem (rem es relativo al <html>,
        // así que también actualizamos el font-size del root para que rem lo refleje)
        document.documentElement.style.fontSize = px;
    }
    const label = { small: 'Pequeña', normal: 'Normal', large: 'Grande', xlarge: 'Muy grande' }[size];
    showToast(`Fuente ajustada: ${label}`, 'success');
    // Re-render perfil para actualizar botones activos
    if (currentMainTab === 'perfil') renderActiveSection();
}

// ---- LECTURA EN VOZ ALTA (TTS) + CLICK-TO-SPEAK ----
function toggleTTS() {
    if (!a11y.synthesis) {
        showToast('Síntesis de voz no disponible en este navegador.', 'error');
        return;
    }
    a11y.ttsActive = !a11y.ttsActive;
    if (!a11y.ttsActive) {
        stopSpeaking();
        removeClickToSpeak();
    } else {
        const container = document.getElementById('app-dynamic-content');
        if (container) bindClickToSpeak(container);
        showToast('TTS activado — toca cualquier elemento para escucharlo 🔊', 'success');
    }
    renderActiveSection();
}

// Registra listener de clic en todos los elementos interactivos/textuales del contenedor
function bindClickToSpeak(container) {
    // Remover listeners previos para evitar duplicados
    removeClickToSpeak();

    a11y._clickHandler = (e) => {
        // Ignorar clics en botones funcionales para no interferir
        const ignoreTags = ['INPUT', 'SELECT', 'TEXTAREA'];
        if (ignoreTags.includes(e.target.tagName)) return;

        // Buscar el texto más relevante del elemento o su ancestro más cercano con texto
        let el = e.target;
        let text = '';

        // Subir hasta encontrar un contenedor con texto significativo
        for (let i = 0; i < 4; i++) {
            const candidate = el.innerText || el.textContent || '';
            const cleaned = candidate.replace(/[^\p{L}\p{N}\s.,;:!?()-]/gu, ' ').replace(/\s+/g, ' ').trim();
            if (cleaned.length > 3) { text = cleaned.slice(0, 250); break; }
            if (el.parentElement) el = el.parentElement; else break;
        }

        if (!text) return;

        stopSpeaking();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 1.0;
        a11y.synthesis.speak(u);

        // Resaltar visualmente el elemento tocado
        highlightElement(e.target);
    };

    container.addEventListener('click', a11y._clickHandler, true);
}

function removeClickToSpeak() {
    const container = document.getElementById('app-dynamic-content');
    if (container && a11y._clickHandler) {
        container.removeEventListener('click', a11y._clickHandler, true);
        a11y._clickHandler = null;
    }
}

function highlightElement(el) {
    // Resalte visual temporal del elemento tocado
    const prev = el.style.outline;
    const prevBg = el.style.backgroundColor;
    el.style.outline = '2px solid var(--primary-color)';
    el.style.backgroundColor = '#e6f9f0';
    setTimeout(() => {
        el.style.outline = prev;
        el.style.backgroundColor = prevBg;
    }, 600);
}

function speakCurrentContent() {
    if (!a11y.synthesis) return;
    stopSpeaking();

    // Recopilar texto legible del contenido activo
    const contentEl = document.getElementById('app-dynamic-content');
    if (!contentEl) return;

    const rawText = contentEl.innerText || contentEl.textContent || '';
    // Limpiar emojis y caracteres especiales para TTS más limpio
    const cleanText = rawText.replace(/[^\p{L}\p{N}\s.,;:!?()-]/gu, ' ').replace(/\s+/g, ' ').trim();

    if (!cleanText) {
        showToast('No hay texto para leer.', 'error');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onstart = () => showToast('Leyendo pantalla…', 'success');
    utterance.onend = () => showToast('Lectura finalizada.', 'success');
    a11y.synthesis.speak(utterance);
}

function stopSpeaking() {
    if (a11y.synthesis && a11y.synthesis.speaking) {
        a11y.synthesis.cancel();
    }
}

// ---- CONTROL POR VOZ (STT) ----
function toggleVoiceControl() {
    if (a11y.voiceControl) {
        stopVoiceControl();
    } else {
        startVoiceControl();
    }
}

function startVoiceControl() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        showToast('Reconocimiento de voz no disponible en este navegador.', 'error');
        return;
    }

    a11y.recognition = new SpeechRecognition();
    a11y.recognition.lang = 'es-ES';
    a11y.recognition.continuous = true;
    a11y.recognition.interimResults = false;

    a11y.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        handleVoiceCommand(transcript);
    };

    a11y.recognition.onerror = (e) => {
        if (e.error !== 'no-speech') {
            showToast(`Error de voz: ${e.error}`, 'error');
            stopVoiceControl();
        }
    };

    a11y.recognition.onend = () => {
        // Reiniciar si sigue activo (sesión corta del navegador)
        if (a11y.voiceControl) a11y.recognition.start();
    };

    a11y.recognition.start();
    a11y.voiceControl = true;
    showToast('Control por voz activado 🎙️', 'success');
    renderActiveSection();
}

function stopVoiceControl() {
    if (a11y.recognition) {
        a11y.recognition.onend = null; // Evitar reinicio automático
        a11y.recognition.stop();
        a11y.recognition = null;
    }
    a11y.voiceControl = false;
    showToast('Control por voz desactivado.', 'success');
    renderActiveSection();
}

function handleVoiceCommand(transcript) {
    const statusEl = document.getElementById('voice-status-text');
    if (statusEl) statusEl.textContent = `"${transcript}"`;

    const commands = {
        'ir a lista':        () => switchMainTab('lista'),
        'lista':             () => switchMainTab('lista'),
        'ir a calendario':   () => switchMainTab('calendario'),
        'calendario':        () => switchMainTab('calendario'),
        'ir a logros':       () => switchMainTab('logros'),
        'logros':            () => switchMainTab('logros'),
        'ir a herramientas': () => switchMainTab('herramientas'),
        'herramientas':      () => switchMainTab('herramientas'),
        'ir a perfil':       () => switchMainTab('perfil'),
        'perfil':            () => switchMainTab('perfil'),
        'ir a amigos':       () => switchMainTab('amigos'),
        'amigos':            () => switchMainTab('amigos'),
        'nueva actividad':   () => { switchMainTab('lista'); setTimeout(openActivityModal, 300); },
        'agregar actividad': () => { switchMainTab('lista'); setTimeout(openActivityModal, 300); },
        'cerrar sesión':     () => handleLogout(),
        'leer pantalla':     () => speakCurrentContent(),
    };

    let matched = false;
    for (const [key, action] of Object.entries(commands)) {
        if (transcript.includes(key)) {
            showToast(`Comando: "${key}"`, 'success');
            action();
            matched = true;
            break;
        }
    }
    if (!matched) {
        showToast(`No reconocí: "${transcript}"`, 'error');
    }
}