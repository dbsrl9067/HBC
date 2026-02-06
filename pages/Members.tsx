import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import { Mail, Plus, Trash2, Pencil, Save, X, PlusCircle, Upload } from 'lucide-react';
import { Member } from '../types';

export const Members: React.FC = () => {
  const { members, isAdmin, addMember, updateMember, deleteMember } = useLab();
  const [isAdding, setIsAdding] = useState(false);
  
  // State for Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Member>>({});
  const [editInterestInput, setEditInterestInput] = useState('');

  // State for Adding
  const [newMember, setNewMember] = useState<Partial<Member>>({
    role: 'PhD Student',
    researchInterests: [],
    imageUrl: ''
  });
  const [interestInput, setInterestInput] = useState('');

  const professor = members.find(m => m.role === 'Principal Investigator');
  const phdStudents = members.filter(m => m.role === 'PhD Student');
  const masterStudents = members.filter(m => m.role === 'Master Student');
  const alumni = members.filter(m => m.role === 'Alumni');

  // --- Handlers ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isEdit) {
          setEditForm(prev => ({ ...prev, imageUrl: result }));
        } else {
          setNewMember(prev => ({ ...prev, imageUrl: result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.role) return;

    addMember({
      id: Date.now().toString(),
      name: newMember.name,
      role: newMember.role as any,
      email: newMember.email || '',
      imageUrl: newMember.imageUrl || `https://picsum.photos/200/200?random=${Date.now()}`,
      researchInterests: newMember.researchInterests || [],
    });
    setNewMember({ role: 'PhD Student', researchInterests: [], imageUrl: '' });
    setIsAdding(false);
  };

  const addInterest = () => {
    if (interestInput.trim()) {
      setNewMember(prev => ({
        ...prev,
        researchInterests: [...(prev.researchInterests || []), interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  // --- EDIT Handlers ---
  const startEditing = (member: Member) => {
    setEditingId(member.id);
    setEditForm({ ...member });
    setEditInterestInput('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
    setEditInterestInput('');
  };

  const saveEditing = () => {
    if (editingId && editForm.name) {
      updateMember(editingId, editForm);
      setEditingId(null);
    }
  };

  const addEditInterest = () => {
    if (editInterestInput.trim()) {
      setEditForm(prev => ({
        ...prev,
        researchInterests: [...(prev.researchInterests || []), editInterestInput.trim()]
      }));
      setEditInterestInput('');
    }
  };

  const removeEditInterest = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      researchInterests: prev.researchInterests?.filter((_, i) => i !== index)
    }));
  };

  // --- Render Helpers ---
  const renderEditForm = (isProfessor: boolean) => (
    <div className={`bg-zinc-50 border-2 border-blue-500 rounded-2xl p-6 space-y-4 ${isProfessor ? 'w-full' : 'h-full'}`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-blue-600">Editing Member</h4>
        <button type="button" onClick={cancelEditing} className="text-zinc-400 hover:text-zinc-600"><X size={20}/></button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Name</label>
          <input 
            className="w-full p-2 border rounded-lg" 
            value={editForm.name || ''} 
            onChange={e => setEditForm({...editForm, name: e.target.value})} 
          />
        </div>
        
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Role</label>
          <select 
            className="w-full p-2 border rounded-lg" 
            value={editForm.role} 
            onChange={e => setEditForm({...editForm, role: e.target.value as any})}
          >
             <option>Principal Investigator</option>
             <option>PhD Student</option>
             <option>Master Student</option>
             <option>Alumni</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Email</label>
          <input 
            className="w-full p-2 border rounded-lg" 
            value={editForm.email || ''} 
            onChange={e => setEditForm({...editForm, email: e.target.value})} 
          />
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase">Image</label>
          <div className="space-y-2">
             <input 
              className="w-full p-2 border rounded-lg text-sm" 
              placeholder="Image URL (https://...)"
              value={editForm.imageUrl || ''} 
              onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} 
            />
            <div className="flex items-center gap-2">
               <span className="text-xs text-zinc-400">OR</span>
               <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium hover:bg-zinc-50">
                  <Upload size={14} /> Upload File
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} />
               </label>
            </div>
          </div>
        </div>

        <div>
           <label className="text-xs font-bold text-zinc-500 uppercase">Research Interests</label>
           <div className="flex gap-2 mb-2">
             <input 
               className="flex-1 p-2 border rounded-lg text-sm"
               placeholder="Add interest..."
               value={editInterestInput}
               onChange={e => setEditInterestInput(e.target.value)}
               onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addEditInterest(); }}}
             />
             <button type="button" onClick={addEditInterest} className="p-2 bg-zinc-200 rounded-lg hover:bg-zinc-300">
               <PlusCircle size={16} />
             </button>
           </div>
           <div className="flex flex-wrap gap-1">
             {editForm.researchInterests?.map((interest, idx) => (
               <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-white border rounded text-xs">
                 {interest}
                 <button type="button" onClick={() => removeEditInterest(idx)} className="text-red-400 hover:text-red-600">
                   <X size={12} />
                 </button>
               </span>
             ))}
           </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button type="button" onClick={saveEditing} className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
          <Save size={16} /> Save Changes
        </button>
      </div>
    </div>
  );

  const renderStudentGrid = (title: string, students: Member[]) => {
    if (students.length === 0) return null;
    return (
      <section className="mb-16">
        <div className="flex items-center gap-4 mb-8">
           <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
            {title}
          </h2>
          <div className="h-px bg-zinc-100 w-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student) => (
            <div key={student.id} className="group relative h-full">
               {editingId === student.id ? renderEditForm(false) : (
                 <div className="relative p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                    {isAdmin && (
                      <div className="absolute top-4 right-4 z-50 flex gap-2">
                         <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); startEditing(student); }}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer shadow-sm border border-blue-200"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete member?')) deleteMember(student.id); }}
                          className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-200 cursor-pointer shadow-sm border border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={student.imageUrl} 
                        alt={student.name} 
                        className="w-16 h-16 rounded-full object-cover border border-zinc-100"
                      />
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">{student.name}</h4>
                        <p className="text-sm text-zinc-500">{student.role}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {student.researchInterests?.slice(0, 3).map(interest => (
                          <span key={interest} className="px-2 py-0.5 bg-zinc-50 text-zinc-500 border border-zinc-100 rounded text-xs">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {student.email && (
                      <div className="pt-4 mt-auto">
                        <a href={`mailto:${student.email}`} className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
                          <Mail size={14} /> {student.email}
                        </a>
                      </div>
                    )}
                 </div>
               )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-500 pb-20">
      
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-zinc-900">People</h1>
          <p className="text-lg text-zinc-500 max-w-2xl">
            Meet the team of researchers and students.
          </p>
        </div>
        {isAdmin && !isAdding && (
          <button 
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} /> Add Member
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddMember} className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
           <h3 className="font-bold text-lg">Add New Member</h3>
           <div className="grid md:grid-cols-2 gap-4">
             <input required placeholder="Name" className="p-3 border rounded-xl" value={newMember.name || ''} onChange={e => setNewMember({...newMember, name: e.target.value})} />
             <select className="p-3 border rounded-xl" value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value as any})}>
               <option>Principal Investigator</option>
               <option>PhD Student</option>
               <option>Master Student</option>
               <option>Alumni</option>
             </select>
             <input placeholder="Email" className="p-3 border rounded-xl" value={newMember.email || ''} onChange={e => setNewMember({...newMember, email: e.target.value})} />
             <div className="flex gap-2">
                <input placeholder="Image URL (https://...)" className="flex-1 p-3 border rounded-xl" value={newMember.imageUrl || ''} onChange={e => setNewMember({...newMember, imageUrl: e.target.value})} />
                <label className="flex items-center justify-center px-4 bg-zinc-100 border border-zinc-200 rounded-xl cursor-pointer hover:bg-zinc-200">
                    <Upload size={20} className="text-zinc-500" />
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} />
                </label>
             </div>
           </div>
           
           <div className="flex gap-2">
             <input 
               placeholder="Add Research Interest (Press Enter)" 
               className="flex-1 p-3 border rounded-xl" 
               value={interestInput}
               onChange={e => setInterestInput(e.target.value)}
               onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addInterest(); }}}
             />
             <button type="button" onClick={addInterest} className="px-4 bg-zinc-200 rounded-xl">Add</button>
           </div>
           <div className="flex flex-wrap gap-2">
             {newMember.researchInterests?.map((tag, i) => (
               <span key={i} className="px-2 py-1 bg-white border rounded text-xs">{tag}</span>
             ))}
           </div>

           <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-zinc-900 text-white px-6 py-2 rounded-lg">Save Member</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border px-6 py-2 rounded-lg">Cancel</button>
           </div>
        </form>
      )}

      {/* Professor Section */}
      {professor && (
        <section className="relative group mb-20">
          {editingId === professor.id ? renderEditForm(true) : (
            <>
              {isAdmin && (
                <div className="absolute top-0 right-0 z-50 flex gap-2">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); startEditing(professor); }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 cursor-pointer shadow-sm border border-blue-200"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete member?')) deleteMember(professor.id); }}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 cursor-pointer shadow-sm border border-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-8 border-b border-zinc-100 pb-2">
                Principal Investigator
              </h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <img 
                  src={professor.imageUrl} 
                  alt={professor.name} 
                  className="w-48 h-48 rounded-2xl object-cover shadow-sm grayscale hover:grayscale-0 transition-all duration-500"
                />
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-zinc-900">{professor.name}</h3>
                  <p className="text-lg text-zinc-600 font-medium">{professor.role}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {professor.researchInterests?.map(interest => (
                      <span key={interest} className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-2">
                    {professor.email && (
                      <a href={`mailto:${professor.email}`} className="flex items-center gap-2 text-zinc-500 hover:text-blue-600 transition-colors">
                        <Mail size={18} />
                        <span>Email</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* Students Grids */}
      {renderStudentGrid('PhD Candidates', phdStudents)}
      {renderStudentGrid('Master Students', masterStudents)}
      {renderStudentGrid('Alumni', alumni)}

    </div>
  );
};