export interface Asset {
  id: string;
  name: string;
  category: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  thumbnailUrl: string;
  modelUrl?: string;
  tags: string[];
  description: string;
}

export type SortOption = "name" | "date" | "size";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  searchQuery: string;
  category: string;
  sortBy: SortOption;
  sortOrder: SortOrder;
}
