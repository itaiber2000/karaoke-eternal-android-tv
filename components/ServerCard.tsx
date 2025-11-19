import React from 'react';
import { ServerConfig } from '../types';
import { Star, Edit2, Trash2 } from 'lucide-react';

interface ServerCardProps {
  server: ServerConfig;
  onLaunch: (server: ServerConfig) => void;
  onEdit: (server: ServerConfig) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  onLaunch,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  return (
    <div 
      className="group relative flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:bg-gray-750"
    >
      {/* Main Click Area for Launching */}
      <button
        className="flex-1 flex flex-col items-center justify-center p-8 focus:outline-none focus:bg-gray-700 transition-colors w-full text-center min-h-[160px]"
        onClick={() => onLaunch(server)}
        tabIndex={0}
      >
        <h3 className="text-3xl font-bold text-white mb-2 truncate w-full tracking-tight drop-shadow-md">
          {server.name}
        </h3>
        <p className="text-gray-400 text-sm truncate w-full opacity-60 font-mono">
          {server.url}
        </p>
      </button>

      {/* Actions Bar */}
      <div className="flex items-center justify-between p-3 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
        <button
          onClick={(e) => { e.stopPropagation(); onSetDefault(server.id); }}
          className={`p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition-colors ${server.isDefault ? 'text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-600 hover:text-yellow-400'}`}
          title="Set as Default"
        >
          <Star className={`w-6 h-6 ${server.isDefault ? 'fill-current' : ''}`} />
        </button>

        <div className="flex gap-2">
           <button
            onClick={(e) => { e.stopPropagation(); onEdit(server); }}
            className="p-3 text-gray-500 hover:text-white hover:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(server.id); }}
            className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg focus:ring-2 focus:ring-red-400 outline-none transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {server.isDefault && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg shadow-lg pointer-events-none">
          DEFAULT
        </div>
      )}
    </div>
  );
};