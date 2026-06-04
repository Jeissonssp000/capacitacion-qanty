import { useState, useEffect, useRef } from 'react';
import Desktop from './components/Desktop';
import Terminal from './components/Terminal';
import Sidebar from './components/Sidebar';
import BottomInterface from './components/BottomInterface';
import confetti from 'canvas-confetti';

const LESSONS = [
  {
    title: "La terminal",
    description: "La terminal es una interfaz de texto para controlar la computadora. Es la herramienta principal para interactuar con sistemas Linux. Puedes abrirla haciendo doble clic en el ícono del escritorio, haciendo clic en el ícono de la barra inferior, buscándola en el menú de inicio o presionando el atajo de teclado ctrl + alt + t.",
    buttons: []
  },
  {
    title: "Sistema de carpetas",
    description: "Linux organiza todo en carpetas. Usa comandos como 'cd' para moverte y 'ls' para ver archivos.",
    buttons: [
      { label: "pwd", value: "pwd" },
      { label: "cd", value: "cd" },
      { label: "ls", value: "ls" },
      { label: "ls -a", value: "ls -a" },
      { label: "..", value: ".." },
      { label: ".", value: "." },
      { label: "Escritorio/", value: "Escritorio/" },
      { label: "Documentos/", value: "Documentos/" },
      { label: "documentos", value: "documentos" },
      { label: "Descargas/", value: "Descargas/" }
    ]
  },
  {
    title: "Comando ping",
    description: "El comando ping comprueba la conexión enviando paquetes. Prueba casos exitosos o errores como host desconocido, inalcanzable o timeout.",
    buttons: [
      { label: "ping google.com", value: "ping google.com" },
      { label: "ping error.com", value: "ping error.com" },
      { label: "ping 193.169.0.254", value: "ping 193.169.0.254" },
      { label: "ping timeout.com", value: "ping timeout.com" },
      { label: "ping -c 4 127.0.0.1", value: "ping -c 4 127.0.0.1" }
    ]
  },
  {
    title: "Comando ip",
    description: "Muestra la configuración de red y la dirección IP asignada a tu máquina. 'ifconfig' es más antiguo, mientras que 'ip' es el estándar moderno.",
    buttons: [
      { label: "ifconfig", value: "ifconfig" },
      { label: "ip addr", value: "ip addr" },
      { label: "ip a", value: "ip a" },
      { label: "hostname -I", value: "hostname -I" }
    ]
  },
  {
    title: "Reto 1: La Contraseña Oculta",
    description: "Un administrador olvidó la contraseña de acceso en el sistema; por ahí dicen que la guardó en la carpeta de documentos, recuerda que usando 'cd' puedes navegar entre carpetas, 'ls' puedes ver archivos y con 'cat' puedes ver su contenido.",
    buttons: [
      { label: "cd", value: "cd" },
      { label: "pwd", value: "pwd" },
      { label: "ls", value: "ls" },
      { label: "ls -a", value: "ls -a" },
      { label: "cat", value: "cat" },
      { label: "Documentos", value: "Documentos/" },
      { label: ".secret_password.txt", value: ".secret_password.txt" }
    ],
    isChallenge: true
  }
];

const COMMAND_RESPONSES = [
  {
    id: "ls",
    command: "ls",
    response: "Escritorio  Documentos  Descargas"
  },
  {
    id: "cd_escritorio",
    command: "cd Escritorio/",
    response: ""
  },
  {
    id: "cd_documentos",
    command: "cd Documentos/",
    response: ""
  },
  {
    id: "cd_descargas",
    command: "cd Descargas/",
    response: ""
  },
  {
    id: "cd_back",
    command: "cd ..",
    response: ""
  },
  {
    id: "cd_dot",
    command: "cd .",
    response: ""
  },
  {
    id: "ifconfig",
    command: "ifconfig",
    response: `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 20381  bytes 3145698 (3.1 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 20381  bytes 3145698 (3.1 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 193.169.1.12  netmask 255.255.255.0  broadcast 193.169.1.255
        inet6 fe80::5054:ff:fe12:3456  prefixlen 64  scopeid 0x20<link>
        ether 52:54:00:12:34:56  txqueuelen 1000  (Ethernet)
        RX packets 1453221  bytes 1834928192 (1.8 GB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 854321  bytes 93218931 (93.2 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`
  },
  {
    id: "ip_addr",
    command: "ip addr",
    response: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 193.169.1.12/24 brd 193.169.1.255 scope global dynamic wlan0
       valid_lft 86399sec preferred_lft 86399sec
    inet6 fe80::5054:ff:fe12:3456/64 scope link 
       valid_lft forever preferred_lft forever`
  },
  {
    id: "ip_a",
    command: "ip a",
    response: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff
    inet 193.169.1.12/24 brd 193.169.1.255 scope global dynamic wlan0
       valid_lft 86399sec preferred_lft 86399sec
    inet6 fe80::5054:ff:fe12:3456/64 scope link 
       valid_lft forever preferred_lft forever`
  },
  {
    id: "hostname_i",
    command: "hostname -I",
    response: "193.169.1.12"
  },
  {
    id: "ip_route",
    command: "ip route",
    response: `default via 193.169.1.1 dev wlan0 proto dhcp metric 600 
193.169.1.0/24 dev wlan0 proto kernel scope link src 193.169.1.12 metric 600`
  }
];

const mockCommandResponse = (cmd, state) => {
  const c = cmd.trim().replace(/\s+/g, ' ');
  if (!c) return null;
  const { currentDirectory, isInternetConnected } = state;

  if (c === "pwd") {
    return currentDirectory === "~" ? "/home/qanty" : `/home/qanty/${currentDirectory.replace('~/', '')}`;
  }

  if (c.startsWith("ls")) {
    const args = c.split(" ").filter(Boolean);
    const isAll = args.includes("-a");
    const dirArg = args.find(a => a !== "ls" && a !== "-a");
    
    let targetDir = currentDirectory;
    if (dirArg) {
      const cleanDir = dirArg.replace(/\/$/, ""); 
      if (cleanDir === "Documentos" || cleanDir === "Escritorio" || cleanDir === "Descargas") {
        if (currentDirectory === "~") targetDir = `~/${cleanDir}`;
        else return `ls: no se puede acceder a '${dirArg}': No existe el archivo o el directorio`;
      } else if (cleanDir === "..") {
        if (currentDirectory === "~") {
           return isAll ? ".  ..  qanty" : "qanty";
        } else {
           targetDir = "~";
        }
      } else if (cleanDir === ".") {
        targetDir = currentDirectory;
      } else if (cleanDir === "~") {
        targetDir = "~";
      } else if (cleanDir === "/") {
        return isAll ? ".  ..  bin  boot  dev  etc  home  lib  opt  root  run  sbin  tmp  usr  var" : "bin  boot  dev  etc  home  lib  opt  root  run  sbin  tmp  usr  var";
      } else {
        return `ls: no se puede acceder a '${dirArg}': No existe el archivo o el directorio`;
      }
    }

    if (targetDir === "~") {
      return isAll ? ".  ..  .bashrc  Escritorio  Documentos  Descargas" : "Escritorio  Documentos  Descargas";
    } else if (targetDir === "~/Escritorio") {
      return isAll ? ".  ..  Terminal.desktop" : "Terminal.desktop";
    } else if (targetDir === "~/Descargas") {
      return isAll ? ".  ..  .oculto" : "";
    } else if (targetDir === "~/Documentos") {
      return isAll ? ".  ..  .secret_password.txt" : "";
    }
    return "";
  }

  if (c.startsWith("cd")) {
    const args = c.split(" ");
    const dir = args[1];
    
    if (!dir || dir === "~") {
      return { type: "cd", newDir: "~" };
    }
    if (dir === "..") {
      if (currentDirectory !== "~") return { type: "cd", newDir: "~" };
      return "";
    }
    if (dir === ".") {
      return "";
    }
    const cleanDir = dir.replace(/\/$/, ""); 
    
    if (currentDirectory === "~") {
      if (["Escritorio", "Documentos", "Descargas"].includes(cleanDir)) {
        return { type: "cd", newDir: `~/${cleanDir}` };
      }
    }
    return `bash: cd: ${dir}: No existe el archivo o el directorio`;
  }

  const found = COMMAND_RESPONSES.find(item => item.command === c);
  if (found) {
    return found.response;
  }

  if (c === "cat .secret_password.txt") {
     if (currentDirectory === "~/Documentos") {
        return "¡Contraseña descifrada!\n Contraseña: qanty2026_super_secret";
     } else {
        return "cat: .secret_password.txt: No existe el archivo o el directorio";
     }
  }

  if (c.startsWith("cd ")) {
    const dir = c.split(" ")[1];
    return `bash: cd: ${dir}: No existe el archivo o el directorio`;
  }

  return `bash: ${c.split(' ')[0]}: no se encontró la orden`;
};

export default function App() {
  const [currentClass, setCurrentClass] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [isInternetConnected, setIsInternetConnected] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [challenge1Completed, setChallenge1Completed] = useState(false);
  const [secretFileDiscovered, setSecretFileDiscovered] = useState(false);
  const intervalRef = useRef(null);
  const pingStatsRef = useRef(null);

  useEffect(() => {
    setExplanation(null);
    setChallenge1Completed(false);
    setSecretFileDiscovered(false);
  }, [currentClass]);

  const stopProcess = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleTerminalClose = () => {
    stopProcess();
    setIsTerminalOpen(false);
  };

  const stopPing = (completedNormally = false) => {
    stopProcess();
    if (pingStatsRef.current) {
      const { target, count, maxCount, isTimeout, isUnreachable } = pingStatsRef.current;
      const loss = (isTimeout || isUnreachable) ? "100" : "0";
      const recv = (isTimeout || isUnreachable) ? "0" : count;
      const prefix = completedNormally ? "" : "^C\n";
      setHistory(prev => [...prev, { 
        text: `${prefix}--- ${target} ping statistics ---\n${count} packets transmitted, ${recv} received, ${loss}% packet loss, time ${count * 1000}ms`, 
        isCommand: false 
      }]);
      pingStatsRef.current = null;
    }
  };

  const startPingCommand = (cmd) => {
    const args = cmd.split(" ").filter(Boolean);
    const target = args[args.length - 1];

    if (target === "ping" || target.startsWith("-")) {
      setHistory(prev => [...prev, { text: `ping: falta el operando de destino\nPruebe 'ping -h' para más información.`, isCommand: false }]);
      return;
    }

    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
    const isLocal = target === "127.0.0.1" || target.startsWith("193.169.");
    
    if (!isInternetConnected && !isLocal && !isIp) {
      setHistory(prev => [...prev, { text: `ping: ${target}: Nombre o servicio desconocido`, isCommand: false }]);
      setExplanation(`El error "Nombre o servicio desconocido" ocurre porque el sistema no puede traducir el dominio "${target}" a una dirección IP (DNS). Esto suele pasar al no tener conexión a internet o si el dominio no existe.`);
      return;
    }

    if (target === "error.com" || target === "unknown.local") {
      setHistory(prev => [...prev, { text: `ping: ${target}: Nombre o servicio desconocido`, isCommand: false }]);
      setExplanation(`El error "Nombre o servicio desconocido" significa que el servidor DNS no tiene un registro para el dominio "${target}". Es como intentar llamar a alguien que no está en la guía telefónica.`);
      return;
    }

    setIsRunning(true);
    
    const isCountIndex = args.indexOf("-c");
    let maxCount = Infinity;
    if (isCountIndex !== -1 && args[isCountIndex + 1]) {
      maxCount = parseInt(args[isCountIndex + 1]) || Infinity;
    }

    let ip = "172.217.30.206";
    let isTimeout = target === "timeout.com";
    let isUnreachable = target === "193.169.0.254" || target === "unreachable.com";

    if (target === "127.0.0.1") {
      ip = "127.0.0.1";
    } else if (isIp) {
      ip = target;
    } else if (isTimeout) {
      ip = "93.184.216.34";
    } else if (isUnreachable) {
      ip = "10.255.255.1";
    }

    let currentExplanation = "";
    if (isTimeout) {
        currentExplanation = `En este escenario ("${target}"), los paquetes se envían pero no hay respuesta. La terminal se queda esperando silenciosamente. Al cancelar (Ctrl+C), verás un "100% packet loss" (pérdida). Esto pasa si un firewall bloquea los pings o si el servidor remoto está apagado.`;
    } else if (isUnreachable) {
        currentExplanation = `El error "Destination Host Unreachable" (Destino inalcanzable) indica que el router no sabe cómo llegar a "${target}" o el equipo no existe en esa red local. El ping ni siquiera logra salir hacia el destino final.`;
    } else {
        currentExplanation = `Un ping exitoso muestra la respuesta de cada paquete.\n• bytes: Tamaño del paquete (64 bytes).\n• icmp_seq: Secuencia del paquete enviado.\n• ttl (Time To Live): Cuántos "saltos" por routers puede dar el paquete antes de expirar.\n• time: Tiempo que tardó en ir y volver (latencia).`;
    }
    setExplanation(currentExplanation);

    pingStatsRef.current = { target, count: 0, maxCount, isTimeout, isUnreachable };
    
    setHistory(prev => [...prev, { text: `PING ${target} (${ip}) 56(84) bytes of data.`, isCommand: false }]);

    intervalRef.current = setInterval(() => {
      pingStatsRef.current.count++;
      const { count } = pingStatsRef.current;
      
      if (isUnreachable) {
        setHistory(prev => [...prev, { text: `From 193.169.1.12 icmp_seq=${count} Destination Host Unreachable`, isCommand: false }]);
      } else if (!isTimeout) {
        const time = ip === "127.0.0.1" ? "0.0" + Math.floor(Math.random() * 90 + 10) : (12 + Math.random() * 2).toFixed(1);
        const ttl = ip === "127.0.0.1" ? 64 : 117;
        let pnboga = ip === "172.217.30.206" ? "pnboga-af-in-f14.1e100.net " : "";
        setHistory(prev => [...prev, { text: `64 bytes from ${pnboga}(${ip}): icmp_seq=${count} ttl=${ttl} time=${time} ms`, isCommand: false }]);
      }

      if (count >= maxCount) {
        stopPing(true);
      }
    }, 1000);
  };

  useEffect(() => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
  }, []);

  const handleTerminalOpen = () => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
    setCurrentInput("");
    setCurrentDirectory("~");
    setIsTerminalOpen(true);
  };

  const handleAction = (action) => {
    if (action === "next_lesson") {
      setCurrentClass(Math.min(currentClass + 1, LESSONS.length - 1));
      return;
    }
    if (action === "ctrl+alt+t") {
      handleTerminalOpen();
    } else if (action === "clean" && isTerminalOpen) {
      if (isRunning) {
        if (pingStatsRef.current) {
          stopPing(false);
        } else {
          stopProcess();
          setHistory(prev => [...prev, { text: "^C", isCommand: false }]);
        }
      } else {
        setHistory(prev => [...prev, { text: currentInput + "^C", isCommand: true, dir: currentDirectory }]);
      }
      setCurrentInput("");
    } else if (action === "enter" && isTerminalOpen) {
      if (isRunning) return;
      const finalInput = currentInput.trim();

      if (!finalInput) {
        setHistory(prev => [...prev, { text: "", isCommand: true, dir: currentDirectory }]);
        return;
      }

      setHistory(prev => [...prev, { text: finalInput, isCommand: true, dir: currentDirectory }]);

      if (finalInput.startsWith("ping")) {
        startPingCommand(finalInput);
        setCurrentInput("");
        return;
      }

      if (finalInput.startsWith("ls")) {
        const isAll = finalInput.includes("-a");
        const hasDir = finalInput.split(" ").length > (isAll ? 2 : 1);
        let exp = `El comando 'ls' (list) muestra los archivos en la carpeta actual.\nEn linux los archivos y carpetas que empiezan con un punto '.' son ocultos y no son visibles con el comando 'ls' sin la opcion '-a'.`;
        if (hasDir) {
           exp += `\nAl pasarle una ruta específica como argumento (ej. 'ls Documentos/'), 'ls' mostrará el contenido de esa ruta en lugar de la actual sin tener que moverte hacia ella.`;
        }
        setExplanation(exp);
        
        // Reto 1: Secret file discovery
        if (isAll && (currentDirectory === "~/Documentos" || finalInput.includes("Documentos"))) {
          setSecretFileDiscovered(true);
        }
      } else if (finalInput === "pwd") {
        setExplanation(`'pwd' (print working directory) muestra la ruta completa de la carpeta en la que te encuentras actualmente.`);
      } else if (finalInput.startsWith("cd")) {
        const dir = finalInput.split(" ")[1];
        if (dir === "documentos/" || dir === "documentos") {
          setExplanation(`Recibes un error porque Linux diferencia mayúsculas de minúsculas (case-sensitive). La carpeta correcta es "Documentos" con 'D' mayúscula, por lo que "documentos" no existe.`);
        } else {
          setExplanation(`'cd' (change directory) sirve para moverte de carpeta. Un error común es escribir una carpeta que no existe o equivocarse de mayúsculas/minúsculas.\nCuando no se especifica una ruta te lleva a la carpeta principal, representada con '~'`);
        }
      } else if (finalInput.startsWith("ifconfig") || finalInput.startsWith("ip") || finalInput.startsWith("hostname")) {
        if (finalInput === "hostname -I") {
           setExplanation(`'hostname -I' es la forma más rápida y limpia de ver solo tu dirección IP, sin toda la información extra de las interfaces de red.`);
        } else if (finalInput === "ifconfig") {
           setExplanation(`'ifconfig' (interface configuration) es un comando antiguo pero muy conocido. Tu IP es la que está al lado de 'inet' bajo la interfaz 'wlan0' o 'eth0'.`);
        } else {
           setExplanation(`'ip a' (o 'ip addr') es el estándar moderno en Linux para ver la configuración de red y las direcciones IPs de tu equipo.`);
        }
      } else {
        setExplanation(null);
      }

      const res = mockCommandResponse(finalInput, { currentDirectory, isInternetConnected });
      if (res && res.type === "cd") {
        setCurrentDirectory(res.newDir);
      } else if (res !== null && res !== "") {
        setHistory(prev => [...prev, { text: res, isCommand: false }]);
        if (finalInput === "cat .secret_password.txt" && currentDirectory === "~/Documentos") {
          if (!challenge1Completed) {
            setChallenge1Completed(true);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              zIndex: 1000
            });
          }
        }
      }

      setCurrentInput("");
    }
  };

  const handleType = (text) => {
    if (!isTerminalOpen || isRunning) return;
    setCurrentInput(prev => {
      let next = prev + text + " ";
      // sanitización de espacios extra
      next = next.replace(/\s+/g, ' ');
      // no permitir espacio al inicio
      if (next.startsWith(' ')) next = next.slice(1);
      return next;
    });
  };

  const handleInputChange = (text) => {
    if (!isTerminalOpen || isRunning) return;
    setCurrentInput(text);
  };

  return (
    <div className="w-full min-h-screen bg-black flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-[56.25dvh] h-[100dvh] relative flex bg-[#1e1e1e] shadow-2xl overflow-hidden">

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">

          {/* Top: Desktop Environment (40% height) */}
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
                onEnter={() => handleAction('enter')}
                onCtrlC={() => handleAction('clean')}
              />
            </Desktop>
          </div>

          {/* Bottom: Interactive Interface (55% height) */}
          <div className="w-full h-full flex flex-col">
            <BottomInterface
              lesson={LESSONS[currentClass]}
              currentInput={currentInput}
              isTerminalOpen={isTerminalOpen}
              onAction={handleAction}
              onType={handleType}
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              currentDirectory={currentDirectory}
              explanation={explanation}
              challengeCompleted={challenge1Completed}
              secretFileDiscovered={secretFileDiscovered}
              isLastLesson={currentClass === LESSONS.length - 1}
            />
          </div>

        </div>
      </div>

      {/* Sidebar (Absolute to the screen left, placed at the end of DOM for z-index) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        lessons={LESSONS}
        currentClass={currentClass}
        onSelectClass={setCurrentClass}
      />
    </div>
  );
}
