/**
 * Vistas del rol PROVEEDOR
 * Validación de QR y confirmación de utilización (HU-013, HU-014)
 */

const ProviderViews = {
  validar() {
    return `
      <div class="toolbar"><h3>Validar beneficio</h3></div>
      <div class="card">
        <p style="margin-bottom:16px;color:var(--text-secondary);font-size:0.9rem">
          Ingrese o pegue el código QR presentado por el miembro, o use el token de la última generación de demo.
        </p>
        <div class="form-group">
          <label>Código / token de validación</label>
          <input type="text" id="input-qr-token" placeholder="QR-..." autocomplete="off" />
        </div>
        <button class="btn btn-primary btn-block" id="btn-validar-qr">
          <span class="material-icons">qr_code_scanner</span> Validar
        </button>
        <button class="btn btn-outline btn-block" style="margin-top:8px" id="btn-usar-ultimo">
          Usar último token generado (demo)
        </button>
      </div>
      <div id="resultado-validacion"></div>
    `;
  },

  bindValidar() {
    document.getElementById('btn-validar-qr')?.addEventListener('click', () => {
      const token = document.getElementById('input-qr-token').value.trim();
      if (!token) return showToast('Ingrese el código de validación');
      this._ejecutarValidacion(token);
    });

    document.getElementById('btn-usar-ultimo')?.addEventListener('click', () => {
      const raw = sessionStorage.getItem('qr_token');
      if (!raw) {
        showToast('No hay token reciente. Genere un QR desde el usuario miembro.');
        return;
      }
      try {
        const data = JSON.parse(raw);
        document.getElementById('input-qr-token').value = data.token;
        this._ejecutarValidacion(data.token);
      } catch (_) {
        showToast('Token inválido');
      }
    });
  },

  /**
   * Lógica de validación centralizada (replica las reglas de la API del TFG)
   * - Credencial habilitada
   * - Membresía activa y vigente
   * - Beneficio vigente y habilitado para el tipo de membresía
   * - Límite de utilizaciones no superado
   */
  _ejecutarValidacion(token) {
    const container = document.getElementById('resultado-validacion');
    const raw = sessionStorage.getItem('qr_token');
    let payload = null;

    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.token === token) payload = data;
      } catch (_) {}
    }

    // Si no coincide con el último, intentamos parsear el formato QR-{credId}-{benId}-...
    if (!payload) {
      const parts = token.split('-');
      if (parts.length >= 3 && parts[0] === 'QR') {
        payload = {
          credencialId: Number(parts[1]),
          beneficioId: Number(parts[2]),
          token
        };
      }
    }

    if (!payload) {
      container.innerHTML = this._renderFail('Código QR no reconocido o expirado.');
      return;
    }

    const cred = MOCK.credenciales.find(c => c.id === payload.credencialId);
    if (!cred) {
      container.innerHTML = this._renderFail('Credencial no encontrada.');
      return;
    }

    const miembro = getMiembro(cred.miembroId);
    const memb = getMembresiaByMiembro(cred.miembroId);
    const beneficio = getBeneficio(payload.beneficioId);

    // 1. Credencial habilitada
    if (cred.estado !== 'HABILITADA') {
      this._registrarRechazo(miembro?.id, beneficio?.id, 'Credencial deshabilitada');
      container.innerHTML = this._renderFail('La credencial digital está deshabilitada.', miembro, beneficio, memb);
      return;
    }

    // 2. Membresía activa y vigente
    if (!memb || !isMembresiaVigente(memb)) {
      const motivo = !memb ? 'Sin membresía' :
        memb.estado !== 'ACTIVA' ? `Membresía ${memb.estado.toLowerCase()}` : 'Membresía fuera de vigencia';
      this._registrarRechazo(miembro?.id, beneficio?.id, motivo);
      container.innerHTML = this._renderFail(motivo, miembro, beneficio, memb);
      return;
    }

    // 3. Beneficio válido
    if (!beneficio || beneficio.estado !== 'ACTIVO') {
      this._registrarRechazo(miembro?.id, beneficio?.id, 'Beneficio no disponible');
      container.innerHTML = this._renderFail('El beneficio no está disponible.', miembro, beneficio, memb);
      return;
    }

    const hoy = todayISO();
    if (beneficio.fechaInicio > hoy || beneficio.fechaFin < hoy) {
      this._registrarRechazo(miembro?.id, beneficio?.id, 'Beneficio fuera de vigencia');
      container.innerHTML = this._renderFail('El beneficio está fuera de su período de vigencia.', miembro, beneficio, memb);
      return;
    }

    if (!beneficio.tiposMembresiaIds.includes(memb.tipoMembresiaId)) {
      this._registrarRechazo(miembro?.id, beneficio?.id, 'Tipo de membresía no admitido');
      container.innerHTML = this._renderFail('El beneficio no está habilitado para este tipo de membresía.', miembro, beneficio, memb);
      return;
    }

    // 4. Límite de utilización
    const usadas = countUtilizaciones(miembro.id, beneficio.id);
    if (beneficio.limiteUtilizacion != null && usadas >= beneficio.limiteUtilizacion) {
      this._registrarRechazo(miembro.id, beneficio.id, 'Límite de utilización alcanzado');
      container.innerHTML = this._renderFail('Se alcanzó el límite de utilizaciones del beneficio.', miembro, beneficio, memb);
      return;
    }

    // Validación OK
    const tipo = getTipoMembresia(memb.tipoMembresiaId);
    const prov = Auth.getProveedorActual();

    container.innerHTML = `
      <div class="card validation-result ok">
        <div class="icon-big"><span class="material-icons">check_circle</span></div>
        <h3>Validación satisfactoria</h3>
        <p>El beneficio puede ser utilizado</p>
        <div class="validation-details">
          <div class="row"><span class="label">Miembro</span><span>${miembro.nombre} ${miembro.apellido}</span></div>
          <div class="row"><span class="label">Nº miembro</span><span>${miembro.numero}</span></div>
          <div class="row"><span class="label">Tipo membresía</span><span>${tipo?.nombre || '—'}</span></div>
          <div class="row"><span class="label">Beneficio</span><span>${beneficio.nombre}</span></div>
          <div class="row"><span class="label">Usos previos</span><span>${usadas}${beneficio.limiteUtilizacion != null ? ' / ' + beneficio.limiteUtilizacion : ''}</span></div>
        </div>
        ${beneficio.condicionesParticulares ? `
          <div class="card" style="background:#fff8e1;text-align:left;margin-bottom:16px">
            <strong style="font-size:0.85rem">Condiciones particulares</strong>
            <p style="font-size:0.9rem;margin-top:4px">${beneficio.condicionesParticulares}</p>
          </div>` : ''}
        <button class="btn btn-accent btn-block" id="btn-confirmar-uso">
          <span class="material-icons">done_all</span> Confirmar utilización
        </button>
      </div>
    `;

    document.getElementById('btn-confirmar-uso').onclick = () => {
      MOCK.utilizaciones.push({
        id: nextIds.utilizacion++,
        miembroId: miembro.id,
        beneficioId: beneficio.id,
        proveedorId: prov?.id || beneficio.proveedorId,
        fechaHora: new Date().toISOString(),
        resultado: 'CONFIRMADA',
        motivo: null
      });
      // Invalidar token usado
      sessionStorage.removeItem('qr_token');
      showToast('Utilización registrada correctamente');
      container.innerHTML = `
        <div class="card validation-result ok">
          <div class="icon-big"><span class="material-icons">task_alt</span></div>
          <h3>Utilización confirmada</h3>
          <div class="validation-details">
            <div class="row"><span class="label">Miembro</span><span>${miembro.nombre} ${miembro.apellido}</span></div>
            <div class="row"><span class="label">Beneficio</span><span>${beneficio.nombre}</span></div>
            <div class="row"><span class="label">Proveedor</span><span>${prov?.nombre || '—'}</span></div>
            <div class="row"><span class="label">Fecha y hora</span><span>${formatDateTime(new Date().toISOString())}</span></div>
          </div>
          <button class="btn btn-outline btn-block" onclick="App.navigate('validar')">Nueva validación</button>
        </div>
      `;
    };
  },

  _registrarRechazo(miembroId, beneficioId, motivo) {
    if (!miembroId || !beneficioId) return;
    const prov = Auth.getProveedorActual();
    MOCK.utilizaciones.push({
      id: nextIds.utilizacion++,
      miembroId,
      beneficioId,
      proveedorId: prov?.id || 1,
      fechaHora: new Date().toISOString(),
      resultado: 'RECHAZADA',
      motivo
    });
  },

  _renderFail(mensaje, miembro, beneficio, memb) {
    return `
      <div class="card validation-result fail">
        <div class="icon-big"><span class="material-icons">cancel</span></div>
        <h3>Validación rechazada</h3>
        <p>${mensaje}</p>
        ${miembro ? `
          <div class="validation-details">
            <div class="row"><span class="label">Miembro</span><span>${miembro.nombre} ${miembro.apellido}</span></div>
            ${memb ? `<div class="row"><span class="label">Estado memb.</span><span>${memb.estado}</span></div>` : ''}
            ${beneficio ? `<div class="row"><span class="label">Beneficio</span><span>${beneficio.nombre}</span></div>` : ''}
          </div>` : ''}
      </div>`;
  }
};
