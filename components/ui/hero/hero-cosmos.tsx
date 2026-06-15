'use client';

import { FrameLink } from '@/components/ui/frame-link';
import { cn } from '@/utils/utils';
import { Environment, Float, Lightformer, PerspectiveCamera, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useTheme } from 'next-themes';
import { RefObject, Suspense, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// --- Config & Types ---

const COLORS = {
  dark: {
    foreground: '#ffffff',
    background: '#000000',
  },
  light: {
    foreground: '#000000',
    background: '#ffffff',
  },
};

type ThemeMode = keyof typeof COLORS;

interface SceneConfig {
  background: string;
  foreground: string;
  isDark: boolean;
  starCount: number;
  starFactor: number;
  lightColor: string;
  coreSurfaceColor: string;
  coreEmissiveIntensity: number;
  coreGlowOpacity: number;
  coreFrontLightIntensity: number;
  coreSecondaryLightIntensity: number;
  coreGlintOpacity: number;
  coreFaceHighlightOpacity: number;
  coreEnvIntensity: number;
}

const SCENE_CONFIG_BY_THEME: Record<ThemeMode, SceneConfig> = {
  dark: {
    ...COLORS.dark,
    isDark: true,
    starCount: 5000,
    starFactor: 4,
    lightColor: '#ffffff',
    coreSurfaceColor: '#ebebeb',
    coreEmissiveIntensity: 2,
    coreGlowOpacity: 0.15,
    coreFrontLightIntensity: 3,
    coreSecondaryLightIntensity: 2,
    coreGlintOpacity: 0.85,
    coreFaceHighlightOpacity: 0,
    coreEnvIntensity: 1.0,
  },
  light: {
    ...COLORS.light,
    isDark: false,
    starCount: 2000,
    starFactor: 2,
    lightColor: '#ffffff',
    coreSurfaceColor: '#060606',
    coreEmissiveIntensity: 0,
    coreGlowOpacity: 0.05,
    coreFrontLightIntensity: 52,
    coreSecondaryLightIntensity: 36,
    coreGlintOpacity: 0.75,
    coreFaceHighlightOpacity: 0.18,
    coreEnvIntensity: 2.0,
  },
};

const SceneConfigContext = createContext<SceneConfig>(SCENE_CONFIG_BY_THEME.light);

// --- Constants ---

const HERO_SECTION_CLASS = 'bg-background relative h-[calc(100vh-60px)] min-h-150 w-full md:h-[calc(100vh-65px)]';
const HERO_SECTION_ACTIVE_CLASS =
  'bg-background relative h-[calc(100vh-60px)] min-h-150 w-full overflow-hidden transition-colors duration-700 md:h-[calc(100vh-65px)]';

const SPRING_EASE = [0.16, 1, 0.3, 1] as const;
const CAMERA_POSITION = [0, 0, 15] as const;
const PARTICLE_RANGE = 40;
const ORBITAL_RING_INDICES = [1, 2, 3] as const;
const DECORATIVE_FRAME_SEGMENTS = [
  'top-8 left-8 h-px w-16',
  'top-8 left-8 h-16 w-px',
  'top-8 right-8 h-px w-16',
  'top-8 right-8 h-16 w-px',
  'bottom-8 left-8 h-px w-16',
  'bottom-8 left-8 h-16 w-px',
  'bottom-8 right-8 h-px w-16',
  'bottom-8 right-8 h-16 w-px',
] as const;

// --- Props ---

interface HeroCosmosProps {
  className?: string;
}

interface ParticlesProps {
  color?: string;
  count?: number;
}

interface OrbitalRingsProps {
  color?: string;
}

interface CoreKeyLightProps {
  color: string;
  intensity: number;
  position: [number, number, number];
  targetRef: RefObject<THREE.Object3D<THREE.Object3DEventMap> | null>;
}

// --- Shared Hook & Util ---

function useSceneConfig() {
  return useContext(SceneConfigContext);
}

function generateParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * PARTICLE_RANGE;
    positions[i3 + 1] = (Math.random() - 0.5) * PARTICLE_RANGE;
    positions[i3 + 2] = (Math.random() - 0.5) * PARTICLE_RANGE;
  }

  return positions;
}

// --- Main ---

export function HeroCosmos({ className }: HeroCosmosProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  const yTranslate = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);

  const theme: ThemeMode = resolvedTheme === 'dark' ? 'dark' : 'light';
  const sceneConfig = SCENE_CONFIG_BY_THEME[theme];

  if (!mounted) {
    return <section className={cn(HERO_SECTION_CLASS, className)} />;
  }

  return (
    <section className={cn(HERO_SECTION_ACTIVE_CLASS, className)}>
      {/* Three.js Background */}
      <BackgroundLayer config={sceneConfig} />

      {/* Content */}
      <HeroContent yTranslate={yTranslate} opacity={opacity} scale={scale} />

      {/* Foreground Core */}
      <CoreLayer config={sceneConfig} />

      {/* Decorative Frame */}
      <DecorativeFrame />
    </section>
  );
}

// --- Sections (HeroCosmos 직속 자식) ---

function BackgroundLayer({ config }: { config: SceneConfig }) {
  return (
    <div className="absolute inset-0 z-0">
      <CosmosCanvas config={config} />

      {/* Overlay Gradients */}
      <div className="via-background/20 to-background absolute inset-0 bg-radial-[circle_at_50%_50%] from-transparent transition-colors duration-700" />
      <div className="from-background absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent transition-colors duration-700" />
    </div>
  );
}

function HeroContent({
  opacity,
  scale,
  yTranslate,
}: {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  yTranslate: MotionValue<number>;
}) {
  return (
    <div className="relative flex h-full items-center justify-center px-6">
      <motion.div style={{ y: yTranslate, opacity, scale }} className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: SPRING_EASE }}
        >
          <span className="font-pixel text-foreground/40 mb-6 inline-block text-[8px] tracking-[0.4em] uppercase transition-colors duration-700 sm:text-[11px]">
            Frontend Developer Blog
          </span>
        </motion.div>

        <h1 className="font-mulmaru text-foreground mb-10 text-6xl leading-[1.05] font-black tracking-tighter transition-colors duration-700 md:text-[10rem]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: SPRING_EASE }}
              className="text-foreground inline-block tracking-wide sm:leading-48"
            >
              Bit
            </motion.span>
          </span>
          <span className="-mt-2 block overflow-hidden md:-mt-8">
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: SPRING_EASE }}
              className="text-muted-foreground/60 inline-block tracking-wide transition-[text-stroke] duration-700"
            >
              By Bit
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mx-auto mt-4 max-w-2xl"
        >
          <p className="text-foreground/50 mt-32 mb-12 text-xs leading-relaxed tracking-wide text-balance break-keep transition-colors duration-700 sm:mt-0 md:text-base">
            Bit by Bit는 작은 단위의 선택과 고민이 모여 하나의 결과를 만들어내는 흐름을 담고 있습니다.
            <br className="hidden sm:inline" /> 이 블로그에서는 프론트엔드를 설계하고 구현하며 쌓아온 생각과 경험을
            기록합니다.
          </p>

          <FrameLink href="/posts" className="relative z-30">
            전체 글 보기
          </FrameLink>
        </motion.div>
      </motion.div>
    </div>
  );
}

function CoreLayer({ config }: { config: SceneConfig }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* R3F가 컨테이너에 inline pointer-events:auto를 강제하므로 style로 덮어써야 클릭이 통과한다 */}
      <Canvas style={{ pointerEvents: 'none' }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={75} />
        <SceneConfigContext.Provider value={config}>
          <Suspense fallback={null}>
            <CoreScene />
          </Suspense>
        </SceneConfigContext.Provider>
      </Canvas>
    </div>
  );
}

function DecorativeFrame() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {DECORATIVE_FRAME_SEGMENTS.map((style, index) => (
        <div key={index} className={`bg-foreground/20 absolute transition-colors duration-700 ${style}`} />
      ))}

      <div className="font-pixel text-foreground/20 invisible absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-widest transition-colors duration-700 sm:visible sm:text-[11px]">
        02.13.2026 / JUNI-JAEI / BIT-BY-BIT
      </div>
    </div>
  );
}

// --- Canvas Containers (Sections 직속 자식) ---

function CosmosCanvas({ config }: { config: SceneConfig }) {
  return (
    <Canvas style={{ pointerEvents: 'none' }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <PerspectiveCamera makeDefault position={CAMERA_POSITION} fov={75} />
      <color attach="background" args={[config.background]} />
      <fog attach="fog" args={[config.background, 10, 35]} />
      <SceneConfigContext.Provider value={config}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </SceneConfigContext.Provider>
    </Canvas>
  );
}

function CoreScene() {
  const targetRef = useRef<THREE.Object3D>(null);
  const config = useSceneConfig();

  return (
    <>
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer form="circle" intensity={0.3} scale={[8, 0.8, 1]} position={[0, -5, 3]} />
      </Environment>

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <object3D ref={targetRef} position={[0, 0, 0]} />
        <PixelCore />
      </Float>

      <CoreGlintLight color={config.lightColor} targetRef={targetRef} />
      <CoreKeyLight
        color={config.lightColor}
        intensity={config.coreFrontLightIntensity}
        position={[-3.2, 3.4, 8]}
        targetRef={targetRef}
      />
      <CoreKeyLight
        color={config.lightColor}
        intensity={config.coreSecondaryLightIntensity}
        position={[7.9, 2.8, 3.5]}
        targetRef={targetRef}
      />
    </>
  );
}

// --- 3D Scenes (Canvas Containers 직속 자식) ---

function Scene() {
  const config = useSceneConfig();

  return (
    <>
      <Stars
        radius={100}
        depth={50}
        count={config.starCount}
        factor={config.starFactor}
        saturation={0}
        fade
        speed={1}
      />
      <Particles count={3000} color={config.foreground} />
      <OrbitalRings color={config.foreground} />
    </>
  );
}

function PixelCore() {
  const config = useSceneConfig();
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (innerRef.current) {
      innerRef.current.rotation.x = time * 0.4;
      innerRef.current.rotation.y = time * 0.2;
    }

    if (outerRef.current) {
      outerRef.current.rotation.x = -time * 0.15;
      outerRef.current.rotation.y = -time * 0.25;

      const scale = 1 + Math.sin(time * 2) * 0.05;
      outerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Inner Core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color={config.coreSurfaceColor}
          emissive={config.lightColor}
          emissiveIntensity={config.coreEmissiveIntensity}
          metalness={0.1}
          roughness={0.03}
          clearcoat={1}
          clearcoatRoughness={0.035}
          ior={2.3}
          reflectivity={1}
          specularColor={config.lightColor}
          specularIntensity={3.0}
          envMapIntensity={config.coreEnvIntensity}
          flatShading
        />
      </mesh>

      {/* Concentrated specular glint for a polished black surface */}
      <mesh position={[-0.42, 0.46, 0.82]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial
          color={config.lightColor}
          transparent
          opacity={config.coreGlintOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Always-visible soft facet light for the black core in light mode */}
      <mesh position={[0.22, 0.08, 0.96]} rotation={[0, 0, Math.PI / 5]} scale={[1, 0.72, 1]}>
        <circleGeometry args={[0.34, 3]} />
        <meshBasicMaterial
          color={config.lightColor}
          transparent
          opacity={config.coreFaceHighlightOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Crystalline Structure */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[1.8, 0]} />
        <meshStandardMaterial color={config.foreground} wireframe transparent opacity={0.3} />
      </mesh>

      {/* Subtle Glow Sphere */}
      <mesh scale={2.5}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={config.foreground} transparent opacity={config.coreGlowOpacity} />
      </mesh>
    </group>
  );
}

function CoreKeyLight({ color, intensity, position, targetRef }: CoreKeyLightProps) {
  const lightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;

    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, [targetRef]);

  return (
    <spotLight
      ref={lightRef}
      position={position}
      angle={0.85}
      penumbra={0.6}
      intensity={intensity}
      distance={40}
      decay={0.8}
      color={color}
    />
  );
}

function CoreGlintLight({
  color,
  targetRef,
}: {
  color: THREE.ColorRepresentation;
  targetRef: RefObject<THREE.Object3D<THREE.Object3DEventMap> | null>;
}) {
  const lightRef = useRef<THREE.SpotLight>(null);

  useEffect(() => {
    if (!lightRef.current || !targetRef.current) return;

    lightRef.current.target = targetRef.current;
    lightRef.current.target.updateMatrixWorld();
  }, [targetRef]);

  useFrame((state) => {
    if (!lightRef.current) return;

    const time = state.clock.getElapsedTime();

    lightRef.current.intensity = 6 + Math.max(0, Math.sin(time * 5.5)) * 11;

    const angle = time * 1.35;
    const xRadius = 5.2;
    const yRadius = 0.75;
    const baseY = 0.25;
    const fixedZ = 1.65;

    lightRef.current.position.set(Math.sin(angle) * xRadius, baseY + Math.sin(angle * 2 + 0.35) * yRadius, fixedZ);
  });

  return <spotLight ref={lightRef} angle={0.22} penumbra={0.18} distance={30} decay={1.2} color={color} />;
}

// --- 3D Primitives (3D Scenes 직속 자식) ---

function Particles({ count = 2000, color = '#ffffff' }: ParticlesProps) {
  const mesh = useRef<THREE.Points>(null);
  const particles = useMemo(() => generateParticlePositions(count), [count]);

  useFrame((state) => {
    if (!mesh.current) return;

    const time = state.clock.getElapsedTime();
    mesh.current.rotation.y = time * 0.05;
    mesh.current.rotation.x = Math.sin(time * 0.1) * 0.1;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} color={color} transparent opacity={0.6} sizeAttenuation={true} />
    </points>
  );
}

function OrbitalRings({ color = '#ffffff' }: OrbitalRingsProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    group.current.rotation.z = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <group ref={group}>
      {ORBITAL_RING_INDICES.map((index) => (
        <mesh key={index} rotation={[Math.PI / (index * 1.5), 0, 0]}>
          <ringGeometry args={[5 + index * 2, 5.02 + index * 2, 128]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
