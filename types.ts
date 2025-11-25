export interface Dish {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'starter' | 'main' | 'dessert' | 'special';
  highlight?: boolean; // Represents a high-margin item
}

export interface MenuConfig {
  restaurantName: string;
  tagline: string;
  theme: string;
}

export enum LayoutZone {
  TheAnchor = "The Anchor", // Top Right
  TheMagnet = "The Magnet", // Center
  TheLead = "The Lead", // Top Left
  Standard = "Standard Flow"
}