import { useState, useMemo } from 'react';
import type { Asset, FilterState } from '../types/asset';
import { useAssets } from '../hooks/useAssets';
import { AssetFilters } from '../components/AssetFilters';
import { AssetList } from '../components/AssetList';
import { AssetDetails } from '../components/AssetDetails';
import { UploadForm } from '../components/UploadForm';

export function Dashboard() {
  const { assets, loading, error, addAsset } = useAssets();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Get unique categories from assets
  const categories = useMemo(() => {
    const uniqueCategories = new Set(assets.map((asset) => asset.category));
    return Array.from(uniqueCategories).sort();
  }, [assets]);

  const handleUpload = async (formData: {
    name: string;
    category: string;
    description: string;
    tags: string;
    file: File | null;
  }) => {
    if (!formData.file) return;

    // Mock upload - create asset object
    const newAsset = {
      name: formData.name,
      category: formData.category,
      fileType: formData.file.name.split('.').pop() || 'unknown',
      fileSize: formData.file.size,
      uploadDate: new Date().toISOString(),
      thumbnailUrl: `https://placehold.co/300x300/6366f1/white?text=${encodeURIComponent(
        formData.name.substring(0, 10)
      )}`,
      modelUrl: formData.file.name.endsWith('.glb') || formData.file.name.endsWith('.gltf')
        ? URL.createObjectURL(formData.file)
        : undefined,
      tags: formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      description: formData.description,
    };

    await addAsset(newAsset);
    setShowUploadForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Make sure the API server is running: <code>npm run api</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Creator Assets Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and preview your 3D models, textures, and assets
              </p>
            </div>
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
            >
              + Upload Asset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Assets</p>
            <p className="text-3xl font-bold text-gray-900">{assets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">3D Models</p>
            <p className="text-3xl font-bold text-gray-900">
              {assets.filter((a) => a.category === '3D Model').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <AssetFilters
          filters={filters}
          onFilterChange={setFilters}
          categories={categories}
        />

        {/* Asset List */}
        <AssetList
          assets={assets}
          filters={filters}
          onAssetSelect={setSelectedAsset}
        />
      </main>

      {/* Modals */}
      {selectedAsset && (
        <AssetDetails asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
      {showUploadForm && (
        <UploadForm
          onSubmit={handleUpload}
          onCancel={() => setShowUploadForm(false)}
        />
      )}
    </div>
  );
}
