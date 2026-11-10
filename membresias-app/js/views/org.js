/**
 * Vistas del rol ORGANIZACION
 */

const OrgViews = {
  /** Gestión de miembros (HU-002) */
  miembros() {
    const list = MOCK.miembros
      .filter(m => m.organizacionId === 1)
      .map(m => {
        const memb = getMembresiaByMiembro(m.id);
        const tipo = memb ? getTipoMembresia(memb.tipoMembresiaId) : null;
        return `
          <div class="list-item" data-id="${m.id}">
            <div class="avatar">${initials(m.nombre, m.apellido)}</div>
            <div class="info">
              <strong>${m.apellido}, ${m.nombre}</strong>
              <span>Nº ${m.numero} · ${tipo ? tipo.nombre : 'Sin membresía'}</span>
            </div>
            ${memb ? badgeEstadoMembresia(memb.estado) : '<span class="badge badge-neutral">Sin memb.</span>'}
          </div>`;
      })
      .join('');

    return `
      <div class="toolbar">
        <h3>Gestión de miembros</h3>
        <button class="btn btn-primary btn-sm" id="btn-nuevo-miembro">
          <span class="material-icons" style="font-size:18px">person_add</span> Nuevo
        </button>
      </div>
      <div class="search-bar">
        <input type="search" id="search-miembros" placeholder="Buscar por nombre o número..." />
      </div>
      <div class="card" id="lista-miembros">
        ${list || '<div class="empty-state"><span class="material-icons">people</span><p>No hay miembros registrados</p></div>'}
      </div>`;
  },

  bindMiembros() {
    document.getElementById('btn-nuevo-miembro')?.addEventListener('click', () => {
      this._formMiembro();
    });

    document.getElementById('search-miembros')?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('#lista-miembros .list-item').forEach(el => {
        const text = el.textContent.toLowerCase();
        el.style.display = text.includes(q) ? '' : 'none';
      });
    });

    document.querySelectorAll('#lista-miembros .list-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = Number(el.dataset.id);
        this._detalleMiembro(id);
      });
    });
  },

  _formMiembro(miembro = null) {
    const isEdit = !!miembro;
    openModal(
      isEdit ? 'Editar miembro' : 'Registrar miembro',
      `
      <div class="form-group"><label>Apellido</label><input id="f-apellido" value="${miembro?.apellido || ''}" required /></div>
      <div class="form-group"><label>Nombre</label><input id="f-nombre" value="${miembro?.nombre || ''}" required /></div>
      <div class="form-group"><label>Tipo documento</label>
        <select id="f-tipo-doc"><option>DNI</option><option>Pasaporte</option></select>
      </div>
      <div class="form-group"><label>Número documento</label><input id="f-nro-doc" value="${miembro?.numeroDocumento || ''}" required /></div>
      <div class="form-group"><label>Fecha nacimiento</label><input type="date" id="f-fnac" value="${miembro?.fechaNacimiento || ''}" /></div>
      <div class="form-group"><label>Domicilio</label><input id="f-dom" value="${miembro?.domicilio || ''}" /></div>
      <div class="form-group"><label>Email</label><input type="email" id="f-email" value="${miembro?.email || ''}" /></div>
      <div class="form-group"><label>Teléfono</label><input id="f-tel" value="${miembro?.telefono || ''}" /></div>
      `,
      `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-primary" id="btn-guardar-miembro">${isEdit ? 'Guardar' : 'Registrar'}</button>`
    );

    document.getElementById('btn-guardar-miembro').onclick = () => {
      const apellido = document.getElementById('f-apellido').value.trim();
      const nombre = document.getElementById('f-nombre').value.trim();
      const numeroDocumento = document.getElementById('f-nro-doc').value.trim();
      if (!apellido || !nombre || !numeroDocumento) {
        showToast('Complete los campos obligatorios');
        return;
      }
      if (isEdit) {
        Object.assign(miembro, {
          apellido, nombre, numeroDocumento,
          tipoDocumento: document.getElementById('f-tipo-doc').value,
          fechaNacimiento: document.getElementById('f-fnac').value,
          domicilio: document.getElementById('f-dom').value,
          email: document.getElementById('f-email').value,
          telefono: document.getElementById('f-tel').value
        });
        showToast('Miembro actualizado');
      } else {
        const nuevo = {
          id: nextIds.miembro++,
          numero: String(100000 + nextIds.miembro).slice(-6),
          apellido, nombre,
          tipoDocumento: document.getElementById('f-tipo-doc').value,
          numeroDocumento,
          fechaNacimiento: document.getElementById('f-fnac').value,
          domicilio: document.getElementById('f-dom').value,
          email: document.getElementById('f-email').value,
          telefono: document.getElementById('f-tel').value,
          organizacionId: 1
        };
        MOCK.miembros.push(nuevo);
        showToast('Miembro registrado');
      }
      closeModal();
      App.navigate('miembros');
    };
  },

  _detalleMiembro(id) {
    const m = getMiembro(id);
    const memb = getMembresiaByMiembro(id);
    const cred = getCredencialByMiembro(id);
    const tipo = memb ? getTipoMembresia(memb.tipoMembresiaId) : null;

    openModal(
      `${m.apellido}, ${m.nombre}`,
      `
      <div class="info-grid">
        <div class="info-box"><div class="label">Número</div><div class="value">${m.numero}</div></div>
        <div class="info-box"><div class="label">Documento</div><div class="value">${m.tipoDocumento} ${m.numeroDocumento}</div></div>
        <div class="info-box"><div class="label">Email</div><div class="value">${m.email || '—'}</div></div>
        <div class="info-box"><div class="label">Teléfono</div><div class="value">${m.telefono || '—'}</div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-title"><span class="material-icons">card_membership</span> Membresía</div>
        ${memb ? `
          <p><strong>Tipo:</strong> ${tipo?.nombre || '—'}</p>
          <p><strong>Vigencia:</strong> ${formatDate(memb.fechaInicio)} – ${formatDate(memb.fechaFin)}</p>
          <p><strong>Estado:</strong> ${badgeEstadoMembresia(memb.estado)}</p>
        ` : '<p>Sin membresía asignada</p>'}
      </div>
      <div class="card">
        <div class="card-title"><span class="material-icons">qr_code</span> Credencial digital</div>
        ${cred ? `
          <p><strong>Estado:</strong> ${badgeEstadoCredencial(cred.estado)}</p>
          <p><strong>ID validación:</strong> <code>${cred.identificadorValidacion}</code></p>
        ` : '<p>Sin credencial</p>'}
      </div>
      `,
      `
      <button class="btn btn-outline btn-sm" id="btn-editar-miembro">Editar datos</button>
      <button class="btn btn-primary btn-sm" id="btn-asignar-memb">Asignar / editar membresía</button>
      ${cred ? `<button class="btn btn-sm ${cred.estado === 'HABILITADA' ? 'btn-danger' : 'btn-accent'}" id="btn-toggle-cred">
        ${cred.estado === 'HABILITADA' ? 'Deshabilitar credencial' : 'Habilitar credencial'}
      </button>` : ''}
      `
    );

    document.getElementById('btn-editar-miembro').onclick = () => {
      closeModal();
      this._formMiembro(m);
    };
    document.getElementById('btn-asignar-memb')?.addEventListener('click', () => {
      closeModal();
      this._formMembresia(id, memb);
    });
    document.getElementById('btn-toggle-cred')?.addEventListener('click', () => {
      if (cred) {
        cred.estado = cred.estado === 'HABILITADA' ? 'DESHABILITADA' : 'HABILITADA';
        showToast(`Credencial ${cred.estado === 'HABILITADA' ? 'habilitada' : 'deshabilitada'}`);
        closeModal();
        this._detalleMiembro(id);
      }
    });
  },

  /** Asignación de membresía (HU-004 / HU-005) */
  _formMembresia(miembroId, membresia = null) {
    const tiposOpts = MOCK.tiposMembresia
      .map(t => `<option value="${t.id}" ${membresia?.tipoMembresiaId === t.id ? 'selected' : ''}>${t.nombre}</option>`)
      .join('');

    openModal(
      membresia ? 'Editar membresía' : 'Asignar membresía',
      `
      <div class="form-group"><label>Tipo de membresía</label>
        <select id="f-tipo-memb">${tiposOpts}</select>
      </div>
      <div class="form-group"><label>Fecha inicio</label>
        <input type="date" id="f-ini" value="${membresia?.fechaInicio || todayISO()}" />
      </div>
      <div class="form-group"><label>Fecha fin</label>
        <input type="date" id="f-fin" value="${membresia?.fechaFin || '2026-12-31'}" />
      </div>
      <div class="form-group"><label>Estado</label>
        <select id="f-estado">
          <option value="ACTIVA" ${membresia?.estado === 'ACTIVA' ? 'selected' : ''}>ACTIVA</option>
          <option value="SUSPENDIDA" ${membresia?.estado === 'SUSPENDIDA' ? 'selected' : ''}>SUSPENDIDA</option>
          <option value="VENCIDA" ${membresia?.estado === 'VENCIDA' ? 'selected' : ''}>VENCIDA</option>
        </select>
      </div>
      `,
      `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-primary" id="btn-save-memb">Guardar</button>`
    );

    document.getElementById('btn-save-memb').onclick = () => {
      const data = {
        tipoMembresiaId: Number(document.getElementById('f-tipo-memb').value),
        fechaInicio: document.getElementById('f-ini').value,
        fechaFin: document.getElementById('f-fin').value,
        estado: document.getElementById('f-estado').value
      };
      if (membresia) {
        Object.assign(membresia, data);
      } else {
        MOCK.membresias.push({
          id: nextIds.membresia++,
          miembroId,
          ...data
        });
        // Crear credencial si no existe
        if (!getCredencialByMiembro(miembroId)) {
          const m = getMiembro(miembroId);
          MOCK.credenciales.push({
            id: nextIds.credencial++,
            miembroId,
            identificadorValidacion: `CRED-${m.numero}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            estado: 'HABILITADA',
            fechaEmision: todayISO()
          });
        }
      }
      showToast('Membresía guardada');
      closeModal();
      App.navigate('miembros');
    };
  },

  /** Tipos de membresía (HU-004) */
  tipos() {
    const list = MOCK.tiposMembresia.map(t => `
      <div class="list-item">
        <div class="avatar"><span class="material-icons">loyalty</span></div>
        <div class="info">
          <strong>${t.nombre}</strong>
          <span>${t.descripcion}</span>
        </div>
      </div>
    `).join('');

    return `
      <div class="toolbar">
        <h3>Tipos de membresía</h3>
        <button class="btn btn-primary btn-sm" id="btn-nuevo-tipo">
          <span class="material-icons" style="font-size:18px">add</span> Nuevo tipo
        </button>
      </div>
      <div class="card">${list}</div>`;
  },

  bindTipos() {
    document.getElementById('btn-nuevo-tipo')?.addEventListener('click', () => {
      openModal(
        'Nuevo tipo de membresía',
        `
        <div class="form-group"><label>Nombre</label><input id="f-tipo-nom" required /></div>
        <div class="form-group"><label>Descripción</label><textarea id="f-tipo-desc" rows="2"></textarea></div>
        `,
        `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
         <button class="btn btn-primary" id="btn-save-tipo">Guardar</button>`
      );
      document.getElementById('btn-save-tipo').onclick = () => {
        const nombre = document.getElementById('f-tipo-nom').value.trim();
        if (!nombre) return showToast('Ingrese el nombre');
        MOCK.tiposMembresia.push({
          id: nextIds.tipoMembresia++,
          nombre,
          descripcion: document.getElementById('f-tipo-desc').value,
          organizacionId: 1
        });
        showToast('Tipo creado');
        closeModal();
        App.navigate('tipos');
      };
    });
  },

  /** Gestión de beneficios (HU-009 / HU-010) */
  beneficios() {
    const list = MOCK.beneficios.map(b => {
      const prov = getProveedor(b.proveedorId);
      const tipos = b.tiposMembresiaIds
        .map(id => getTipoMembresia(id)?.nombre)
        .filter(Boolean)
        .join(', ');
      return `
        <div class="list-item" data-id="${b.id}">
          <div class="avatar"><span class="material-icons">local_offer</span></div>
          <div class="info">
            <strong>${b.nombre}</strong>
            <span>${prov?.nombre || '—'} · ${tipos || 'Sin tipos'}</span>
          </div>
          <span class="badge ${b.estado === 'ACTIVO' ? 'badge-success' : 'badge-neutral'}">${b.estado}</span>
        </div>`;
    }).join('');

    return `
      <div class="toolbar">
        <h3>Beneficios</h3>
        <button class="btn btn-primary btn-sm" id="btn-nuevo-beneficio">
          <span class="material-icons" style="font-size:18px">add</span> Nuevo
        </button>
      </div>
      <div class="card" id="lista-beneficios">${list}</div>`;
  },

  bindBeneficios() {
    document.getElementById('btn-nuevo-beneficio')?.addEventListener('click', () => this._formBeneficio());
    document.querySelectorAll('#lista-beneficios .list-item').forEach(el => {
      el.addEventListener('click', () => this._formBeneficio(Number(el.dataset.id)));
    });
  },

  _formBeneficio(id = null) {
    const b = id ? getBeneficio(id) : null;
    const provOpts = MOCK.proveedores.map(p =>
      `<option value="${p.id}" ${b?.proveedorId === p.id ? 'selected' : ''}>${p.nombre}</option>`
    ).join('');
    const tiposChecks = MOCK.tiposMembresia.map(t => `
      <label style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
        <input type="checkbox" name="tipos" value="${t.id}" ${b?.tiposMembresiaIds?.includes(t.id) ? 'checked' : ''} />
        ${t.nombre}
      </label>`).join('');

    openModal(
      b ? 'Editar beneficio' : 'Nuevo beneficio',
      `
      <div class="form-group"><label>Nombre</label><input id="f-ben-nom" value="${b?.nombre || ''}" /></div>
      <div class="form-group"><label>Descripción</label><textarea id="f-ben-desc" rows="2">${b?.descripcion || ''}</textarea></div>
      <div class="form-group"><label>Proveedor</label><select id="f-ben-prov">${provOpts}</select></div>
      <div class="form-group"><label>Fecha inicio</label><input type="date" id="f-ben-ini" value="${b?.fechaInicio || todayISO()}" /></div>
      <div class="form-group"><label>Fecha fin</label><input type="date" id="f-ben-fin" value="${b?.fechaFin || '2026-12-31'}" /></div>
      <div class="form-group"><label>Límite de utilización (vacío = sin límite)</label>
        <input type="number" id="f-ben-lim" min="0" value="${b?.limiteUtilizacion ?? ''}" placeholder="Sin límite" />
      </div>
      <div class="form-group"><label>Tipos de membresía admitidos</label>${tiposChecks}</div>
      <div class="form-group"><label>Condiciones particulares</label>
        <textarea id="f-ben-cond" rows="2">${b?.condicionesParticulares || ''}</textarea>
      </div>
      <div class="form-group"><label>Estado</label>
        <select id="f-ben-estado">
          <option value="ACTIVO" ${b?.estado === 'ACTIVO' ? 'selected' : ''}>ACTIVO</option>
          <option value="INACTIVO" ${b?.estado === 'INACTIVO' ? 'selected' : ''}>INACTIVO</option>
        </select>
      </div>
      `,
      `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-primary" id="btn-save-ben">Guardar</button>`
    );

    document.getElementById('btn-save-ben').onclick = () => {
      const tipos = [...document.querySelectorAll('input[name="tipos"]:checked')].map(c => Number(c.value));
      const limVal = document.getElementById('f-ben-lim').value;
      const data = {
        nombre: document.getElementById('f-ben-nom').value.trim(),
        descripcion: document.getElementById('f-ben-desc').value,
        proveedorId: Number(document.getElementById('f-ben-prov').value),
        fechaInicio: document.getElementById('f-ben-ini').value,
        fechaFin: document.getElementById('f-ben-fin').value,
        limiteUtilizacion: limVal === '' ? null : Number(limVal),
        tiposMembresiaIds: tipos,
        condicionesParticulares: document.getElementById('f-ben-cond').value,
        estado: document.getElementById('f-ben-estado').value,
        organizacionId: 1
      };
      if (!data.nombre) return showToast('Ingrese el nombre del beneficio');
      if (b) {
        Object.assign(b, data);
      } else {
        MOCK.beneficios.push({ id: nextIds.beneficio++, ...data });
      }
      showToast('Beneficio guardado');
      closeModal();
      App.navigate('beneficios');
    };
  },

  /** Utilizaciones registradas (HU-015) */
  utilizaciones() {
    const rows = [...MOCK.utilizaciones]
      .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora))
      .map(u => {
        const m = getMiembro(u.miembroId);
        const ben = getBeneficio(u.beneficioId);
        const prov = getProveedor(u.proveedorId);
        return `
          <div class="list-item" style="cursor:default">
            <div class="info">
              <strong>${m ? m.apellido + ', ' + m.nombre : '—'}</strong>
              <span>${ben?.nombre || '—'} · ${prov?.nombre || '—'} · ${formatDateTime(u.fechaHora)}</span>
              ${u.motivo ? `<span style="color:var(--danger);font-size:0.8rem">${u.motivo}</span>` : ''}
            </div>
            ${badgeResultado(u.resultado)}
          </div>`;
      })
      .join('');

    return `
      <div class="toolbar"><h3>Utilizaciones registradas</h3></div>
      <div class="card">
        ${rows || '<div class="empty-state"><span class="material-icons">receipt_long</span><p>Sin utilizaciones</p></div>'}
      </div>`;
  },

  bindUtilizaciones() {}
};
