/**
 * Aplicación principal – enrutamiento por rol y navegación
 * Replica los flujos del TFG: organización, miembro y proveedor.
 */

const App = {
  routes: {
    ORGANIZACION: [
      { id: 'miembros', label: 'Miembros', icon: 'people', title: 'Gestión de miembros' },
      { id: 'tipos', label: 'Tipos de membresía', icon: 'loyalty', title: 'Tipos de membresía' },
      { id: 'beneficios', label: 'Beneficios', icon: 'local_offer', title: 'Gestión de beneficios' },
      { id: 'utilizaciones', label: 'Utilizaciones', icon: 'receipt_long', title: 'Utilizaciones registradas' }
    ],
    MIEMBRO: [
      { id: 'inicio', label: 'Inicio', icon: 'home', title: 'Mi cuenta' },
      { id: 'credencial', label: 'Mi credencial', icon: 'badge', title: 'Credencial digital' },
      { id: 'beneficios-miembro', label: 'Beneficios', icon: 'local_offer', title: 'Beneficios disponibles' },
      { id: 'historial', label: 'Historial', icon: 'history', title: 'Mi historial' }
    ],
    PROVEEDOR: [
      { id: 'validar', label: 'Validar QR', icon: 'qr_code_scanner', title: 'Validar beneficio' }
    ]
  },

  init() {
    // Login form
    document.getElementById('form-login').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const result = Auth.login(username, password);
      const errEl = document.getElementById('login-error');
      if (!result.ok) {
        errEl.textContent = result.error;
        errEl.classList.remove('hidden');
        return;
      }
      errEl.classList.add('hidden');
      this.showApp();
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
      Auth.logout();
      this.showLogin();
    });

    document.getElementById('btn-menu').addEventListener('click', () => this.toggleNav(true));
    document.getElementById('nav-overlay').addEventListener('click', () => this.toggleNav(false));

    // Restaurar sesión si existe
    if (Auth.restore()) {
      this.showApp();
    } else {
      this.showLogin();
    }
  },

  showLogin() {
    document.getElementById('view-login').classList.add('active');
    document.getElementById('view-app').classList.remove('active');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  },

  showApp() {
    document.getElementById('view-login').classList.remove('active');
    document.getElementById('view-app').classList.add('active');

    const user = Auth.currentUser;
    document.getElementById('nav-user-name').textContent = user.nombre;
    document.getElementById('nav-user-role').textContent = this._roleLabel(user.rol);

    this._buildNav();
    const first = this.routes[user.rol][0];
    this.navigate(first.id);
  },

  _roleLabel(rol) {
    return { ORGANIZACION: 'Organización', MIEMBRO: 'Miembro', PROVEEDOR: 'Proveedor' }[rol] || rol;
  },

  _buildNav() {
    const links = this.routes[Auth.role()] || [];
    const ul = document.getElementById('nav-links');
    ul.innerHTML = links.map(r => `
      <li>
        <a href="#" data-route="${r.id}">
          <span class="material-icons">${r.icon}</span>
          ${r.label}
        </a>
      </li>
    `).join('');

    ul.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigate(a.dataset.route);
        this.toggleNav(false);
      });
    });
  },

  toggleNav(open) {
    document.getElementById('side-nav').classList.toggle('open', open);
    document.getElementById('nav-overlay').classList.toggle('open', open);
  },

  navigate(routeId) {
    const role = Auth.role();
    const route = (this.routes[role] || []).find(r => r.id === routeId);
    if (!route) return;

    document.getElementById('header-title').textContent = route.title;

    // Marcar activo en nav
    document.querySelectorAll('#nav-links a').forEach(a => {
      a.classList.toggle('active', a.dataset.route === routeId);
    });

    const main = document.getElementById('main-content');
    let html = '';
    let bind = null;

    if (role === 'ORGANIZACION') {
      switch (routeId) {
        case 'miembros':
          html = OrgViews.miembros();
          bind = () => OrgViews.bindMiembros();
          break;
        case 'tipos':
          html = OrgViews.tipos();
          bind = () => OrgViews.bindTipos();
          break;
        case 'beneficios':
          html = OrgViews.beneficios();
          bind = () => OrgViews.bindBeneficios();
          break;
        case 'utilizaciones':
          html = OrgViews.utilizaciones();
          bind = () => OrgViews.bindUtilizaciones();
          break;
      }
    } else if (role === 'MIEMBRO') {
      switch (routeId) {
        case 'inicio':
          html = MemberViews.inicio();
          bind = () => MemberViews.bindInicio();
          break;
        case 'credencial':
          html = MemberViews.credencial();
          bind = () => MemberViews.bindCredencial();
          break;
        case 'beneficios-miembro':
          html = MemberViews.beneficios();
          bind = () => MemberViews.bindBeneficios();
          break;
        case 'historial':
          html = MemberViews.historial();
          bind = () => MemberViews.bindHistorial();
          break;
      }
    } else if (role === 'PROVEEDOR') {
      if (routeId === 'validar') {
        html = ProviderViews.validar();
        bind = () => ProviderViews.bindValidar();
      }
    }

    main.innerHTML = html;
    if (bind) bind();
  }
};

// Arranque
document.addEventListener('DOMContentLoaded', () => App.init());
