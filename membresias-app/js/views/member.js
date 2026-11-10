/**
 * Vistas del rol MIEMBRO
 */

const MemberViews = {
  /** Inicio del miembro (HU-003, HU-006) */
  inicio() {
    const m = Auth.getMiembroActual();
    if (!m) return '<p>Error: no se encontró el miembro</p>';
    const memb = getMembresiaByMiembro(m.id);
    const tipo = memb ? getTipoMembresia(memb.tipoMembresiaId) : null;
    const cred = getCredencialByMiembro(m.id);

    return `
      <div class="card">
        <div class="card-title"><span class="material-icons">person</span> Mis datos</div>
        <div class="info-grid">
          <div class="info-box"><div class="label">Nombre</div><div class="value">${m.nombre} ${m.apellido}</div></div>
          <div class="info-box"><div class="label">Número de miembro</div><div class="value">${m.numero}</div></div>
          <div class="info-box"><div class="label">Documento</div><div class="value">${m.tipoDocumento} ${m.numeroDocumento}</div></div>
          <div class="info-box"><div class="label">Email</div><div class="value">${m.email || '—'}</div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span class="material-icons">card_membership</span> Mi membresía</div>
        ${memb ? `
          <div class="info-grid">
            <div class="info-box"><div class="label">Tipo</div><div class="value">${tipo?.nombre || '—'}</div></div>
            <div class="info-box"><div class="label">Estado</div><div class="value">${badgeEstadoMembresia(memb.estado)}</div></div>
            <div class="info-box"><div class="label">Inicio</div><div class="value">${formatDate(memb.fechaInicio)}</div></div>
            <div class="info-box"><div class="label">Fin</div><div class="value">${formatDate(memb.fechaFin)}</div></div>
          </div>
        ` : '<p>No tiene membresía asignada</p>'}
      </div>

      <div class="card">
        <div class="card-title"><span class="material-icons">qr_code_2</span> Credencial digital</div>
        <p>Estado: ${cred ? badgeEstadoCredencial(cred.estado) : '—'}</p>
        <button class="btn btn-primary btn-block" style="margin-top:12px" id="btn-ver-credencial"
          ${!cred || cred.estado !== 'HABILITADA' ? 'disabled' : ''}>
          <span class="material-icons">badge</span>
          ${cred?.estado === 'HABILITADA' ? 'Ver mi credencial' : 'Credencial no disponible'}
        </button>
      </div>
    `;
  },

  bindInicio() {
    document.getElementById('btn-ver-credencial')?.addEventListener('click', () => {
      App.navigate('credencial');
    });
  },

  /** Credencial digital del miembro (HU-008) */
  credencial() {
    const m = Auth.getMiembroActual();
    const memb = getMembresiaByMiembro(m.id);
    const tipo = memb ? getTipoMembresia(memb.tipoMembresiaId) : null;
    const cred = getCredencialByMiembro(m.id);

    if (!cred || cred.estado !== 'HABILITADA') {
      return `
        <div class="card empty-state">
          <span class="material-icons">block</span>
          <p>La credencial digital no se encuentra disponible para su utilización.</p>
          <button class="btn btn-outline" onclick="App.navigate('inicio')">Volver</button>
        </div>`;
    }

    return `
      <div class="credential-card">
        <div class="org-name">${MOCK.organizacion.nombre}</div>
        <div class="member-name">${m.nombre} ${m.apellido}</div>
        <div class="member-id">Nº ${m.numero}</div>
        <div class="meta">
          <div><span>Tipo</span>${tipo?.nombre || '—'}</div>
          <div><span>Vigencia</span>${formatDate(memb.fechaInicio)} – ${formatDate(memb.fechaFin)}</div>
          <div><span>Estado memb.</span>${memb.estado}</div>
        </div>
        <div class="status-row">
          <div class="credential-status enabled">
            <span class="material-icons" style="font-size:16px">check_circle</span>
            Credencial habilitada
          </div>
        </div>
      </div>
      <p style="text-align:center;margin:16px 0;color:var(--text-secondary);font-size:0.85rem">
        Presente esta credencial o genere un código QR al utilizar un beneficio.
      </p>
      <button class="btn btn-primary btn-block" id="btn-ir-beneficios">
        <span class="material-icons">local_offer</span> Ver beneficios disponibles
      </button>
    `;
  },

  bindCredencial() {
    document.getElementById('btn-ir-beneficios')?.addEventListener('click', () => {
      App.navigate('beneficios-miembro');
    });
  },

  /** Consulta de beneficios disponibles (HU-011) */
  beneficios() {
    const m = Auth.getMiembroActual();
    const memb = getMembresiaByMiembro(m.id);
    if (!memb || !isMembresiaVigente(memb)) {
      return `
        <div class="card empty-state">
          <span class="material-icons">info</span>
          <p>No tiene una membresía activa y vigente para consultar beneficios.</p>
        </div>`;
    }

    const hoy = todayISO();
    const disponibles = MOCK.beneficios.filter(b =>
      b.estado === 'ACTIVO' &&
      b.fechaInicio <= hoy &&
      b.fechaFin >= hoy &&
      b.tiposMembresiaIds.includes(memb.tipoMembresiaId)
    );

    if (disponibles.length === 0) {
      return `
        <div class="card empty-state">
          <span class="material-icons">local_offer</span>
          <p>No hay beneficios disponibles para su tipo de membresía en este momento.</p>
        </div>`;
    }

    const list = disponibles.map(b => {
      const prov = getProveedor(b.proveedorId);
      const usadas = countUtilizaciones(m.id, b.id);
      const limiteTxt = b.limiteUtilizacion != null
        ? `${usadas}/${b.limiteUtilizacion} usos`
        : 'Sin límite';
      return `
        <div class="list-item" data-id="${b.id}">
          <div class="avatar"><span class="material-icons">local_offer</span></div>
          <div class="info">
            <strong>${b.nombre}</strong>
            <span>${prov?.nombre || '—'} · ${limiteTxt}</span>
          </div>
          <span class="material-icons" style="color:var(--text-secondary)">chevron_right</span>
        </div>`;
    }).join('');

    return `
      <div class="toolbar"><h3>Beneficios disponibles</h3></div>
      <div class="card" id="lista-ben-miembro">${list}</div>`;
  },

  bindBeneficios() {
    document.querySelectorAll('#lista-ben-miembro .list-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.dataset.id);
        this._detalleBeneficio(id);
      });
    });
  },

  _detalleBeneficio(beneficioId) {
    const m = Auth.getMiembroActual();
    const b = getBeneficio(beneficioId);
    const prov = getProveedor(b.proveedorId);
    const usadas = countUtilizaciones(m.id, b.id);
    const limiteOk = b.limiteUtilizacion == null || usadas < b.limiteUtilizacion;

    openModal(
      b.nombre,
      `
      <p>${b.descripcion}</p>
      <div class="info-grid" style="margin-top:12px">
        <div class="info-box"><div class="label">Proveedor</div><div class="value">${prov?.nombre || '—'}</div></div>
        <div class="info-box"><div class="label">Vigencia</div><div class="value">${formatDate(b.fechaInicio)} – ${formatDate(b.fechaFin)}</div></div>
        <div class="info-box"><div class="label">Usos</div><div class="value">${b.limiteUtilizacion != null ? usadas + ' / ' + b.limiteUtilizacion : 'Sin límite'}</div></div>
      </div>
      ${b.condicionesParticulares ? `
        <div class="card" style="margin-top:12px;background:#fff8e1">
          <strong style="font-size:0.85rem">Condiciones</strong>
          <p style="font-size:0.9rem;margin-top:4px">${b.condicionesParticulares}</p>
        </div>` : ''}
      `,
      limiteOk
        ? `<button class="btn btn-primary" id="btn-generar-qr">
             <span class="material-icons">qr_code</span> Utilizar (generar QR)
           </button>`
        : `<button class="btn btn-outline" disabled>Límite de usos alcanzado</button>`
    );

    document.getElementById('btn-generar-qr')?.addEventListener('click', () => {
      closeModal();
      this._mostrarQR(beneficioId);
    });
  },

  /** Inicio de utilización – generación de QR (HU-012) */
  _mostrarQR(beneficioId) {
    const m = Auth.getMiembroActual();
    const cred = getCredencialByMiembro(m.id);
    const b = getBeneficio(beneficioId);
    const token = generateValidationToken(cred.id, beneficioId);

    // Guardamos temporalmente el token activo para la validación del proveedor
    sessionStorage.setItem('qr_token', JSON.stringify({
      token,
      credencialId: cred.id,
      beneficioId,
      miembroId: m.id,
      createdAt: Date.now()
    }));

    openModal(
      'Código QR para validación',
      `
      <div class="qr-container">
        <div id="qr-canvas"></div>
        <p class="qr-hint">Presente este código al proveedor para validar el beneficio:<br><strong>${b.nombre}</strong></p>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:8px;word-break:break-all">${token}</p>
      </div>
      `,
      `<button class="btn btn-outline" onclick="closeModal()">Cerrar</button>`
    );

    // Generar QR con la librería
    const container = document.getElementById('qr-canvas');
    if (window.QRCode) {
      QRCode.toCanvas(document.createElement('canvas'), token, {
        width: 200,
        margin: 2,
        color: { dark: '#0d47a1', light: '#ffffff' }
      }, (err, canvas) => {
        if (!err && container) {
          container.innerHTML = '';
          container.appendChild(canvas);
        } else if (container) {
          container.innerHTML = `<p style="font-family:monospace;font-size:0.8rem">${token}</p>`;
        }
      });
    } else {
      container.innerHTML = `<p style="font-family:monospace;font-size:0.85rem;word-break:break-all">${token}</p>`;
    }
  },

  /** Historial de utilizaciones del miembro (HU-016) */
  historial() {
    const m = Auth.getMiembroActual();
    const rows = MOCK.utilizaciones
      .filter(u => u.miembroId === m.id)
      .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora))
      .map(u => {
        const ben = getBeneficio(u.beneficioId);
        const prov = getProveedor(u.proveedorId);
        return `
          <div class="list-item" style="cursor:default">
            <div class="info">
              <strong>${ben?.nombre || '—'}</strong>
              <span>${prov?.nombre || '—'} · ${formatDateTime(u.fechaHora)}</span>
              ${u.motivo ? `<span style="color:var(--danger);font-size:0.8rem">${u.motivo}</span>` : ''}
            </div>
            ${badgeResultado(u.resultado)}
          </div>`;
      })
      .join('');

    return `
      <div class="toolbar"><h3>Mi historial de utilizaciones</h3></div>
      <div class="card">
        ${rows || '<div class="empty-state"><span class="material-icons">history</span><p>Aún no tiene utilizaciones registradas</p></div>'}
      </div>`;
  },

  bindHistorial() {}
};
