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

  // Validate file extension matches category requirements
  if (data.file) {
    const allowedExtensions: Record<string, string[]> = {
      "3D Model": [".glb"],
      Audio: [".mp3", ".wav", ".ogg", ".m4a"],
      Video: [".mp4", ".webm", ".mov", ".avi"],
      Image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    };

    const fileExtension = data.file.name
      .substring(data.file.name.lastIndexOf("."))
      .toLowerCase();
    const categoryExtensions = allowedExtensions[data.category];

    if (categoryExtensions && !categoryExtensions.includes(fileExtension)) {
      errors.file = `Invalid file type for ${data.category}. Allowed: ${categoryExtensions.join(", ")}`;
    }
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  if (!data.file) {
    errors.file = "File is required";
  } else if (data.file.size > 50 * 1024 * 1024) {
    // 50MB limit
    errors.file = "File size must be less than 50MB";
  }

  return errors;
}

// Validation for update form where file is optional
export function validateAssetUpdateForm(data: {
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

  // Validate file extension matches category requirements (only if file is provided)
  if (data.file) {
    const allowedExtensions: Record<string, string[]> = {
      "3D Model": [".glb"],
      Audio: [".mp3", ".wav", ".ogg", ".m4a"],
      Video: [".mp4", ".webm", ".mov", ".avi"],
      Image: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
    };

    const fileExtension = data.file.name
      .substring(data.file.name.lastIndexOf("."))
      .toLowerCase();
    const categoryExtensions = allowedExtensions[data.category];

    if (categoryExtensions && !categoryExtensions.includes(fileExtension)) {
      errors.file = `Invalid file type for ${data.category}. Allowed: ${categoryExtensions.join(", ")}`;
    }

    if (data.file.size > 50 * 1024 * 1024) {
      // 50MB limit
      errors.file = "File size must be less than 50MB";
    }
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  return errors;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
