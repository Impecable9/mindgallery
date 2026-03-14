import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, PenTool, Image as ImageIcon, Save, Trash2, ExternalLink, Rss, MonitorPlay } from 'lucide-react';
import { Language } from '../types';

interface DashboardProps {
  user: any;
  language: Language;
  isNegativeMode: boolean;
  globalConfig?: any;
  onGlobalConfigUpdate?: () => void;
}

export default function Dashboard({ user, language, isNegativeMode, globalConfig, onGlobalConfigUpdate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'HERO' | 'BLOGS' | 'PHOTOS'>('SETTINGS');
  
  // Settings State
  const [settings, setSettings] = useState({ substackUrl: '' });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Hero Config State
  const [heroConfig, setHeroConfig] = useState<any>({
    heroTitlePos: '', heroTitleNeg: '',
    heroDescPos: '', heroDescNeg: '',
    heroImagePos: '', heroImageNeg: ''
  });
  const [isSavingHero, setIsSavingHero] = useState(false);

  // Blogs State
  const [blogs, setBlogs] = useState<any[]>([]);
  const [substackFeed, setSubstackFeed] = useState<any>(null);
  const [newBlogResult, setNewBlogResult] = useState({ title: '', content: '' });
  const [isSavingBlog, setIsSavingBlog] = useState(false);

  // Photos State
  const [photos, setPhotos] = useState<any[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchBlogs();
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (globalConfig) {
      setHeroConfig({
        heroTitlePos: globalConfig.heroTitlePos || '',
        heroTitleNeg: globalConfig.heroTitleNeg || '',
        heroDescPos: globalConfig.heroDescPos || '',
        heroDescNeg: globalConfig.heroDescNeg || '',
        heroImagePos: globalConfig.heroImagePos || '',
        heroImageNeg: globalConfig.heroImageNeg || ''
      });
    }
  }, [globalConfig]);

  useEffect(() => {
    if (settings.substackUrl) {
      fetchSubstackFeed(settings.substackUrl);
    }
  }, [settings.substackUrl]);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    }
  };

  const saveSettings = async () => {
    setIsSavingSettings(true);
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setIsSavingSettings(false);
  };

  const saveHeroConfig = async () => {
    setIsSavingHero(true);
    const res = await fetch('/api/config/global', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(heroConfig)
    });
    if (res.ok && onGlobalConfigUpdate) {
      onGlobalConfigUpdate();
    }
    setIsSavingHero(false);
  };

  const fetchBlogs = async () => {
    const res = await fetch('/api/blogs');
    if (res.ok) {
      const data = await res.json();
      setBlogs(data.blogs || []);
    }
  };

  const fetchSubstackFeed = async (url: string) => {
    try {
      const res = await fetch(`/api/substack?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setSubstackFeed(data.feed);
      }
    } catch (e) {
      console.error("Failed to fetch substack feed");
    }
  };

  const saveBlog = async () => {
    if (!newBlogResult.title || !newBlogResult.content) return;
    setIsSavingBlog(true);
    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlogResult)
    });
    if (res.ok) {
      setNewBlogResult({ title: '', content: '' });
      fetchBlogs();
    }
    setIsSavingBlog(false);
  };

  const deleteBlog = async (id: string) => {
    const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
    if (res.ok) fetchBlogs();
  };

  const fetchPhotos = async () => {
    const res = await fetch('/api/photos');
    if (res.ok) {
      const data = await res.json();
      setPhotos(data.photos || []);
    }
  };

  const savePhoto = async () => {
    if (!newPhotoUrl) return;
    setIsSavingPhoto(true);
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newPhotoUrl })
    });
    if (res.ok) {
      setNewPhotoUrl('');
      fetchPhotos();
    }
    setIsSavingPhoto(false);
  };

  const deletePhoto = async (id: string) => {
    const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    if (res.ok) fetchPhotos();
  };

  const tabs = [
    { id: 'SETTINGS', icon: <Settings size={20} />, label: 'Configuración' },
    { id: 'HERO', icon: <MonitorPlay size={20} />, label: 'Apariencia (Hero)' },
    { id: 'BLOGS', icon: <PenTool size={20} />, label: 'Blogs' },
    { id: 'PHOTOS', icon: <ImageIcon size={20} />, label: 'Fotos' }
  ] as const;

  if (!user?.isAdmin) {
    return (
      <div className={`mt-10 mx-auto max-w-4xl w-full p-12 text-center rounded-3xl border shadow-2xl flex flex-col items-center justify-center min-h-[50vh] ${
        isNegativeMode ? 'bg-black/80 border-red-500/20 text-white' : 'bg-white border-red-200 text-slate-900'
      }`}>
        <h2 className="text-3xl font-bold mb-4 text-red-500">Acceso Denegado</h2>
        <p className={isNegativeMode ? 'text-gray-400' : 'text-slate-600'}>
          No tienes permisos de administrador para acceder a este panel de control. Sólo el creador de la página web puede modificar blogs y fotos.
        </p>
      </div>
    );
  }

  return (
    <div className={`mt-10 mx-auto max-w-6xl w-full min-h-[70vh] rounded-3xl overflow-hidden flex border shadow-2xl ${
      isNegativeMode ? 'bg-black/80 border-white/10' : 'bg-white border-slate-200'
    }`}>
      
      {/* Sidebar */}
      <div className={`w-64 p-6 border-r ${isNegativeMode ? 'bg-black/90 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-4 mb-8">
          <img src={user.picture} alt={user.name} className="w-12 h-12 rounded-full border-2 border-slate-300" />
          <div>
            <h3 className={`font-bold ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h3>
            <p className={`text-xs ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Panel de Control</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? isNegativeMode ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-900'
                  : isNegativeMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Settings Tab */}
          {activeTab === 'SETTINGS' && (
            <div className="max-w-xl">
              <h2 className={`text-3xl font-bold mb-8 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>Configuración del Perfil</h2>
              
              <div className={`p-6 rounded-2xl border ${isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
                  <Rss size={20} className="text-orange-500" /> Integración Substack
                </h3>
                <p className={`text-sm mb-4 ${isNegativeMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Conecta tu blog de Substack para mostrar tus artículos automáticamente.
                </p>
                
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  URL de Substack
                </label>
                <input
                  type="text"
                  placeholder="https://tu-blog.substack.com"
                  value={settings.substackUrl}
                  onChange={(e) => setSettings({ ...settings, substackUrl: e.target.value })}
                  className={`w-full p-3 rounded-xl border mb-4 focus:ring-2 focus:outline-none transition-all ${
                    isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-white border-slate-300 focus:ring-blue-500'
                  }`}
                />

                <button
                  onClick={saveSettings}
                  disabled={isSavingSettings}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    isNegativeMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Save size={16} />
                  {isSavingSettings ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          )}

          {/* Hero Config Tab */}
          {activeTab === 'HERO' && (
            <div className="max-w-2xl">
              <h2 className={`text-3xl font-bold mb-8 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>Apariencia de la Web</h2>
              
              <div className={`p-6 rounded-2xl border mb-6 ${isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
                  <MonitorPlay size={20} className="text-blue-500" /> Configuración Principal (Hero Section)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Positive Mode Customization */}
                  <div className={`p-4 rounded-xl border ${isNegativeMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h4 className={`font-bold mb-4 text-emerald-500`}>⭐ Modo Luz</h4>
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Título</label>
                    <input
                      type="text" placeholder="I am enough."
                      value={heroConfig.heroTitlePos} onChange={(e) => setHeroConfig({ ...heroConfig, heroTitlePos: e.target.value })}
                      className={`w-full p-2 mb-3 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-emerald-500' : 'bg-slate-50 border-slate-300 focus:ring-emerald-500'}`}
                    />
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Descripción corta</label>
                    <input
                      type="text" placeholder="MindGallery"
                      value={heroConfig.heroDescPos} onChange={(e) => setHeroConfig({ ...heroConfig, heroDescPos: e.target.value })}
                      className={`w-full p-2 mb-3 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-emerald-500' : 'bg-slate-50 border-slate-300 focus:ring-emerald-500'}`}
                    />
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Fondo (URL Imagen)</label>
                    <input
                      type="text" placeholder="https://..."
                      value={heroConfig.heroImagePos} onChange={(e) => setHeroConfig({ ...heroConfig, heroImagePos: e.target.value })}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-emerald-500' : 'bg-slate-50 border-slate-300 focus:ring-emerald-500'}`}
                    />
                  </div>

                  {/* Negative Mode Customization */}
                  <div className={`p-4 rounded-xl border ${isNegativeMode ? 'bg-black/40 border-white/5' : 'bg-white border-slate-200'}`}>
                    <h4 className={`font-bold mb-4 text-purple-500`}>🌙 Modo Sombra</h4>
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Título</label>
                    <input
                      type="text" placeholder="I am a failure."
                      value={heroConfig.heroTitleNeg} onChange={(e) => setHeroConfig({ ...heroConfig, heroTitleNeg: e.target.value })}
                      className={`w-full p-2 mb-3 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-slate-50 border-slate-300 focus:ring-purple-500'}`}
                    />
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Descripción corta</label>
                    <input
                      type="text" placeholder="MindGallery"
                      value={heroConfig.heroDescNeg} onChange={(e) => setHeroConfig({ ...heroConfig, heroDescNeg: e.target.value })}
                      className={`w-full p-2 mb-3 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-slate-50 border-slate-300 focus:ring-purple-500'}`}
                    />
                    <label className={`block text-xs font-bold mb-1 uppercase tracking-wide ${isNegativeMode ? 'text-gray-400' : 'text-slate-500'}`}>Fondo (URL Imagen)</label>
                    <input
                      type="text" placeholder="https://..."
                      value={heroConfig.heroImageNeg} onChange={(e) => setHeroConfig({ ...heroConfig, heroImageNeg: e.target.value })}
                      className={`w-full p-2 rounded-lg border focus:ring-2 focus:outline-none text-sm transition-all ${isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-slate-50 border-slate-300 focus:ring-purple-500'}`}
                    />
                  </div>
                </div>

                <button
                  onClick={saveHeroConfig}
                  disabled={isSavingHero}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                    isNegativeMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Save size={16} />
                  {isSavingHero ? 'Guardando...' : 'Guardar y Aplicar a la Web'}
                </button>
              </div>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'BLOGS' && (
            <div>
              <h2 className={`text-3xl font-bold mb-8 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>Mis Blogs</h2>
              
              <div className={`p-6 rounded-2xl border mb-8 ${isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                 <h3 className={`text-lg font-bold mb-4 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>Nuevo Artículo</h3>
                 <input
                    type="text"
                    placeholder="Título del Artículo"
                    value={newBlogResult.title}
                    onChange={(e) => setNewBlogResult({ ...newBlogResult, title: e.target.value })}
                    className={`w-full p-3 rounded-xl border mb-4 focus:ring-2 focus:outline-none transition-all ${
                      isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                 />
                 <textarea
                    placeholder="Escribe tu contenido aquí..."
                    value={newBlogResult.content}
                    onChange={(e) => setNewBlogResult({ ...newBlogResult, content: e.target.value })}
                    className={`w-full p-4 rounded-xl border mb-4 h-40 resize-none focus:ring-2 focus:outline-none transition-all ${
                      isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                 />
                 <button
                    onClick={saveBlog}
                    disabled={isSavingBlog || !newBlogResult.title || !newBlogResult.content}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      isNegativeMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                    } disabled:opacity-50`}
                 >
                    <Save size={16} />
                    {isSavingBlog ? 'Publicando...' : 'Publicar'}
                 </button>
              </div>

              {/* Substack Feed Integration */}
              {substackFeed && substackFeed.items && substackFeed.items.length > 0 && (
                <div className="mb-8">
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>
                    <Rss size={20} className="text-orange-500" /> Artículos de Substack
                  </h3>
                  <div className="grid gap-4">
                    {substackFeed.items.slice(0, 3).map((item: any, i: number) => (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" key={i} className={`block p-5 rounded-2xl border transition-all hover:-translate-y-1 ${
                        isNegativeMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:shadow-lg'
                      }`}>
                        <h4 className={`font-bold mb-2 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                        <p className={`text-sm line-clamp-2 ${isNegativeMode ? 'text-gray-400' : 'text-slate-600'}`}>{item.contentSnippet || item.content}</p>
                        <div className="mt-4 flex items-center text-xs text-orange-500 font-bold gap-1">
                          Leer en Substack <ExternalLink size={12} />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Blogs List */}
              <h3 className={`text-xl font-bold mb-4 ${isNegativeMode ? 'text-white' : 'text-slate-800'}`}>Artículos Internos</h3>
              <div className="grid gap-4">
                {blogs.length === 0 && <p className={`text-sm ${isNegativeMode ? 'text-gray-500' : 'text-slate-400'}`}>No tienes artículos publicados aquí aún.</p>}
                {blogs.map(blog => (
                  <div key={blog.id} className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div>
                      <h4 className={`font-bold mb-2 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>{blog.title}</h4>
                      <p className={`text-sm whitespace-pre-wrap ${isNegativeMode ? 'text-gray-400' : 'text-slate-600'}`}>{blog.content}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button onClick={() => deleteBlog(blog.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-500/10 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'PHOTOS' && (
            <div>
              <h2 className={`text-3xl font-bold mb-8 ${isNegativeMode ? 'text-white' : 'text-slate-900'}`}>Mi Galería de Fotos</h2>
              
              <div className={`p-6 rounded-2xl border mb-8 flex gap-4 items-center ${isNegativeMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                 <input
                    type="text"
                    placeholder="Pega la URL de una imagen aquí..."
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    className={`flex-1 p-3 rounded-xl border focus:ring-2 focus:outline-none transition-all ${
                      isNegativeMode ? 'bg-black/50 border-white/10 text-white focus:ring-purple-500' : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                 />
                 <button
                    onClick={savePhoto}
                    disabled={isSavingPhoto || !newPhotoUrl}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                      isNegativeMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                    } disabled:opacity-50`}
                 >
                    {isSavingPhoto ? 'Añadiendo...' : 'Añadir Foto'}
                 </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                 {photos.length === 0 && <p className={`col-span-full text-sm ${isNegativeMode ? 'text-gray-500' : 'text-slate-400'}`}>Aún no hay fotos en tu galería.</p>}
                 {photos.map(photo => (
                   <div key={photo.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-white/10">
                     <img src={photo.url} alt="User gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => deletePhoto(photo.id)} className="p-3 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors">
                         <Trash2 size={24} />
                       </button>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
