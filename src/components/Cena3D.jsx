'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const LETRA = 'S';

// Plano da imagem: ondula devagar e, ao entrar, chega curvado e com as cores separadas
const vertexShader = /* glsl */ `
    uniform float uTime;
    uniform float uProgress;
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 p = position;
        float entrada = 1.0 - uProgress;
        p.z += sin(p.x * 3.0 + uTime * 0.8) * 0.05 + sin(p.y * 2.5 + uTime * 0.6) * 0.05;
        p.z += sin(uv.x * 3.14159) * entrada * 0.9;
        p.y -= entrada * 0.4;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    uniform sampler2D uTex;
    uniform float uProgress;
    uniform vec2 uCover;
    varying vec2 vUv;

    void main() {
        // "background-size: cover" dentro do plano
        vec2 uv = (vUv - 0.5) * uCover + 0.5;
        float shift = (1.0 - uProgress) * 0.03;
        float r = texture2D(uTex, uv + vec2(shift, 0.0)).r;
        float g = texture2D(uTex, uv).g;
        float b = texture2D(uTex, uv - vec2(shift, 0.0)).b;
        vec3 cor = vec3(r, g, b) * 0.5;
        gl_FragColor = vec4(cor, uProgress);
        #include <colorspace_fragment>
    }
`;

export default function Cena3D({ imagem, imagens, className }) {
    const mountRef = useRef(null);
    const apiRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
        camera.position.z = 10;

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envMap;

        // Luzes: laranja que segue o mouse + contraluz fria
        const luzMouse = new THREE.PointLight(0xf2600c, 80, 18, 1.6);
        luzMouse.position.set(2, 1, 4);
        scene.add(luzMouse);
        const contraluz = new THREE.DirectionalLight(0xf2600c, 2.5);
        contraluz.position.set(-4, 3, -5);
        scene.add(contraluz);

        // Letra gótica extrudada
        const grupo = new THREE.Group();
        scene.add(grupo);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x1c1916,
            metalness: 1,
            roughness: 0.3,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
        });
        let letra = null;
        // Fonte gótica convertida para o formato do Three.js (só letras A–Z / a–z)
        new FontLoader().load('/fonts/UnifrakturMaguntia.typeface.json', (font) => {
            const geo = new TextGeometry(LETRA, {
                font,
                size: 3,
                depth: 0.7,
                curveSegments: 16,
                bevelEnabled: true,
                bevelThickness: 0.08,
                bevelSize: 0.035,
                bevelSegments: 5,
            });
            geo.center();
            letra = new THREE.Mesh(geo, material);
            grupo.add(letra);
            gsap.from(letra.rotation, { y: -Math.PI, duration: 2.2, ease: 'power3.out' });
            gsap.from(letra.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 2.2, ease: 'power3.out' });
        });

        // Plano da imagem do projeto
        const texturas = new Map();
        const loader = new THREE.TextureLoader();
        const carregar = (url) => {
            if (!texturas.has(url)) {
                const tex = loader.load(url, () => atualizarCover());
                tex.colorSpace = THREE.SRGBColorSpace;
                texturas.set(url, tex);
            }
            return texturas.get(url);
        };
        for (const url of imagens ?? []) carregar(url);

        const uniforms = {
            uTex: { value: null },
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uCover: { value: new THREE.Vector2(1, 1) },
        };
        const plano = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 48, 48),
            new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
                depthWrite: false,
            }),
        );
        plano.position.z = -3;
        plano.renderOrder = -1;
        scene.add(plano);

        // Ajusta a proporção da imagem ao tamanho do plano (efeito "cover")
        const atualizarCover = () => {
            const img = uniforms.uTex.value?.image;
            if (!img?.width) return;
            const planoAspect = plano.scale.x / plano.scale.y;
            const imgAspect = img.width / img.height;
            uniforms.uCover.value.set(
                planoAspect < imgAspect ? planoAspect / imgAspect : 1,
                planoAspect < imgAspect ? 1 : imgAspect / planoAspect,
            );
        };

        // Layout responsivo: letra à direita no desktop, centralizada no celular
        let base = { x: 0, y: 0, escala: 1 };
        const resize = () => {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
            const visW = visH * camera.aspect;
            const celular = camera.aspect < 0.9;
            base = celular
                ? { x: 0, y: visH * 0.18, escala: Math.min(1, visW / 4.2) }
                : { x: visW * 0.2, y: visH * 0.1, escala: 1.15 };

            // Plano a z=-3 fica mais longe da câmera: compensa o tamanho
            const fator = (camera.position.z + 3) / camera.position.z;
            if (celular) {
                plano.scale.set(visW * fator * 0.9, visH * fator * 0.42, 1);
                plano.position.y = visH * fator * 0.18;
            } else {
                plano.scale.set(visW * fator * 0.5, visH * fator * 0.62, 1);
                plano.position.y = visH * fator * 0.1;
            }
            atualizarCover();
        };
        resize();
        window.addEventListener('resize', resize);

        const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
        const onMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener('pointermove', onMove);

        const clock = new THREE.Clock();
        renderer.setAnimationLoop(() => {
            const t = clock.getElapsedTime();
            mouse.sx += (mouse.x - mouse.sx) * 0.05;
            mouse.sy += (mouse.y - mouse.sy) * 0.05;
            const rolagem = Math.min(window.scrollY / window.innerHeight, 1.5);

            grupo.position.set(base.x, base.y + rolagem * 5, 0);
            grupo.scale.setScalar(base.escala);
            if (!reduzMovimento) {
                grupo.rotation.y = Math.sin(t * 0.35) * 0.45 + mouse.sx * 0.5;
                grupo.rotation.x = Math.sin(t * 0.25) * 0.08 - mouse.sy * 0.25;
                grupo.position.y += Math.sin(t * 0.8) * 0.08;
            }

            luzMouse.position.set(mouse.sx * 6, mouse.sy * 4, 4);
            plano.rotation.y = mouse.sx * 0.12;
            plano.rotation.x = -mouse.sy * 0.08;
            uniforms.uTime.value = t;

            renderer.render(scene, camera);
        });

        apiRef.current = {
            mostrar(url) {
                uniforms.uTex.value = carregar(url);
                atualizarCover();
                gsap.fromTo(
                    uniforms.uProgress,
                    { value: Math.min(uniforms.uProgress.value, 0.4) },
                    { value: 1, duration: 1, ease: 'power3.out', overwrite: true },
                );
            },
            esconder() {
                gsap.to(uniforms.uProgress, { value: 0, duration: 0.5, ease: 'power2.out', overwrite: true });
            },
        };

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            gsap.killTweensOf(uniforms.uProgress);
            for (const tex of texturas.values()) tex.dispose();
            letra?.geometry.dispose();
            material.dispose();
            plano.geometry.dispose();
            plano.material.dispose();
            envMap.dispose();
            pmrem.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
            apiRef.current = null;
        };
    }, [imagens]);

    useEffect(() => {
        if (imagem) apiRef.current?.mostrar(imagem);
        else apiRef.current?.esconder();
    }, [imagem]);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
}
