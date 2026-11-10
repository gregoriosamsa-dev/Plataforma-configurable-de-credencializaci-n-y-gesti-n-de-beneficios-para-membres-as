# Plataforma configurable de credencialización y gestión de beneficios para membresías

**Frontend del prototipo** basado en el Trabajo Final de Graduación de Jesús Martínez (Universidad Siglo 21 – Ingeniería en Software).

Este proyecto es una **aplicación web (SPA)** que replica las pantallas, roles y flujos funcionales descritos en el TFG:

- **Organización**: gestión de miembros, tipos de membresía, asignación de membresías, habilitación/deshabilitación de credenciales digitales, configuración de beneficios y consulta de utilizaciones.
- **Miembro**: consulta de datos y membresía, visualización de credencial digital, listado de beneficios disponibles, generación de código QR para utilización e historial propio.
- **Proveedor**: validación del código QR (credencial, membresía, vigencia, tipo y límites) y confirmación/registro de la utilización.

Los datos son **mock** (en memoria) y se basan en los ejemplos del documento (Juan Pérez, Ana Gómez, Luis Romero, Farmacia Central, Cine Centro, etc.).

---

## Estructura de carpetas

```
membresias-app/
├── index.html              # Punto de entrada (login + shell de la app)
├── css/
│   └── styles.css          # Estilos Material-like, responsive, mobile-first
├── js/
│   ├── data.js             # Datos mock (miembros, membresías, beneficios, utilizaciones…)
│   ├── utils.js            # Formateo, badges, helpers de dominio
│   ├── auth.js             # Login / sesión (sessionStorage)
│   ├── app.js              # Router por rol y navegación
│   └── views/
│       ├── org.js          # Pantallas de la Organización
│       ├── member.js       # Pantallas del Miembro
│       └── provider.js     # Validación QR del Proveedor
├── assets/                 # (reservado para imágenes estáticas)
└── README.md
```

---

## Cómo ejecutarlo en VS Code

### Opción 1 – Extensión Live Server (recomendada)

1. Abra la carpeta `membresias-app` en VS Code.
2. Instale la extensión **Live Server** (Ritwick Dey) si no la tiene.
3. Click derecho sobre `index.html` → **Open with Live Server**.
4. Se abrirá el navegador en `http://127.0.0.1:5500` (o el puerto que asigne).

### Opción 2 – Servidor Python (sin extensiones)

```bash
cd membresias-app
python3 -m http.server 8080
```

Luego abra en el navegador: `http://localhost:8080`

### Opción 3 – Node (si tiene instalado)

```bash
npx serve .
```

---

## Usuarios de demostración

| Usuario    | Contraseña     | Rol          |
|------------|----------------|--------------|
| `org`      | `org123`       | Organización |
| `miembro`  | `miembro123`   | Miembro (Juan Pérez – Platino) |
| `miembro2` | `miembro123`   | Miembro (Ana Gómez – Oro) |
| `proveedor`| `proveedor123` | Proveedor (Farmacia Central) |

---

## Flujo de demo sugerido

1. Inicie sesión como **org** → revise miembros, asigne o edite membresías, gestione beneficios.
2. Cierre sesión e ingrese como **miembro** → vea su credencial, consulte beneficios y genere un código QR para “20 % de descuento”.
3. Cierre sesión e ingrese como **proveedor** → use el botón “Usar último token generado (demo)” o pegue el token, valide y confirme la utilización.
4. Vuelva a **org** o **miembro** y verifique que la utilización aparece en el listado / historial.

---

## Correspondencia con el TFG

| Historia de usuario | Implementación en este frontend |
|---------------------|---------------------------------|
| HU-001 Inicio de sesión | Login por rol + sesión |
| HU-002 Gestión de miembros | Alta / edición / listado |
| HU-003 Consulta de datos propios | Inicio del miembro |
| HU-004 Tipos de membresía | CRUD de tipos |
| HU-005 Asignación y gestión de membresías | Formulario de asignación + estados |
| HU-006 Consulta de membresía propia | Tarjeta de membresía en inicio |
| HU-007 Gestión del estado de credencial | Habilitar / deshabilitar desde detalle de miembro |
| HU-008 Visualización de credencial digital | Pantalla de credencial |
| HU-009 / HU-010 Gestión y condiciones de beneficios | Formulario completo de beneficios |
| HU-011 Consulta de beneficios disponibles | Listado filtrado por tipo de membresía |
| HU-012 Inicio de utilización (QR) | Generación de QR + token |
| HU-013 Validación de beneficio | Reglas de validación en el proveedor |
| HU-014 Confirmación y registro | Confirmación y alta de utilización |
| HU-015 Consulta de utilizaciones (org) | Listado de utilizaciones |
| HU-016 Historial propio (miembro) | Historial del miembro |

---

## Notas técnicas

- No requiere backend ni base de datos: todo corre en el navegador.
- Los cambios (nuevos miembros, utilizaciones, etc.) se mantienen mientras no se recargue la página (o se limpie sessionStorage/local).
- El código QR se genera con la librería [qrcode](https://github.com/soldair/node-qrcode) cargada desde CDN.
- Diseño responsive (mobile-first) inspirado en Material Design, acorde a la app Android del TFG.

---

**Autor del TFG:** Jesús Martínez · Legajo SOF01548  
**Prototipo frontend generado a partir del documento del proyecto.**
