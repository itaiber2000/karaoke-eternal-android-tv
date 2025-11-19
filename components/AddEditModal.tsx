import React, { useState, useEffect } from 'react';
import { ServerConfig } from '../types';
import { TVButton } from './TVButton';
import { Save, X } from 'lucide-react';

interface AddEditModalProps {
  isOpen: boolean;
  initialData?: ServerConfig | null;
  onSave: (server: Omit<ServerConfig, 'id' | 'isDefault'> & { id?: string }) => void;
  onCancel: () => void;
}

export const AddEditModal: React.FC<AddEditModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setUrl(initialData.url);
    } else {
      setName('');
      setUrl('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    onSave({ 
      id: initialData?.id, 
      name, 
      url: url.startsWith('http') ? url : `https://${url}` 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            {initialData ? 'Edit Server' : 'Add New Server'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white focus:outline-none focus:text-white">
            <X className="w-8 h-8" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-300 text-lg font-medium">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Living Room Karaoke"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-300 text-lg font-medium">Server URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. 192.168.1.50:3000"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white text-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-600"
            />
          </div>

          <div className="flex gap-4 pt-6 justify-end">
            <TVButton type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </TVButton>
            <TVButton type="submit" icon={<Save className="w-5 h-5" />}>
              Save
            </TVButton>
          </div>
        </form>
      </div>
    </div>
  );
};