import { create } from 'zustand';

export interface SiteSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  copyrightText: string;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

interface PageContent {
  title: string;
  content: string;
}

interface ContentState {
  pages: Record<string, PageContent>;
  blogs: BlogPost[];
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updatePage: (slug: string, newContent: string) => void;
  addPage: (slug: string, title: string, content: string) => void;
  deletePage: (slug: string) => void;
  addBlog: (blog: Omit<BlogPost, 'id' | 'date'>) => void;
  deleteBlog: (id: number) => void;
}

const defaultPages: Record<string, PageContent> = {
  privacy: { title: 'Privacy Policy', content: 'We value your privacy. Your data is secure with us.\n\nChanges to this policy will be communicated via email.' },
  terms: { title: 'Terms & Conditions', content: 'By using Biscuit Bazar, you agree to these terms.\n\nWe reserve the right to modify prices without prior notice.' },
  refund: { title: 'Refund Policy', content: 'We offer a 7-day money-back guarantee for unopened biscuits.\n\nTo raise a refund request, please contact our support team.' },
  shipping: { title: 'Shipping Policy', content: 'Nationwide shipping in 24-48 hours. Shipping fee is 80 BDT base charge.\n\nAdditional charges may apply for remote areas.' },
  faq: { title: 'Frequently Asked Questions', content: 'Q: How fresh are the biscuits?\nA: Extremely fresh! We restock weekly.\n\nQ: Do you offer bulk discounts?\nA: Yes, contact us for details via email or phone.' },
};

const initialBlogs: BlogPost[] = [
  { id: 1, title: 'The Secret to Perfect Tea Time', excerpt: 'Discover which biscuits pair best with your evening tea.', content: 'Full article text goes here. A good cup of tea deserves a rich, buttery biscuit...', date: '2026-05-10', image: 'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&w=500&q=60' },
  { id: 2, title: 'Health Benefits of Digestive Biscuits', excerpt: 'Why digestives should be part of your daily routine.', content: 'Full article text goes here. Made with whole wheat and fiber...', date: '2026-05-15', image: 'https://images.unsplash.com/photo-1620935105269-e05445fc6e4b?auto=format&fit=crop&w=500&q=60' }
];

const initialSettings: SiteSettings = {
  storeName: "Biscuit Bazar",
  supportEmail: "hello@biscuitbazar.com",
  supportPhone: "+880 1234-567890",
  address: "123 Biscuit Lane, Sweet District, Dhaka, Bangladesh",
  facebookUrl: "#",
  twitterUrl: "#",
  instagramUrl: "#",
  copyrightText: "Biscuit Bazar. All rights reserved."
};

export const useContentStore = create<ContentState>((set) => ({
  pages: defaultPages,
  blogs: initialBlogs,
  settings: initialSettings,
  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings }
  })),
  updatePage: (slug, newContent) => set((state) => ({
    pages: {
      ...state.pages,
      [slug]: { ...state.pages[slug], content: newContent }
    }
  })),
  addPage: (slug, title, content) => set((state) => ({
    pages: { ...state.pages, [slug]: { title, content } }
  })),
  deletePage: (slug) => set((state) => {
    const newPages = { ...state.pages };
    delete newPages[slug];
    return { pages: newPages };
  }),
  addBlog: (blog) => set(state => ({
    blogs: [{ ...blog, id: Date.now(), date: new Date().toISOString().split('T')[0] }, ...state.blogs]
  })),
  deleteBlog: (id) => set(state => ({
    blogs: state.blogs.filter(b => b.id !== id)
  }))
}));
