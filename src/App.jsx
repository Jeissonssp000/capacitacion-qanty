import { useState, useEffect, useRef } from "react";
import Desktop from "./components/Desktop";
import Terminal from "./components/Terminal";
import Sidebar from "./components/Sidebar";
import BottomInterface from "./components/BottomInterface";
import confetti from "canvas-confetti";
import { LESSONS, SECTIONS } from "./data/lessons";
import { mockCommandResponse, buildTopOutput } from "./data/commands";

// ── Explanation resolver ─────────────────────────────────
function getExplanation(cmd, extra = {}) {
  if (cmd === "clear")
    return "'clear' limpia toda la pantalla de la terminal, permitiéndote empezar desde una vista limpia. No borra el historial, solo lo desplaza hacia arriba.";

  if (cmd.startsWith("ls")) {
    const flags = cmd.match(/-\w+/g)?.join("") || "";
    if (flags.includes("l"))
      return "El formato largo ('ls -l') muestra permisos, propietario, grupo, tamaño y fecha de cada archivo.\nLos permisos se leen como 3 bloques de 'rwx': usuario, grupo y otros.\n• r = lectura  • w = escritura  • x = ejecución";
    if (flags.includes("a"))
      return "El flag '-a' muestra TODOS los archivos, incluidos los ocultos (los que empiezan con '.').\nEn Linux los archivos ocultos no son un sistema de seguridad, simplemente se ocultan de la vista normal para mantener el directorio limpio.";
    if (cmd.includes(" ") && !cmd.startsWith("ls -"))
      return "'ls' puede recibir una ruta como argumento para mostrar el contenido de otro directorio sin tener que moverte hacia él.";
    return "'ls' (list) muestra los archivos en la carpeta actual.\nEn Linux los archivos que empiezan con un punto '.' son ocultos y no son visibles sin la opción '-a'.";
  }

  if (cmd === "pwd")
    return "'pwd' (print working directory) muestra la ruta completa de la carpeta en la que te encuentras actualmente.";

  if (cmd.startsWith("cd")) {
    const dir = cmd.split(" ")[1];
    if (dir === "documentos/" || dir === "documentos")
      return 'Recibes un error porque Linux diferencia mayúsculas de minúsculas (case-sensitive). La carpeta correcta es "Documentos" con \'D\' mayúscula.';
    return "'cd' (change directory) sirve para moverte de carpeta. Un error común es equivocarse de mayúsculas/minúsculas.\nCuando no se especifica una ruta te lleva a la carpeta principal, representada con '~'.";
  }

  if (cmd === "hostname -I")
    return "'hostname -I' es la forma más rápida de ver solo tu dirección IP, sin la información extra de las interfaces de red.";
  if (cmd === "ifconfig")
    return "'ifconfig' (interface configuration) muestra la configuración de todas las interfaces de red. Tu IP está al lado de 'inet' bajo 'wlan0'. La dirección MAC (física) está al lado de 'ether'.";
  if (cmd.startsWith("ip"))
    return "'ip a' (o 'ip addr') es el estándar moderno en Linux para ver la configuración de red y las direcciones IPs de tu equipo.";

  if (cmd.startsWith("chmod"))
    return "'chmod' cambia los permisos de un archivo.\n• Notación simbólica: 'chmod u+x archivo' (añade ejecución al usuario)\n• Notación numérica: 'chmod 755 archivo' (rwxr-xr-x)\nLos números representan: 4=lectura, 2=escritura, 1=ejecución.";

  if (cmd.startsWith("rm"))
    return "⚠️ 'rm' elimina archivos de forma PERMANENTE. No hay papelera de reciclaje.\n'rm -r' elimina directorios con todo su contenido.\n'rm -rf' fuerza la eliminación sin preguntar. ¡Usa con precaución!";

  if (cmd === "top" || cmd === "htop")
    return "'top' muestra los procesos del sistema en tiempo real.\n• PID: Identificador único del proceso\n• %CPU: Porcentaje de CPU que consume\n• %MEM: Porcentaje de memoria RAM\n• COMMAND: Nombre del programa\nUsa Ctrl+C para salir.";

  if (cmd.startsWith("kill"))
    return "'kill' envía una señal a un proceso para detenerlo.\n• kill <PID>: Terminación normal (SIGTERM)\n• kill -9 <PID>: Terminación forzada (SIGKILL)\nNecesitas conocer el PID del proceso, que puedes obtener con 'top' o 'ps aux'.";

  if (cmd.includes("| grep"))
    return "'grep' filtra líneas de texto que contengan una palabra clave.\nEl símbolo '|' (pipe) conecta la salida de un comando con la entrada de otro.\nEjemplo: 'ifconfig | grep ether' muestra solo las líneas que contienen 'ether'.";

  if (cmd.startsWith("cat"))
    return "'cat' (concatenate) muestra el contenido de un archivo en la terminal. Es la forma más rápida de leer archivos de texto.";

  return null;
}

// ── Ping explanation helper ──────────────────────────────
function getPingExplanation(target, isTimeout, isUnreachable) {
  if (isTimeout)
    return `En este escenario ("${target}"), los paquetes se envían pero no hay respuesta. Al cancelar (Ctrl+C), verás "100% packet loss". Esto pasa si un firewall bloquea los pings o el servidor está apagado.`;
  if (isUnreachable)
    return `El error "Destination Host Unreachable" indica que el router no sabe cómo llegar a "${target}" o el equipo no existe en esa red local.`;
  return `Un ping exitoso muestra la respuesta de cada paquete.\n• bytes: Tamaño del paquete (64 bytes).\n• icmp_seq: Secuencia del paquete.\n• ttl (Time To Live): Cuántos "saltos" puede dar.\n• time: Latencia (ida y vuelta).`;
}

// ═══════════════════════════════════════════════════════════
export default function App() {
  // ── Core state ──────────────────────────────────────────
  const [currentClass, setCurrentClass] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [explanation, setExplanation] = useState(null);

  // ── Challenge state (persists across tab switches) ─────
  // Shape: { [lessonIndex]: { completed: bool, discovered: { [btnValue]: true } } }
  const [challengeState, setChallengeState] = useState({});
  const [topProcessAlive, setTopProcessAlive] = useState(true);

  // ── Refs ────────────────────────────────────────────────
  const intervalRef = useRef(null);
  const pingStatsRef = useRef(null);
  const topRef = useRef(false);

  // ── Challenge helpers ──────────────────────────────────
  const getChallengeCompleted = (idx) => challengeState[idx]?.completed || false;
  const getDiscoveredButtons = (idx) => challengeState[idx]?.discovered || {};

  const markCompleted = (idx) => {
    setChallengeState((prev) => ({
      ...prev,
      [idx]: { ...prev[idx], completed: true, completedAt: new Date().toLocaleTimeString() },
    }));
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, zIndex: 1000 });
  };

  const discoverButton = (idx, btnValue) => {
    setChallengeState((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        discovered: { ...(prev[idx]?.discovered || {}), [btnValue]: true },
      },
    }));
  };

  // ── Only reset explanation on tab switch (challenge state persists) ──
  useEffect(() => {
    setExplanation(null);
  }, [currentClass]);

  // ── Boot message ────────────────────────────────────────
  useEffect(() => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
  }, []);

  // ── Process management ─────────────────────────────────
  const stopProcess = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleTerminalClose = () => {
    stopProcess();
    topRef.current = false;
    setIsTerminalOpen(false);
  };

  const handleTerminalOpen = () => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
    setCurrentInput("");
    setCurrentDirectory("~");
    setIsTerminalOpen(true);
  };

  // ── Ping command ────────────────────────────────────────
  const stopPing = (completedNormally = false) => {
    stopProcess();
    if (pingStatsRef.current) {
      const { target, count, isTimeout, isUnreachable } = pingStatsRef.current;
      const loss = isTimeout || isUnreachable ? "100" : "0";
      const recv = isTimeout || isUnreachable ? "0" : count;
      const prefix = completedNormally ? "" : "^C\n";
      setHistory((prev) => [
        ...prev,
        {
          text: `${prefix}--- ${target} ping statistics ---\n${count} packets transmitted, ${recv} received, ${loss}% packet loss, time ${count * 1000}ms`,
          isCommand: false,
        },
      ]);
      pingStatsRef.current = null;
    }
  };

  const startPingCommand = (cmd) => {
    const args = cmd.split(" ").filter(Boolean);
    const target = args[args.length - 1];

    if (target === "ping" || target.startsWith("-")) {
      setHistory((prev) => [
        ...prev,
        { text: "ping: falta el operando de destino\nPruebe 'ping -h' para más información.", isCommand: false },
      ]);
      return;
    }

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const isLocal = target === "127.0.0.1" || target.startsWith("193.169.");

    if (!isInternetConnected && !isLocal && !isIp) {
      setHistory((prev) => [
        ...prev,
        { text: `ping: ${target}: Nombre o servicio desconocido`, isCommand: false },
      ]);
      setExplanation(
        `El error "Nombre o servicio desconocido" ocurre porque el sistema no puede traducir el dominio "${target}" a una dirección IP (DNS).`
      );
      return;
    }

    if (target === "error.com" || target === "unknown.local") {
      setHistory((prev) => [
        ...prev,
        { text: `ping: ${target}: Nombre o servicio desconocido`, isCommand: false },
      ]);
      setExplanation(
        `El error "Nombre o servicio desconocido" significa que el servidor DNS no tiene un registro para "${target}".`
      );
      return;
    }

    setIsRunning(true);

    const cIdx = args.indexOf("-c");
    let maxCount = Infinity;
    if (cIdx !== -1 && args[cIdx + 1]) maxCount = parseInt(args[cIdx + 1]) || Infinity;

    let ip = "172.217.30.206";
    const isTimeout = target === "timeout.com";
    const isUnreachable = target === "193.169.0.254" || target === "unreachable.com";

    if (target === "127.0.0.1") ip = "127.0.0.1";
    else if (isIp) ip = target;
    else if (isTimeout) ip = "93.184.216.34";
    else if (isUnreachable) ip = "10.255.255.1";

    setExplanation(getPingExplanation(target, isTimeout, isUnreachable));
    pingStatsRef.current = { target, count: 0, maxCount, isTimeout, isUnreachable };

    setHistory((prev) => [
      ...prev,
      { text: `PING ${target} (${ip}) 56(84) bytes of data.`, isCommand: false },
    ]);

    intervalRef.current = setInterval(() => {
      pingStatsRef.current.count++;
      const { count } = pingStatsRef.current;

      if (isUnreachable) {
        setHistory((prev) => [
          ...prev,
          { text: `From 193.169.1.12 icmp_seq=${count} Destination Host Unreachable`, isCommand: false },
        ]);
      } else if (!isTimeout) {
        const time =
          ip === "127.0.0.1"
            ? "0.0" + Math.floor(Math.random() * 90 + 10)
            : (12 + Math.random() * 2).toFixed(1);
        const ttl = ip === "127.0.0.1" ? 64 : 117;
        const pnboga = ip === "172.217.30.206" ? "pnboga-af-in-f14.1e100.net " : "";
        setHistory((prev) => [
          ...prev,
          { text: `64 bytes from ${pnboga}(${ip}): icmp_seq=${count} ttl=${ttl} time=${time} ms`, isCommand: false },
        ]);
      }

      if (count >= maxCount) stopPing(true);
    }, 1000);
  };

  // ── Top / htop command ─────────────────────────────────
  const startTopCommand = (isHtop) => {
    topRef.current = true;
    setIsRunning(true);

    const ch3Idx = LESSONS.findIndex((l) => l.challengeId === "challenge_3");

    // Discover kill/PID buttons for challenge 3
    discoverButton(ch3Idx, "kill");
    discoverButton(ch3Idx, "2026");

    const output = buildTopOutput(isHtop, topProcessAlive);
    setHistory((prev) => [...prev, { text: output, isCommand: false }]);

    // Periodic refresh to simulate live monitoring
    intervalRef.current = setInterval(() => {
      if (!topProcessAlive) return;
      const cpu = (98 + Math.random() * 1.5).toFixed(1);
      const mem = (40 + Math.random() * 2).toFixed(1);
      setHistory((prev) => [
        ...prev,
        { text: ` 2026 root      20   0  ${cpu} ${mem}   8:42.13 proceso_basura`, isCommand: false },
      ]);
    }, 2000);
  };

  // ── Challenge discovery & completion checks ────────────
  const checkChallengeDiscovery = (cmd) => {
    const ch1Idx = LESSONS.findIndex((l) => l.challengeId === "challenge_1");

    // Challenge 1: ls -a in ~/Documentos → reveal .secret_password.txt
    if (cmd.startsWith("ls") && cmd.includes("-a")) {
      if (currentDirectory === "~/Documentos" || cmd.includes("Documentos")) {
        discoverButton(ch1Idx, ".secret_password.txt");
      }
    }
  };

  const checkChallengeCompletion = (cmd, result) => {
    const ch1Idx = LESSONS.findIndex((l) => l.challengeId === "challenge_1");

    // Challenge 1: cat .secret_password.txt in ~/Documentos
    if (cmd === "cat .secret_password.txt" && currentDirectory === "~/Documentos") {
      if (!getChallengeCompleted(ch1Idx)) markCompleted(ch1Idx);
    }
  };

  // ── Main action handler ────────────────────────────────
  const handleAction = (action) => {
    if (action === "next_lesson") {
      setCurrentClass(Math.min(currentClass + 1, LESSONS.length - 1));
      return;
    }

    if (action === "clear_input") {
      setCurrentInput("");
      return;
    }

    if (action === "ctrl+alt+t") {
      handleTerminalOpen();
      return;
    }

    if (action === "clean" && isTerminalOpen) {
      if (isRunning) {
        if (pingStatsRef.current) {
          stopPing(false);
        } else {
          if (topRef.current) topRef.current = false;
          stopProcess();
          setHistory((prev) => [...prev, { text: "^C", isCommand: false }]);
        }
      } else {
        setHistory((prev) => [
          ...prev,
          { text: currentInput + "^C", isCommand: true, dir: currentDirectory },
        ]);
      }
      setCurrentInput("");
      return;
    }

    if (action === "enter" && isTerminalOpen) {
      if (isRunning) return;
      const finalInput = currentInput.trim();

      if (!finalInput) {
        setHistory((prev) => [...prev, { text: "", isCommand: true, dir: currentDirectory }]);
        return;
      }

      setHistory((prev) => [...prev, { text: finalInput, isCommand: true, dir: currentDirectory }]);

      // ── Intercepted commands (special handling) ──────
      // clear
      if (finalInput === "clear") {
        setHistory([]);
        setExplanation(getExplanation("clear"));
        setCurrentInput("");
        return;
      }

      // ping
      if (finalInput.startsWith("ping")) {
        setExplanation(getExplanation(finalInput));
        startPingCommand(finalInput);
        setCurrentInput("");
        return;
      }

      // top / htop
      if (finalInput === "top" || finalInput === "htop") {
        setExplanation(getExplanation(finalInput));
        startTopCommand(finalInput === "htop");
        setCurrentInput("");
        return;
      }

      // kill 2026 (challenge 3 special case)
      if (finalInput.match(/^kill\s+(-\d+\s+)?2026$/)) {
        setExplanation(getExplanation("kill 2026"));
        if (topProcessAlive) {
          setTopProcessAlive(false);
          setHistory((prev) => [
            ...prev,
            { text: "✓ Proceso 'proceso_basura' (PID 2026) terminado exitosamente.\nEl sistema ha vuelto a la normalidad.", isCommand: false },
          ]);
          const ch3Idx = LESSONS.findIndex((l) => l.challengeId === "challenge_3");
          if (!getChallengeCompleted(ch3Idx)) markCompleted(ch3Idx);
        } else {
          setHistory((prev) => [
            ...prev,
            { text: "bash: kill: (2026) - No existe el proceso", isCommand: false },
          ]);
        }
        setCurrentInput("");
        return;
      }

      // ── Standard commands via mockCommandResponse ────
      setExplanation(getExplanation(finalInput));
      checkChallengeDiscovery(finalInput);

      const res = mockCommandResponse(finalInput, { currentDirectory, isInternetConnected });

      if (res && res.type === "cd") {
        setCurrentDirectory(res.newDir);
      } else if (res !== null && res !== "") {
        setHistory((prev) => [...prev, { text: res, isCommand: false }]);
        checkChallengeCompletion(finalInput, res);
      }

      setCurrentInput("");
    }
  };

  // ── Button typing handler ──────────────────────────────
  const handleType = (text) => {
    if (!isTerminalOpen || isRunning) return;
    setCurrentInput((prev) => {
      let next = prev + text + " ";
      next = next.replace(/\s+/g, " ");
      if (next.startsWith(" ")) next = next.slice(1);
      return next;
    });
  };

  const handleInputChange = (text) => {
    if (!isTerminalOpen || isRunning) return;
    setCurrentInput(text);
  };

  // ── Derived values for current view ────────────────────
  const currentLesson = LESSONS[currentClass];
  const currentChallengeCompleted = getChallengeCompleted(currentClass);
  const currentDiscovered = getDiscoveredButtons(currentClass);
  const currentChallengeCompletedAt = challengeState[currentClass]?.completedAt;

  // ── Render ──────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen bg-black flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-[56.25dvh] h-[100dvh] relative flex bg-[#1e1e1e] shadow-2xl overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">

          {/* Top: Desktop Environment */}
          <div className="h-[45%] w-full relative flex items-start justify-center bg-black" style={{ height: "max-content" }}>
            <Desktop
              onTerminalOpen={handleTerminalOpen}
              isInternetConnected={isInternetConnected}
              onToggleInternet={() => setIsInternetConnected(!isInternetConnected)}
            >
              <Terminal
                isOpen={isTerminalOpen}
                onClose={handleTerminalClose}
                history={history}
                currentDirectory={currentDirectory}
                currentInput={currentInput}
                isRunning={isRunning}
                onType={handleInputChange}
                onEnter={() => handleAction("enter")}
                onCtrlC={() => handleAction("clean")}
              />
            </Desktop>
          </div>

          {/* Bottom: Interactive Interface */}
          <div className="w-full h-full flex flex-col">
            <BottomInterface
              lesson={currentLesson}
              currentInput={currentInput}
              isTerminalOpen={isTerminalOpen}
              onAction={handleAction}
              onType={handleType}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              currentDirectory={currentDirectory}
              explanation={explanation}
              challengeCompleted={currentChallengeCompleted}
              challengeCompletedAt={currentChallengeCompletedAt}
              discoveredButtons={currentDiscovered}
              isLastLesson={currentClass === LESSONS.length - 1}
            />
          </div>

        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        lessons={LESSONS}
        sections={SECTIONS}
        currentClass={currentClass}
        onSelectClass={setCurrentClass}
      />
    </div>
  );
}
