import { useMemo } from 'react';
import { Upload, Music } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';
import { MusicCard } from '../components/MusicCard';

export function Home() {
  const { songs, searchQuery, openUploadModal, isAdminMode, isLightMode } = useMusicStore();

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const q = searchQuery.toLowerCase();
    return songs.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [songs, searchQuery]);

  const text = isLightMode ? '#111' : '#fff';
  const text2 = isLightMode ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)';
  const text3 = isLightMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)';
  const border = isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
  const grid = isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.025)';
  const orb = isLightMode ? 'rgba(249,115,22,0.1)' : 'rgba(249,115,22,0.18)';

  return (
    <main className="min-h-screen pt-14 pb-28 relative overflow-hidden transition-colors duration-400">

      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(${grid} 1px, transparent 1px), linear-gradient(90deg, ${grid} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 65%, transparent 100%)',
        }} />
        {/* Orb */}
        <div className="absolute" style={{
          top: '-80px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: `radial-gradient(ellipse, ${orb} 0%, transparent 70%)`,
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium text-orange-400"
          style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" style={{ boxShadow: '0 0 6px #f97316', animation: 'pulse 2s ease-in-out infinite' }} />
          Sem monetização · 100% gratuito
        </div>

        {/* Title */}
        <h1 className="font-extrabold leading-tight mb-4 tracking-tight transition-colors"
          style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px,6vw,56px)', color: text, letterSpacing: '-1.5px' }}>
          Ouça e descubra<br />
          <span style={{ color: '#f97316' }}>músicas</span> incríveis
        </h1>

        {/* Subtitle */}
        <p className="text-sm max-w-sm leading-relaxed transition-colors" style={{ color: text2 }}>
          Uma plataforma para músicos independentes compartilharem suas criações. Sem custos, apenas música.
        </p>
      </section>

      {/* Divider */}
      <div className="mx-6 mb-0" style={{ height: '1px', background: `linear-gradient(90deg, transparent, ${border} 30%, ${border} 70%, transparent)` }} />

      {/* Library */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-base transition-colors" style={{ fontFamily: 'Syne, sans-serif', color: text }}>
              Biblioteca
            </h2>
            <p className="text-xs mt-0.5 transition-colors" style={{ color: text3 }}>
              {songs.length} {songs.length === 1 ? 'música' : 'músicas'}
            </p>
          </div>
          {isAdminMode && (
            <button onClick={openUploadModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>
              <Upload className="w-3.5 h-3.5" />
              Enviar música
            </button>
          )}
        </div>

        {searchQuery && (
          <p className="text-xs mb-4" style={{ color: text3 }}>
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para "
            <span style={{ color: text2 }}>{searchQuery}</span>"
          </p>
        )}

        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((song) => (
              <MusicCard key={song.id} music={song} index={songs.indexOf(song)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: isLightMode ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)' }}>
              <Music className="w-6 h-6" style={{ color: text3 }} />
            </div>
            <div>
              <p className="font-semibold text-sm transition-colors" style={{ color: text }}>
                {searchQuery ? 'Nenhuma música encontrada' : 'Nenhuma música ainda'}
              </p>
              <p className="text-xs mt-1 transition-colors" style={{ color: text3 }}>
                {searchQuery ? 'Tente buscar por outro nome'
                  : isAdminMode ? 'Clique em "Enviar música" para começar'
                  : 'Ative o modo admin para enviar músicas'}
              </p>
            </div>
            {!searchQuery && isAdminMode && (
              <button onClick={openUploadModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-orange-400 transition-all"
                style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
                <Upload className="w-4 h-4" />
                Enviar primeira música
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
