export interface Member {
  id: string;
  name: string;
  role: 'Principal Investigator' | 'PhD Student' | 'Master Student' | 'Alumni';
  email?: string;
  imageUrl: string;
  researchInterests?: string[];
  website?: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  tags?: string[];
  link?: string;
  doi?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  content: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}