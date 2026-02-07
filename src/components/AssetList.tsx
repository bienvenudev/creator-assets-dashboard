import { useMemo } from 'react';
import type { Asset, FilterState } from '../types/asset';
import { AssetCard } from './AssetCard';

interface AssetListProps {
  assets: Asset[];
  filters: FilterState;
  onAssetSelect: (asset: Asset) => void;
}

export function AssetList({ assets, filters, onAssetSelect }: AssetListProps) {
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(query) ||
          asset.description.toLowerCase().includes(query) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((asset) => asset.category === filters.category);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison =
            new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
          break;
        case 'size':
          comparison = a.fileSize - b.fileSize;
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [assets, filters]);

  if (filteredAndSortedAssets.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-xl">No assets found</p>
        <p className="mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedAssets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onSelect={onAssetSelect} />
      ))}
    </div>
  );
}
