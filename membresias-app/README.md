PLATAFORMA CONFIGURABLE DE CREDENCIALIZACIÓN Y GESTIÓN DE BENEFICIOS PARA MEMBRESÍAS
Prototipo - Trabajo Final de Graduación, Ingeniería en Software
Universidad Siglo 21 – Jesús Martínez (SOF01548)

El sistema permite administrar miembros, tipos de membresía, credenciales digitales y
beneficios de una organización. El miembro puede ver su credencial, consultar los
beneficios disponibles y generar un código QR para utilizarlos. El proveedor valida
el código QR (credencial, vigencia de la membresía y condiciones del beneficio) y
confirma la utilización. La organización consulta el historial de operaciones.

Este repositorio contiene el frontend del prototipo. Funciona en la propia computadora:
se abre desde el navegador.

================================================================================
QUÉ HAY QUE TENER INSTALADO
================================================================================

- Un navegador actualizado (Chrome, Edge o Firefox).
- Visual Studio Code (recomendado), para editar y levantar el prototipo con Live Server.
  Se descarga desde https://code.visualstudio.com/
- (Opcional) Extensión "Live Server" de Ritwick Dey, dentro de VS Code.
- (Opcional) Python 3, solo si se quiere usar el servidor local por consola.
  Se descarga desde https://www.python.org/. Al instalarlo en Windows, marcar
  la opción "Add python.exe to PATH".
- (Opcional) Node.js, como alternativa a Python para servir los archivos.
  Se descarga desde https://nodejs.org/

No hace falta instalar Java, Android Studio ni PostgreSQL para correr este frontend.
Los datos son de demostración (en memoria) y se reinician al recargar la página.

================================================================================
PUESTA EN MARCHA
================================================================================

1) Abrir el proyecto

   Descomprimir el ZIP (si se descargó así) y abrir la carpeta "membresias-app"
   en Visual Studio Code:
   Archivo → Abrir carpeta → seleccionar "membresias-app".

2) Ejecutar el prototipo (elegir una forma)

   Forma A – Live Server (la más simple en VS Code)
   - Instalar la extensión "Live Server" si no está instalada.
   - Click derecho sobre el archivo index.html → "Open with Live Server".
   - Se abre el navegador solo.

   Forma B – Doble clic
   - Ir a la carpeta membresias-app en el Explorador de archivos.
   - Doble clic en index.html.
   - Se abre en el navegador predeterminado.

   Forma C – Consola con Python
   - Abrir una terminal en la carpeta membresias-app.
   - Escribir:
       python -m http.server 8080
   - Abrir el navegador en: http://localhost:8080

   Forma D – Consola con Node
   - En la misma carpeta, escribir:
       npx --yes serve .
   - Abrir la URL que muestre la consola (por ejemplo http://localhost:3000).

3) Iniciar sesión con un usuario de demo

   Organización:   usuario  org         contraseña  org123
   Miembro:        usuario  miembro     contraseña  miembro123
   Proveedor:      usuario  proveedor   contraseña  proveedor123

   (Hay un segundo miembro de prueba: usuario miembro2 / contraseña miembro123)

================================================================================
FLUJO DE PRUEBA SUGERIDO
================================================================================

1. Entrar como "org".
   - Revisar la lista de miembros.
   - Abrir un miembro y ver o cambiar el estado de su credencial.
   - Revisar beneficios.

2. Cerrar sesión y entrar como "miembro".
   - Ver datos y membresía.
   - Abrir "Mi credencial".
   - Ir a Beneficios, elegir uno (por ejemplo "20 % de descuento") y generar el QR.

3. Cerrar sesión y entrar como "proveedor".
   - Usar el botón "Usar último token generado (demo)" o pegar el código del QR.
   - Validar. Si todo está correcto, confirmar la utilización.

4. Volver a "org" o a "miembro" y comprobar que la utilización quedó registrada
   en Utilizaciones o en el Historial.

================================================================================
QUÉ HACE CADA ROL
================================================================================

Organización
- Alta y edición de miembros
- Tipos de membresía
- Asignación de membresía (tipo, fechas, estado)
- Habilitar / deshabilitar credencial digital
- Configurar beneficios (vigencia, tipos admitidos, límite de usos)
- Consultar utilizaciones

Miembro
- Consultar sus datos y su membresía
- Ver la credencial digital (si está habilitada)
- Ver beneficios disponibles para su tipo de membresía
- Generar código QR para usar un beneficio
- Ver su historial de utilizaciones

Proveedor
- Validar el código QR
- El sistema comprueba: credencial habilitada, membresía activa y vigente,
  beneficio vigente, tipo de membresía admitido y límite de usos
- Confirmar o rechazar la utilización

================================================================================
ESTRUCTURA DE CARPETAS
================================================================================

membresias-app/
  index.html          Página principal (login y aplicación)
  css/
    styles.css        Estilos
  js/
    data.js           Datos de demostración
    utils.js          Funciones auxiliares
    auth.js           Inicio de sesión
    app.js            Navegación según el rol
    views/
      org.js          Pantallas de la organización
      member.js       Pantallas del miembro
      provider.js     Validación del proveedor
  README.md           Este archivo

================================================================================
NOTAS
================================================================================

- Este frontend replica las pantallas y las reglas de validación del TFG.
  En el documento del Trabajo Final de Graduación el sistema completo se plantea
  con aplicación Android (Java), API REST en Java + Spring Boot y base de datos
  PostgreSQL. Acá los datos son mock para poder probar sin instalar el backend.
- Los cambios (nuevos miembros, utilizaciones, etc.) se mantienen mientras no
  se recargue la página.
- Autor del TFG: Jesús Martínez – Legajo SOF01548 – Tutor: Julieta Rabozzi.