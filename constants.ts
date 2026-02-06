import { Member, Publication, NewsItem, ResearchArea } from './types';

export const LAB_NAME = "HBC Lab";
export const UNIVERSITY_NAME = "Chungbuk National University, Dept. of Psychology";

export const NEWS: NewsItem[] = [
  {
    id: 'n1',
    date: '2024.03.01',
    title: 'New Academic Year Begins',
    content: 'We welcome our new Master\'s and PhD students for the Spring 2024 semester.'
  },
  {
    id: 'n2',
    date: '2024.02.15',
    title: 'Recruiting Participants for Research',
    content: 'We are looking for participants for a study on stress and coping mechanisms in crisis situations.'
  }
];

// Structure: PI (1), PhD (4), Masters (8: 3x5th, 3x3rd, 2x1st)
export const MEMBERS: Member[] = [
  {
    id: 'pi',
    name: 'Dr. Sungeun You',
    role: 'Principal Investigator',
    email: 'seyou@chungbuk.ac.kr',
    imageUrl: 'https://picsum.photos/200/200?random=100',
    researchInterests: ['Crisis Psychology', 'Trauma', 'Suicide Prevention']
  },
  // PhD Students (4)
  {
    id: 'phd1',
    name: 'PhD Student 1',
    role: 'PhD Student',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    researchInterests: ['Disaster Psychology', 'Resilience']
  },
  {
    id: 'phd2',
    name: 'PhD Student 2',
    role: 'PhD Student',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    researchInterests: ['Clinical Psychology', 'Assessment']
  },
  {
    id: 'phd3',
    name: 'PhD Student 3',
    role: 'PhD Student',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    researchInterests: ['Crisis Intervention']
  },
  {
    id: 'phd4',
    name: 'PhD Student 4',
    role: 'PhD Student',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    researchInterests: ['Trauma Therapy']
  },
  // Masters - 5th Semester (3)
  {
    id: 'ms5-1',
    name: 'Master Student (5th Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=5',
    researchInterests: ['Behavior Analysis']
  },
  {
    id: 'ms5-2',
    name: 'Master Student (5th Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=6',
    researchInterests: ['Qualitative Research']
  },
  {
    id: 'ms5-3',
    name: 'Master Student (5th Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=7',
    researchInterests: ['Adolescent Psychology']
  },
  // Masters - 3rd Semester (3)
  {
    id: 'ms3-1',
    name: 'Master Student (3rd Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=8',
    researchInterests: ['Stress Management']
  },
  {
    id: 'ms3-2',
    name: 'Master Student (3rd Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=9',
    researchInterests: ['Mental Health']
  },
  {
    id: 'ms3-3',
    name: 'Master Student (3rd Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=10',
    researchInterests: ['Psychopathology']
  },
  // Masters - 1st Semester (2)
  {
    id: 'ms1-1',
    name: 'Master Student (1st Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=11',
    researchInterests: ['General Psychology']
  },
  {
    id: 'ms1-2',
    name: 'Master Student (1st Sem)',
    role: 'Master Student',
    imageUrl: 'https://picsum.photos/200/200?random=12',
    researchInterests: ['Research Methods']
  }
];

export const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: 'r1',
    title: 'Crisis Intervention',
    description: 'Developing effective psychological intervention strategies for individuals and communities facing acute crises and disasters.',
    imageUrl: 'https://picsum.photos/600/400?random=20',
    link: '#'
  },
  {
    id: 'r2',
    title: 'Trauma & Resilience',
    description: 'Investigating the mechanisms of trauma processing and the factors that contribute to psychological resilience and post-traumatic growth.',
    imageUrl: 'https://picsum.photos/600/400?random=21',
    link: '#'
  },
  {
    id: 'r3',
    title: 'Suicide Prevention',
    description: 'Researching behavioral indicators and preventive measures for suicide risk reduction in vulnerable populations.',
    imageUrl: 'https://picsum.photos/600/400?random=22',
    link: '#'
  }
];

export const PUBLICATIONS: Publication[] = [
  {
    id: 'p1',
    title: "Psychological Impact of Social Disasters on Community Resilience",
    authors: ["S. You", "et al."],
    venue: "Journal of Traumatic Stress",
    year: 2024,
    tags: ["Trauma", "Community"],
    link: "#"
  },
  {
    id: 'p2',
    title: "Crisis Intervention Strategies for High-Risk Adolescents",
    authors: ["PhD Student 1", "S. You"],
    venue: "Korean Journal of Psychology",
    year: 2023,
    tags: ["Adolescents", "Crisis"],
    link: "#"
  },
  {
    id: 'p3',
    title: "The Role of Social Support in Post-Traumatic Growth",
    authors: ["PhD Student 2", "S. You"],
    venue: "APA Convention",
    year: 2023,
    tags: ["PTG", "Support"],
    link: "#"
  }
];