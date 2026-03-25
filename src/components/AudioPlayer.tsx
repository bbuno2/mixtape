import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';

function formatTime(seconds: number) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const BAR_COUNT = 40;

export function AudioPlayer() {
  const { songs, player, togglePlay, nextSong, prevSong, setVolume, setCurrentTime, setDuration } = useMusicStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const vizRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [vizOn, setVizOn] = useState(true);

  const currentSong = player.currentIndex !== null ? songs[player.currentIndex] : null;

  // Build visualizer bars once
  useEffect(() => {
    if (!vizRef.current) return;
    vizRef.current.innerHTML = '';
    barsRef.current = [];
    for (let i = 0; i < BAR_COUNT; i++) {
      const b = document.createElement('div');
      const alpha = 0.07 + (i % 5) * 0.025;
      b.style.cssText = `flex:1;height:3px;background:rgba(249,115,22,${alpha});border-radius:2px 2px 0 0;`;
      vizRef.current.appendChild(b);
      barsRef.current.push(b);
    }
  }, []);

  // Animate bars
  const phases = useRef(Array.from({ length: BAR_COUNT }, () => Math.random() * Math.PI * 2));
  const speeds = useRef(Array.from({ length: BAR_COUNT }, () => 1.0 + Math.random() * 2.4));
  const amps = useRef(Array.from({ length: BAR_COUNT }, () => 10 + Math.random() * 28));

  const animate = useCallback(() => {
    tRef.current += 0.032;
    barsRef.current.forEach((b, i) => {
      const h = Math.max(2, amps.current[i] * Math.abs(Math.sin(tRef.current * speeds.current[i] + phases.current[i])));
      b.style.height = h + 'px';
    });
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (vizOn && currentSong) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
      barsRef.current.forEach(b => b.style.height = '2px');
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [vizOn, currentSong, animate]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (player.isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [player.isPlaying, currentSong]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.file_url;
    audioRef.current.load();
    if (player.isPlaying) audioRef.current.play().catch(() => {});
  }, [currentSong?.id]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : player.volume;
  }, [player.volume, isMuted]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = Number(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  };

  const toggleMute = () => {
    if (!isMuted) { setPrevVolume(player.volume); setIsMuted(true); }
    else { setIsMuted(false); setVolume(prevVolume); }
  };

  if (!currentSong) return null;
  const progress = player.duration ? (player.currentTime / player.duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={nextSong}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 overflow-hidden"
        style={{ background: 'rgba(12,12,12,0.98)', backdropFilter: 'blur(30px)' }}>

        {/* Progress bar top */}
        <div className="relative h-[2px] w-full">
          <input type="range" min={0} max={player.duration || 100} value={player.currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
          <div className="h-full bg-white/10">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="relative flex items-center gap-4 px-6 py-3 max-w-screen-xl mx-auto">

          {/* Visualizer bars — ONLY behind song info area */}
          <div
            ref={vizRef}
            className="absolute left-0 top-0 bottom-0 flex items-end gap-[1px] pointer-events-none overflow-hidden transition-opacity duration-500"
            style={{
              width: '200px',
              opacity: vizOn ? 1 : 0,
              WebkitMaskImage: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
              maskImage: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
            }}
          />

          {/* Song info */}
          <div className="flex items-center gap-3 w-48 min-w-0 relative z-10">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
              {currentSong.cover_url ? (
                <img src={currentSong.cover_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange-500/20 flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{currentSong.title}</p>
              <p className="text-white/30 text-[10px] truncate mt-0.5">{currentSong.artist}</p>
            </div>
          </div>

          {/* Progress + Controls */}
          <div className="flex-1 flex flex-col gap-1 relative z-10">
            <div className="flex items-center justify-center gap-3">
              <button onClick={prevSong} className="text-white/20 hover:text-white/60 transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>
              <button onClick={togglePlay}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm shadow-lg"
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}>
                {player.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button onClick={nextSong} className="text-white/20 hover:text-white/60 transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/30 font-mono justify-center">
              <span>{formatTime(player.currentTime)}</span>
              <span>/</span>
              <span>{formatTime(player.duration)}</span>
            </div>
          </div>

          {/* Volume + Viz toggle */}
          <div className="hidden sm:flex items-center gap-3 relative z-10">
            <button onClick={toggleMute} className="text-white/30 hover:text-white/60 transition-colors">
              {isMuted || player.volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input type="range" min={0} max={1} step={0.01} value={isMuted ? 0 : player.volume}
              onChange={(e) => { setVolume(Number(e.target.value)); if (isMuted) setIsMuted(false); }}
              className="w-20 accent-orange-500 cursor-pointer" />

            {/* Visualizer toggle icon */}
            <button
              onClick={() => setVizOn(v => !v)}
              title="Visualizador"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: vizOn ? 'rgba(249,115,22,0.15)' : 'transparent',
                border: vizOn ? '1px solid rgba(249,115,22,0.3)' : '1px solid transparent',
                opacity: vizOn ? 1 : 0.4,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={vizOn ? '#f97316' : 'currentColor'} strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="20" x2="4" y2="14"/>
                <line x1="8" y1="20" x2="8" y2="8"/>
                <line x1="12" y1="20" x2="12" y2="11"/>
                <line x1="16" y1="20" x2="16" y2="5"/>
                <line x1="20" y1="20" x2="20" y2="10"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
