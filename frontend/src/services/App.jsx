import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

export default function App() {
  return (
    <Canvas className="dark-theme">
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <OrbitControls autoRotate />
      
      {/* Transcription Overlay */}
      <div className="floating-transcript">
        {transcript.map((term) => (
          <span style={{ backgroundColor: term.isMedical ? '#FFA50080' : '' }}>
            {term.text}
          </span>
        ))}
      </div>
    </Canvas>
  );
}