'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { categoryService, subcategoryService, Category } from '@/services/menuService';
import { ConfirmationModal } from './ConfirmationModal';

interface CategoryModalProps {
  category?: Category | null;
  onSave: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

function CategoryModal({ category, onSave, onClose }: CategoryModalProps) {
  const [title, setTitle] = useState(category?.title || '');
  const [text, setText] = useState(category?.text || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onSave({
        title: title.trim(),
        text: text.trim() || null,
        status: category?.status || 'active',
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-base md:text-lg font-semibold mb-4">
          {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h3>

        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Entrées, Plats, Desserts..."
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

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Search and pagination states
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Apply search filter
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories.filter(cat =>
      cat.title.toLowerCase().includes(query) ||
      cat.text?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCategories, currentPage, itemsPerPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleCreate = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleSave = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingCategory) {
      await categoryService.update(editingCategory.id, categoryData);
    } else {
      // Create the category
      const newCategory = await categoryService.create(categoryData);

      // Auto-create a "General" subcategory for the new category
      try {
        await subcategoryService.create({
          title: `${categoryData.title} - General`,
          text: null,
          category_id: newCategory.id,
          status: 'active',
          created_by: null,
          updated_by: null,
        });
      } catch (err) {
        console.error('Failed to create General subcategory:', err);
        // Don't block the category creation if subcategory creation fails
      }
    }
    await loadCategories();
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      setDeletingId(categoryToDelete.id);
      setError(null);
      await categoryService.delete(categoryToDelete.id);
      await loadCategories();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Chargement des catégories...</span>
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
          Catégories ({filteredCategories.length})
        </h3>
        <Button onClick={handleCreate} size="sm">
          + Ajouter une catégorie
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <Input
          type="text"
          placeholder="Rechercher par titre ou description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {categories.length === 0 ? 'Aucune catégorie pour le moment' : 'Aucun résultat trouvé'}
          </p>
          {categories.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              Créer la première catégorie
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
                {paginatedCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.title}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {category.text || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleEdit(category)}
                          variant="outline"
                          size="sm"
                          disabled={deletingId === category.id}
                        >
                          Modifier
                        </Button>
                        <Button
                          onClick={() => handleDeleteClick(category)}
                          variant="outline"
                          size="sm"
                          disabled={deletingId === category.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === category.id ? '...' : 'Supprimer'}
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
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCategories.length)}</span> sur{' '}
                    <span className="font-medium">{filteredCategories.length}</span> résultats
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

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
        />
      )}

      {showDeleteModal && categoryToDelete && (
        <ConfirmationModal
          title="Supprimer la catégorie"
          message={`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryToDelete.title}" ? Toutes les sous-catégories et éléments de menu associés seront également supprimés (cascade).`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deletingId === categoryToDelete.id}
        />
      )}
    </div>
  );
}
