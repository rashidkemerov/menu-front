import React from 'react';
import { Dish, LayoutZone } from '../types';
import { Info, Sparkles } from 'lucide-react';

interface MenuCanvasProps {
  dishes: Dish[];
  restaurantName: string;
  tagline: string;
  showHeatmap: boolean;
}

const A4_RATIO_CLASS = "aspect-[210/297]";

export const MenuCanvas: React.FC<MenuCanvasProps> = ({ dishes, restaurantName, tagline, showHeatmap }) => {
  // Psychological Sort:
  // We manually map specific indices from the API response to specific "Zones" on the paper.
  // API gives us a list. We need to categorize them to place them correctly.
  
  const specials = dishes.filter(d => d.category === 'special');
  const starters = dishes.filter(d => d.category === 'starter');
  const mains = dishes.filter(d => d.category === 'main');
  const desserts = dishes.filter(d => d.category === 'dessert');

  // Helper to render an item
  const renderItem = (dish: Dish, zone?: LayoutZone) => (
    <div className={`relative mb-6 group ${showHeatmap ? 'p-2 rounded transition-all duration-300' : ''}`}
         style={{ backgroundColor: showHeatmap && zone ? getZoneColor(zone) : 'transparent' }}>
      
      {showHeatmap && zone && (
        <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-1 rounded shadow-lg pointer-events-none w-32 text-center">
          {getZoneDescription(zone)}
        </div>
      )}

      <div className="flex justify-between items-baseline mb-1">
        <h4 className="font-serif text-lg font-bold text-gray-800 tracking-wide uppercase">
          {dish.name}
        </h4>
        <span className="font-serif text-lg font-bold text-gray-900 ml-4 whitespace-nowrap">{dish.price}</span>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed italic font-light">
        {dish.description}
      </p>
      {dish.highlight && (
        <div className="mt-1 flex items-center text-xs text-amber-600 font-semibold uppercase tracking-wider">
           <Sparkles size={12} className="mr-1" /> Chef's Choice
        </div>
      )}
    </div>
  );

  return (
    <div className={`w-full max-w-[800px] mx-auto bg-white shadow-2xl ${A4_RATIO_CLASS} relative overflow-hidden text-gray-800`}>
      {/* Paper Texture/Style */}
      <div className="absolute inset-0 pointer-events-none border-[16px] border-white z-20 shadow-inner"></div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-stone-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col p-12">
        
        {/* Header Section */}
        <header className="text-center mb-12 mt-4">
          <div className="inline-block border-b-2 border-double border-gray-800 pb-2 mb-4">
             <h1 className="text-5xl font-serif font-black tracking-tight text-gray-900 uppercase">
              {restaurantName}
            </h1>
          </div>
          <p className="text-gray-500 font-serif italic text-lg tracking-widest uppercase">{tagline}</p>
        </header>

        {/* The Golden Triangle Layout */}
        <div className="flex-1 grid grid-cols-12 gap-8">
          
          {/* Left Column (Standard scan path after Anchor) */}
          <div className="col-span-5 pt-8">
            <div className="mb-2 border-b border-gray-300 pb-1">
               <h3 className="font-serif text-xl font-bold uppercase text-gray-400 tracking-widest">Starters</h3>
            </div>
            <div className="space-y-2">
              {starters.map(d => renderItem(d, LayoutZone.TheLead))}
            </div>

            <div className="mt-12 mb-2 border-b border-gray-300 pb-1">
               <h3 className="font-serif text-xl font-bold uppercase text-gray-400 tracking-widest">Entrées</h3>
            </div>
             <div className="space-y-2">
              {mains.slice(0, 3).map(d => renderItem(d, LayoutZone.Standard))}
            </div>
          </div>

          {/* Spacer */}
          <div className="col-span-1 border-r border-gray-200 h-[90%] self-center mx-auto opacity-50"></div>

          {/* Right Column - Holds the Sweet Spots */}
          <div className="col-span-6 flex flex-col">
            
            {/* The ANCHOR Position (Top Right) - High Profit/Price items are often seen first or second */}
            <div className="bg-stone-50 p-6 -mx-4 mb-8 border border-stone-100 relative shadow-sm">
               {/* Decorative Corner */}
               <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-400"></div>
               <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-400"></div>
               
               <h3 className="font-serif text-center text-sm font-bold uppercase text-amber-700 mb-4 tracking-widest">Recommendation</h3>
               {specials[0] ? renderItem(specials[0], LayoutZone.TheAnchor) : null}
            </div>

            {/* The MAGNET (Middle) - Where the eye rests naturally */}
            <div className="flex-grow flex flex-col justify-center">
               <div className="mb-2 border-b border-gray-300 pb-1">
                 <h3 className="font-serif text-xl font-bold uppercase text-gray-400 tracking-widest">Signatures</h3>
               </div>
               {mains.slice(3).map(d => renderItem(d, LayoutZone.TheMagnet))}
            </div>

            {/* Bottom Right - Desserts (The Exit) */}
            <div className="mt-auto pt-8">
              <div className="mb-2 border-b border-gray-300 pb-1 text-right">
                 <h3 className="font-serif text-xl font-bold uppercase text-gray-400 tracking-widest">Sweets</h3>
              </div>
              <div className="text-right">
                {desserts.map(d => (
                   <div key={d.id} className={`relative mb-6 ${showHeatmap ? 'bg-blue-50/50 p-2' : ''}`}>
                      <h4 className="font-serif text-lg font-bold text-gray-800">{d.name} <span className="ml-2">{d.price}</span></h4>
                      <p className="text-gray-600 text-sm italic">{d.description}</p>
                   </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 pb-4">
           <p className="text-xs text-gray-400 font-sans tracking-widest uppercase">Service included • Please inform us of allergies</p>
        </footer>
      </div>
    </div>
  );
};

// Heatmap Helpers
function getZoneColor(zone: LayoutZone): string {
  switch (zone) {
    case LayoutZone.TheAnchor: return 'rgba(251, 191, 36, 0.2)'; // Amber (Top Right)
    case LayoutZone.TheMagnet: return 'rgba(248, 113, 113, 0.2)'; // Red (Center)
    case LayoutZone.TheLead: return 'rgba(96, 165, 250, 0.2)'; // Blue (Top Left)
    default: return 'rgba(229, 231, 235, 0.3)';
  }
}

function getZoneDescription(zone: LayoutZone): string {
  switch (zone) {
    case LayoutZone.TheAnchor: return 'The Anchor: Top right is the second place eyes scan. Ideal for high-margin specials.';
    case LayoutZone.TheMagnet: return 'Optical Center: The eye naturally settles here. Perfect for signature dishes.';
    case LayoutZone.TheLead: return 'Primary Scan: Top left is read sequentially. Good for appetizers.';
    default: return 'Standard Flow: Used for listing core items.';
  }
}
