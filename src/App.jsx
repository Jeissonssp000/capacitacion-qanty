import { useState, useEffect } from 'react';
import Desktop from './components/Desktop';
import Terminal from './components/Terminal';
import Sidebar from './components/Sidebar';
import BottomInterface from './components/BottomInterface';

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
      { label: "Descargas/", value: "Descargas/" }
    ]
  },
  {
    title: "Comando ping",
    description: "El comando ping comprueba la conexión con otro equipo en la red o internet enviando paquetes de datos.",
    buttons: [
      { label: "ping", value: "ping" },
      { label: "google.com", value: "google.com" },
      { label: "127.0.0.1", value: "127.0.0.1" },
      { label: "-c 4", value: "-c 4" }
    ]
  },
  {
    title: "Comando ip",
    description: "Muestra la configuración de red y la dirección IP asignada a tu máquina.",
    buttons: [
      { label: "ifconfig", value: "ifconfig" },
      { label: "ip addr", value: "ip addr" },
      { label: "ip a", value: "ip a" }
    ]
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
    id: "ping_google",
    command: "ping google.com",
    response: `PING google.com (142.250.190.46) 56(84) bytes of data.
64 bytes from 142.250.190.46: icmp_seq=1 ttl=115 time=20.4 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=115 time=21.1 ms`
  },
  {
    id: "ping_localhost",
    command: "ping 127.0.0.1",
    response: `PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.035 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.041 ms`
  },
  {
    id: "ping_c4",
    command: "ping -c 4 google.com",
    response: `PING google.com (142.250.190.46) 56(84) bytes of data.
64 bytes from 142.250.190.46: icmp_seq=1 ttl=115 time=20.4 ms
64 bytes from 142.250.190.46: icmp_seq=2 ttl=115 time=20.9 ms
64 bytes from 142.250.190.46: icmp_seq=3 ttl=115 time=21.2 ms
64 bytes from 142.250.190.46: icmp_seq=4 ttl=115 time=20.8 ms

--- google.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms`
  },
  {
    id: "ifconfig",
    command: "ifconfig",
    response: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN 
    inet 127.0.0.1/8 scope host lo
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP 
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic wlan0`
  },
  {
    id: "ip_addr",
    command: "ip addr",
    response: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN 
    inet 127.0.0.1/8 scope host lo
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP 
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic wlan0`
  },
  {
    id: "ip_a",
    command: "ip a",
    response: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN 
    inet 127.0.0.1/8 scope host lo
2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP 
    inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic wlan0`
  }
];

const mockCommandResponse = (cmd, state) => {
  const c = cmd.trim().replace(/\s+/g, ' ');
  if (!c) return null;
  const { currentDirectory, isInternetConnected } = state;

  if (c === "pwd") {
    return currentDirectory === "~" ? "/home/qanty" : `/home/qanty/${currentDirectory.replace('~/', '')}`;
  }

  if (c === "ls" || c === "ls -a") {
    const isAll = c === "ls -a";
    if (currentDirectory === "~") {
      return isAll ? ".  ..  .bashrc  Escritorio  Documentos  Descargas" : "Escritorio  Documentos  Descargas";
    } else if (currentDirectory === "~/Escritorio") {
      return isAll ? ".  ..  Terminal.desktop" : "Terminal.desktop";
    } else if (currentDirectory === "~/Descargas") {
      return isAll ? ".  ..  .oculto" : "";
    } else if (currentDirectory === "~/Documentos") {
      return isAll ? ".  .." : "";
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

  if (c.startsWith("ping")) {
    const isGoogle = c.includes("google.com");
    if (isGoogle && !isInternetConnected) {
      return `ping: ${c.split(" ")[c.split(" ").length - 1]}: Fallo temporal en la resolución del nombre`;
    }
    const found = COMMAND_RESPONSES.find(item => item.command === c);
    if (found) return found.response;
    return `ping: ${c.split(" ")[c.split(" ").length - 1]}: Name or service not known`;
  }

  const found = COMMAND_RESPONSES.find(item => item.command === c);
  if (found) {
    return found.response;
  }

  if (c.startsWith("cd ")) {
    const dir = c.split(" ")[1];
    return `bash: cd: ${dir}: No existe el archivo o el directorio`;
  }

  return `bash: ${c.split(' ')[0]}: no se encontró la orden`;
};

export default function App() {
  const [currentClass, setCurrentClass] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentInput, setCurrentInput] = useState("");
  const [history, setHistory] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState("~");
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  useEffect(() => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
  }, []);

  // Handle Resize for Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTerminalOpen = () => {
    setHistory([{ text: "Bienvenido a Linux Mint 21.2 Cinnamon 64-bit", isCommand: false }]);
    setCurrentInput("");
    setCurrentDirectory("~");
    setIsTerminalOpen(true);
  };

  const handleAction = (action) => {
    if (action === "ctrl+alt+t") {
      handleTerminalOpen();
    } else if (action === "clean" && isTerminalOpen) {
      setCurrentInput("");
    } else if (action === "enter" && isTerminalOpen) {
      const finalInput = currentInput.trim();

      if (!finalInput) {
        setHistory(prev => [...prev, { text: "", isCommand: true, dir: currentDirectory }]);
        return;
      }

      setHistory(prev => [...prev, { text: finalInput, isCommand: true, dir: currentDirectory }]);

      const res = mockCommandResponse(finalInput, { currentDirectory, isInternetConnected });
      if (res && res.type === "cd") {
        setCurrentDirectory(res.newDir);
      } else if (res !== null && res !== "") {
        setHistory(prev => [...prev, { text: res, isCommand: false }]);
      }

      setCurrentInput("");
    }
  };

  const handleType = (text) => {
    if (!isTerminalOpen) return;
    setCurrentInput(prev => {
      let next = prev + text + " ";
      // sanitización de espacios extra
      next = next.replace(/\s+/g, ' ');
      // no permitir espacio al inicio
      if (next.startsWith(' ')) next = next.slice(1);
      return next;
    });
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
                onClose={() => setIsTerminalOpen(false)}
                history={history}
                currentDirectory={currentDirectory}
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
