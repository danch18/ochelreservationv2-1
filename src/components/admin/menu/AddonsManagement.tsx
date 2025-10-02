'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Alert } from '@/components/ui/Alert';
import { addonService, categoryService, subcategoryService, Addon, Category, Subcategory } from '@/services/menuService';
import { ImageUpload } from './ImageUpload';
import { ConfirmationModal } from './ConfirmationModal';

interface AddonModalProps {
  addon?: Addon | null;
  categories: Category[];
  subcategories: Subcategory[];
  onSave: (addon: Omit<Addon, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onClose: () => void;
}

function AddonModal({ addon, categories, subcategories, onSave, onClose }: AddonModalProps) {
  const [title, setTitle] = useState(addon?.title || '');
  const [description, setDescription] = useState(addon?.description || '');
  const [price, setPrice] = useState(addon?.price?.toString() || '');
  const [imagePath, setImagePath] = useState(addon?.image_path || '');
  const [categoryId, setCategoryId] = useState<number>(0);
  const [subcategoryId, setSubcategoryId] = useState<number>(0);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize category and subcategory for editing
  useEffect(() => {
    if (addon) {
      // Find the category through subcategory
      if (addon.subcategory_id) {
        const subcat = subcategories.find(s => s.id === addon.subcategory_id);
        if (subcat) {
          setCategoryId(subcat.category_id);
          setSubcategoryId(addon.subcategory_id);
        }
      } else if (addon.category_id) {
        // For old addons linked directly to category, find the General subcategory
        setCategoryId(addon.category_id);
        const generalSubcat = subcategories.find(
          s => s.category_id === addon.category_id && s.title.toLowerCase().includes('general')
        );
        if (generalSubcat) {
          setSubcategoryId(generalSubcat.id);
        }
      }
    }
  }, [addon, subcategories]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (categoryId) {
      // Filter by category and exclude "General" subcategories from dropdown
      const filtered = subcategories.filter(s =>
        s.category_id === categoryId && !s.title.toLowerCase().includes('general')
      );
      setFilteredSubcategories(filtered);

      // Auto-select General subcategory if available and not editing
      if (!addon) {
        const allCategorySubcats = subcategories.filter(s => s.category_id === categoryId);
        const generalSubcat = allCategorySubcats.find(s => s.title.toLowerCase().includes('general'));
        if (generalSubcat) {
          setSubcategoryId(generalSubcat.id);
        } else if (filtered.length > 0) {
          setSubcategoryId(filtered[0].id);
        }
      }
    } else {
      setFilteredSubcategories([]);
      if (!addon) {
        setSubcategoryId(0);
      }
    }
  }, [categoryId, subcategories, addon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Le titre est obligatoire');
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) < 0) {
      setError('Le prix doit être un nombre positif');
      return;
    }

    if (!categoryId) {
      setError('Veuillez sélectionner une catégorie');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // If no subcategory selected, find or use the General subcategory
      let finalSubcategoryId = subcategoryId;
      if (!finalSubcategoryId) {
        // Look in all subcategories for this category (including General)
        const allCategorySubcats = subcategories.filter(s => s.category_id === categoryId);
        const generalSubcat = allCategorySubcats.find(s => s.title.toLowerCase().includes('general'));
        if (generalSubcat) {
          finalSubcategoryId = generalSubcat.id;
        } else {
          setError('Aucune sous-catégorie disponible. Veuillez d\'abord créer une sous-catégorie.');
          setSaving(false);
          return;
        }
      }

      await onSave({
        title: title.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        image_path: imagePath.trim() || null,
        category_id: null, // We only link to subcategory now
        subcategory_id: finalSubcategoryId,
        status: addon?.status || 'active',
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
      <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
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
          {addon ? 'Modifier l\'add-on' : 'Nouvel add-on'}
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
              placeholder="Ex: Fromage supplémentaire, Sauce piquante..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 placeholder:text-gray-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              value={categoryId || ''}
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
              Sous-catégorie
            </label>
            <select
              value={subcategoryId || ''}
              onChange={(e) => setSubcategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 cursor-pointer"
              disabled={!categoryId}
            >
              <option value="" className="text-gray-500">
                {categoryId ? 'Général (par défaut)' : 'Sélectionner d\'abord une catégorie'}
              </option>
              {filteredSubcategories.map((subcat) => (
                <option key={subcat.id} value={subcat.id} className="text-gray-900">
                  {subcat.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Laissez vide pour utiliser la sous-catégorie générale par défaut
            </p>
          </div>

          <ImageUpload
            value={imagePath}
            onChange={setImagePath}
            folder="add-ons"
            label="Image de l'add-on"
          />

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

export function AddonsManagement() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addonToDelete, setAddonToDelete] = useState<Addon | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [filterSubcategory, setFilterSubcategory] = useState<number | 'all' | 'general'>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [addonsData, catsData, subcatsData] = await Promise.all([
        addonService.getAll(),
        categoryService.getAll(),
        subcategoryService.getAll(),
      ]);
      setAddons(addonsData);
      setCategories(catsData);
      setSubcategories(subcatsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter subcategories based on selected category (excluding General)
  const availableSubcategories = useMemo(() => {
    if (filterCategory === 'all') return [];
    return subcategories.filter(s =>
      s.category_id === filterCategory && !s.title.toLowerCase().includes('general')
    );
  }, [filterCategory, subcategories]);

  // Get the General subcategory ID for the selected category
  const generalSubcategoryId = useMemo(() => {
    if (filterCategory === 'all') return null;
    const generalSubcat = subcategories.find(s =>
      s.category_id === filterCategory && s.title.toLowerCase().includes('general')
    );
    return generalSubcat?.id || null;
  }, [filterCategory, subcategories]);

  // Apply search and filters
  const filteredAddons = useMemo(() => {
    let filtered = addons;

    // Category filter first
    if (filterCategory !== 'all') {
      filtered = filtered.filter(addon => {
        const subcat = subcategories.find(s => s.id === addon.subcategory_id);
        return subcat?.category_id === filterCategory;
      });
    }

    // Subcategory filter second (including "General" option)
    if (filterSubcategory === 'general') {
      // Show items under General subcategory
      filtered = filtered.filter(addon => addon.subcategory_id === generalSubcategoryId);
    } else if (typeof filterSubcategory === 'number') {
      // Show items under specific subcategory
      filtered = filtered.filter(addon => addon.subcategory_id === filterSubcategory);
    }

    // Search filter last
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(addon => {
        const subcat = subcategories.find(s => s.id === addon.subcategory_id);
        const cat = subcat ? categories.find(c => c.id === subcat.category_id) : null;

        return (
          addon.title.toLowerCase().includes(query) ||
          addon.description?.toLowerCase().includes(query) ||
          cat?.title.toLowerCase().includes(query) ||
          subcat?.title.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [addons, searchQuery, filterCategory, filterSubcategory, generalSubcategoryId, categories, subcategories]);

  // Pagination
  const totalPages = Math.ceil(filteredAddons.length / itemsPerPage);
  const paginatedAddons = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAddons.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAddons, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterSubcategory]);

  const handleCreate = () => {
    setEditingAddon(null);
    setShowModal(true);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setShowModal(true);
  };

  const handleSave = async (addonData: Omit<Addon, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingAddon) {
      await addonService.update(editingAddon.id, addonData);
    } else {
      await addonService.create(addonData);
    }
    await loadData();
  };

  const handleDeleteClick = (addon: Addon) => {
    setAddonToDelete(addon);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addonToDelete) return;

    try {
      setDeletingId(addonToDelete.id);
      setError(null);
      await addonService.delete(addonToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setAddonToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAddonToDelete(null);
  };

  const getCategoryName = (subcategoryId: number): string => {
    const subcat = subcategories.find((s) => s.id === subcategoryId);
    if (!subcat) return 'N/A';
    const cat = categories.find((c) => c.id === subcat.category_id);
    return cat?.title || 'N/A';
  };

  const getSubcategoryName = (subcategoryId: number): string => {
    return subcategories.find((s) => s.id === subcategoryId)?.title || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-gray-600">Chargement des add-ons...</span>
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
          Add-ons ({filteredAddons.length})
        </h3>
        <Button onClick={handleCreate} size="sm" disabled={categories.length === 0}>
          + Ajouter un add-on
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Rechercher par titre, description, catégorie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value === 'all' ? 'all' : Number(e.target.value));
              setFilterSubcategory('all');
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 cursor-pointer md:w-48"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.title}
              </option>
            ))}
          </select>

          {/* Subcategory Filter */}
          <select
            value={filterSubcategory}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all' || value === 'general') {
                setFilterSubcategory(value);
              } else {
                setFilterSubcategory(Number(value));
              }
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F34A23] focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed md:w-48"
            disabled={filterCategory === 'all'}
          >
            <option value="all">
              {filterCategory === 'all' ? 'Sélectionner d\'abord une catégorie' : 'Tous les éléments'}
            </option>
            {filterCategory !== 'all' && (
              <option value="general">General</option>
            )}
            {availableSubcategories.map((subcat) => (
              <option key={subcat.id} value={subcat.id}>
                {subcat.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">Vous devez d'abord créer au moins une catégorie</p>
        </div>
      ) : filteredAddons.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {addons.length === 0 ? 'Aucun add-on pour le moment' : 'Aucun résultat trouvé'}
          </p>
          {addons.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              Créer le premier add-on
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
                      Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Sous-catégorie
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Statut
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedAddons.map((addon) => (
                    <tr key={addon.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {addon.image_path ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={addon.image_path}
                              alt={addon.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Pas d'image</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{addon.title}</div>
                        {addon.description && (
                          <div className="text-xs text-gray-500 truncate max-w-xs">{addon.description}</div>
                        )}
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div className="text-sm text-gray-700">
                          {addon.subcategory_id ? getCategoryName(addon.subcategory_id) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div className="text-sm text-gray-700">
                          {addon.subcategory_id ? getSubcategoryName(addon.subcategory_id) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{addon.price.toFixed(2)} €</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          addon.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {addon.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleEdit(addon)}
                            variant="outline"
                            size="sm"
                            disabled={deletingId === addon.id}
                          >
                            Modifier
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(addon)}
                            variant="outline"
                            size="sm"
                            disabled={deletingId === addon.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === addon.id ? '...' : 'Supprimer'}
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
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAddons.length)}</span> sur{' '}
                    <span className="font-medium">{filteredAddons.length}</span> résultats
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
        <AddonModal
          addon={editingAddon}
          categories={categories}
          subcategories={subcategories}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingAddon(null);
          }}
        />
      )}

      {showDeleteModal && addonToDelete && (
        <ConfirmationModal
          title="Supprimer l'add-on"
          message={`Êtes-vous sûr de vouloir supprimer "${addonToDelete.title}" ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isLoading={deletingId === addonToDelete.id}
        />
      )}
    </div>
  );
}
