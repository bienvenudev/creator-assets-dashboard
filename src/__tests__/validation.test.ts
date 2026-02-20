import { describe, it, expect } from 'vitest';
import { validateAssetForm, validateAssetUpdateForm } from '../utils/validation';

describe('Form Validation', () => {
  it('shows error for name too short', () => {
    const mockFile = new File(['content'], 'test.glb', { type: 'model/gltf-binary' });
    const formData = {
      name: 'AB',
      category: '3D Model',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.name).toBe('Name must be at least 3 characters');
  });

  it('shows error for description too short', () => {
    const mockFile = new File(['content'], 'test.glb', { type: 'model/gltf-binary' });
    const formData = {
      name: 'Test Asset',
      category: '3D Model',
      description: 'Short',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.description).toBe('Description must be at least 10 characters');
  });

  it('shows no errors for valid form', () => {
    const mockFile = new File(['content'], 'test.glb', { type: 'model/gltf-binary' });
    const formData = {
      name: 'Test Asset',
      category: '3D Model',
      description: 'This is a valid description',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe('File Type Validation', () => {
  it('accepts .glb files for 3D Model', () => {
    const mockFile = new File(['content'], 'model.glb', { type: 'model/gltf-binary' });
    const formData = {
      name: 'Test Model',
      category: '3D Model',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.file).toBeUndefined();
  });

  it('rejects .gltf files for 3D Model', () => {
    const mockFile = new File(['content'], 'model.gltf', { type: 'model/gltf+json' });
    const formData = {
      name: 'Test Model',
      category: '3D Model',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.file).toContain('Invalid file type for 3D Model');
  });

  it('rejects .jpg files for 3D Model', () => {
    const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    const formData = {
      name: 'Test Model',
      category: '3D Model',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.file).toContain('Invalid file type for 3D Model');
  });

  it('accepts .mp4 files for Video', () => {
    const mockFile = new File(['content'], 'video.mp4', { type: 'video/mp4' });
    const formData = {
      name: 'Test Video',
      category: 'Video',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.file).toBeUndefined();
  });

  it('accepts .jpg files for Image', () => {
    const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    const formData = {
      name: 'Test Image',
      category: 'Image',
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetForm(formData);
    expect(errors.file).toBeUndefined();
  });
});

describe('Update Form Validation', () => {
  it('allows update without file (file is optional)', () => {
    const formData = {
      name: 'Updated Asset Name',
      category: '3D Model',
      description: 'Updated description here',
      file: null,
    };

    const errors = validateAssetUpdateForm(formData);
    expect(errors.file).toBeUndefined();
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('still validates name and description even without file', () => {
    const formData = {
      name: 'AB',
      category: '3D Model',
      description: 'Short', 
      file: null,
    };

    const errors = validateAssetUpdateForm(formData);
    expect(errors.name).toBe('Name must be at least 3 characters');
    expect(errors.description).toBe('Description must be at least 10 characters');
    expect(errors.file).toBeUndefined();
  });

  it('validates file type when file is provided', () => {
    const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
    const formData = {
      name: 'Test Model',
      category: '3D Model', 
      description: 'Valid description here',
      file: mockFile,
    };

    const errors = validateAssetUpdateForm(formData);
    expect(errors.file).toContain('Invalid file type for 3D Model');
  });

  it('accepts valid update with new file', () => {
    const mockFile = new File(['content'], 'model.glb', { type: 'model/gltf-binary' });
    const formData = {
      name: 'Updated Model',
      category: '3D Model',
      description: 'Updated description here',
      file: mockFile,
    };

    const errors = validateAssetUpdateForm(formData);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
