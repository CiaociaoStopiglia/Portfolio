'use client';

import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

const LETRA = 'S';

export default function Cena3D({ className }) {
    const mountRef = useRef(null);

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
                : // centro vertical do bloco de texto do hero (padding 6rem em cima, 4rem embaixo)
                  { x: visW * 0.2, y: -(16 / h) * visH, escala: 1.15 };

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

            renderer.render(scene, camera);
        });

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onMove);
            letra?.geometry.dispose();
            material.dispose();
            envMap.dispose();
            pmrem.dispose();
            renderer.dispose();
            mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} className={className} aria-hidden="true" />;
}
