import React, { useState } from 'react';
import { LAB_NAME } from '../constants';
import { useLab } from '../context/LabContext';
import { ArrowRight, Sparkles, Plus, Trash2, ExternalLink, Pencil, Save, X, Image as ImageIcon, Upload } from 'lucide-react';
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
    // Convert YYYY.MM.DD (display) -> YYYY-MM-DD (input)
    setEditForm({ 
      ...item,
      date: item.date.replace(/\./g, '-')
    });
  };

  const saveEditing = () => {
    if (editingId && editForm.title && editForm.date) {
      updateNews(editingId, {
        ...editForm,
        // Convert YYYY-MM-DD (input) -> YYYY.MM.DD (display)
        date: editForm.date.replace(/-/g, '.')
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium uppercase tracking-wider">
          <Sparkles size={12} className="text-blue-600" />
          Laboratory for Human Behavior in Crisis
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
          Understanding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">human behavior</span> in times of crisis.
        </h1>
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed">
          Welcome to {LAB_NAME} at Chungbuk National University. We research trauma, crisis intervention, and resilience to help individuals and society recover and grow.
        </p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link 
            to="/research" 
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-95"
          >
            Our Research <ArrowRight size={18} />
          </Link>
          <a 
            href="https://psychology.chungbuk.ac.kr/" 
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-medium hover:bg-zinc-50 transition-all hover:border-zinc-300"
          >
            Dept. Website <ExternalLink size={16} />
          </a>
        </div>
      </section>

      {/* Image Banner */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-sm group">
        {isEditingImage ? (
          <div className="absolute inset-0 bg-zinc-50 z-20 flex flex-col items-center justify-center p-6 gap-4">
             <h3 className="font-bold text-lg text-zinc-900">Update Banner Image</h3>
             
             <div className="w-full max-w-md space-y-3">
               <div className="flex gap-2">
                 <input 
                    className="flex-1 p-3 border rounded-xl shadow-sm"
                    placeholder="Enter Image URL..."
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    autoFocus
                 />
                 <button onClick={saveImage} type="button" className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700">Save</button>
                 <button onClick={() => setIsEditingImage(false)} type="button" className="bg-white border text-zinc-700 px-4 rounded-xl hover:bg-zinc-50">Cancel</button>
               </div>
               
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-50 px-2 text-zinc-500">Or upload file</span>
                  </div>
               </div>

               <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-zinc-300 border-dashed rounded-xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-zinc-400 mb-2" />
                          <p className="text-sm text-zinc-500">Click to upload image</p>
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
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {isAdmin && (
              <button 
                type="button"
                onClick={startEditingImage}
                className="absolute top-4 right-4 z-50 bg-white text-zinc-800 px-4 py-2 rounded-lg text-sm font-medium shadow-md border border-zinc-200 flex items-center gap-2 hover:bg-zinc-50 cursor-pointer"
              >
                <ImageIcon size={16} /> Edit Image
              </button>
            )}
          </>
        )}
      </div>

      {/* News Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Lab News</h2>
          {isAdmin && !isAdding && (
            <button 
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} /> Add News
            </button>
          )}
          {!isAdmin && <span className="text-sm text-zinc-400">Updates & Announcements</span>}
        </div>

        {isAdding && (
          <form onSubmit={handleAddNews} className="mb-8 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
            <h3 className="font-bold text-lg">Add New Post</h3>
            <div className="flex gap-4">
              <input
                type="date"
                required
                className="p-3 border rounded-xl"
                value={newPost.date}
                onChange={e => setNewPost({...newPost, date: e.target.value})}
              />
              <input
                required
                placeholder="Title"
                className="flex-1 p-3 border rounded-xl"
                value={newPost.title}
                onChange={e => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            <textarea
              required
              placeholder="Content"
              className="w-full p-3 border rounded-xl h-24"
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
            />
            <div className="flex gap-3">
              <button type="submit" className="bg-zinc-900 text-white px-4 py-2 rounded-lg">Save</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </form>
        )}
        
        <div className="grid gap-6">
          {news.map((item) => (
            <div key={item.id} className="group relative">
               {editingId === item.id ? (
                 // Edit Mode
                 <div className="p-6 rounded-2xl bg-zinc-50 border-2 border-blue-500 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-blue-600">Editing Post</h4>
                      <button type="button" onClick={() => setEditingId(null)} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      <input 
                        type="date"
                        className="p-3 border rounded-xl"
                        value={editForm.date || ''}
                        onChange={e => setEditForm({...editForm, date: e.target.value})}
                      />
                      <input 
                        className="flex-1 p-3 border rounded-xl" 
                        value={editForm.title || ''} 
                        onChange={e => setEditForm({...editForm, title: e.target.value})} 
                      />
                    </div>
                    <textarea 
                      className="w-full p-3 border rounded-xl h-24" 
                      value={editForm.content || ''} 
                      onChange={e => setEditForm({...editForm, content: e.target.value})} 
                    />
                    <button type="button" onClick={saveEditing} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                      <Save size={16} /> Save Changes
                    </button>
                 </div>
               ) : (
                 // View Mode - Buttons are always visible for admin
                  <div className="relative flex flex-col md:flex-row gap-4 md:gap-8 p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                    {isAdmin && (
                      <div className="absolute top-4 right-4 z-50 flex gap-2">
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); startEditing(item); }}
                          className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-zinc-200 hover:bg-blue-50 cursor-pointer"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this post?')) deleteNews(item.id); }}
                          className="p-2 bg-white text-red-500 rounded-lg shadow-sm border border-zinc-200 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    <div className="md:w-32 flex-shrink-0">
                      <span className="inline-block px-3 py-1 bg-white rounded-md text-xs font-semibold text-zinc-500 shadow-sm border border-zinc-100">
                        {item.date}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-zinc-600 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
               )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};