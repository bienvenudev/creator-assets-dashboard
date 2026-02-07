import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Grid, Environment } from '@react-three/drei';

interface ModelProps {
  url: string;
  wireframe: boolean;
}

function Model({ url, wireframe }: ModelProps) {
  const { scene } = useGLTF(url);
  
  // Apply wireframe to all meshes if enabled
  if (wireframe) {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.wireframe = true;
      }
    });
  } else {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material.wireframe = false;
      }
    });
  }

  return <primitive object={scene} />;
}

interface ThreeDViewerProps {
  modelUrl: string;
}

export function ThreeDViewer({ modelUrl }: ThreeDViewerProps) {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment for better lighting */}
          <Environment preset="studio" />
          
          {/* Grid */}
          {showGrid && <Grid infiniteGrid cellSize={0.5} sectionSize={1} fadeDistance={30} />}
          
          {/* 3D Model */}
          <Model url={modelUrl} wireframe={wireframe} />
          
          {/* Camera Controls */}
          <OrbitControls 
            autoRotate={autoRotate}
            autoRotateSpeed={2}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 rounded-lg shadow-lg p-3">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              wireframe
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {wireframe ? '🔲 Wireframe: ON' : '🔲 Wireframe: OFF'}
          </button>
          
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRotate
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {autoRotate ? '🔄 Auto-Rotate: ON' : '🔄 Auto-Rotate: OFF'}
          </button>
          
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showGrid
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showGrid ? '⊞ Grid: ON' : '⊞ Grid: OFF'}
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          💡 Drag to rotate • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
}
