import React, { useEffect, useState } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { MetaTags } from '@shared/components/MetaTags';
import { MenuService } from '@shared/services/menuService';
import type { Category } from '@shared/types/menu';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const list = await MenuService.getCategories();
    setCategories(list);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleToggleActive = async (cat: Category) => {
    await MenuService.updateCategory(cat.id, { isActive: !cat.isActive });
    await loadCategories();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this menu category? Existing dishes assigned to it will remain.')) {
      await MenuService.deleteCategory(id);
      await loadCategories();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    if (editingCategory.id) {
      await MenuService.updateCategory(editingCategory.id, editingCategory);
    } else {
      await MenuService.createCategory(editingCategory);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
    await loadCategories();
  };

  return (
    <AdminLayout>
      <MetaTags title="Categories Management | Tronx Admin" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#241416]">Menu Categories</h1>
          <p className="text-xs text-[#7E6568] font-medium">Structure menu sections, display order, and visibility</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory({
              name: '',
              slug: '',
              displayOrder: categories.length + 1,
              isActive: true,
            });
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#602E31] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md hover:bg-[#4D2326] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#E8D9CC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF2EA] border-b border-[#E8D9CC] text-[#533B3D] uppercase text-[10px] font-mono font-bold tracking-wider">
              <tr>
                <th className="p-4">Display Order</th>
                <th className="p-4">Category Name</th>
                <th className="p-4">URL Slug</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D9CC]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#7E6568] font-mono animate-pulse">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#7E6568] font-serif text-sm">
                    No categories defined.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#FAF2EA] transition-colors">
                    <td className="p-4 font-mono font-bold text-[#241416]">#{cat.displayOrder}</td>
                    <td className="p-4 font-serif font-bold text-[#241416] text-sm">{cat.name}</td>
                    <td className="p-4 font-mono text-[#7E6568]">{cat.slug}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(cat)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          cat.isActive
                            ? 'bg-[#FAF2EA] text-[#602E31] border border-[#602E31]/30'
                            : 'bg-[#C2674F]/10 text-[#C2674F] border border-[#C2674F]/30'
                        }`}
                      >
                        {cat.isActive ? <ToggleRight className="w-4 h-4 text-[#602E31]" /> : <ToggleLeft className="w-4 h-4 text-[#C2674F]" />}
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#FAF2EA] border border-[#E8D9CC] text-[#241416] hover:bg-[#602E31] hover:text-white cursor-pointer transition-colors shadow-xs"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 rounded-lg bg-[#C2674F]/10 border border-[#C2674F]/20 text-[#C2674F] hover:bg-[#C2674F]/20 cursor-pointer transition-colors shadow-xs"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSaveCategory}
            className="bg-white w-full max-w-md border border-[#E8D9CC] rounded-3xl p-6 space-y-4 text-[#241416] shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-[#E8D9CC] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#241416]">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
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
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="e.g. Sommelier Cellar & Cocktails"
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] placeholder-[#7E6568]/50 focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">URL Slug (Unique)</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="e.g. wines"
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] placeholder-[#7E6568]/50 font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#533B3D] font-bold uppercase text-[10px] tracking-wider">Display Order Priority</label>
                <input
                  type="number"
                  value={editingCategory.displayOrder || 1}
                  onChange={(e) => setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#FAF2EA] border border-[#E8D9CC] rounded-xl px-3 py-2 text-xs text-[#241416] font-mono focus:outline-none focus:border-[#602E31] transition-colors font-medium"
                />
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
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
};
