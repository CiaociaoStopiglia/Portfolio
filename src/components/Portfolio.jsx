'use client';

import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import Cantos, { Rodape } from './Cantos';
import Cena3D from './Cena3D';
import styles from './Portfolio.module.css';

const CAMPOS = ['cliente', 'categoria', 'ano'];

// Linha do índice de projetos
function ProjectItem({ project, index, onActivate, isActive, ref }) {
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

export default function Portfolio({ projetos = [], frase }) {
    const [activeIndex, setActiveIndex] = useState(-1);
    const imagens = useMemo(() => projetos.map((p) => p.imagem), [projetos]);

    const rootRef = useRef(null);
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


    return (
        <div
            ref={rootRef}
            className={`${styles.container} ${activeIndex !== -1 ? styles.hasActive : ''}`}>
            <div className={styles.fundo} aria-hidden="true">
                {imagens.map((src, i) => (
                    // biome-ignore lint/performance/noImgElement: imagens trocadas pelo usuário
                    <img key={src} src={src} alt="" className={i === activeIndex ? styles.visivel : ''} />
                ))}
            </div>
            <Cena3D className={styles.cena} />
            <Cantos />

            <section className={styles.hero}>
                <p className={styles.apresentacao} data-fade>
                    João Stopiglia, designer gráfico em São Paulo. Identidade visual, editorial e
                    interfaces.
                </p>
                <div>
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
                </div>
            </section>

            <main className={styles.indice} onMouseLeave={() => setActiveIndex(-1)}>
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
                            onActivate={setActiveIndex}
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
