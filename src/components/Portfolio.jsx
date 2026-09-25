'use client';

import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Portfolio.module.css';

gsap.registerPlugin(ScrambleTextPlugin);

const CAMPOS = ['titulo', 'cliente', 'categoria', 'tipo', 'ano'];

// Relógio no canto inferior direito
function TimeDisplay({ config }) {
    const [time, setTime] = useState({ hours: '', minutes: '', dayPeriod: '' });

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            timeZone: config.timeZone,
            hour: '2-digit',
            minute: '2-digit',
        });
        const updateTime = () => {
            const parts = formatter.formatToParts(new Date());
            setTime({
                hours: parts.find((p) => p.type === 'hour')?.value || '',
                minutes: parts.find((p) => p.type === 'minute')?.value || '',
            });
        };

        updateTime();
        const interval = setInterval(updateTime, config.timeUpdateInterval);
        return () => clearInterval(interval);
    }, [config.timeZone, config.timeUpdateInterval]);

    return (
        <time className={`${styles.cornerItem} ${styles.bottomRight}`}>
            {time.hours}
            <span className={styles.timeBlink}>:</span>
            {time.minutes}
        </time>
    );
}

// Linha de projeto
function ProjectItem({ project, index, onActivate, isActive, ref }) {
    const textRefs = useRef({});

    useEffect(() => {
        CAMPOS.forEach((key) => {
            const el = textRefs.current[key];
            if (!el) return;
            gsap.killTweensOf(el);
            if (isActive) {
                gsap.to(el, {
                    duration: 0.8,
                    scrambleText: {
                        text: project[key],
                        chars: 'ᚠᚢᚦᚨᚱᚲ✠†‡§¶01',
                        revealDelay: 0.3,
                        speed: 0.4,
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
            onMouseEnter={() => onActivate(index, project.imagem)}>
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
        </li>
    );
}

export default function Portfolio({ projetos = [], config = {}, links = [], localizacao = '', frase }) {
    const [activeIndex, setActiveIndex] = useState(-1);

    const backgroundRef = useRef(null);
    const idleTimerRef = useRef(null);
    const idleAnimationRef = useRef(null);
    const projectItemsRef = useRef([]);

    // Pré-carrega as imagens
    useEffect(() => {
        projetos.forEach((p) => {
            if (p.imagem) {
                const img = new Image();
                img.src = p.imagem;
            }
        });
    }, [projetos]);

    const startIdleAnimation = useCallback(() => {
        if (idleAnimationRef.current) return;
        const items = projectItemsRef.current.filter(Boolean);
        const timeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        items.forEach((item, i) => {
            const hideTime = i * 0.05;
            const showTime = items.length * 0.05 * 0.5 + i * 0.05;
            timeline.to(item, { opacity: 0.05, duration: 0.1, ease: 'power2.inOut' }, hideTime);
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
        (index, imageUrl) => {
            stopIdleAnimation();
            stopIdleTimer();
            if (activeIndex === index) return;
            setActiveIndex(index);

            const bg = backgroundRef.current;
            if (imageUrl && bg) {
                bg.style.transition = 'none';
                bg.style.transform = 'scale(1.2)';
                bg.style.backgroundImage = `url(${imageUrl})`;
                bg.style.opacity = '1';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bg.style.transition =
                            'opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                        bg.style.transform = 'scale(1)';
                    });
                });
            }
        },
        [activeIndex, stopIdleAnimation, stopIdleTimer],
    );

    const handleContainerMouseLeave = useCallback(() => {
        setActiveIndex(-1);
        if (backgroundRef.current) backgroundRef.current.style.opacity = '0';
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
        <div className={`${styles.container} ${activeIndex !== -1 ? styles.hasActive : ''}`}>
            <div ref={backgroundRef} className={styles.backgroundImage} aria-hidden="true" />

            <header className={styles.hero}>
                <h1 className={styles.frase}>{frase?.texto}</h1>
                {frase?.autor && <p className={styles.autor}>— {frase.autor}</p>}
            </header>

            <main className={styles.portfolio} onMouseLeave={handleContainerMouseLeave}>
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

            <aside>
                <div className={`${styles.cornerItem} ${styles.topLeft}`}>
                    <div className={styles.cornerSquare} aria-hidden="true" />
                    <span className={styles.nome}>Stopiglia</span>
                </div>
                <nav className={`${styles.cornerItem} ${styles.topRight}`}>
                    {links.map((link, i) => (
                        <span key={link.nome}>
                            {i > 0 && ' | '}
                            {link.href.startsWith('/') ? (
                                <Link href={link.href}>{link.nome}</Link>
                            ) : (
                                <a href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.nome}
                                </a>
                            )}
                        </span>
                    ))}
                </nav>
                <div className={`${styles.cornerItem} ${styles.bottomLeft}`}>{localizacao}</div>
                <TimeDisplay config={config} />
            </aside>
        </div>
    );
}
