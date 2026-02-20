import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Asset } from '../types/asset';
import { api } from '../services/api';
import { formatFileSize, formatDate } from '../utils/validation';
import { ThreeDViewer } from '../components/ThreeDViewer';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { UpdateForm } from '../components/UpdateForm';
import { extractVideoThumbnail } from '../utils/videoThumbnail';

export function AssetDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (formData: {
    name: string;
    category: string;
    description: string;
    tags: string;
    file: File | null;
  }) => {
    if (!asset || !id) return;

    let updatedAsset: Asset;

    // If new file is provided
    if (formData.file) {
      const fileExtension = formData.file.name.split('.').pop()?.toLowerCase() || 'unknown';
      const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
      const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(fileExtension);
      const is3DModel = ['glb', 'gltf'].includes(fileExtension);

      // Generate thumbnail
      let thumbnailUrl: string;
      let modelUrl: string | undefined;

      if (isImage) {
        thumbnailUrl = URL.createObjectURL(formData.file);
        modelUrl = thumbnailUrl;
      } else if (isVideo) {
        try {
          thumbnailUrl = await extractVideoThumbnail(formData.file);
        } catch (err) {
          console.error('Failed to extract video thumbnail:', err);
          thumbnailUrl = `https://placehold.co/300x300/8b5cf6/white?text=🎬+Video`;
        }
        modelUrl = URL.createObjectURL(formData.file);
      } else if (is3DModel) {
        thumbnailUrl = `https://placehold.co/300x300/6366f1/white?text=${encodeURIComponent(
          formData.name.substring(0, 10)
        )}`;
        modelUrl = URL.createObjectURL(formData.file);
      } else {
        thumbnailUrl = `https://placehold.co/300x300/64748b/white?text=${encodeURIComponent(
          formData.name.substring(0, 10)
        )}`;
        modelUrl = URL.createObjectURL(formData.file);
      }

      updatedAsset = {
        ...asset,
        name: formData.name,
        category: formData.category,
        fileType: fileExtension,
        fileSize: formData.file.size,
        thumbnailUrl,
        modelUrl,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        description: formData.description,
      };
    } else {
      // No new file, just update metadata
      updatedAsset = {
        ...asset,
        name: formData.name,
        category: formData.category,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        description: formData.description,
      };
    }

    try {
      await api.updateAsset(updatedAsset, id);
      setAsset(updatedAsset);
      setShowUpdateForm(false);
    } catch (err) {
      console.error('Error updating asset:', err);
      setError('Failed to update asset. Please try again.');
    }
  }

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

  if (showUpdateForm && asset) {
    return (
      <UpdateForm
        initialAsset={asset}
        onCancel={() => setShowUpdateForm(false)}
        onSubmit={handleUpdate}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 cursor-pointer hover:text-gray-900 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
          </div>
          <button 
            className='text-blue-900 cursor-pointer text-xl hover:text-blue-950'
            onClick={() => setShowUpdateForm(true)}
          >Edit</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Asset Viewer - FULL WIDTH ON TOP */}
          <div className="w-full">
            {is3DModel ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Larger aspect ratio for immersive 3D viewing */}
                <div className="aspect-[16/10] lg:aspect-[21/9] bg-gray-100">
                  <ErrorBoundary>
                    <ThreeDViewer modelUrl={asset.modelUrl!} />
                  </ErrorBoundary>
                </div>
              </div>
            ) : asset.category === 'Image' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            ) : asset.category === 'Video' ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <video
                  controls
                  className="w-full h-auto max-h-[70vh]"
                  poster={asset.thumbnailUrl}
                >
                  <source src={asset.modelUrl} type={`video/${asset.fileType}`} />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : asset.category === 'Audio' ? (
              <div className="bg-white rounded-lg shadow-md p-12">
                <div className="text-center mb-6">
                  <div className="text-8xl mb-6">🎵</div>
                  <h3 className="text-2xl font-semibold text-gray-900">{asset.name}</h3>
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
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
            )}
          </div>

          {/* Details Section - FULL WIDTH BELOW */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Asset Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Upload Date
                </h3>
                <p className="text-gray-900">{formatDate(asset.uploadDate)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Description
              </h3>
              <p className="text-gray-700">{asset.description}</p>
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
      </main>
    </div>
  );
}
