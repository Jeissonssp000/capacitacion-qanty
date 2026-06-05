export const SECTIONS = [
  { id: "terminal", title: "La Terminal" },
  { id: "navegacion", title: "Navegación Básica" },
  { id: "carpetas", title: "Carpetas y Archivos" },
  { id: "red", title: "Diagnóstico y Red" },
  { id: "procesos", title: "Recursos y Procesos" },
  { id: "permisos", title: "Permisos y Archivos" },
];

export const LESSONS = [
  // ── Section 1: La Terminal ──────────────────────────────
  {
    section: "terminal",
    title: "Abrir y limpiar la consola",
    description:
      "La terminal es una interfaz de texto para controlar la computadora. Ábrela con ctrl + alt + t. Usa 'clear' para limpiar la pantalla cuando haya demasiado texto.",
    buttons: [{ label: "clear", value: "clear" }],
  },

  // ── Section 2: Navegación Básica ────────────────────────
  {
    section: "navegacion",
    title: "¿Dónde estoy? (pwd)",
    description:
      "'pwd' (print working directory) muestra la ruta completa del directorio en el que te encuentras. Es útil cuando te sientes perdido en el sistema de archivos.",
    buttons: [{ label: "pwd", value: "pwd" }],
  },
  {
    section: "navegacion",
    title: "Moverse entre directorios (cd)",
    description:
      "'cd' (change directory) te permite moverte entre carpetas. Usa 'cd ..' para subir un nivel, 'cd ~' para ir al inicio, o 'cd <carpeta>' para entrar en una.",
    buttons: [
      { label: "cd", value: "cd" },
      { label: "..", value: ".." },
      { label: "~", value: "~" },
      { label: "Escritorio/", value: "Escritorio/" },
      { label: "Documentos/", value: "Documentos/" },
      { label: "Descargas/", value: "Descargas/" },
    ],
  },

  // ── Section 3: Carpetas y Archivos ──────────────────────
  {
    section: "carpetas",
    title: "Listar contenido (ls)",
    description:
      "'ls' (list) muestra los archivos y carpetas en el directorio actual. Puedes pasarle una ruta como argumento para ver el contenido de otro directorio sin moverte.",
    buttons: [
      { label: "ls", value: "ls" },
      { label: "Escritorio/", value: "Escritorio/" },
      { label: "Documentos/", value: "Documentos/" },
      { label: "Descargas/", value: "Descargas/" },
    ],
  },
  {
    section: "carpetas",
    title: "Revelar archivos ocultos (ls -a)",
    description:
      "En Linux, los archivos que comienzan con un punto '.' son ocultos. 'ls -a' muestra todos los archivos, incluidos los ocultos como '.bashrc'.",
    buttons: [
      { label: "ls", value: "ls" },
      { label: "ls -a", value: "ls -a" },
    ],
  },
  {
    section: "carpetas",
    title: "Leer archivos (cat)",
    description:
      "'cat' (concatenate) muestra el contenido de un archivo en la terminal. Es la forma más rápida de leer archivos de texto. Úsalo como 'cat nombre_del_archivo'.",
    buttons: [
      { label: "cat", value: "cat" },
      { label: "archivo.txt", value: "archivo.txt" },
      { label: "archivo.sh", value: "archivo.sh" },
    ],
  },


  // ── Section 4: Diagnóstico y Red ────────────────────────
  {
    section: "red",
    title: "Datos de red locales",
    description:
      "Muestra la configuración de red de tu máquina. 'ifconfig' es el comando clásico, mientras que 'ip addr' (o 'ip a') es el estándar moderno.",
    buttons: [
      { label: "ifconfig", value: "ifconfig" },
      { label: "ip addr", value: "ip addr" },
      { label: "ip a", value: "ip a" },
    ],
  },
  {
    section: "red",
    title: "Verificar conectividad (ping)",
    description:
      "El comando 'ping' envía paquetes a un destino para comprobar la conexión. Usa 'ping -c N' para limitar paquetes. Prueba diferentes escenarios.",
    buttons: [
      { label: "ping google.com", value: "ping google.com" },
      { label: "ping error.com", value: "ping error.com" },
      { label: "ping 193.169.0.254", value: "ping 193.169.0.254" },
      { label: "ping timeout.com", value: "ping timeout.com" },
      { label: "ping -c 4 127.0.0.1", value: "ping -c 4 127.0.0.1" },
    ],
  },
  {
    section: "red",
    title: "Nombre del equipo (hostname)",
    description:
      "'hostname' muestra el nombre de tu equipo en la red. Con '-I' (mayúscula) puedes ver rápidamente la dirección IP asignada.",
    buttons: [{ label: "hostname -I", value: "hostname -I" }],
  },

  // ── Section 5: Recursos y Procesos ──────────────────────
  {
    section: "procesos",
    title: "Monitorear el sistema (top / htop)",
    description:
      "'top' muestra en tiempo real los procesos que se están ejecutando, su uso de CPU, memoria y más. 'htop' es una versión mejorada. Presiona Ctrl+C para salir.",
    buttons: [
      { label: "top", value: "top" },
      { label: "htop", value: "htop" },
    ],
  },
  {
    section: "procesos",
    title: "Finalizar procesos (kill)",
    description:
      "'kill' envía una señal a un proceso para detenerlo. Necesitas el PID (Process ID). Usa 'kill <PID>' para terminarlo o 'kill -9 <PID>' para forzar su cierre.",
    buttons: [
      { label: "top", value: "top" },
      { label: "kill", value: "kill" },
    ],
  },

  // ── Section 6: Permisos y Archivos ──────────────────────
  {
    section: "permisos",
    title: "Listado largo y permisos (ls -l)",
    description:
      "'ls -l' muestra archivos con información detallada: permisos, propietario, tamaño y fecha. Los permisos se leen como rwx (lectura, escritura, ejecución).",
    buttons: [{ label: "ls -l", value: "ls -l" }],
  },
  {
    section: "permisos",
    title: "Modificar accesos (chmod)",
    description:
      "'chmod' cambia los permisos de un archivo. Puedes usar notación simbólica ('chmod u+x archivo') o numérica ('chmod 755 archivo').",
    buttons: [
      { label: "chmod", value: "chmod" },
      { label: "u+x", value: "u+x" },
      { label: "755", value: "755" },
      { label: "archivo.sh", value: "archivo.sh" },
    ],
  },
  {
    section: "permisos",
    title: "Eliminación permanente (rm)",
    description:
      "'rm' elimina archivos de forma permanente (no van a una papelera). ¡Cuidado! Esta acción no se puede deshacer.",
    buttons: [
      { label: "rm", value: "rm" },
      { label: "archivo.txt", value: "archivo.txt" },
    ],
  },

  // ── Challenges ──────────────────────────────────────────
  {
    section: "retos",
    title: "Reto 1: La Contraseña Oculta",
    description:
      "Un administrador olvidó la contraseña de acceso en el sistema; por ahí dicen que la guardó en la carpeta de documentos. Recuerda que usando 'cd' puedes navegar entre carpetas, 'ls' puedes ver archivos y con 'cat' puedes ver su contenido.",
    buttons: [
      { label: "cd", value: "cd" },
      { label: "pwd", value: "pwd" },
      { label: "ls", value: "ls" },
      { label: "ls -a", value: "ls -a" },
      { label: "cat", value: "cat" },
      { label: "Documentos", value: "Documentos/" },
      { label: ".secret_password.txt", value: ".secret_password.txt" },
    ],
    isChallenge: true,
    challengeId: "challenge_1",
    hiddenButtons: [".secret_password.txt"],
  },
  {
    section: "retos",
    title: "Reto 2: Mal Rendimiento",
    description:
      "El sistema se ha puesto extremadamente lento debido a un proceso colgado que está consumiendo toda la memoria; abre el administrador de tareas con 'top' para identificar el ID (PID) del servicio malicioso y elimínalo usando 'kill'.",
    buttons: [
      { label: "top", value: "top" },
      { label: "htop", value: "htop" },
      { label: "kill", value: "kill" },
      { label: "2026", value: "2026" },
    ],
    isChallenge: true,
    challengeId: "challenge_3",
    hiddenButtons: ["kill", "2026"],
  },
];
