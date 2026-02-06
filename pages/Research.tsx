import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { ArrowUpRight, Plus, Trash2, Pencil, Save, X, Upload } from 'lucide-react';
import { ResearchArea } from '../types';

export const Research: React.FC = () => {
  const { researchAreas, isAdmin, addResearchArea, updateResearchArea, deleteResearchArea } = useLab();
  const [isAdding, setIsAdding] = useState(false);
  const [newArea, setNewArea] = useState({ title: '', description: '', link: '', imageUrl: '' });

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResearchArea>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEdit) {
          setEditForm(prev => ({ ...prev, imageUrl: result }));
        } else {
          setNewArea(prev => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addResearchArea({
      id: Date.now().toString(),
      title: newArea.title,
      description: newArea.description,
      imageUrl: newArea.imageUrl || `https://picsum.photos/600/400?random=${Date.now()}`,
      link: newArea.link || '#'
    });
    setNewArea({ title: '', description: '', link: '', imageUrl: '' });
    setIsAdding(false);
  };

  const startEditing = (area: ResearchArea) => {
    setEditingId(area.id);
    setEditForm({ ...area });
  };

  const saveEditing = () => {
    if (editingId && editForm.title) {
      updateResearchArea(editingId, editForm);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900">Research</h1>
          <p className="text-lg text-zinc-500">
            Our work spans multiple disciplines, aiming to solve fundamental problems in artificial intelligence.
          </p>
        </div>
        {isAdmin && !isAdding && (
          <button type="button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl">
            <Plus size={18} /> Add Area
          </button>
        )}
      </div>

      {isAdding && (
         <form onSubmit={handleAdd} className="p-6 bg-zinc-50 border rounded-2xl space-y-4">
            <input required placeholder="Title" className="w-full p-3 border rounded-xl" value={newArea.title} onChange={e => setNewArea({...newArea, title: e.target.value})} />
            <textarea required placeholder="Description" className="w-full p-3 border rounded-xl" value={newArea.description} onChange={e => setNewArea({...newArea, description: e.target.value})} />
            
            <div className="grid md:grid-cols-2 gap-4">
               <div className="flex gap-2">
                 <input placeholder="Image URL (https://...)" className="flex-1 p-3 border rounded-xl" value={newArea.imageUrl || ''} onChange={e => setNewArea({...newArea, imageUrl: e.target.value})} />
                 <label className="flex items-center justify-center px-4 bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-200">
                    <Upload size={20} className="text-zinc-500" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
                 </label>
               </div>
               <input placeholder="Project Link (Optional)" className="w-full p-3 border rounded-xl" value={newArea.link} onChange={e => setNewArea({...newArea, link: e.target.value})} />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg">Save</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border px-4 py-2 rounded-lg">Cancel</button>
            </div>
         </form>
      )}

      <div className="space-y-20">
        {researchAreas.map((area, index) => (
          <div key={area.id} className="relative group">
            {editingId === area.id ? (
              // EDIT MODE
              <div className="p-6 bg-zinc-50 border-2 border-blue-500 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                   <h4 className="font-bold text-blue-600">Editing Research Area</h4>
                   <button type="button" onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
                </div>
                <input className="w-full p-3 border rounded-xl" placeholder="Title" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                <textarea className="w-full p-3 border rounded-xl h-32" placeholder="Description" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                
                <div className="space-y-2">
                   <div className="flex gap-2">
                     <input className="flex-1 p-3 border rounded-xl" placeholder="Image URL" value={editForm.imageUrl || ''} onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} />
                     <label className="flex items-center justify-center px-4 bg-white border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-50">
                        <Upload size={20} className="text-zinc-500" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
                     </label>
                   </div>
                   <input className="w-full p-3 border rounded-xl" placeholder="Project URL (e.g. https://...)" value={editForm.link || ''} onChange={e => setEditForm({...editForm, link: e.target.value})} />
                </div>

                <button type="button" onClick={saveEditing} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            ) : (
              // VIEW MODE
              <div className={`relative flex flex-col md:flex-row gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                 {isAdmin && (
                    <div className="absolute top-0 right-0 z-50 flex gap-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); startEditing(area); }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer shadow-sm border border-blue-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete area?')) deleteResearchArea(area.id); }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 cursor-pointer shadow-sm border border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                <div className="w-full md:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-sm">
                  <img 
                    src={area.imageUrl} 
                    alt={area.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-2xl font-bold text-zinc-900">{area.title}</h3>
                  <p className="text-zinc-600 leading-relaxed text-lg">
                    {area.description}
                  </p>
                  <a 
                    href={area.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`flex items-center gap-2 text-blue-600 font-medium hover:underline ${(!area.link || area.link === '#') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => (!area.link || area.link === '#') && e.preventDefault()}
                  >
                    Read more about this project <ArrowUpRight size={18} />
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};