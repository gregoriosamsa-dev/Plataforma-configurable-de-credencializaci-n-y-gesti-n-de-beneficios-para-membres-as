/**
 * Autenticación y sesión (mock)
 */

const Auth = {
  currentUser: null,

  login(username, password) {
    const user = MOCK.usuarios.find(
      u => u.username === username && u.password === password
    );
    if (!user) return { ok: false, error: 'Credenciales no válidas' };
    this.currentUser = { ...user };
    delete this.currentUser.password;
    sessionStorage.setItem('session', JSON.stringify(this.currentUser));
    return { ok: true, user: this.currentUser };
  },

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('session');
  },

  restore() {
    try {
      const raw = sessionStorage.getItem('session');
      if (raw) {
        this.currentUser = JSON.parse(raw);
        return true;
      }
    } catch (_) {}
    return false;
  },

  isLoggedIn() {
    return !!this.currentUser;
  },

  role() {
    return this.currentUser?.rol || null;
  },

  /** Obtiene el miembro asociado al usuario logueado (si es MIEMBRO) */
  getMiembroActual() {
    if (!this.currentUser || this.currentUser.rol !== 'MIEMBRO') return null;
    return getMiembro(this.currentUser.miembroId);
  },

  getProveedorActual() {
    if (!this.currentUser || this.currentUser.rol !== 'PROVEEDOR') return null;
    return getProveedor(this.currentUser.proveedorId);
  }
};
