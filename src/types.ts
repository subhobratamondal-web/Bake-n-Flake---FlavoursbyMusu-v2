export interface Product {
  nameEn: string;
  nameBn: string;
  img: string;
  rounded?: boolean;
  descEn?: string;
  descBn?: string;
  category?: string;
  section?: string;
}

export interface VideoItem {
  nameEn: string;
  nameBn: string;
  vid: string;
  url: string;
  img?: string;
  extraZoom?: boolean;
}

export interface Review {
  nameEn: string;
  nameBn: string;
  timeEn: string;
  timeBn: string;
  rating: number;
  date: Date;
  textEn: string;
  textBn: string;
  avatar: string;
  recommends?: boolean;
}

export interface GalleryData {
  totalImageCount?: number;
  items?: (Product | any)[];
  FAQ?: FAQ[];
  [key: string]: string[] | VideoItem[] | number | any[] | undefined;
}

export interface FAQ {
  id: number;
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
  keywords?: string;
  images?: string[];
  links?: { label: string; url: string; icon?: string }[];
  mapIframe?: string;
}

export interface FAQCategory {
  titleEn: string;
  titleBn: string;
  icon: string;
  faqs: FAQ[];
  categoryImages?: string[];
}

export interface BotIntent {
  id?: string | number;
  keywords: string[];
  answerBn?: string;
  answerEn?: string;
  responseBn?: string;
  responseEn?: string;
  images?: string[];
  links?: { label: string; url: string; icon?: string }[];
  mapIframe?: string;
}

export type Language = 'en' | 'bn';

export interface Translation {
  brand: string;
  tag: string;
  nav: any;
  hero: any;
  categories: any;
  videos: any;
  gallery: any;
  story: any;
  reviews: any;
  contact: any;
  footer: any;
}
