import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Asset } from '../types/asset';
import { api } from '../services/api';
import { formatFileSize, formatDate } from '../utils/validation';
import { ThreeDViewer } from '../components/ThreeDViewer';

export function AssetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAsset = async () => {
      try {
        setLoading(true);
        const data = await api.getAsset(id);
        setAsset(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading asset...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || 'Asset not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const is3DModel = asset.modelUrl && asset.fileType === 'glb';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Viewer / Preview - Takes 2 columns */}
          <div className="lg:col-span-2">
            {is3DModel ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <ThreeDViewer modelUrl={asset.modelUrl!} />
                </div>
              </div>
            ) : asset.category === 'Image' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full h-auto"
                />
              </div>
            ) : asset.category === 'Video' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <video
                  controls
                  className="w-full h-auto"
                  poster={asset.thumbnailUrl}
                >
                  <source src={asset.modelUrl} type={`video/${asset.fileType}`} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : asset.category === 'Audio' ? (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold text-gray-900">{asset.name}</h3>
                </div>
                <audio controls className="w-full">
                  <source src={asset.modelUrl} type={`audio/${asset.fileType}`} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Details Sidebar - Takes 1 column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Category
                </h3>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {asset.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Description
                </h3>
                <p className="text-gray-700">{asset.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    File Type
                  </h3>
                  <p className="text-gray-900">{asset.fileType.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    File Size
                  </h3>
                  <p className="text-gray-900">{formatFileSize(asset.fileSize)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Upload Date
                </h3>
                <p className="text-gray-900">{formatDate(asset.uploadDate)}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
