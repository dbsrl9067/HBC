import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  writeBatch, 
  setDoc,
  query,
  orderBy,
  getDocs
} from 'firebase/firestore';
import { NEWS, MEMBERS, PUBLICATIONS, RESEARCH_AREAS } from '../constants';
import { Member, NewsItem, Publication, ResearchArea } from '../types';

interface LabContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  
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
  // Auth state stays local for this simple app
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('lab_is_admin') === 'true';
  });

  const [adminPassword, setAdminPassword] = useState<string>('admin');
  const [homeImage, setHomeImage] = useState<string>('https://picsum.photos/1200/600?grayscale');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);

  // Subscribe to Firebase Data
  useEffect(() => {
    // Settings (Home Image)
    const unsubSettings = onSnapshot(doc(db, "settings", "general"), (doc) => {
      if (doc.exists()) {
        setHomeImage(doc.data().homeImage);
      }
    });

    // Admin Password
    const unsubAuth = onSnapshot(doc(db, "settings", "auth"), (doc) => {
      if (doc.exists()) {
        setAdminPassword(doc.data().password);
      }
    });

    // News (Ordered by date)
    const qNews = query(collection(db, "news"), orderBy("date", "desc"));
    const unsubNews = onSnapshot(qNews, (snapshot) => {
      setNews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem)));
    });

    // Members
    // Note: Firestore doesn't guarantee order without a sort field. 
    // For now we rely on client-side filtering/rendering order in the component.
    const unsubMembers = onSnapshot(collection(db, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member)));
    });

    // Publications (Ordered by year)
    const qPubs = query(collection(db, "publications"), orderBy("year", "desc"));
    const unsubPubs = onSnapshot(qPubs, (snapshot) => {
      setPublications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Publication)));
    });

    // Research Areas
    const unsubResearch = onSnapshot(collection(db, "research_areas"), (snapshot) => {
      setResearchAreas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ResearchArea)));
    });

    return () => {
      unsubSettings();
      unsubAuth();
      unsubNews();
      unsubMembers();
      unsubPubs();
      unsubResearch();
    };
  }, []);

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

  const changePassword = async (newPassword: string) => {
    await setDoc(doc(db, "settings", "auth"), { password: newPassword }, { merge: true });
  };

  // --- Firestore Actions ---

  const updateHomeImage = async (url: string) => {
    await setDoc(doc(db, "settings", "general"), { homeImage: url }, { merge: true });
  };

  const addNews = async (item: NewsItem) => {
    const { id, ...data } = item; // Let Firestore generate ID
    await addDoc(collection(db, "news"), data);
  };
  const updateNews = async (id: string, item: Partial<NewsItem>) => {
    await updateDoc(doc(db, "news", id), item);
  };
  const deleteNews = async (id: string) => {
    await deleteDoc(doc(db, "news", id));
  };

  const addMember = async (member: Member) => {
    const { id, ...data } = member;
    await addDoc(collection(db, "members"), data);
  };
  const updateMember = async (id: string, member: Partial<Member>) => {
    await updateDoc(doc(db, "members", id), member);
  };
  const deleteMember = async (id: string) => {
    await deleteDoc(doc(db, "members", id));
  };

  const addPublication = async (pub: Publication) => {
    const { id, ...data } = pub;
    await addDoc(collection(db, "publications"), data);
  };
  const updatePublication = async (id: string, pub: Partial<Publication>) => {
    await updateDoc(doc(db, "publications", id), pub);
  };
  const deletePublication = async (id: string) => {
    await deleteDoc(doc(db, "publications", id));
  };

  const addResearchArea = async (area: ResearchArea) => {
    const { id, ...data } = area;
    await addDoc(collection(db, "research_areas"), data);
  };
  const updateResearchArea = async (id: string, area: Partial<ResearchArea>) => {
    await updateDoc(doc(db, "research_areas", id), area);
  };
  const deleteResearchArea = async (id: string) => {
    await deleteDoc(doc(db, "research_areas", id));
  };

  const resetData = async () => {
    if (!window.confirm("WARNING: This will delete ALL data in the database and reset it to default constants. Are you sure?")) return;
    
    try {
      // Helper to clear collection
      const clearCollection = async (name: string) => {
        const snapshot = await getDocs(collection(db, name));
        if (snapshot.empty) return; // Skip if empty to avoid empty batch commit
        
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }

      // 1. Clear all collections
      await Promise.all([
        clearCollection('news'),
        clearCollection('members'),
        clearCollection('publications'),
        clearCollection('research_areas')
      ]);

      // 2. Batch add defaults
      // Note: WriteBatch has a limit of 500 ops. Our constants are small so it's fine.
      const batch = writeBatch(db);

      NEWS.forEach(({id, ...item}) => batch.set(doc(collection(db, 'news')), item));
      MEMBERS.forEach(({id, ...item}) => batch.set(doc(collection(db, 'members')), item));
      PUBLICATIONS.forEach(({id, ...item}) => batch.set(doc(collection(db, 'publications')), item));
      RESEARCH_AREAS.forEach(({id, ...item}) => batch.set(doc(collection(db, 'research_areas')), item));
      
      // Reset Home Image
      batch.set(doc(db, "settings", "general"), { homeImage: 'https://picsum.photos/1200/600?grayscale' });

      await batch.commit();
      alert("Database has been reset to defaults!");
      
    } catch (error) {
      console.error("Error resetting data:", error);
      alert("Failed to reset data. Check console for details.");
    }
  };

  return (
    <LabContext.Provider value={{
      isAdmin, login, logout, changePassword, resetData,
      homeImage, updateHomeImage,
      news, addNews, updateNews, deleteNews,
      members, addMember, updateMember, deleteMember,
      publications, addPublication, updatePublication, deletePublication,
      researchAreas, addResearchArea, updateResearchArea, deleteResearchArea
    }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
};