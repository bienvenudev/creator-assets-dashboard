import type { Asset } from '../types/asset';
import { formatFileSize, formatDate } from '../utils/validation';
import { ThreeDViewer } from './ThreeDViewer';

interface AssetDetailsProps {
  asset: Asset;
  onClose: () => void;
}

export function AssetDetails({ asset, onClose }: AssetDetailsProps) {
  const is3DModel = asset.modelUrl && asset.fileType === 'glb';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{asset.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview/3D Viewer */}
            <div>
              {is3DModel ? (
                <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
                  <ThreeDViewer modelUrl={asset.modelUrl!} />
                </div>
              ) : (
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.name}
                  className="w-full rounded-lg"
                />
              )}
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Category
                </h3>
                <p className="text-lg text-gray-900">{asset.category}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
                  Description
                </h3>
                <p className="text-gray-700">{asset.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    File Type
                  </h3>
                  <p className="text-gray-900">{asset.fileType.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    File Size
                  </h3>
                  <p className="text-gray-900">{formatFileSize(asset.fileSize)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase">
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
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
