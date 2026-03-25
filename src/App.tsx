import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useMusicStore } from './store/musicStore';
import { Music } from './types/music';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { UploadModal } from './components/UploadModal';
import { Home } from './pages/Home';

function App() {
  const { setSongs, addSong, removeSong, isLightMode } = useMusicStore();

  useEffect(() => {
    const loadSongs = async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('uploaded_at', { ascending: false });
      if (!error && data) setSongs(data as Music[]);
    };
    loadSongs();

    const channel = supabase
      .channel('songs-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'songs' },
        (payload) => addSong(payload.new as Music))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'songs' },
        (payload) => removeSong(payload.old.id))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Apply light mode class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-400 ${isLightMode ? 'bg-[#fafaf8]' : 'bg-[#080808]'}`}>
      <Header />
      <Home />
      <AudioPlayer />
      <UploadModal />
    </div>
  );
}

export default App;
