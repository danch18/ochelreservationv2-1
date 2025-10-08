'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { subcategoryService, categoryService, Subcategory, Category } from '@/services/menuService';
import { ConfirmationModal } from './ConfirmationModal';

interface SubcategoryModalProps {
  subcategory?: Subcategory | null;
  categories: Category[];
  onSave: (subcategory: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

function SubcategoryModal({ subcategory, categories, onSave, onClose }: SubcategoryModalProps) {
  const [categoryId, setCategoryId] = useState(subcategory?.category_id || categories[0]?.id || 0);
  const [title, setTitle] = useState(subcategory?.title || '');
  const [text, setText] = useState(subcategory?.text || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (!categoryId) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSave({
        category_id: categoryId,
        title: title.trim(),
        text: text.trim() || null,
        status: subcategory?.status || 'active',
        created_by: null,
        updated_by: null,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !saving) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base md:text-lg font-semibold mb-4">
          {subcategory ? 'Modifier la sous-catégorie' : 'Nouvelle sous-catégorie'}
        </h3>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie parente <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 cursor-pointer"
              required
            >
              <option value="" className="text-gray-500">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Pizzas, Pâtes, Viandes..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Description optionnelle..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button type="submit" disabled={saving} className="flex-1 order-2 sm:order-1">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={saving} className="flex-1 order-1 sm:order-2">
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SubcategoriesManagement() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState<Subcategory | null>(null);

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [subcatsData, catsData] = await Promise.all([
        subcategoryService.getAll(),
        categoryService.getAll(),
      ]);
      setSubcategories(subcatsData);
      setCategories(catsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper function to get category name
  const getCategoryName = (categoryId: number): string => {
    return categories.find((c) => c.id === categoryId)?.title || 'N/A';
  };

  // Apply search and category filters
  const filteredSubcategories = useMemo(() => {
    // First, filter out "General" subcategories
    let filtered = subcategories.filter(subcat =>
      !subcat.title.toLowerCase().includes('general')
    );

    // Apply category filter
    if (selectedCategoryId !== 'all') {
      filtered = filtered.filter(subcat => subcat.category_id === selectedCategoryId);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(subcat =>
        subcat.title.toLowerCase().includes(query) ||
        subcat.text?.toLowerCase().includes(query) ||
        getCategoryName(subcat.category_id).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [subcategories, searchQuery, selectedCategoryId, categories]);

  // Pagination
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const paginatedSubcategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubcategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubcategories, currentPage, itemsPerPage]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryId]);

  const handleCreate = () => {
    setEditingSubcategory(null);
    setShowModal(true);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setShowModal(true);
  };

  const handleSave = async (subcategoryData: Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingSubcategory) {
      await subcategoryService.update(editingSubcategory.id, subcategoryData);
    } else {
      await subcategoryService.create(subcategoryData);
    }
    // Notify all tabs that menu data has changed
    const menuUpdateChannel = new BroadcastChannel('menu-data-updates');
    menuUpdateChannel.postMessage('invalidate');
    menuUpdateChannel.close();
    await loadData();
  };

  const handleDeleteClick = (subcategory: Subcategory) => {
    setSubcategoryToDelete(subcategory);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subcategoryToDelete) return;

    try {
      setDeletingId(subcategoryToDelete.id);
      setError(null);
      await subcategoryService.delete(subcategoryToDelete.id);
      // Notify all tabs that menu data has changed
      const menuUpdateChannel = new BroadcastChannel('menu-data-updates');
      menuUpdateChannel.postMessage('invalidate');
      menuUpdateChannel.close();
      await loadData();
      setShowDeleteModal(false);
      setSubcategoryToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSubcategoryToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Chargement des sous-catégories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          {error}
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Sous-catégories ({filteredSubcategories.length})
        </h3>
        <Button onClick={handleCreate} size="sm" disabled={categories.length === 0}>
          + Ajouter une sous-catégorie
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Vous devez d'abord créer au moins une catégorie</p>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher par titre, description ou catégorie..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredSubcategories.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                {subcategories.length === 0 ? 'Aucune sous-catégorie pour le moment' : 'Aucun résultat trouvé'}
              </p>
              {subcategories.length === 0 && (
                <Button onClick={handleCreate} variant="outline">
                  Créer la première sous-catégorie
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Titre
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Catégorie
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSubcategories.map((subcategory) => (
                      <tr key={subcategory.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{subcategory.title}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-500">{getCategoryName(subcategory.category_id)}</div>
                        </td>
                        <td className="px-4 py-4 hidden md:table-cell">
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {subcategory.text || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            subcategory.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {subcategory.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleEdit(subcategory)}
                              variant="outline"
                              size="sm"
                              disabled={deletingId === subcategory.id}
                            >
                              Modifier
                            </Button>
                            <Button
                              onClick={() => handleDeleteClick(subcategory)}
                              variant="outline"
                              size="sm"
                              disabled={deletingId === subcategory.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              {deletingId === subcategory.id ? '...' : 'Supprimer'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <Button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-gray-700 self-center">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                    >
                      Suivant
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
                        <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredSubcategories.length)}</span> sur{' '}
                        <span className="font-medium">{filteredSubcategories.length}</span> résultats
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        size="sm"
                      >
                        Précédent
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            variant={currentPage === pageNum ? 'primary' : 'outline'}
                            size="sm"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        size="sm"
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {showModal && (
        <SubcategoryModal
          subcategory={editingSubcategory}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingSubcategory(null);
          }}
        />
      )}

      {showDeleteModal && subcategoryToDelete && (
        <ConfirmationModal
          title="Supprimer la sous-catégorie"
          message={`Êtes-vous sûr de vouloir supprimer la sous-catégorie "${subcategoryToDelete.title}" ? Tous les éléments de menu associés seront également supprimés (cascade).`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deletingId === subcategoryToDelete.id}
        />
      )}
    </div>
  );
}
