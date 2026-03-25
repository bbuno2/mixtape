import { Play, Pause, Trash2 } from 'lucide-react';
import { Music as MusicType } from '../types/music';
import { useMusicStore } from '../store/musicStore';
import { supabase } from '../lib/supabase';

interface MusicCardProps {
  music: MusicType;
  index: number;
}

function formatDuration(seconds?: number) {
  if (!seconds || isNaN(seconds)) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicCard({ music, index }: MusicCardProps) {
  const { player, playSong, togglePlay, removeSong, isAdminMode, isLightMode } = useMusicStore();

  const isCurrentSong = player.currentIndex === index;
  const isThisPlaying = isCurrentSong && player.isPlaying;

  const handlePlay = () => {
    if (isCurrentSong) togglePlay();
    else playSong(index);
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const fileName = music.file_url.split('/').pop();
    if (fileName) await supabase.storage.from('songs').remove([fileName]);
    if (music.cover_url) {
      const coverName = music.cover_url.split('/').pop();
      if (coverName) await supabase.storage.from('covers').remove([coverName]);
    }
    await supabase.from('songs').delete().eq('id', music.id);
    removeSong(music.id);
  };

  const border = isLightMode ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)';
  const cardBg = isLightMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.02)';
  const text = isLightMode ? '#111' : '#fff';
  const text3 = isLightMode ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.2)';

  return (
    <div
      onClick={handlePlay}
      className="group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-200"
      style={{
        background: isCurrentSong ? 'rgba(249,115,22,0.07)' : cardBg,
        border: `1px solid ${isCurrentSong ? 'rgba(249,115,22,0.2)' : border}`,
        animation: `slideUp 0.4s ease ${index * 0.04}s both`,
      }}
    >
      {/* Cover / Equalizer */}
      <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden relative">
        {music.cover_url ? (
          <img src={music.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: isCurrentSong ? 'rgba(249,115,22,0.15)' : isLightMode ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
            {isThisPlaying ? (
              <div className="flex items-end gap-[2px] h-4">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-[3px] bg-orange-400 rounded-sm"
                    style={{ height: `${30 + i * 18}%`, animation: `pulse ${0.4 + i * 0.1}s ease-in-out infinite alternate` }} />
                ))}
              </div>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={isCurrentSong ? '#f97316' : text3} strokeWidth="2" strokeLinecap="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate transition-colors"
          style={{ color: isCurrentSong ? '#fb923c' : text }}>
          {music.title}
        </p>
        <p className="text-[10px] truncate mt-0.5" style={{ color: text3 }}>{music.artist}</p>
      </div>

      {/* Duration */}
      <span className="text-[10px] font-mono hidden sm:block" style={{ color: text3 }}>
        {formatDuration(music.duration)}
      </span>

      {/* Play button */}
      <button onClick={(e) => { e.stopPropagation(); handlePlay(); }}
        className="w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0"
        style={isCurrentSong
          ? { background: '#f97316', color: '#fff', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }
          : { background: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.06)', color: text3, opacity: 0 }
        }
        onMouseEnter={e => { if (!isCurrentSong) (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        onMouseLeave={e => { if (!isCurrentSong) (e.currentTarget as HTMLElement).style.opacity = '0'; }}
      >
        {isThisPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </button>

      {/* Remove (admin) */}
      {isAdminMode && (
        <button onClick={handleRemove}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
