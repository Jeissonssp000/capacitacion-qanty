import { useEffect, useState, useRef } from 'react';
import StartMenu from './StartMenu';
import mintBg from '../assets/mint.jpg';
import { SiIterm2, SiLinuxmint } from 'react-icons/si';
import { IoTerminalOutline, IoWifi } from 'react-icons/io5';
import { VscClose } from 'react-icons/vsc';

const simpleTimeOptions = { hour: '2-digit', minute: '2-digit', hour12: false }
const simpleTime = (date) => new Intl.DateTimeFormat('es-CO', simpleTimeOptions).format(date)
let interval
export default function Desktop({ onTerminalOpen, children, isInternetConnected, onToggleInternet }) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date())
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isStartMenuOpen && 
        menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)
      ) {
        setIsStartMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStartMenuOpen]);

  const handleTerminalOpen = () => {
    setIsStartMenuOpen(false);
    onTerminalOpen();
  };

  useEffect(() => {
    if (interval) clearInterval(interval)
    interval = setInterval(() => {
      setTime(new Date())
    }, 5000);
  }, [])


  return (
    <div
      className="w-full aspect-video relative overflow-hidden flex flex-col justify-between select-none bg-cover bg-center"
      style={{ backgroundImage: `url(${mintBg})`, backgroundColor: '#1a2b3c' }}
    >
      <div ref={menuRef}>
        <StartMenu isOpen={isStartMenuOpen} onTerminalOpen={handleTerminalOpen} />
      </div>
      {/* Desktop Icons */}
      <div
        className="flex flex-col flex-wrap gap-2 max-h-full items-start justify-start flex-1 relative"
      >
        <div
          className="flex flex-col items-center justify-center cursor-pointer p-1 hover:bg-white/10 rounded w-16 m-2"
          onDoubleClick={onTerminalOpen}
        >
          <SiIterm2 style={{ height: "100%" }} className="text-gray-300" />
          <span className="text-white text-[10px] mt-1 drop-shadow-md text-center leading-tight">Terminal</span>
        </div>
        {children}
      </div>

      {/* Taskbar */}
      <div className="w-full h-8 bg-gray-900/80 border-t border-gray-700/50 flex items-center px-2 z-40 relative">
        <div className="w-full flex items-center space-x-2">
          {/* Menu button placeholder */}
          <div
            ref={buttonRef}
            className="w-6 h-6 text-white rounded-sm flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors"
            onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          >
            <SiLinuxmint />
          </div>
          {/* Taskbar icons */}
          <div className='w-full flex justify-between items-center'>
            <div
              className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-sm cursor-pointer"
              onClick={onTerminalOpen}
            >
              <IoTerminalOutline size={18} className="text-gray-300" />
            </div>
            <div className="flex items-center space-x-2">
              <div 
                className="cursor-pointer text-gray-300 hover:text-white flex items-center justify-center"
                onClick={onToggleInternet}
                title={isInternetConnected ? "Internet conectado" : "Sin internet"}
              >
                {isInternetConnected ? <IoWifi size={14} /> : <div className="relative"><IoWifi size={14} className="opacity-50"/><VscClose size={18} className="absolute -top-0.5 -right-0.5 text-red-500 font-bold"/></div>}
              </div>
              <span className='text-white text-[10px] mt-1 drop-shadow-md text-center leading-tight'>{simpleTime(time)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
