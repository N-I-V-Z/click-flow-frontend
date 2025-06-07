// // src/providers/MouseEffectProvider.tsx - Golden Star Bling Effect
// import React, {
//   createContext,
//   useContext,
//   ReactNode,
//   useEffect,
//   useRef,
//   useState,
//   useCallback
// } from 'react';

// interface MousePosition {
//   x: number;
//   y: number;
// }

// interface GoldenStar {
//   id: number;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
//   life: number;
//   maxLife: number;
//   size: number;
//   rotation: number;
//   rotationSpeed: number;
//   opacity: number;
//   glowIntensity: number;
//   type: 'star' | 'sparkle' | 'glow';
// }

// interface MouseEffectContextType {
//   toggleEffect: () => void;
//   isEffectEnabled: boolean;
//   setIntensity: (intensity: number) => void;
//   intensity: number;
// }

// const MouseEffectContext = createContext<MouseEffectContextType | undefined>(
//   undefined
// );

// interface MouseEffectProviderProps {
//   children: ReactNode;
//   enabled?: boolean;
// }

// export const MouseEffectProvider: React.FC<MouseEffectProviderProps> = ({
//   children,
//   enabled = true
// }) => {
//   const [isEffectEnabled, setIsEffectEnabled] = useState(enabled);
//   const [intensity, setIntensity] = useState(1);
//   const [stars, setStars] = useState<GoldenStar[]>([]);
//   const starIdRef = useRef(0);

//   const toggleEffect = useCallback(() => {
//     setIsEffectEnabled((prev) => !prev);
//   }, []);

//   const setIntensityCallback = useCallback((newIntensity: number) => {
//     setIntensity(Math.max(0.1, Math.min(3, newIntensity)));
//   }, []);

//   // ⭐ CREATE GOLDEN STAR
//   const createGoldenStar = useCallback(
//     (x: number, y: number, velocity: number = 1) => {
//       if (!isEffectEnabled) return;

//       const starTypes: GoldenStar['type'][] = ['star', 'sparkle', 'glow'];

//       const star: GoldenStar = {
//         id: starIdRef.current++,
//         x: x + (Math.random() - 0.5) * 10, // Reduced from 20 to 10 (50% smaller)
//         y: y + (Math.random() - 0.5) * 10,
//         vx: (Math.random() - 0.5) * 3 * velocity, // Reduced from 6 to 3 (50% slower)
//         vy: (Math.random() - 0.5) * 3 * velocity - Math.random() * 1.5,
//         life: 60 + Math.random() * 30,
//         maxLife: 60 + Math.random() * 30,
//         size: 6 + Math.random() * 10, // Reduced from 8-24 to 6-16 (smaller size)
//         rotation: Math.random() * 360,
//         rotationSpeed: (Math.random() - 0.5) * 4, // Reduced rotation speed
//         opacity: 0.7 + Math.random() * 0.3, // Increased from 0.5-0.8 to 0.7-1.0
//         glowIntensity: 0.5 + Math.random() * 0.5,
//         type: starTypes[Math.floor(Math.random() * starTypes.length)]
//       };

//       setStars((prev) => [...prev.slice(-40), star]);
//     },
//     [isEffectEnabled]
//   );

//   // 🖱️ MOUSE EVENTS
//   useEffect(() => {
//     if (!isEffectEnabled) return;

//     let lastX = 0;
//     let lastY = 0;

//     const handleMouseMove = (e: MouseEvent) => {
//       const currentX = e.clientX;
//       const currentY = e.clientY;

//       const distance = Math.sqrt(
//         (currentX - lastX) ** 2 + (currentY - lastY) ** 2
//       );

//       if (distance > 12) {
//         // Increased threshold from 8 to 12
//         const numStars = Math.floor(intensity * (0.5 + distance * 0.01)); // Reduced spawn rate
//         const velocity = Math.min(1.5, distance * 0.05); // Reduced max velocity

//         for (let i = 0; i < numStars; i++) {
//           createGoldenStar(currentX, currentY, velocity);
//         }

//         lastX = currentX;
//         lastY = currentY;
//       }
//     };

//     const handleClick = (e: MouseEvent) => {
//       const explosionStars = Math.floor(8 * intensity); // Reduced from 15 to 8

//       for (let i = 0; i < explosionStars; i++) {
//         const angle = (i / explosionStars) * Math.PI * 2;
//         const distance = 15 + Math.random() * 25; // Reduced spread from 30-80 to 15-40
//         const explodeX = e.clientX + Math.cos(angle) * distance;
//         const explodeY = e.clientY + Math.sin(angle) * distance;

//         setTimeout(() => {
//           createGoldenStar(explodeX, explodeY, 2);
//         }, i * 30);
//       }
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('click', handleClick);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('click', handleClick);
//     };
//   }, [isEffectEnabled, intensity, createGoldenStar]);

//   // 🎬 STAR ANIMATION
//   useEffect(() => {
//     if (!isEffectEnabled || stars.length === 0) return;

//     const animateStars = () => {
//       setStars(
//         (prev) =>
//           prev
//             .map((star) => {
//               star.x += star.vx;
//               star.y += star.vy;
//               star.life--;
//               star.rotation += star.rotationSpeed;

//               // Physics
//               star.vy += 0.3; // Gravity
//               star.vx *= 0.98; // Air resistance
//               star.vy *= 0.98;

//               // Bounce off bottom
//               if (star.y > window.innerHeight - star.size && star.vy > 0) {
//                 star.vy *= -0.6;
//                 star.vx *= 0.8;
//                 star.y = window.innerHeight - star.size;
//               }

//               // Bounce off sides
//               if (
//                 star.x < star.size ||
//                 star.x > window.innerWidth - star.size
//               ) {
//                 star.vx *= -0.7;
//                 star.x =
//                   star.x < star.size
//                     ? star.size
//                     : window.innerWidth - star.size;
//               }

//               star.opacity = (star.life / star.maxLife) * 0.95; // Slightly increased final opacity
//               star.glowIntensity =
//                 Math.sin(Date.now() * 0.01 + star.id) * 0.3 + 0.7;

//               return star.life > 0 ? star : null;
//             })
//             .filter(Boolean) as GoldenStar[]
//       );
//     };

//     const interval = setInterval(animateStars, 16); // ~60fps
//     return () => clearInterval(interval);
//   }, [isEffectEnabled, stars.length]);

//   return (
//     <MouseEffectContext.Provider
//       value={{
//         toggleEffect,
//         isEffectEnabled,
//         setIntensity: setIntensityCallback,
//         intensity
//       }}
//     >
//       {children}

//       {/* Golden Stars */}
//       {isEffectEnabled &&
//         stars.map((star) => (
//           <div
//             key={star.id}
//             className="golden-star"
//             style={{
//               position: 'fixed',
//               left: star.x,
//               top: star.y,
//               width: star.size,
//               height: star.size,
//               opacity: star.opacity,
//               transform: `translate(-50%, -50%) rotate(${star.rotation}deg)`,
//               pointerEvents: 'none',
//               zIndex: 9998
//             }}
//           >
//             {star.type === 'star' && (
//               <div
//                 className="star-shape"
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   background: `linear-gradient(45deg, #d4af37 0%, #f4d03f 30%, #f7dc6f 60%, #d4af37 100%)`, // Balanced gold - not too bright, not too dark
//                   clipPath:
//                     'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
//                   filter: `brightness(${1.1 + star.glowIntensity * 0.4}) drop-shadow(0 0 ${star.size * 0.4}px #d4af37) drop-shadow(0 0 ${star.size * 0.8}px #f4d03f)`, // Moderate glow
//                   boxShadow: `
//                   0 0 ${star.size * 0.4}px #d4af37,
//                   0 0 ${star.size * 0.8}px #f4d03f,
//                   0 0 ${star.size * 1.2}px rgba(212, 175, 55, 0.3),
//                   inset 0 0 ${star.size * 0.25}px rgba(255, 255, 255, 0.6)
//                 `
//                 }}
//               />
//             )}

//             {star.type === 'sparkle' && (
//               <div
//                 className="sparkle-shape"
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   background: `radial-gradient(circle, #ffffff 0%, #d4af37 25%, #f4d03f 60%, transparent 85%)`, // Balanced sparkle - white center but not too bright
//                   borderRadius: '50%',
//                   filter: `brightness(${1.3 + star.glowIntensity * 0.5}) blur(0.5px)`, // Moderate brightness with less blur
//                   boxShadow: `
//                   0 0 ${star.size * 0.6}px #ffffff,
//                   0 0 ${star.size}px #d4af37,
//                   0 0 ${star.size * 1.5}px rgba(212, 175, 55, 0.4)
//                 `
//                 }}
//               />
//             )}

//             {star.type === 'glow' && (
//               <div
//                 className="glow-shape"
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   background: `radial-gradient(circle, #ffd700 0%, #ffed4e 40%, transparent 80%)`,
//                   borderRadius: '50%',
//                   filter: `brightness(${1.3 + star.glowIntensity * 0.6})`,
//                   boxShadow: `
//                   0 0 ${star.size}px #ffd700,
//                   0 0 ${star.size * 2}px rgba(255, 215, 0, 0.6),
//                   0 0 ${star.size * 3}px rgba(255, 215, 0, 0.3)
//                 `
//                 }}
//               />
//             )}
//           </div>
//         ))}

//       {/* CSS Animations */}
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//           .golden-star {
//             animation: twinkle 2s ease-in-out infinite;
//           }

//           @keyframes twinkle {
//             0%, 100% {
//               filter: brightness(1) drop-shadow(0 0 6px #d4af37);  // Balanced twinkle
//             }
//             50% {
//               filter: brightness(1.4) drop-shadow(0 0 15px #d4af37) drop-shadow(0 0 25px #f4d03f);
//             }
//           }

//           .star-shape {
//             position: relative;
//           }

//           .star-shape::before {
//             content: '';
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             width: 60%;
//             height: 60%;
//             background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 70%);  // Balanced highlight
//             transform: translate(-50%, -50%);
//             border-radius: 50%;
//             pointer-events: none;
//           }

//           .sparkle-shape {
//             animation: sparkle-pulse 1.5s ease-in-out infinite;
//           }

//           @keyframes sparkle-pulse {
//             0%, 100% {
//               transform: scale(1);
//               opacity: 0.8;
//             }
//             50% {
//               transform: scale(1.3);
//               opacity: 1;
//             }
//           }

//           .glow-shape {
//             animation: glow-float 3s ease-in-out infinite;
//           }

//           @keyframes glow-float {
//             0%, 100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-10px);
//             }
//           }
//         `
//         }}
//       />
//     </MouseEffectContext.Provider>
//   );
// };

// export const useMouseEffectContext = () => {
//   const context = useContext(MouseEffectContext);
//   if (context === undefined) {
//     throw new error(
//       'useMouseEffectContext must be used within a MouseEffectProvider'
//     );
//   }
//   return context;
// };
