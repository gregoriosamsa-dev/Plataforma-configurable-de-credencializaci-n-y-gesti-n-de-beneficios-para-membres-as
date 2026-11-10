/**
 * Utilidades generales
 */

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function showToast(msg, duration = 2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), duration);
}

function openModal(title, bodyHtml, footerHtml = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHtml;
  document.getElementById('modal-footer').innerHTML = footerHtml;
  document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
}

document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

/** Evalúa si una membresía está vigente hoy */
function isMembresiaVigente(membresia) {
  if (!membresia) return false;
  if (membresia.estado !== 'ACTIVA') return false;
  const hoy = todayISO();
  return membresia.fechaInicio <= hoy && membresia.fechaFin >= hoy;
}

/** Cuenta utilizaciones confirmadas de un miembro para un beneficio */
function countUtilizaciones(miembroId, beneficioId) {
  return MOCK.utilizaciones.filter(
    u => u.miembroId === miembroId && u.beneficioId === beneficioId && u.resultado === 'CONFIRMADA'
  ).length;
}

/** Genera un identificador de validación único para el QR */
function generateValidationToken(credencialId, beneficioId) {
  const ts = Date.now().toString(36);
  return `QR-${credencialId}-${beneficioId}-${ts}`;
}

/** Busca entidades relacionadas */
function getTipoMembresia(id) {
  return MOCK.tiposMembresia.find(t => t.id === id);
}
function getMiembro(id) {
  return MOCK.miembros.find(m => m.id === id);
}
function getMembresiaByMiembro(miembroId) {
  return MOCK.membresias.find(m => m.miembroId === miembroId);
}
function getCredencialByMiembro(miembroId) {
  return MOCK.credenciales.find(c => c.miembroId === miembroId);
}
function getProveedor(id) {
  return MOCK.proveedores.find(p => p.id === id);
}
function getBeneficio(id) {
  return MOCK.beneficios.find(b => b.id === id);
}

function badgeEstadoMembresia(estado) {
  const map = {
    ACTIVA: 'badge-success',
    SUSPENDIDA: 'badge-warning',
    VENCIDA: 'badge-danger'
  };
  return `<span class="badge ${map[estado] || 'badge-neutral'}">${estado}</span>`;
}

function badgeEstadoCredencial(estado) {
  const map = {
    HABILITADA: 'badge-success',
    DESHABILITADA: 'badge-danger'
  };
  return `<span class="badge ${map[estado] || 'badge-neutral'}">${estado}</span>`;
}

function badgeResultado(resultado) {
  const map = {
    CONFIRMADA: 'badge-success',
    RECHAZADA: 'badge-danger'
  };
  return `<span class="badge ${map[resultado] || 'badge-neutral'}">${resultado}</span>`;
}

function initials(nombre, apellido) {
  return ((nombre?.[0] || '') + (apellido?.[0] || '')).toUpperCase();
}
