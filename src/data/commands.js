// ── Static command responses ──────────────────────────────
const COMMAND_RESPONSES = {
  ifconfig: `lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
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
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0`,

  "ip addr": `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
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
       valid_lft forever preferred_lft forever`,

  "ip a": `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
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
       valid_lft forever preferred_lft forever`,

  "hostname -I": "193.169.1.12",

  "ip route": `default via 193.169.1.1 dev wlan0 proto dhcp metric 600 
193.169.1.0/24 dev wlan0 proto kernel scope link src 193.169.1.12 metric 600`,
};

// ── Long-listing data per directory ──────────────────────
const LS_LONG = {
  "~": {
    visible: [
      "-rw-r--r-- 1 qanty qanty  128 jun  4 10:30 archivo.sh",
      "-rw-r--r-- 1 qanty qanty   42 jun  4 10:30 archivo.txt",
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 Descargas",
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 Documentos",
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 Escritorio",
    ],
    hidden: [
      "drwxr-xr-x 8 qanty qanty 4096 jun  4 10:30 .",
      "drwxr-xr-x 3 root  root  4096 jun  4 10:00 ..",
      "-rw-r--r-- 1 qanty qanty  220 jun  4 10:00 .bashrc",
    ],
  },
  "~/Escritorio": {
    visible: [
      "-rw-r--r-- 1 qanty qanty 2048 jun  4 10:30 Terminal.desktop",
    ],
    hidden: [
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 .",
      "drwxr-xr-x 8 qanty qanty 4096 jun  4 10:30 ..",
    ],
  },
  "~/Documentos": {
    visible: [],
    hidden: [
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 .",
      "drwxr-xr-x 8 qanty qanty 4096 jun  4 10:30 ..",
      "-rw------- 1 qanty qanty   35 jun  4 10:30 .secret_password.txt",
    ],
  },
  "~/Descargas": {
    visible: [],
    hidden: [
      "drwxr-xr-x 2 qanty qanty 4096 jun  4 10:30 .",
      "drwxr-xr-x 8 qanty qanty 4096 jun  4 10:30 ..",
      "-rw-r--r-- 1 qanty qanty   12 jun  4 10:30 .oculto",
    ],
  },
};

// ── Short-listing data per directory ─────────────────────
const LS_SHORT = {
  "~": {
    visible: "archivo.sh  archivo.txt  Descargas  Documentos  Escritorio",
    all: ".  ..  .bashrc  archivo.sh  archivo.txt  Descargas  Documentos  Escritorio",
  },
  "~/Escritorio": {
    visible: "Terminal.desktop",
    all: ".  ..  Terminal.desktop",
  },
  "~/Documentos": {
    visible: "",
    all: ".  ..  .secret_password.txt",
  },
  "~/Descargas": {
    visible: "",
    all: ".  ..  .oculto",
  },
};

// ── Top / htop process table ─────────────────────────────
export function buildTopOutput(isHtop, processAlive) {
  const header = isHtop
    ? "  CPU[||||||||||||||||||||||||||||  99.3%]   Mem[||||||||||||||       5.8G/7.7G]\n  Tasks: 187, 12 thr; 2 running\n  Uptime: 02:30:15\n"
    : `top - 15:09:35 up 2:30,  1 user,  load average: 0.98, 0.75, 0.52
Tasks: 187 total,   2 running, 185 sleeping,   0 stopped,   0 zombie
%Cpu(s): 99.3 us,  0.3 sy,  0.0 ni,  0.3 id,  0.0 wa
MiB Mem :   7856.4 total,   1024.2 free,   5832.2 used
MiB Swap:   2048.0 total,   1536.0 free,    512.0 used
`;

  const tableHeader =
    "  PID USER      PR  NI  %CPU %MEM     TIME+ COMMAND";

  const rows = [];
  if (processAlive) {
    rows.push(
      " 2026 root      20   0  99.3 41.2   8:42.13 proceso_basura"
    );
  }
  rows.push(
    " 1284 qanty     20   0   1.3  0.6   0:12.45 firefox",
    "  892 root      20   0   0.7  0.2   0:05.21 systemd-journal",
    "  445 qanty     20   0   0.3  0.0   0:01.12 bash",
    "    1 root      20   0   0.0  0.2   0:03.45 systemd"
  );

  return `${header}\n${tableHeader}\n${rows.join("\n")}`;
}

// ── Resolve target directory for ls ──────────────────────
function resolveTargetDir(dirArg, currentDirectory, isAll) {
  if (!dirArg) return currentDirectory;

  const cleanDir = dirArg.replace(/\/$/, "");

  if (["Documentos", "Escritorio", "Descargas"].includes(cleanDir)) {
    if (currentDirectory === "~") return `~/${cleanDir}`;
    return { error: `ls: no se puede acceder a '${dirArg}': No existe el archivo o el directorio` };
  }
  if (cleanDir === "..") {
    if (currentDirectory === "~") {
      return { inline: isAll ? ".  ..  qanty" : "qanty" };
    }
    return "~";
  }
  if (cleanDir === ".") return currentDirectory;
  if (cleanDir === "~") return "~";
  if (cleanDir === "/") {
    return {
      inline: isAll
        ? ".  ..  bin  boot  dev  etc  home  lib  opt  root  run  sbin  tmp  usr  var"
        : "bin  boot  dev  etc  home  lib  opt  root  run  sbin  tmp  usr  var",
    };
  }

  return { error: `ls: no se puede acceder a '${dirArg}': No existe el archivo o el directorio` };
}

// ── Main command processor ───────────────────────────────
export function mockCommandResponse(cmd, state) {
  const c = cmd.trim().replace(/\s+/g, " ");
  if (!c) return null;
  const { currentDirectory } = state;

  // ── Pipe support (only grep) ────────────────────────────
  if (c.includes(" | ")) {
    const pipeIdx = c.indexOf(" | ");
    const leftCmd = c.substring(0, pipeIdx).trim();
    const rightCmd = c.substring(pipeIdx + 3).trim();

    const leftResult = mockCommandResponse(leftCmd, state);
    if (leftResult === null || typeof leftResult !== "string") return leftResult;
    if (leftResult === "") return "";

    if (rightCmd.startsWith("grep ")) {
      const keyword = rightCmd.substring(5).trim();
      if (!keyword) return leftResult;
      const filtered = leftResult.split("\n").filter((l) => l.includes(keyword));
      return filtered.length > 0 ? filtered.join("\n") : "";
    }
    return `bash: ${rightCmd.split(" ")[0]}: no se encontró la orden`;
  }

  // ── pwd ─────────────────────────────────────────────────
  if (c === "pwd") {
    return currentDirectory === "~"
      ? "/home/qanty"
      : `/home/qanty/${currentDirectory.replace("~/", "")}`;
  }

  // ── ls (all variants) ──────────────────────────────────
  if (c === "ls" || c.startsWith("ls ")) {
    const args = c.split(" ").filter(Boolean);
    const flags = args.filter((a) => a.startsWith("-")).join("").replace(/-/g, "");
    const isAll = flags.includes("a");
    const isLong = flags.includes("l");
    const dirArg = args.find((a) => a !== "ls" && !a.startsWith("-"));

    const resolved = resolveTargetDir(dirArg, currentDirectory, isAll);
    if (typeof resolved === "object" && resolved !== null) {
      if (resolved.error) return resolved.error;
      if (resolved.inline) return resolved.inline;
    }
    const targetDir = typeof resolved === "string" ? resolved : currentDirectory;

    if (isLong) {
      const data = LS_LONG[targetDir];
      if (!data) return "";
      const lines = isAll ? [...data.hidden, ...data.visible] : [...data.visible];
      if (lines.length === 0) return "total 0";
      return `total ${lines.length * 4}\n${lines.join("\n")}`;
    }

    const data = LS_SHORT[targetDir];
    if (!data) return "";
    return isAll ? data.all : data.visible;
  }

  // ── cd ──────────────────────────────────────────────────
  if (c === "cd" || c.startsWith("cd ")) {
    const dir = c.split(" ")[1];
    if (!dir || dir === "~") return { type: "cd", newDir: "~" };
    if (dir === "..") {
      return currentDirectory !== "~" ? { type: "cd", newDir: "~" } : "";
    }
    if (dir === ".") return "";

    const cleanDir = dir.replace(/\/$/, "");
    if (currentDirectory === "~" && ["Escritorio", "Documentos", "Descargas"].includes(cleanDir)) {
      return { type: "cd", newDir: `~/${cleanDir}` };
    }
    return `bash: cd: ${dir}: No existe el archivo o el directorio`;
  }

  // ── cat ─────────────────────────────────────────────────
  if (c.startsWith("cat ")) {
    const filename = c.substring(4).trim();
    if (filename === ".secret_password.txt") {
      if (currentDirectory === "~/Documentos") {
        return "¡Contraseña descifrada!\n Contraseña: qanty2026_super_secret";
      }
    }
    if (filename === "archivo.sh" && currentDirectory === "~") {
      return '#!/bin/bash\necho "Hola desde el script"';
    }
    if (filename === "archivo.txt" && currentDirectory === "~") {
      return "Este es un archivo de texto de ejemplo.";
    }
    return `cat: ${filename}: No existe el archivo o el directorio`;
  }

  // ── chmod ───────────────────────────────────────────────
  if (c.startsWith("chmod ")) {
    const args = c.split(" ").filter(Boolean);
    if (args.length < 3) {
      return "chmod: falta un operando\nPruebe 'chmod --help' para más información.";
    }
    const target = args[args.length - 1];
    if ((target === "archivo.sh" || target === "archivo.txt") && currentDirectory === "~") {
      return "";
    }
    return `chmod: no se puede acceder a '${target}': No existe el archivo o el directorio`;
  }

  // ── rm ──────────────────────────────────────────────────
  if (c.startsWith("rm")) {
    const args = c.split(" ").filter(Boolean);
    if (args.length === 1) {
      return "rm: falta un operando\nPruebe 'rm --help' para más información.";
    }
    const target = args[args.length - 1];
    if ((target === "archivo.txt" || target === "archivo.sh") && currentDirectory === "~") {
      return "";
    }
    if (["Documentos", "Escritorio", "Descargas"].includes(target)) {
      return `rm: no se puede borrar '${target}': Es un directorio`;
    }
    return `rm: no se puede borrar '${target}': No existe el archivo o el directorio`;
  }

  // ── kill (non-special PIDs) ─────────────────────────────
  if (c.startsWith("kill")) {
    const args = c.split(" ").filter(Boolean);
    if (args.length === 1) {
      return "kill: uso: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...";
    }
    const pid = args[args.length - 1];
    return `bash: kill: (${pid}) - No existe el proceso`;
  }

  // ── Static responses (ifconfig, ip, hostname) ──────────
  if (COMMAND_RESPONSES[c]) return COMMAND_RESPONSES[c];

  // ── Default ─────────────────────────────────────────────
  return `bash: ${c.split(" ")[0]}: no se encontró la orden`;
}
