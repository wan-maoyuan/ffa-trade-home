import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DigitalOceanBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 检测当前主题
    const getTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        }
        return 'dark';
    };

    useEffect(() => {
        if (!containerRef.current) return;

        const CONFIG = {
            particleCount: 10000,
            rangeX: 3500,
            zStart: 600,
            zEnd: -1600,
            flowSpeed: 2.5,
            baseWaveHeight: 50,
            maxWaveHeight: 120,
            cameraY: 400,
            cameraZ: 950
        };

        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let renderer: THREE.WebGLRenderer;
        let particles: THREE.Points;
        let animationFrameId: number;

        const particleData: {
            baseX: number;
            baseZ: number;
            phaseOffset: number;
            blinkSpeed: number;
            volatilitySensitivity: number;
        }[] = [];

        // Texture creation function (moved outside init for reuse)
        const createDataStarTexture = (isLightTheme: boolean) => {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            if (!ctx) return new THREE.Texture();

                if (isLightTheme) {
                    // 白天主题：使用与夜晚主题一致的蓝色粒子纹理，但调整为适合浅色背景的亮度
                    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                    grad.addColorStop(0, 'rgba(100, 180, 255, 0.95)'); // 蓝色核心，稍微降低透明度
                    grad.addColorStop(0.2, 'rgba(120, 200, 255, 0.6)'); // 亮蓝色
                    grad.addColorStop(0.5, 'rgba(60, 140, 220, 0.3)'); // 中等蓝色
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)'); // 透明
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 64, 64);

                    // 核心与夜晚主题保持一致
                    ctx.fillStyle = 'rgba(100, 180, 255, 0.9)';
                    ctx.beginPath();
                    ctx.arc(32, 32, 7, 0, Math.PI * 2);
                    ctx.fill();
            } else {
                // 暗色主题：原有的蓝色粒子
                const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.2, 'rgba(180, 230, 255, 0.5)');
                grad.addColorStop(0.5, 'rgba(20, 80, 200, 0.2)');
                grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 64, 64);

                // Sharp core
                ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
                ctx.beginPath();
                ctx.arc(32, 32, 7, 0, Math.PI * 2);
                ctx.fill();
            }

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            return texture;
        };

        const init = () => {
            const container = containerRef.current;
            if (!container) return;

            // Scene setup
            scene = new THREE.Scene();
            const theme = getTheme();
            const fogColor = theme === 'light' ? 0xf7f7f5 : 0x000205; // 白天主题使用与背景一致的浅灰色
            const fogDensity = theme === 'light' ? 0.0002 : 0.001; // 白天主题稍微降低雾密度，让粒子更清晰
            scene.fog = new THREE.FogExp2(fogColor, fogDensity);

            // Camera setup
            camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(0, CONFIG.cameraY, CONFIG.cameraZ);
            camera.lookAt(0, 0, -600);

            // Geometry setup
            const geometry = new THREE.BufferGeometry();
            const positions: number[] = [];
            const colors: number[] = [];

            for (let i = 0; i < CONFIG.particleCount; i++) {
                const x = (Math.random() - 0.5) * CONFIG.rangeX;
                const z = CONFIG.zStart - Math.random() * (CONFIG.zStart - CONFIG.zEnd);

                positions.push(0, 0, 0);
                colors.push(0, 0, 1);

                particleData.push({
                    baseX: x,
                    baseZ: z,
                    phaseOffset: Math.random() * Math.PI * 2,
                    blinkSpeed: 0.5 + Math.random() * 3.0,
                    volatilitySensitivity: Math.random()
                });
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

            (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
            (geometry.attributes.color as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

            // Material setup
            const isLightTheme = theme === 'light';
            const material = new THREE.PointsMaterial({
                size: 32, // 统一粒子大小，保持一致的视觉效果
                vertexColors: true,
                transparent: true,
                opacity: 1.0, // 统一不透明度
                blending: THREE.AdditiveBlending, // 统一使用Additive混合模式，保持一致的动画效果
                depthWrite: false,
                map: createDataStarTexture(isLightTheme),
                sizeAttenuation: true
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // Renderer setup
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            window.addEventListener('resize', onWindowResize, false);
        };

        const onWindowResize = () => {
            if (!camera || !renderer) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const renderScene = () => {
            if (!particles || !renderer || !scene || !camera) return;

            const positions = particles.geometry.attributes.position.array as Float32Array;
            const colors = particles.geometry.attributes.color.array as Float32Array;

            const time = Date.now() * 0.001;

            // Market cycle simulation
            const marketCycle = (Math.sin(time * 0.2) + 1) / 2;
            const volatility = Math.pow(marketCycle, 2);

            const currentWaveHeight = CONFIG.baseWaveHeight + volatility * (CONFIG.maxWaveHeight - CONFIG.baseWaveHeight);
            const currentSurge = 30 + volatility * 40;

            for (let i = 0; i < CONFIG.particleCount; i++) {
                const data = particleData[i];

                // 1. Flow
                const speed = CONFIG.flowSpeed * (1 + volatility * 0.5);
                data.baseZ -= speed;

                if (data.baseZ < CONFIG.zEnd) {
                    data.baseZ = CONFIG.zStart;
                    data.baseX = (Math.random() - 0.5) * CONFIG.rangeX;
                }

                // 2. Wave Physics
                const wavePhase = (data.baseZ * 0.005) + (time * 1.5);
                const surge = Math.cos(wavePhase) * currentSurge;
                const heave = Math.sin(wavePhase) * currentWaveHeight;

                // 3. Uncertainty/Chaos
                const jitterAmount = volatility * data.volatilitySensitivity * 30;
                const jitterX = Math.sin(time * 3 + data.phaseOffset) * jitterAmount;
                const jitterY = Math.cos(time * 4 + data.phaseOffset) * jitterAmount;
                const jitterZ = Math.sin(time * 2 + data.phaseOffset) * jitterAmount;

                const x = data.baseX + jitterX;
                const y = heave + jitterY + (heave > 0 ? jitterY * 0.5 : 0);
                const z = data.baseZ + surge + jitterZ;

                // 4. Color & Energy
                const normHeight = y / currentWaveHeight;
                const distProgress = 1 - (z - CONFIG.zEnd) / (CONFIG.zStart - CONFIG.zEnd);
                const fade = Math.pow(distProgress, 0.5) * (1 - Math.pow(distProgress, 10));

                const currentTheme = getTheme();
                const isLightTheme = currentTheme === 'light';

                let h, s, l;

                if (isLightTheme) {
                    // 白天主题：使用与夜晚主题一致的蓝色/青色系，但调整亮度适配浅色背景
                    if (normHeight < -0.3) {
                        // 深部粒子：与夜晚主题相同的色调
                        h = 0.62;
                        s = 0.8;
                        l = 0.15 * fade; // 在浅色背景上需要较暗的亮度
                    } else {
                        const blink = Math.sin(time * data.blinkSpeed + data.phaseOffset);
                        const hueShift = volatility * 0.1 * blink;
                        // 主要粒子：与夜晚主题相同的色调范围和饱和度
                        h = 0.58 - normHeight * 0.15 - hueShift;
                        s = 0.9;
                        let brightness = 0.25 + normHeight * 0.4 + blink * 0.15 * volatility;
                        l = brightness * fade; // 整体亮度降低，使其在浅色背景上可见
                    }

                    // 高波动时的亮点：与夜晚主题一致的色调
                    if (volatility > 0.8 && Math.sin(time * 10 + i) > 0.98) {
                        l = 0.7; // 在浅色背景上需要足够的亮度
                        h = 0.5;
                        s = 0.9;
                    }
                } else {
                    // 暗色主题：原有的蓝色/青色系
                    if (normHeight < -0.3) {
                        h = 0.62;
                        s = 0.8;
                        l = 0.2 * fade;
                    } else {
                        const blink = Math.sin(time * data.blinkSpeed + data.phaseOffset);
                        const hueShift = volatility * 0.1 * blink;
                        h = 0.58 - normHeight * 0.15 - hueShift;
                        s = 0.9;
                        let brightness = 0.4 + normHeight * 0.6 + blink * 0.2 * volatility;
                        l = brightness * fade;
                    }

                    if (volatility > 0.8 && Math.sin(time * 10 + i) > 0.98) {
                        l = 1.0;
                        h = 0.5;
                    }
                }

                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                const colorObj = new THREE.Color();
                colorObj.setHSL(h, s, l);
                colors[i * 3] = colorObj.r;
                colors[i * 3 + 1] = colorObj.g;
                colors[i * 3 + 2] = colorObj.b;
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.color.needsUpdate = true;

            const targetY = CONFIG.cameraY + volatility * 100;
            camera.position.y += (targetY - camera.position.y) * 0.02;
            camera.lookAt(0, 0, -600);

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(renderScene);
        };

        init();
        renderScene();

        // 监听主题变化
        let themeObserver: MutationObserver | null = null;
        if (typeof window !== 'undefined') {
            themeObserver = new MutationObserver(() => {
                if (scene && particles) {
                    const newTheme = getTheme();
                    const isLightTheme = newTheme === 'light';
                    
                    // 更新雾效
                    const fogColor = isLightTheme ? 0xf7f7f5 : 0x000205; // 白天主题使用与背景一致的浅灰色
                    const fogDensity = isLightTheme ? 0.0002 : 0.001; // 白天主题稍微降低雾密度
                    scene.fog = new THREE.FogExp2(fogColor, fogDensity);
                    
                    // 更新材质
                    if (particles.material instanceof THREE.PointsMaterial) {
                        // 释放旧纹理
                        if (particles.material.map) {
                            particles.material.map.dispose();
                        }
                        
                        particles.material.size = 32; // 统一粒子大小
                        particles.material.opacity = 1.0; // 统一不透明度
                        particles.material.blending = THREE.AdditiveBlending; // 统一使用Additive混合模式
                        particles.material.map = createDataStarTexture(isLightTheme);
                        particles.material.needsUpdate = true;
                    }
                }
            });

            themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['data-theme']
            });
        }

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (themeObserver) {
                themeObserver.disconnect();
            }
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            if (renderer) {
                renderer.dispose();
                if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
                    containerRef.current.removeChild(renderer.domElement);
                }
            }
            if (particles) {
                particles.geometry.dispose();
                if (Array.isArray(particles.material)) {
                    particles.material.forEach(m => m.dispose());
                } else {
                    particles.material.dispose();
                }
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="digital-ocean-background"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1,
                background: 'radial-gradient(circle at 50% 30%, #0d1a2d 0%, #000000 80%)',
                overflow: 'hidden'
            }}
        />
    );
};

export default DigitalOceanBackground;
