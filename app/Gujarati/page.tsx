'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '../lib/types';
import { fetchMenuFromGoogleSheet } from '../lib/fetch-google-sheet-guj';

type SubCategory = {
  id: string;
  name: string;
};

type ParentCategory = {
  id: string;
  name: string;
  icon: string;
  subCategories: SubCategory[];
};

const parentCategories: ParentCategory[] = [
  {
    id: 'chicken',
    name: 'ચિકન',
    icon: '🍗',
    subCategories: [{ id: 'Chicken', name: 'ચિકન' }],
  },
  {
    id: 'chicken shawarma',
    name: 'ચિકન શાવર્મા',
    icon: '🌯',
    subCategories: [{ id: 'Chicken Shawarma', name: 'ચિકન શાવર્મા' }],
  },
  {
    id: 'mutton',
    name: 'મટન',
    icon: '🍖',
    subCategories: [{ id: 'Mutton', name: 'મટન' }],
  },
  {
    id: 'biryani',
    name: 'બિરયાની',
    icon: '🍚',
    subCategories: [{ id: 'Biryani', name: 'બિરયાની' }],
  },
  {
    id: 'momos',
    name: 'મોમોઝ',
    icon: '🥟',
    subCategories: [{ id: 'Momos', name: 'મોમોઝ' }],
  },
];

const getFirstSubCategory = (parentId: string): string => {
  const parent = parentCategories.find(p => p.id === parentId);
  return parent?.subCategories[0]?.id || '';
};

export default function GujaratiMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categoryItems, setCategoryItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('chicken');
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    getFirstSubCategory('chicken')
  );

  const GOOGLE_CSV_URL =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTeVv9QsEicZ5EO8ta9VSzVjt1Zw5rH-AqEekpRhMJQrfjjoqlzA3UwJkDU4aK3TNQ0tj6L27DslgKV/pub?output=csv&gid=663674793';

  const handleBack = () => {
    window.location.href = '/';
  };

  /* LOAD MENU */
  useEffect(() => {
    async function loadMenuItems() {
      const items = await fetchMenuFromGoogleSheet(GOOGLE_CSV_URL);

      const formatted: MenuItem[] = items
        .filter(
          (item: any) =>
            (item.language || '').toLowerCase() === 'gujarati'
        )
        .map((item: any) => ({
          id: String(item.id).trim(),
          name: String(item.name).trim(),
          category: String(item.category).trim(),
          price: Number(item.price) || 0,
          type: String(item.type).toLowerCase().trim() as 'veg' | 'non-veg',
          description: String(item.description || '').trim(),
          longDescription: '',
          image: '',
          language: 'Gujarati',
        }));

      setMenuItems(formatted);
    }

    loadMenuItems();
  }, []);

  /* FILTER */
  useEffect(() => {
    if (!selectedSubCategory) return;

    const filtered = menuItems.filter(
      item =>
        item.category.toLowerCase() === selectedSubCategory.toLowerCase()
    );

    setCategoryItems(filtered);
  }, [menuItems, selectedSubCategory]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(getFirstSubCategory(categoryId));
  };

  const currentSubCategories =
    parentCategories.find(p => p.id === selectedCategory)?.subCategories || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-rose-950 text-white">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center w-full relative">
        <h1 className="text-3xl font-bold -rotate-12 text-yellow-400 sm:fixed sm:top-4 sm:left-4">
          Aaron's
        </h1>

        <h1 className="pt-6 text-5xl font-bold text-center">
          અમારું મેનુ
        </h1>

        <button
          onClick={handleBack}
          className="mx-auto mt-4 sm:mt-0 sm:fixed sm:top-4 sm:right-4 px-4 py-2 bg-yellow-500 text-black rounded-md"
        >
          પાછા જાઓ
        </button>
      </div>

      {/* CATEGORY TABS */}
      <header className="bg-black/30 backdrop-blur-sm sticky top-0 z-10 mt-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {parentCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-800 text-gray-300'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {currentSubCategories.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {currentSubCategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.id)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    selectedSubCategory === sub.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* MENU LIST */}
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center mb-8">
          {currentSubCategories.find(s => s.id === selectedSubCategory)?.name}
        </h2>

        <div className="space-y-5">
          {categoryItems.map(item => (
            <div key={item.id} className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      item.type === 'veg' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <h3 className="text-lg font-medium">{item.name}</h3>
                </div>

                {item.description && (
                  <p className="text-sm text-gray-300 ml-5">
                    {item.description}
                  </p>
                )}
              </div>

              <span className="text-lg font-semibold">
                ₹{item.price.toFixed(2)}
              </span>
            </div>
          ))}

          {categoryItems.length === 0 && (
            <p className="text-center text-gray-400">
              કોઈ આઇટમ ઉપલબ્ધ નથી
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
