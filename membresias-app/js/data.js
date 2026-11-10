/**
 * Datos mock basados en el TFG:
 * Organización modelada, miembros, tipos de membresía, credenciales,
 * beneficios, proveedores y utilizaciones.
 */

const MOCK = {
  organizacion: {
    id: 1,
    nombre: 'Organización Modelada',
    razonSocial: 'Organización Modelada S.A.'
  },

  usuarios: [
    {
      id: 1,
      username: 'org',
      password: 'org123',
      rol: 'ORGANIZACION',
      nombre: 'Admin Organización',
      organizacionId: 1
    },
    {
      id: 2,
      username: 'miembro',
      password: 'miembro123',
      rol: 'MIEMBRO',
      nombre: 'Juan Pérez',
      miembroId: 1
    },
    {
      id: 3,
      username: 'proveedor',
      password: 'proveedor123',
      rol: 'PROVEEDOR',
      nombre: 'Farmacia Central',
      proveedorId: 1
    },
    {
      id: 4,
      username: 'miembro2',
      password: 'miembro123',
      rol: 'MIEMBRO',
      nombre: 'Ana Gómez',
      miembroId: 2
    }
  ],

  tiposMembresia: [
    { id: 1, nombre: 'Platino', descripcion: 'Membresía premium con acceso completo a beneficios', organizacionId: 1 },
    { id: 2, nombre: 'Oro', descripcion: 'Membresía intermedia', organizacionId: 1 },
    { id: 3, nombre: 'Plata', descripcion: 'Membresía básica', organizacionId: 1 }
  ],

  miembros: [
    {
      id: 1,
      numero: '000125',
      apellido: 'Pérez',
      nombre: 'Juan',
      tipoDocumento: 'DNI',
      numeroDocumento: '30.123.456',
      fechaNacimiento: '1985-03-12',
      domicilio: 'Av. Colón 1250, Córdoba',
      email: 'juan.perez@correo.com',
      telefono: '351 555-0123',
      organizacionId: 1
    },
    {
      id: 2,
      numero: '000126',
      apellido: 'Gómez',
      nombre: 'Ana',
      tipoDocumento: 'DNI',
      numeroDocumento: '28.987.654',
      fechaNacimiento: '1990-07-22',
      domicilio: 'Calle San Martín 450, Córdoba',
      email: 'ana.gomez@correo.com',
      telefono: '351 555-0456',
      organizacionId: 1
    },
    {
      id: 3,
      numero: '000127',
      apellido: 'Romero',
      nombre: 'Luis',
      tipoDocumento: 'DNI',
      numeroDocumento: '32.111.222',
      fechaNacimiento: '1978-11-05',
      domicilio: 'Bv. Illia 890, Córdoba',
      email: 'luis.romero@correo.com',
      telefono: '351 555-0789',
      organizacionId: 1
    }
  ],

  membresias: [
    {
      id: 1,
      miembroId: 1,
      tipoMembresiaId: 1, // Platino
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31',
      estado: 'ACTIVA' // ACTIVA | SUSPENDIDA | VENCIDA
    },
    {
      id: 2,
      miembroId: 2,
      tipoMembresiaId: 2, // Oro
      fechaInicio: '2026-03-01',
      fechaFin: '2027-02-28',
      estado: 'ACTIVA'
    },
    {
      id: 3,
      miembroId: 3,
      tipoMembresiaId: 3, // Plata
      fechaInicio: '2025-01-01',
      fechaFin: '2025-12-31',
      estado: 'VENCIDA'
    }
  ],

  credenciales: [
    {
      id: 1,
      miembroId: 1,
      identificadorValidacion: 'CRED-000125-A1B2',
      estado: 'HABILITADA', // HABILITADA | DESHABILITADA
      fechaEmision: '2026-01-01'
    },
    {
      id: 2,
      miembroId: 2,
      identificadorValidacion: 'CRED-000126-C3D4',
      estado: 'HABILITADA',
      fechaEmision: '2026-03-01'
    },
    {
      id: 3,
      miembroId: 3,
      identificadorValidacion: 'CRED-000127-E5F6',
      estado: 'DESHABILITADA',
      fechaEmision: '2025-01-01'
    }
  ],

  proveedores: [
    { id: 1, nombre: 'Farmacia Central', organizacionId: 1 },
    { id: 2, nombre: 'Cine Centro', organizacionId: 1 },
    { id: 3, nombre: 'Gimnasio Activo', organizacionId: 1 }
  ],

  beneficios: [
    {
      id: 1,
      nombre: '20 % de descuento',
      descripcion: 'Descuento del 20 % en medicamentos de venta libre',
      proveedorId: 1,
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31',
      tiposMembresiaIds: [1, 2], // Platino y Oro
      limiteUtilizacion: 5, // por miembro por período (null = sin límite)
      condicionesParticulares: 'No acumulable con otras promociones. Presentar DNI.',
      estado: 'ACTIVO',
      organizacionId: 1
    },
    {
      id: 2,
      nombre: '2x1 en entradas',
      descripcion: 'Dos entradas al precio de una de lunes a jueves',
      proveedorId: 2,
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31',
      tiposMembresiaIds: [1, 2, 3],
      limiteUtilizacion: 4,
      condicionesParticulares: 'Válido de lunes a jueves. No aplica en estrenos.',
      estado: 'ACTIVO',
      organizacionId: 1
    },
    {
      id: 3,
      nombre: 'Acceso gratuito al gimnasio',
      descripcion: '1 día de acceso libre por mes',
      proveedorId: 3,
      fechaInicio: '2026-01-01',
      fechaFin: '2026-12-31',
      tiposMembresiaIds: [1],
      limiteUtilizacion: 1,
      condicionesParticulares: 'Solo membresía Platino. Coordinar turno previo.',
      estado: 'ACTIVO',
      organizacionId: 1
    }
  ],

  utilizaciones: [
    {
      id: 1,
      miembroId: 3,
      beneficioId: 1,
      proveedorId: 1,
      fechaHora: '2026-11-10T12:10:00',
      resultado: 'RECHAZADA',
      motivo: 'Membresía vencida'
    },
    {
      id: 2,
      miembroId: 2,
      beneficioId: 2,
      proveedorId: 2,
      fechaHora: '2026-11-10T16:30:00',
      resultado: 'CONFIRMADA',
      motivo: null
    },
    {
      id: 3,
      miembroId: 1,
      beneficioId: 1,
      proveedorId: 1,
      fechaHora: '2026-11-10T18:42:00',
      resultado: 'CONFIRMADA',
      motivo: null
    }
  ]
};

/** Contador para nuevos IDs */
let nextIds = {
  miembro: 4,
  membresia: 4,
  credencial: 4,
  beneficio: 4,
  utilizacion: 4,
  tipoMembresia: 4
};
