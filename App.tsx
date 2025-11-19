import React, { useState, useEffect } from 'react';
import { ServerConfig, ScreenState } from './types';
import { ServerCard } from './components/ServerCard';
import { AddEditModal } from './components/AddEditModal';
import { Viewer } from './components/Viewer';
import { TVButton } from './components/TVButton';
import { Plus } from 'lucide-react';

function App() {
  // State
  const [servers, setServers] = useState<ServerConfig[]>([]);
  const [screen, setScreen] = useState<ScreenState>(ScreenState.HOME);
  const [activeServer, setActiveServer] = useState<ServerConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerConfig | null>(null);
  
  // Banner Image - Expecting 'banner.png' in the public root
  const bannerUrl = "/banner.png"; 

  // Load data from local storage
  useEffect(() => {
    const saved = localStorage.getItem('karaoke_eternal_servers');
    if (saved) {
      try {
        setServers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved servers", e);
      }
    }
  }, []);

  // Save data to local storage
  useEffect(() => {
    localStorage.setItem('karaoke_eternal_servers', JSON.stringify(servers));
  }, [servers]);

  // Handlers
  const handleAddServer = () => {
    setEditingServer(null);
    setIsModalOpen(true);
  };

  const handleEditServer = (server: ServerConfig) => {
    setEditingServer(server);
    setIsModalOpen(true);
  };

  const handleDeleteServer = (id: string) => {
    if (window.confirm("Are you sure you want to delete this server?")) {
      setServers(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setServers(prev => prev.map(s => ({
      ...s,
      isDefault: s.id === id
    })));
  };

  const handleSaveModal = (data: Omit<ServerConfig, 'id' | 'isDefault'> & { id?: string }) => {
    if (data.id) {
      // Edit existing
      setServers(prev => prev.map(s => s.id === data.id ? { ...s, ...data } : s));
    } else {
      // Add new
      const newServer: ServerConfig = {
        ...data,
        id: crypto.randomUUID(),
        isDefault: servers.length === 0, // First one is default
      };
      setServers(prev => [...prev, newServer]);
    }
    setIsModalOpen(false);
  };

  const handleLaunch = (server: ServerConfig) => {
    setActiveServer(server);
    setScreen(ScreenState.VIEWER);
  };

  const handleExitViewer = () => {
    setActiveServer(null);
    setScreen(ScreenState.HOME);
  };

  // Views
  if (screen === ScreenState.VIEWER && activeServer) {
    return <Viewer server={activeServer} onExit={handleExitViewer} />;
  }

  return (
    <div className="min-h-screen bg-[#111827] flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Banner Area */}
      <header className="relative w-full h-48 md:h-64 shrink-0 overflow-hidden bg-gray-900 border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f131d] to-[#111827] z-0" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-start px-8 md:px-12 z-10">
           <img 
             src={bannerUrl} 
             alt="Karaoke Eternal" 
             className="h-full max-h-36 md:max-h-52 w-auto object-contain drop-shadow-[0_0_30px_rgba(60,130,250,0.6)]"
             onError={(e) => {
               // Fallback if image is missing
               e.currentTarget.style.display = 'none';
               e.currentTarget.parentElement!.innerHTML += '<h1 class="text-4xl font-bold text-white">Karaoke Eternal</h1>';
             }}
           />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-400 uppercase tracking-wider">
            Servers
          </h2>
          <TVButton 
            onClick={handleAddServer} 
            variant="primary" 
            icon={<Plus className="w-5 h-5" />}
            autoFocus={servers.length === 0}
          >
            Add Connection
          </TVButton>
        </div>

        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-700 rounded-2xl text-gray-500 bg-gray-800/30">
            <p className="text-xl mb-4">No karaoke servers configured.</p>
            <TVButton onClick={handleAddServer} variant="secondary">
              Add Server
            </TVButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {servers.map((server) => (
              <ServerCard
                key={server.id}
                server={server}
                onLaunch={handleLaunch}
                onEdit={handleEditServer}
                onDelete={handleDeleteServer}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </main>

      <AddEditModal 
        isOpen={isModalOpen}
        initialData={editingServer}
        onSave={handleSaveModal}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default App;