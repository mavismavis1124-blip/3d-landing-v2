'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Trail, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Neon floating particles
function ParticleField() {
  const count = 1000
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00ffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

// Floating geometric shapes with distortion
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Large central sphere with distortion */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={2}>
        <Sphere args={[2, 64, 64]} position={[0, 0, -8]}>
          <MeshDistortMaterial color="#ff00ff" distort={0.4} speed={2} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>

      {/* Orbiting smaller spheres */}
      <Float speed={2} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.5, 32, 32]} position={[-4, 2, -5]}>
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={2.5}>
        <Sphere args={[0.7, 32, 32]} position={[4, -2, -6]}>
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
        <Sphere args={[0.4, 32, 32]} position={[3, 3, -4]}>
          <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={0.9} floatIntensity={3}>
        <Sphere args={[0.6, 32, 32]} position={[-3, -3, -7]}>
          <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </group>
  )
}

// Neon ring with trail effect
function NeonRing() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3
      ringRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={0.5} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={ringRef} position={[0, 0, -10]}>
        <torusGeometry args={[4, 0.1, 16, 100]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </Float>
  )
}

// Main 3D scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
      <pointLight position={[0, 10, -5]} intensity={0.8} color="#ffff00" />
      <ParticleField />
      <FloatingShapes />
      <NeonRing />
      <Stars radius={100} depth={50} count={3000} factor={6} saturation={1} fade speed={2} />
    </>
  )
}

// Animated text component with GSAP scroll trigger
function ScrollText({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!textRef.current) return

    gsap.fromTo(textRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [delay])

  return <div ref={textRef} className={className}>{children}</div>
}

// Split text animation
function SplitText({ text, className = '' }: { text: string, className?: string }) {
  const words = text.split(' ')

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            type: 'spring',
            stiffness: 100
          }}
          className="inline-block mr-3"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      {/* Fixed 3D Background */}
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="h-screen flex flex-col items-center justify-center px-4">
          <motion.div style={{ y: heroY, opacity: heroOpacity, scale }} className="text-center">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="text-7xl md:text-9xl font-black mb-8 tracking-tighter"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                NEON
              </span>
            </motion.h1>

            <SplitText
              text="Enter the digital dimension"
              className="text-2xl md:text-4xl text-gray-300 font-light block"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12"
            >
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0,255,255,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-bold text-lg rounded-full hover:bg-cyan-400 hover:text-black transition-all duration-300"
              >
                EXPLORE
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute bottom-10"
          >
            <div className="w-8 h-12 border-2 border-cyan-400/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 16, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-2 h-2 bg-cyan-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center py-32 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            {[
              { icon: '⚡', title: 'Lightning Fast', color: 'cyan' },
                { icon: '🎨', title: 'Stunning Visuals', color: 'purple' },
                { icon: '🚀', title: 'Next Level', color: 'pink' }
            ].map((feature, i) => (
              <ScrollText key={i} delay={i * 0.2}>
                <motion.div
                  whileHover={{ y: -10, boxShadow: `0 20px 40px rgba(0,255,255,0.2)` }}
                  className={`bg-black/50 backdrop-blur-xl border border-${feature.color}-400/30 rounded-3xl p-10 text-center group`}
                >
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className={`text-3xl font-bold mb-4 text-${feature.color}-400`}>{feature.title}</h3>
                  <p className="text-gray-400 text-lg">Experience the future of web design with cutting-edge 3D technology.</p>
                </motion.div>
              </ScrollText>
            ))}
          </div>
        </section>

        {/* Gallery Section with 3D Cards */}
        <section className="min-h-screen flex items-center py-32 px-4">
          <div className="max-w-6xl mx-auto w-full">
            <ScrollText className="text-center mb-20">
              <h2 className="text-6xl md:text-8xl font-black mb-8">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                  GALLERY
                </span>
              </h2>
            </ScrollText>

            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((item, i) => (
                <ScrollText key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="aspect-video bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-2xl border border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity">🎭</div>
                      <p className="text-xl text-gray-300">Project {item}</p>
                    </div>
                  </motion.div>
                </ScrollText>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="min-h-screen flex items-center py-32 px-4">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Users' },
                { value: '99%', label: 'Satisfaction' },
                { value: '50+', label: 'Projects' },
                { value: '24/7', label: 'Support' }
              ].map((stat, i) => (
                <ScrollText key={i} delay={i * 0.1}>
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 }}
                      className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4"
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-xl text-gray-400">{stat.label}</p>
                  </div>
                </ScrollText>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-screen flex items-center justify-center py-32 px-4">
          <div className="text-center">
            <ScrollText>
              <h2 className="text-5xl md:text-7xl font-black mb-8">
                <span className="text-white">Ready to</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  level up?
                </span>
              </h2>
            </ScrollText>

            <ScrollText delay={0.3}>
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: '0 0 50px rgba(255,0,255,0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold text-xl rounded-full"
              >
                GET STARTED NOW
              </motion.button>
            </ScrollText>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 text-center border-t border-white/10">
          <p className="text-gray-500 text-lg">© 2026 Neon Labs. All rights reserved.</p>
        </footer>
      </div>
    </main>
  )
}
