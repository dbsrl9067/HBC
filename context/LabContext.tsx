import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { NEWS, MEMBERS, PUBLICATIONS, RESEARCH_AREAS } from '../constants';
import { Member, NewsItem, Publication, ResearchArea } from '../types';

interface LabContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPass: string) => void;
  
  homeImage: string;
  updateHomeImage: (url: string) => void;

  news: NewsItem[];
  addNews: (item: NewsItem) => void;
  updateNews: (id: string, item: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;
  
  members: Member[];
  addMember: (member: Member) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  publications: Publication[];
  addPublication: (pub: Publication) => void;
  updatePublication: (id: string, pub: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  
  researchAreas: ResearchArea[];
  addResearchArea: (area: ResearchArea) => void;
  updateResearchArea: (id: string, area: Partial<ResearchArea>) => void;
  deleteResearchArea: (id: string) => void;
  
  resetData: () => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Auth State ---
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lab_is_admin') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState(() => {
    return localStorage.getItem('lab_admin_password') || 'admin';
  });

  const login = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      localStorage.setItem('lab_is_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('lab_is_admin');
  };

  const changePassword = (newPass: string) => {
    setAdminPassword(newPass);
    localStorage.setItem('lab_admin_password', newPass);
  };
  
  // --- Data States ---
  const [homeImage, setHomeImage] = useState<string>(() => {
    return localStorage.getItem('lab_home_image') || 'https://picsum.photos/1200/600?grayscale';
  });
  
  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('lab_news');
    return saved ? JSON.parse(saved) : NEWS;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('lab_members');
    return saved ? JSON.parse(saved) : MEMBERS;
  });

  const [publications, setPublications] = useState<Publication[]>(() => {
    const saved = localStorage.getItem('lab_publications');
    return saved ? JSON.parse(saved) : PUBLICATIONS;
  });

  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>(() => {
    const saved = localStorage.getItem('lab_research');
    return saved ? JSON.parse(saved) : RESEARCH_AREAS;
  });

  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('lab_home_image', homeImage), [homeImage]);
  useEffect(() => localStorage.setItem('lab_news', JSON.stringify(news)), [news]);
  useEffect(() => localStorage.setItem('lab_members', JSON.stringify(members)), [members]);
  useEffect(() => localStorage.setItem('lab_publications', JSON.stringify(publications)), [publications]);
  useEffect(() => localStorage.setItem('lab_research', JSON.stringify(researchAreas)), [researchAreas]);

  // --- Actions ---
  const updateHomeImage = (url: string) => setHomeImage(url);

  const resetData = () => {
    if (window.confirm("Are you sure? This will revert all data to the initial default state.")) {
      setHomeImage('https://picsum.photos/1200/600?grayscale');
      setNews(NEWS);
      setMembers(MEMBERS);
      setPublications(PUBLICATIONS);
      setResearchAreas(RESEARCH_AREAS);
    }
  };

  // Functional updates for reliability
  const addNews = (item: NewsItem) => setNews(prev => [item, ...prev]);
  const updateNews = (id: string, item: Partial<NewsItem>) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, ...item } : n));
  };
  const deleteNews = (id: string) => setNews(prev => prev.filter(n => n.id !== id));

  const addMember = (member: Member) => setMembers(prev => [...prev, member]);
  const updateMember = (id: string, member: Partial<Member>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...member } : m));
  };
  const deleteMember = (id: string) => setMembers(prev => prev.filter(m => m.id !== id));

  const addPublication = (pub: Publication) => setPublications(prev => [pub, ...prev]);
  const updatePublication = (id: string, pub: Partial<Publication>) => {
    setPublications(prev => prev.map(p => p.id === id ? { ...p, ...pub } : p));
  };
  const deletePublication = (id: string) => setPublications(prev => prev.filter(p => p.id !== id));

  const addResearchArea = (area: ResearchArea) => setResearchAreas(prev => [...prev, area]);
  const updateResearchArea = (id: string, area: Partial<ResearchArea>) => {
    setResearchAreas(prev => prev.map(r => r.id === id ? { ...r, ...area } : r));
  };
  const deleteResearchArea = (id: string) => setResearchAreas(prev => prev.filter(r => r.id !== id));

  const value = useMemo(() => ({
    isAdmin, login, logout, changePassword, resetData,
    homeImage, updateHomeImage,
    news, addNews, updateNews, deleteNews,
    members, addMember, updateMember, deleteMember,
    publications, addPublication, updatePublication, deletePublication,
    researchAreas, addResearchArea, updateResearchArea, deleteResearchArea
  }), [isAdmin, homeImage, news, members, publications, researchAreas]);

  return (
    <LabContext.Provider value={value}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
};