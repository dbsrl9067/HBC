import React, { useState } from 'react';
import { LAB_NAME } from '../constants';
import { useLab } from '../context/LabContext';
import { ArrowRight, Plus, Trash2, ExternalLink, Pencil, Save, X, ImageIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

export const Home: React.FC = () => {
  const { news, isAdmin, addNews, updateNews, deleteNews, homeImage, updateHomeImage } = useLab();
  
  // News Adding State
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({ 
    title: '', 
    content: '', 
    date: new Date().toISOString().split('T')[0] 
  });

  // News Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<NewsItem>>({});

  // Home Image Editing State
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');

  // --- Image Handlers ---
  const startEditingImage = () => {
    setTempImageUrl(homeImage);
    setIsEditingImage(true);
  };

  const saveImage = () => {
    if (tempImageUrl.trim()) {
      updateHomeImage(tempImageUrl.trim());
      setIsEditingImage(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- News Handlers ---
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    addNews({
      id: Date.now().toString(),
      date: newPost.date.replace(/-/g, '.'),
      title: newPost.title,
      content: newPost.content
    });
    setNewPost({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setIsAdding(false);
  };

  const startEditing = (item: NewsItem) => {
    setEditingId(item.id);
    setEditForm({ 
      ...item,
      date: item.date.replace(/\./g, '-')
    });
  };

  const saveEditing = () => {
    if (editingId && editForm.title && editForm.date) {
      updateNews(editingId, {
        ...editForm,
        date: editForm.date.replace(/-/g, '.')
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="space-y-8 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.2]">
          Understanding <span className="text-zinc-400">human behavior</span><br /> 
          in times of crisis.
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl leading-relaxed font-light">
          Welcome to {LAB_NAME}. We investigate trauma, resilience, and decision-making 
          processes to develop effective psychological interventions for individuals and communities.
        </p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link 
            to="/research" 
            className="inline-flex items-center gap-2 text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-600 hover:border-zinc-600 transition-colors font-medium"
          >
            Research Areas <ArrowRight size={16} />
          </Link>
          <a 
            href="https://psychology.chungbuk.ac.kr/" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-zinc-400 border-b border-zinc-200 pb-0.5 hover:text-zinc-900 hover:border-zinc-900 transition-colors font-medium ml-4"
          >
            Dept. Website <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* Image Banner */}
      <div className="relative w-full aspect-[21/9] md:h-[400px] bg-zinc-100 overflow-hidden group">
        {isEditingImage ? (
          <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 gap-4">
             <h3 className="font-bold text-lg text-zinc-900">Update Banner Image</h3>
             
             <div className="w-full max-w-md space-y-3">
               <div className="flex gap-2">
                 <input 
                    className="flex-1 p-3 border border-zinc-200 rounded-lg text-sm"
                    placeholder="Enter Image URL..."
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    autoFocus
                 />
                 <button onClick={saveImage} type="button" className="bg-zinc-900 text-white px-4 rounded-lg text-sm hover:bg-zinc-800">Save</button>
                 <button onClick={() => setIsEditingImage(false)} type="button" className="bg-white border text-zinc-700 px-4 rounded-lg text-sm hover:bg-zinc-50">Cancel</button>
               </div>
               
               <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-200 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 text-zinc-400 mb-2" />
                          <p className="text-xs text-zinc-500">Upload image</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </label>
               </div>
             </div>
          </div>
        ) : (
          <>
            <img 
              src={homeImage} 
              alt="Lab environment" 
              className="w-full h-full object-cover grayscale opacity-90 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 ease-in-out"
            />
            {isAdmin && (
              <button 
                type="button"
                onClick={startEditingImage}
                className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur text-zinc-800 px-3 py-1.5 rounded text-xs font-medium shadow-sm hover:bg-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
              >
                <ImageIcon size={14} /> Edit Image
              </button>
            )}
          </>
        )}
      </div>

      {/* News Section - Clean List Style */}
      <section className="max-w-3xl">
        <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
          <h2 className="text-lg font-bold text-zinc-900">Lab News</h2>
          {isAdmin && !isAdding && (
            <button 
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 text-xs bg-zinc-900 text-white px-3 py-1.5 rounded hover:bg-zinc-700 transition-colors"
            >
              <Plus size={14} /> Add News
            </button>
          )}
        </div>

        {isAdding && (
          <form onSubmit={handleAddNews} className="mb-10 p-6 bg-zinc-50 border border-zinc-100 rounded-lg space-y-4">
            <h3 className="font-bold text-sm">New Announcement</h3>
            <div className="flex gap-4">
              <input
                type="date"
                required
                className="p-2 border rounded text-sm"
                value={newPost.date}
                onChange={e => setNewPost({...newPost, date: e.target.value})}
              />
              <input
                required
                placeholder="Title"
                className="flex-1 p-2 border rounded text-sm"
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            <textarea
              required
              placeholder="Content details..."
              className="w-full p-2 border rounded h-20 text-sm"
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-zinc-900 text-white px-3 py-1.5 rounded text-sm">Post</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border px-3 py-1.5 rounded text-sm">Cancel</button>
            </div>
          </form>
        )}
        
        <div className="space-y-6">
          {news.map((item) => (
            <div key={item.id} className="group">
               {editingId === item.id ? (
                 // Edit Mode
                 <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-zinc-500 uppercase">Editing</h4>
                      <button type="button" onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-600"><X size={16}/></button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="date"
                        className="p-2 border rounded text-sm"
                        value={editForm.date || ''}
                        onChange={e => setEditForm({...editForm, date: e.target.value})}
                      />
                      <input 
                        className="flex-1 p-2 border rounded text-sm" 
                        value={editForm.title || ''} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})} 
                      />
                    </div>
                    <textarea 
                      className="w-full p-2 border rounded h-20 text-sm" 
                      value={editForm.content || ''} 
                      onChange={e => setEditForm({...editForm, content: e.target.value})} 
                    />
                    <button type="button" onClick={saveEditing} className="bg-zinc-900 text-white px-3 py-1.5 rounded text-xs flex items-center gap-2 hover:bg-zinc-700">
                      <Save size={14} /> Save
                    </button>
                 </div>
               ) : (
                 // View Mode - Minimalist List
                  <div className="relative pl-4 border-l-2 border-transparent hover:border-zinc-200 transition-colors py-1">
                    {isAdmin && (
                      <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-2 transition-opacity">
                         <button onClick={() => startEditing(item)} className="text-zinc-400 hover:text-blue-600"><Pencil size={14}/></button>
                         <button onClick={() => { if(window.confirm('Delete?')) deleteNews(item.id); }} className="text-zinc-400 hover:text-red-500"><Trash2 size={14}/></button>
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-baseline mb-1">
                      <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">{item.date}</span>
                      <h3 className="text-base font-semibold text-zinc-900">{item.title}</h3>
                    </div>
                    <p className="text-sm text-zinc-500 leading-relaxed sm:pl-[6.5rem]">
                      {item.content}
                    </p>
                  </div>
               )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};