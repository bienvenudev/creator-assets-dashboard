import type { Asset } from '../types/asset';
import { formatFileSize, formatDate } from '../utils/validation';

interface AssetCardProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
}

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <div
      onClick={() => onSelect(asset)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-200"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={asset.thumbnailUrl}
          alt={asset.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 truncate">{asset.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{asset.category}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{formatFileSize(asset.fileSize)}</span>
          <span>{formatDate(asset.uploadDate)}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {asset.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {asset.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{asset.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
