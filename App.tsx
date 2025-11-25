import React, { useState, useEffect } from 'react';
import { MenuCanvas } from './components/MenuCanvas';
import { generateMenuContent } from './services/geminiService';
import { Dish, MenuConfig } from './types';
import { RefreshCw, Eye, Printer, ChefHat, Loader2, Info } from 'lucide-react';

// Default Fallback Data (Russian)
const DEFAULT_MENU: { dishes: Dish[], restaurantName: string, tagline: string } = {
  restaurantName: "L'Harmonie",
  tagline: "Гастрономическое Путешествие",
  dishes: [
    { id: 1, name: "Тартар из Мраморной Говядины", description: "С трюфельным айоли, каперсами и чипсами из пармезана.", price: "850₽", category: "starter" },
    { id: 2, name: "Морские Гребешки", description: "Обжаренные на сливочном масле, с пюре из цветной капусты.", price: "1200₽", category: "starter" },
    { id: 3, name: "Стейк Рибай Прайм", description: "Зерновой откорм 200 дней, подается с перечным соусом.", price: "3500₽", category: "special", highlight: true },
    { id: 4, name: "Утиная Грудка Магре", description: "С ягодным соусом и карамелизированной грушей.", price: "1450₽", category: "main" },
    { id: 5, name: "Лосось на Гриле", description: "Дикий лосось со спаржей и голландским соусом.", price: "1600₽", category: "main" },
    { id: 6, name: "Ризотто с Белыми Грибами", description: "Классический итальянский рецепт с маслом белого трюфеля.", price: "950₽", category: "main" },
    { id: 7, name: "Томленая Баранина", description: "Готовится 12 часов, подается с кускусом и мятой.", price: "1300₽", category: "main" },
    { id: 8, name: "Равиоли с Омаром", description: "Домашняя паста с нежным мясом омара в сливочном биске.", price: "1800₽", category: "main" },
    { id: 9, name: "Шоколадный Фондан", description: "Горячий кекс с жидким центром и ванильным мороженым.", price: "650₽", category: "dessert" },
    { id: 10, name: "Лимонный Тарт", description: "Французская классика с меренгой.", price: "550₽", category: "dessert" },
  ]
};

const THEMES = [
  "Современная Русская",
  "Итальянская Классика",
  "Паназиатский Фьюжн",
  "Французское Бистро",
  "Скандинавский Минимализм"
];

export default function App() {
  const [dishes, setDishes] = useState<Dish[]>(DEFAULT_MENU.dishes);
  const [config, setConfig] = useState<Omit<MenuConfig, 'theme'>>({
    restaurantName: DEFAULT_MENU.restaurantName,
    tagline: DEFAULT_MENU.tagline
  });
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [loading, setLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!process.env.API_KEY) {
      setError("API Key is missing. Please check your environment.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await generateMenuContent(currentTheme);
      setDishes(data.dishes);
      setConfig({
        restaurantName: data.restaurantName,
        tagline: data.tagline
      });
    } catch (err) {
      console.error(err);
      setError("Failed to generate menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Sidebar Controls */}
      <aside className="w-full md:w-80 bg-white border-r border-gray-200 p-6 flex flex-col shadow-xl z-20">
        <div className="flex items-center space-x-2 mb-8 text-amber-600">
          <ChefHat size={32} />
          <h1 className="text-2xl font-bold font-serif text-gray-900">NeuroMenu</h1>
        </div>

        <div className="space-y-6 flex-1">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Выберите концепцию</label>
            <select 
              value={currentTheme}
              onChange={(e) => setCurrentTheme(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-amber-500 focus:ring-amber-500 p-2 border bg-gray-50"
            >
              {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white py-3 px-4 rounded-md transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
            <span>Сгенерировать Меню</span>
          </button>

          <hr className="border-gray-100" />

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
            <h3 className="font-bold text-amber-800 flex items-center mb-2">
              <Info size={16} className="mr-2" />
              Психология Меню
            </h3>
            <p className="text-xs text-amber-900 leading-relaxed">
              Мы используем правило <strong>Золотого Треугольника</strong>. Взгляд посетителя движется по маршруту: Середина → Правый верхний угол → Левый верхний угол. Самые маржинальные блюда размещаются именно там.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4">
             <span className="text-sm font-medium">Показать тепловую карту</span>
             <button 
               onClick={() => setShowHeatmap(!showHeatmap)}
               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showHeatmap ? 'bg-amber-600' : 'bg-gray-200'}`}
             >
               <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showHeatmap ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
          </div>

        </div>

        <div className="mt-8 text-center">
            <button onClick={() => window.print()} className="text-gray-500 hover:text-gray-900 flex items-center justify-center w-full py-2 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                <Printer size={16} className="mr-2"/> Печать / PDF
            </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 overflow-y-auto bg-stone-200 p-4 md:p-12 flex justify-center items-start">
        <div className="w-full max-w-[900px]">
           {error && (
             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow" role="alert">
               <p className="font-bold">Ошибка</p>
               <p>{error}</p>
             </div>
           )}
           
           <div className={`transition-opacity duration-500 ${loading ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}>
              <MenuCanvas 
                dishes={dishes} 
                restaurantName={config.restaurantName} 
                tagline={config.tagline} 
                showHeatmap={showHeatmap}
              />
           </div>
        </div>
      </main>
    </div>
  );
}