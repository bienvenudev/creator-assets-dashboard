export interface ValidationErrors {
  name?: string;
  category?: string;
  description?: string;
  file?: string;
}

export function validateAssetForm(data: {
  name: string;
  category: string;
  description: string;
  file: File | null;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  // file extension validation , if 3d model then only allow .glb and .gltf files
  if (data.file) {
    const allowedExtensions: Record<string, string[]> = {
      "3D Model": [".glb", ".gltf"],
      "Audio": [".mp3", ".wav", ".ogg", ".m4a"],
      "Video": [".mp4", ".webm", ".mov", ".avi"],
      "Image": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    };

    const fileExtension = data.file.name.substring(data.file.name.lastIndexOf(".")).toLowerCase();
    const categoryExtensions = allowedExtensions[data.category];
    
    if (categoryExtensions && !categoryExtensions.includes(fileExtension)) {
      errors.file = `Invalid file type for ${data.category}. Allowed: ${categoryExtensions.join(', ')}`;
    }
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!data.file) {
    errors.file = "File is required";
    // what does 50 * 1024 * 1024 do? it converts 50 megabytes to bytes, which is the unit used by the File API to represent file sizes? but why times 1024 twice? because 1 megabyte is equal to 1024 kilobytes, and 1 kilobyte is equal to 1024 bytes, so to convert megabytes to bytes, you need to multiply by 1024 twice (or multiply by 1024^2).
  } else if (data.file.size > 50 * 1024 * 1024) { // why 50MB? because it's a reasonable limit for most assets and helps prevent server overload
    errors.file = "File size must be less than 50MB";
  }

  return errors;
}
// why this formatfilesize function is in validation.ts? because it's a utility function that is used to format file sizes in a human-readable way, and it can be considered part of the validation and formatting utilities for the application.
// where is this formatfilesize function used? it's used in the AssetCard component to display the file size of each asset in a human-readable format.
export function formatFileSize(bytes: number): string { // what is this function for? it's used to convert a file size in bytes to a more human-readable format (e.g., KB, MB, GB) with appropriate units.
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function formatDate(dateString: string): string { // what is this function for? it's used to convert a date string to a more human-readable format (e.g., "Jan 1, 2020").
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { 
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
