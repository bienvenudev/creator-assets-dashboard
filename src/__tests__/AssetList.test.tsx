import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssetList } from '../components/AssetList';
import type { Asset, FilterState } from '../types/asset';

describe('Search Filter Functionality', () => {
  const mockAssets: Asset[] = [
    {
      id: '1',
      name: 'Alpha Model',
      category: '3D Model',
      fileType: 'glb',
      fileSize: 1000,
      uploadDate: '2026-01-15T10:30:00Z',
      thumbnailUrl: 'https://example.com/1.jpg',
      tags: ['test'],
      description: 'First asset',
    },
    {
      id: '2',
      name: 'Beta Image',
      category: 'Image',
      fileType: 'jpg',
      fileSize: 2000,
      uploadDate: '2026-01-20T10:30:00Z',
      thumbnailUrl: 'https://example.com/2.jpg',
      tags: ['image'],
      description: 'Second asset',
    },
    {
      id: '3',
      name: 'Gamma Video',
      category: 'Video',
      fileType: 'mp4',
      fileSize: 500,
      uploadDate: '2026-01-10T10:30:00Z',
      thumbnailUrl: 'https://example.com/3.jpg',
      tags: ['video'],
      description: 'Third asset',
    },
  ];

  const defaultFilters: FilterState = {
    searchQuery: '',
    category: '',
    sortBy: 'date',
    sortOrder: 'asc',
  };

  it('shows all assets when search is empty', () => {
    render(
      <BrowserRouter>
        <AssetList assets={mockAssets} filters={defaultFilters} />
      </BrowserRouter>
    );

    expect(screen.getByText('Alpha Model')).toBeInTheDocument();
    expect(screen.getByText('Beta Image')).toBeInTheDocument();
    expect(screen.getByText('Gamma Video')).toBeInTheDocument();
  });

  it('filters assets by search query', () => {
    const filters: FilterState = {
      ...defaultFilters,
      searchQuery: 'beta',
    };
    
    render(
      <BrowserRouter>
        <AssetList assets={mockAssets} filters={filters} />
      </BrowserRouter>
    );

    expect(screen.getByText('Beta Image')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Model')).not.toBeInTheDocument();
    expect(screen.queryByText('Gamma Video')).not.toBeInTheDocument();
  });

  it('shows empty state when no matches found', () => {
    const filters: FilterState = {
      ...defaultFilters,
      searchQuery: 'nonexistent',
    };
    
    render(
      <BrowserRouter>
        <AssetList assets={mockAssets} filters={filters} />
      </BrowserRouter>
    );

    expect(screen.getByText('No assets found')).toBeInTheDocument();
  });
});
