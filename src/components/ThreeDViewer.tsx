import { useState, Suspense, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen function
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  }, []);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle 'f' key press for fullscreen
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleFullscreen]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-100">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* Environment for better lighting */}
          <Environment preset="studio" />
          
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
            onClick={toggleFullscreen}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isFullscreen
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Fullscreen (F)"
          >
            {isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen'}
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">
          💡 Drag to rotate • Scroll to zoom • Right-click to pan • Press F for fullscreen
        </p>
      </div>
    </div>
  );
}
