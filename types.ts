import React from 'react';

export type Language = 'en' | 'es' | 'de';

export enum CategoryType {
  SELF_ESTEEM = 'Self-Esteem & Worth',
  ABUNDANCE = 'Abundance & Wealth',
  RELATIONSHIPS = 'Conscious Relationships',
  PRODUCTIVITY = 'Stress-Free Productivity',
  BIBLICAL = 'Biblical Wisdom',
  EMOTIONS = 'Emotions',
  AI = 'AI Thought',
  RIGHT = 'Right-wing',
  LEFT = 'Left-wing',
  NEUTRAL = 'Neutral'
}

export enum AspectRatio {
  SQUARE = '1:1',
  POSTER_2_3 = '2:3', // Classic Poster
  GALLERY_3_4 = '3:4', // Art Print
  ISO_5_7 = '5:7',    // A4/A3 style
  STORY = '9:16',     // Mobile
  CINEMA = '16:9'     // Screen
}

export type FontFamily = 'sans' | 'serif' | 'classic' | 'hand' | 'outfit';
export type TextAlign = 'left' | 'center' | 'right';
export type TextColor = 'slate' | 'rose' | 'emerald' | 'violet' | 'amber' | 'black' | 'white';

export type FrameColor = 'black' | 'oak' | 'gold' | 'white' | 'silver' | 'none';
export type LogoStyle = 'crown' | 'star' | 'heart' | 'infinity' | 'feather' | 'none';
export type ArtStyle = 'none' | 'vangogh' | 'monet' | 'warhol' | 'abstract' | 'ai_generated';

export interface StyleConfig {
  font: FontFamily;
  align: TextAlign;
  color: TextColor;
}

export interface ThoughtContent {
  limiting: string;
  expansive: string;
}

export interface Thought {
  id: string;
  category: CategoryType;
  // Content by Language
  content: {
    en: ThoughtContent;
    es: ThoughtContent;
    de: ThoughtContent;
  };
  visualDescription: string;
  isPremium: boolean;
  author?: string;
  likes: number;
  tag?: string;
}

export interface ThemeConfig {
  gradient: string;
  accent: string;
  icon: React.ReactNode;
}

export type ProductCategory = 'prints' | 'canvas' | 'framed' | 'apparel' | 'tech' | 'stationery' | 'stickers';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  size: string;
  price: number;
  description?: string;
}

export interface ProductCatalog {
  [key: string]: {
    name: string;
    description: string;
    variants: ProductVariant[];
  };
}