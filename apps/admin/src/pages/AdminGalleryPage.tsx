import React, { useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { Plus, Trash2, Star, X } from 'lucide-react';
import { ImageLightbox } from '@shared/components/ImageLightbox';

interface GalleryMedia {
  id: string;
  url: string;
  title: string;
  category: string;
  isFeatured: boolean;
}

export const AdminGalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; category?: string } | null>(null);
  const [mediaList, setMediaList] = useState<GalleryMedia[]>([
    {
      id: 'med-1',
      url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1200',
      title: 'Main Dining Hall Lighting',
      category: 'interior',
      isFeatured: true,
    },
    {
      id: 'med-2',
      url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1200',
      title: 'Sommelier Wine Reserve',
      category: 'wines',
      isFeatured: true,
    },
    {
      id: 'med-3',
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
      title: 'Chef Pass Preparation',
      category: 'plating',
      isFeatured: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('plating');

  const handleToggleFeatured = (id: string) => {
    setMediaList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFeatured: !m.isFeatured } : m))
    );
  };

  const handleDeleteMedia = (id: string) => {
    if (window.confirm('Delete media asset?')) {
      setMediaList((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    setMediaList([
      {
        id: `med-${Date.now()}`,
        url: newUrl.trim(),
        title: newTitle.trim() || 'Haute Media Asset',
        category: newCategory,
        isFeatured: false,
      },
      ...mediaList,
    ]);

    setIsModalOpen(false);
    setNewUrl('');
    setNewTitle('');
  };

  return (
    <AdminLayout>
      <MetaTags title="Media Gallery Manager | Tronx Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Media Gallery Asset Manager</h1>
          <p className="text-xs text-[#7E6568] font-medium">Curate luxury visual assets, photos, and featured highlights</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#602E31] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#4D2326] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Media URL
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl space-y-3 border border-[#E8D9CC] shadow-sm">
            <div
              data-cursor="image"
              onClick={() => setSelectedImage({ url: item.url, title: item.title, category: item.category })}
              className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-[#E8D9CC] hover:border-[#602E31] transition-all duration-300"
            >
              <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {item.isFeatured && (
                <span className="absolute top-2 right-2 bg-[#602E31] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow-md">
                  Featured
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <h4 className="font-serif font-bold text-[#241416]">{item.title}</h4>
                <span className="text-[10px] text-[#7E6568] font-mono uppercase font-bold">{item.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFeatured(item.id)}
                  className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors shadow-xs ${
                    item.isFeatured
                      ? 'bg-[#C2674F]/15 border-[#C2674F]/30 text-[#C2674F]'
                      : 'bg-[#FAF2EA] border-[#E8D9CC] text-[#7E6568] hover:text-[#241416]'
                  }`}
                  title="Toggle Featured"
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMedia(item.id)}
                  className="p-1.5 rounded-lg bg-[#C2674F]/10 border border-[#C2674F]/20 text-[#C2674F] hover:bg-[#C2674F]/20 cursor-pointer transition-colors shadow-xs"
                  title="Delete Asset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleAddMedia}
            className="bg-white w-full max-w-md border border-[#E8D9CC] rounded-3xl p-6 space-y-4 text-[#241416] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#241416]">Add Media Asset</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-[#7E6568] hover:text-[#241416] hover:bg-[#FAF2EA] cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Image/Media URL *</label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] placeholder-[#7E6568]/60 focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Media Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Chef Pass Presentation"
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] placeholder-[#7E6568]/60 focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                >
                  <option value="plating">Plating</option>
                  <option value="interior">Interior</option>
                  <option value="wines">Sommelier Cellar</option>
                  <option value="backstage">Kitchen Pass</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#E8D9CC] text-xs">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#E8D9CC] text-[#241416] hover:bg-[#FAF2EA] font-bold cursor-pointer transition-colors shadow-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#602E31] text-white hover:bg-[#4D2326] font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all"
              >
                Add Asset
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Fullscreen Preview Lightbox */}
      <ImageLightbox
        isOpen={!!selectedImage}
        imageUrl={selectedImage?.url || null}
        title={selectedImage?.title}
        category={selectedImage?.category}
        onClose={() => setSelectedImage(null)}
      />
    </AdminLayout>
  );
};
