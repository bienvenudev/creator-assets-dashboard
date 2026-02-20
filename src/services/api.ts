import type { Asset } from "../types/asset";

const API_URL = "http://localhost:3001";

export const api = {
  async getAssets(): Promise<Asset[]> {
    const response = await fetch(`${API_URL}/assets`);
    if (!response.ok) throw new Error("Failed to fetch assets");
    return response.json();
  },

  async getAsset(id: string): Promise<Asset> {
    const response = await fetch(`${API_URL}/assets/${id}`);
    if (!response.ok) throw new Error("Failed to fetch asset");
    return response.json();
  },

  async createAsset(asset: Omit<Asset, "id">): Promise<Asset> {
    const response = await fetch(`${API_URL}/assets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error("Failed to create asset");
    return response.json();
  },

  async deleteAsset(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete asset");
  },

  async updateAsset(asset: Asset, id: string): Promise<Asset> {
    const response = await fetch(`${API_URL}/assets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error("Failed to update asset");
    return response.json();
  },
};
