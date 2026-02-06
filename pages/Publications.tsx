import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { FileText, Plus, Trash2, Pencil, Save, X, ExternalLink } from 'lucide-react';
import { Publication } from '../types';

export const Publications: React.FC = () => {
  const { publications, isAdmin, addPublication, updatePublication, deletePublication } = useLab();
  const [filterYear, setFilterYear] = useState<number | 'All'>('All');
  
  // Adding State
  const [isAdding, setIsAdding] = useState(false);
  const [newPub, setNewPub] = useState({ title: '', venue: '', year: new Date().getFullYear(), authors: '', doi: '' });

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Publication> & { authorsStr?: string }>({});

  const years = Array.from(new Set(publications.map(p => p.year))).sort((a: number, b: number) => b - a);
  const filteredPublications = filterYear === 'All' 
    ? publications 
    : publications.filter(p => p.year === filterYear);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addPublication({
      id: Date.now().toString(),
      title: newPub.title,
      venue: newPub.venue,
      year: Number(newPub.year),
      authors: newPub.authors.split(',').map(s => s.trim()),
      doi: newPub.doi,
      link: '#',
      tags: []
    });
    setNewPub({ title: '', venue: '', year: new Date().getFullYear(), authors: '', doi: '' });
    setIsAdding(false);
  };

  const startEditing = (pub: Publication) => {
    setEditingId(pub.id);
    setEditForm({ ...pub, authorsStr: pub.authors.join(', ') });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingId && editForm.title && editForm.authorsStr) {
      updatePublication(editingId, {
        ...editForm,
        authors: editForm.authorsStr.split(',').map(s => s.trim())
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900">Publications</h1>
          <p className="text-lg text-zinc-500">
            Selected papers from top-tier conferences and journals.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {isAdmin && !isAdding && (
            <button type="button" onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
              <Plus size={16} /> Add
            </button>
          )}
          {/* Year Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setFilterYear('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filterYear === 'All' 
                  ? 'bg-zinc-900 text-white' 
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              All Years
            </button>
            {years.map(year => (
              <button
                key={year}
                onClick={() => setFilterYear(year)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filterYear === year
                    ? 'bg-zinc-900 text-white' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-6 bg-zinc-50 border rounded-2xl space-y-4">
           <h3 className="font-bold text-lg">Add New Publication</h3>
           <div className="grid md:grid-cols-2 gap-4">
             <input required placeholder="Title" className="col-span-2 p-3 border rounded-xl" value={newPub.title} onChange={e => setNewPub({...newPub, title: e.target.value})} />
             <input required placeholder="Venue (e.g. CVPR)" className="p-3 border rounded-xl" value={newPub.venue} onChange={e => setNewPub({...newPub, venue: e.target.value})} />
             <input required type="number" placeholder="Year" className="p-3 border rounded-xl" value={newPub.year} onChange={e => setNewPub({...newPub, year: Number(e.target.value)})} />
             <input required placeholder="Authors (comma separated)" className="col-span-2 p-3 border rounded-xl" value={newPub.authors} onChange={e => setNewPub({...newPub, authors: e.target.value})} />
             <input placeholder="DOI Link (e.g., https://doi.org/...)" className="col-span-2 p-3 border rounded-xl" value={newPub.doi} onChange={e => setNewPub({...newPub, doi: e.target.value})} />
           </div>
           <div className="flex gap-3">
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg">Save</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border px-4 py-2 rounded-lg">Cancel</button>
            </div>
        </form>
      )}

      <div className="space-y-4">
        {filteredPublications.map((pub) => (
          <div key={pub.id} className="group relative">
            {editingId === pub.id ? (
              // EDIT MODE
              <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-blue-500 space-y-4">
                 <div className="flex justify-between items-center">
                    <h4 className="font-bold text-blue-600">Editing Publication</h4>
                    <button type="button" onClick={cancelEditing} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
                 </div>
                 <div className="space-y-3">
                   <input className="w-full p-2 border rounded-lg" placeholder="Title" value={editForm.title || ''} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                   <div className="grid grid-cols-2 gap-3">
                     <input className="p-2 border rounded-lg" placeholder="Venue" value={editForm.venue || ''} onChange={e => setEditForm({...editForm, venue: e.target.value})} />
                     <input type="number" className="p-2 border rounded-lg" placeholder="Year" value={editForm.year || ''} onChange={e => setEditForm({...editForm, year: Number(e.target.value)})} />
                   </div>
                   <input className="w-full p-2 border rounded-lg" placeholder="Authors (comma separated)" value={editForm.authorsStr || ''} onChange={e => setEditForm({...editForm, authorsStr: e.target.value})} />
                   <input className="w-full p-2 border rounded-lg" placeholder="DOI Link (https://...)" value={editForm.doi || ''} onChange={e => setEditForm({...editForm, doi: e.target.value})} />
                 </div>
                 <div className="flex gap-2">
                    <button type="button" onClick={saveEditing} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                      <Save size={16} /> Save Changes
                    </button>
                 </div>
              </div>
            ) : (
              // VIEW MODE
              <div className="relative p-6 rounded-2xl bg-white border border-zinc-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                 {isAdmin && (
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); startEditing(pub); }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer shadow-sm border border-blue-200"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete publication?')) deletePublication(pub.id); }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 cursor-pointer shadow-sm border border-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 pr-20">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {pub.venue} {pub.year}
                      </span>
                      {pub.tags?.map(tag => (
                        <span key={tag} className="text-xs text-zinc-400 border border-zinc-100 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {pub.title}
                    </h3>
                    
                    <p className="text-zinc-600">
                      {pub.authors.map((author, i) => (
                        <span key={i} className={author.includes("S. You") ? "font-semibold text-zinc-900" : ""}>
                          {author}{i < pub.authors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>

                  <div className="flex items-start pt-2 flex-shrink-0">
                    {pub.doi && (
                      <a 
                        href={pub.doi} 
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-50 text-zinc-600 text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        <ExternalLink size={16} />
                        <span>DOI / PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {filteredPublications.length === 0 && (
            <div className="text-center py-20 text-zinc-400">
                No publications found for this year.
            </div>
        )}
      </div>
    </div>
  );
};