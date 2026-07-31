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
  badgeEn?: string;
  badgeBn?: string;
  ownerReplyEn?: string;
  ownerReplyBn?: string;
  topics?: string[];
  likes?: number;
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

export type WeatherCondition = 'sunny' | 'rainy' | 'cloudy' | 'cool';

export interface WeatherData {
  condition: WeatherCondition;
  temp: number; // Celsius
  locationName: string;
  isAuto: boolean;
  labelEn: string;
  labelBn: string;
  icon: string;
}

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

export interface CartItem {
  id: string;
  productNameEn: string;
  productNameBn: string;
  img: string;
  weight: string;
  price?: number;
  quantity: number;
  customNote?: string;
  category?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  isLoggedIn: boolean;
  role?: 'customer' | 'admin';
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDate: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  timestamp: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery' | 'UPI / Online';
  userReview?: {
    rating: number;
    comment: string;
    timestamp: string;
  };
  isThanksSent?: boolean;
}
