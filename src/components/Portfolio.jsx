'use client';

import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Cantos, { Rodape } from './Cantos';
import Cena3D from './Cena3D';
import styles from './Portfolio.module.css';

gsap.registerPlugin(ScrambleTextPlugin);

const CAMPOS = ['cliente', 'categoria', 'ano'];

// Linha do índice de projetos
function ProjectItem({ project, index, onActivate, isActive, ref }) {
    const textRefs = useRef({});

    useEffect(() => {
        CAMPOS.forEach((key) => {
            const el = textRefs.current[key];
            if (!el) return;
            gsap.killTweensOf(el);
            if (isActive) {
                gsap.to(el, {
                    duration: 0.7,
                    scrambleText: {
                        text: project[key],
                        chars: 'upperCase',
                        revealDelay: 0.2,
                        speed: 0.5,
                    },
                });
            } else {
                el.textContent = project[key];
            }
        });
    }, [isActive, project]);

    return (
        <li
            ref={ref}
            className={`${styles.projectItem} ${isActive ? styles.active : ''}`}
            onMouseEnter={() => onActivate(index)}>
            <Link href={`/projetos/${project.slug}`} className={styles.projectLink}>
                <span className={styles.numero}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.titulo}>{project.titulo}</span>
                {CAMPOS.map((key) => (
                    <span
                        key={key}
                        ref={(el) => {
                            textRefs.current[key] = el;
                        }}
                        className={`${styles.projectData} ${styles[key]}`}>
                        {project[key]}
                    </span>
                ))}
                <span className={styles.seta} aria-hidden="true">
                    →
                </span>
            </Link>
        </li>
    );
}

export default function Portfolio({ projetos = [], config = {}, frase }) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const imagens = useMemo(() => projetos.map((p) => p.imagem), [projetos]);

    const rootRef = useRef(null);
    const idleTimerRef = useRef(null);
    const idleAnimationRef = useRef(null);
    const projectItemsRef = useRef([]);

    // Entrada: a frase sobe palavra por palavra e o índice aparece em sequência
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('[data-linha]', {
                yPercent: 110,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.1,
                delay: 0.3,
            });
            gsap.from('[data-fade]', { opacity: 0, duration: 1, delay: 0.9 });
            gsap.from(projectItemsRef.current.filter(Boolean), {
                opacity: 0,
                y: 12,
                duration: 0.6,
                stagger: 0.06,
                delay: 1,
                ease: 'power2.out',
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    // Piscada do índice quando ninguém mexe (do componente original)
    const startIdleAnimation = useCallback(() => {
        if (idleAnimationRef.current) return;
        const items = projectItemsRef.current.filter(Boolean);
        const timeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });

        items.forEach((item, i) => {
            const hideTime = i * 0.05;
            const showTime = items.length * 0.05 * 0.5 + i * 0.05;
            timeline.to(item, { opacity: 0.1, duration: 0.1, ease: 'power2.inOut' }, hideTime);
            timeline.to(item, { opacity: 1, duration: 0.1, ease: 'power2.inOut' }, showTime);
        });

        idleAnimationRef.current = timeline;
    }, []);

    const stopIdleAnimation = useCallback(() => {
        if (!idleAnimationRef.current) return;
        idleAnimationRef.current.kill();
        idleAnimationRef.current = null;
        projectItemsRef.current.forEach((item) => {
            if (item) gsap.set(item, { opacity: 1 });
        });
    }, []);

    const stopIdleTimer = useCallback(() => {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
    }, []);

    const startIdleTimer = useCallback(() => {
        stopIdleTimer();
        idleTimerRef.current = setTimeout(startIdleAnimation, config.idleDelay);
    }, [config.idleDelay, startIdleAnimation, stopIdleTimer]);

    const handleActivate = useCallback(
        (index) => {
            stopIdleAnimation();
            stopIdleTimer();
            setActiveIndex(index);
        },
        [stopIdleAnimation, stopIdleTimer],
    );

    const handleListLeave = useCallback(() => {
        setActiveIndex(-1);
        startIdleTimer();
    }, [startIdleTimer]);

    useEffect(() => {
        startIdleTimer();
        return () => {
            stopIdleTimer();
            stopIdleAnimation();
        };
    }, [startIdleTimer, stopIdleTimer, stopIdleAnimation]);

    return (
        <div
            ref={rootRef}
            className={`${styles.container} ${activeIndex !== -1 ? styles.hasActive : ''}`}>
            <Cena3D
                className={styles.cena}
                imagens={imagens}
                imagem={projetos[activeIndex]?.imagem ?? null}
            />
            <Cantos />

            <section className={styles.hero}>
                <p className={styles.apresentacao} data-fade>
                    João Stopiglia, designer gráfico em São Paulo. Identidade visual, editorial e
                    interfaces.
                </p>
                <h1 className={styles.frase}>
                    {frase?.texto.split(' ').map((palavra) => (
                        <span key={palavra} className={styles.mascara}>
                            <span data-linha>{palavra}</span>
                        </span>
                    ))}
                </h1>
                {frase?.autor && (
                    <p className={styles.autor} data-fade>
                        {frase.autor}
                    </p>
                )}
            </section>

            <main className={styles.indice} onMouseLeave={handleListLeave}>
                <div className={styles.cabecalho} aria-hidden="true">
                    <span>Nº</span>
                    <span>Projeto</span>
                    <span className={styles.cliente}>Cliente</span>
                    <span className={styles.categoria}>Disciplina</span>
                    <span className={styles.ano}>Ano</span>
                    <span />
                </div>
                <ul className={styles.projectList}>
                    {projetos.map((project, index) => (
                        <ProjectItem
                            key={project.id}
                            project={project}
                            index={index}
                            onActivate={handleActivate}
                            isActive={activeIndex === index}
                            ref={(el) => {
                                projectItemsRef.current[index] = el;
                            }}
                        />
                    ))}
                </ul>
            </main>

            <Rodape />
        </div>
    );
}
