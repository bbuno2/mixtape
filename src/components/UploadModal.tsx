import { useState, useCallback, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Upload, Music, CheckCircle, AlertCircle, FileAudio } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useMusicStore } from '../store/musicStore';

const ACCEPTED_EXTENSIONS = /\.(mp3|wav|ogg)$/i;

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => { resolve(audio.duration); URL.revokeObjectURL(url); });
    audio.addEventListener('error', () => resolve(0));
  });
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function UploadModal() {
  const { isUploadModalOpen, closeUploadModal } = useMusicStore();
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitle(''); setArtist(''); setDescription('');
    setFile(null); setStatus('idle'); setError(''); setProgress(0); setDragOver(false);
  };

  const handleClose = () => { reset(); closeUploadModal(); };

  const validateFile = (f: File) => {
    if (!ACCEPTED_EXTENSIONS.test(f.name)) { setError('Formato inválido. Use MP3, WAV ou OGG.'); return false; }
    if (f.size > 50 * 1024 * 1024) { setError('Arquivo muito grande. Máximo 50MB.'); return false; }
    return true;
  };

  const handleFileChange = (f: File) => {
    setError('');
    if (validateFile(f)) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileChange(dropped);
  }, [title]);

  const handleSubmit = async () => {
    if (!file) { setError('Selecione um arquivo de áudio.'); return; }
    if (!title.trim()) { setError('Digite o título da música.'); return; }
    if (!artist.trim()) { setError('Digite o nome do artista.'); return; }

    setStatus('uploading');
    setError('');

    try {
      const duration = await getAudioDuration(file);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Simula progresso durante upload
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 85));
      }, 200);

      // Upload para Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(fileName, file, { contentType: file.type });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;
      setProgress(90);

      // Pega URL pública do arquivo
      const { data: urlData } = supabase.storage.from('songs').getPublicUrl(fileName);
      const fileUrl = urlData.publicUrl;
      setProgress(95);

      // Salva metadados no banco
      const { error: dbError } = await supabase.from('songs').insert({
        title: title.trim(),
        artist: artist.trim(),
        description: description.trim(),
        file_name: file.name,
        file_url: fileUrl,
        file_type: file.type,
        duration,
        uploaded_at: Date.now(),
      });

      if (dbError) throw dbError;

      setProgress(100);
      setStatus('success');
      setTimeout(() => handleClose(), 1500);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Erro ao enviar. Tente novamente.');
    }
  };

  return (
    <Transition appear show={isUploadModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        <Transition.Child as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Transition.Child as={Fragment}
            enter="ease-out duration-200" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Music className="w-4 h-4 text-orange-400" />
                  </div>
                  <Dialog.Title className="text-white font-bold text-lg">Enviar música</Dialog.Title>
                </div>
                <button onClick={handleClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {status === 'success' ? (
                <div className="flex flex-col items-center py-8 gap-3 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-white font-semibold text-lg">Música enviada!</p>
                  <p className="text-zinc-400 text-sm text-center">"{title}" foi adicionada à biblioteca.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      dragOver ? 'border-orange-500 bg-orange-500/10'
                      : file ? 'border-green-500/50 bg-green-500/5'
                      : 'border-white/15 hover:border-white/30 hover:bg-white/3'
                    }`}
                  >
                    <input ref={inputRef} type="file" accept=".mp3,.wav,.ogg,audio/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <FileAudio className="w-8 h-8 text-green-400" />
                        <p className="text-white text-sm font-medium">{file.name}</p>
                        <p className="text-zinc-500 text-xs">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className={`w-8 h-8 ${dragOver ? 'text-orange-400' : 'text-zinc-500'}`} />
                        <p className="text-zinc-300 text-sm">Arraste e solte ou <span className="text-orange-400 font-medium">clique para selecionar</span></p>
                        <p className="text-zinc-600 text-xs">MP3, WAV, OGG • Máximo 50MB</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1 font-medium">Título <span className="text-orange-500">*</span></label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome da música"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1 font-medium">Artista <span className="text-orange-500">*</span></label>
                      <input type="text" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Nome do artista ou banda"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1 font-medium">Descrição</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Sobre a música (opcional)" rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all resize-none" />
                    </div>
                  </div>

                  {status === 'uploading' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Enviando para o Supabase...</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button onClick={handleSubmit} disabled={status === 'uploading'}
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20">
                    {status === 'uploading' ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando... {progress}%</>
                    ) : (
                      <><Upload className="w-4 h-4" />Enviar música</>
                    )}
                  </button>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
