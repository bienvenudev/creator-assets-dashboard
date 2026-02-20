import { useState, useEffect } from "react";
import type { Asset } from "../types/asset";
import { api } from "../services/api";

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const data = await api.getAssets();
      setAssets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const addAsset = async (asset: Omit<Asset, "id">) => {
    try {
      const newAsset = await api.createAsset(asset);
      setAssets((prev) => [...prev, newAsset]);
      return newAsset;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to add asset",
      );
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      await api.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete asset",
      );
    }
  };

  const updateAsset = async (asset: Asset, id: string) => {
    try {
      await api.updateAsset(asset, id);
      setAssets((prev) => prev.map((a) => (a.id === id ? asset : a)));
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update asset",
      );
    }
  };

  return {
    assets,
    loading,
    error,
    addAsset,
    deleteAsset,
    updateAsset,
    refetch: fetchAssets,
  };
}
