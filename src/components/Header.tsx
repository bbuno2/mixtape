import { useState } from "react";
import { Music, Search, ShieldCheck, LogOut, Sun, Moon, Compass, Library } from "lucide-react";
import { useMusicStore } from "../store/musicStore";
import { AdminModal } from "./AdminModal";

export function Header() {
  const { searchQuery, setSearchQuery, isAdminMode, toggleAdminMode, isLightMode, toggleLightMode } = useMusicStore();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const handleAdminClick = () => { if (isAdminMode) toggleAdminMode(); else setShowAdminModal(true); };
  const border = isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)";
  const navBg = isLightMode ? "rgba(250,250,248,0.92)" : "rgba(8,8,8,0.9)";
  const textColor = isLightMode ? "#111" : "#fff";
  const mutedColor = isLightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)";
  const inputBg = isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";
  const btnBg = isLightMode ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)";
  const borderColor2 = isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)";
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-3 transition-all" style={{ background: navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2 w-52">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 0 14px rgba(249,115,22,0.35)" }}>
            <Music className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight" style={{ color: textColor, fontFamily: "Syne, sans-serif" }}>MIXTAPE</span>
        </div>
        <nav className="flex-1 flex items-center justify-center gap-3">
          <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: mutedColor }} onMouseEnter={e => (e.currentTarget.style.color = textColor)} onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}>
            <Compass className="w-4 h-4" />Explorar
          </a>
          <a href="#biblioteca" className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: mutedColor }} onMouseEnter={e => (e.currentTarget.style.color = textColor)} onMouseLeave={e => (e.currentTarget.style.color = mutedColor)}>
            <Library className="w-4 h-4" />Minhas Músicas
          </a>
        </nav>
        <div className="flex items-center gap-2 w-52 justify-end">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: mutedColor }} />
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="rounded-full pl-8 pr-4 py-1.5 text-xs focus:outline-none w-32 transition-all" style={{ background: inputBg, border: `1px solid ${borderColor2}`, color: textColor }} />
          </div>
          <button onClick={handleAdminClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all" style={isAdminMode ? { background: "#f97316", color: "#fff", boxShadow: "0 0 16px rgba(249,115,22,0.3)" } : { background: btnBg, color: mutedColor, border: `1px solid ${borderColor2}` }}>
            {isAdminMode ? <><LogOut className="w-3 h-3" />Sair</> : <><ShieldCheck className="w-3 h-3" />Admin</>}
          </button>
          <button onClick={toggleLightMode} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: btnBg, border: `1px solid ${borderColor2}`, color: mutedColor }}>
            {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} />
    </>
  );
}