# Design Notes (max 1 page)

## Architecture choice
**Component-based React with page routing**
- Chose React Router for separate asset details page (shareable URLs, better UX than modal)
- Custom hooks (`useAssets`) for asset management logic separation
- Service layer (`api.ts`) abstracts JSON server interactions
- Type-safe with TypeScript interfaces for all data structures

**3D Rendering**: React Three Fiber over vanilla Three.js for declarative React integration and automatic lifecycle management

## Data model
```typescript
Asset {
  id: string;
  name: string;
  category: '3D Model' | 'Audio' | 'Video' | 'Image';
  fileType: string;  // Extension: glb, mp4, jpg, etc.
  fileSize: number;  // Bytes
  uploadDate: string; // ISO timestamp
  thumbnailUrl: string; // Display in grid
  modelUrl?: string;  // Actual file URL
  tags: string[];     // Search/filter metadata
  description: string;
}
```

**Mock API**: json-server provides REST endpoints. In production would use real backend with file storage.

## Edge cases handled
- **Invalid file types**: Strict validation per category (e.g., only `.glb/.gltf` for 3D Model)
- **3D loading failures**: Error Boundary catches render errors, shows user-friendly message
- **Empty search results**: "No assets found" message with clear state
- **Blob URL expiration**: Documented limitation; works for demo, production needs persistent storage

## Risks and mitigations
**Risk**: Blob URLs don't persist after refresh  
**Mitigation**: Clearly documented. For demo purposes acceptable. Production would save to `public/` or cloud storage.

**Risk**: No authentication means anyone can upload/view  
**Mitigation**: Out of scope for MVP. Would add auth layer (JWT, sessions) in production.

**Risk**: Video thumbnail extraction may fail  
**Mitigation**: Try-catch with fallback to generic video icon if Canvas API fails.

## What I'd do next
1. **Persistent file storage**: Save uploads to `public/models/` with real file paths
2. **Delete/Edit assets**: Add UI for CRUD operations
3. **Pagination**: Virtualization for 100+ assets
4. **Accessibility**: ARIA labels, keyboard navigation, focus management
