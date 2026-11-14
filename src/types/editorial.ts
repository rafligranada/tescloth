export type ArticleCategory =
  | 'Semua'
  | 'Mesin & Oli'
  | 'Rem & Suspensi'
  | 'Kelistrikan & Aki'
  | 'Ban & Kaki-kaki'
  | 'AC & Kabin'
  | 'Perawatan Bodi';

export type SubsystemId =
  | 'all'
  | 'engine'
  | 'brakes'
  | 'electrical'
  | 'tires'
  | 'ac'
  | 'body';

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
  tip?: string;
}

export interface ArticleFaq {
  question: string;
  answer: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: Exclude<ArticleCategory, 'Semua'>;
  subsystemId: Exclude<SubsystemId, 'all'>;
  readMinutes: number;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  reviewer: string;
  difficulty: 'Pemula' | 'Menengah' | 'Teknis';
  estimatedCost: string;
  image: string;
  imageAlt: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: ArticleFaq[];
}

export type RouteView =
  | { page: 'home' }
  | { page: 'articles' }
  | { page: 'article-detail'; slug: string }
  | { page: 'inspect-3d'; subsystem?: SubsystemId }
  | { page: 'calculator' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'privacy' }
  | { page: 'terms' }
  | { page: 'disclaimer' }
  | { page: 'editorial-policy' };
