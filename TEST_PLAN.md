# Test Plan (3–5 intentionally chosen tests)

## Test Strategy
I focused on 3 critical tests that cover validation, user interaction, and data integrity - the core requirements.

---

## Test 1: File Type Validation (Unit Test)

**File**: `src/__tests__/validation.test.ts`

**What it tests**: File extension validation for each asset category

**Why this test matters**: 
- Prevents app crashes when users upload wrong file types (e.g., JPG as 3D Model)
- Critical for data integrity and user experience
- Tests business logic in isolation

**Test cases**:
- ✅ 3D Model accepts `.glb` and `.gltf` files
- ✅ 3D Model rejects `.jpg`, `.mp4`, `.png` files
- ✅ Video accepts `.mp4`, `.webm`, `.mov` files
- ✅ Audio accepts `.mp3`, `.wav`, `.ogg` files
- ✅ Image accepts `.jpg`, `.png`, `.gif` files

**How to run**: `npm test validation.test.ts`

**Expected behavior**: Returns `true` for valid extensions, `false` for invalid ones

---

## Test 2: Search Filter Functionality (Component Test)

**File**: `src/__tests__/AssetList.test.tsx`

**What it tests**: Search box filters assets by name in real-time

**Why this test matters**:
- Core user feature for finding assets
- Tests React component state and rendering
- Verifies user interaction updates UI correctly

**Test cases**:
- ✅ Initially shows all assets
- ✅ Typing "Model" filters to only matching assets
- ✅ Shows "No assets found" for non-matching search
- ✅ Clearing search shows all assets again

**How to run**: `npm test AssetList.test.tsx`

**Expected behavior**: Only assets matching search query are displayed

---

## Test 3: Form Validation Error Messages (Component Test)

**File**: `src/__tests__/validation.test.ts`

**What it tests**: Upload form shows error messages for invalid input

**Why this test matters**:
- Prevents bad data from entering the system
- Tests user feedback (UX)
- Verifies form validation rules work correctly

**Test cases**:
- ✅ Name too short (<3 chars) shows "Name must be at least 3 characters"
- ✅ Empty name shows "Name is required"
- ✅ Description too short (<10 chars) shows error
- ✅ Valid input returns no errors

**How to run**: `npm test validation.test.ts`

**Expected behavior**: Returns appropriate error messages for invalid inputs

---

## Test Coverage Summary

**Total Tests**: 10 tests across 2 test files  
**Test Files**: 2 (validation, AssetList)  
**Coverage Areas**: 
- Unit tests: File type validation
- Component tests: Search filtering, form validation

---

## How to Run

```bash
npm test              # All tests
npm run test:ui       # With UI
```

**Status**: ✅ 10/10 tests passing
