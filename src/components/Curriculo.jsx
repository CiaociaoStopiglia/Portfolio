'use client';

import { Dithering } from '@paper-design/shaders-react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LOCALIZACAO } from '@/data/projetos';
import styles from './Curriculo.module.css';

// Edite aqui seu texto, experiências e links
const BIO =
    'Designer gráfico em São Paulo. Trabalho com identidade visual, editorial e interfaces, sempre partindo da tipografia. Troque este parágrafo por uma apresentação sua.';

const EXPERIENCIAS = [
    { empresa: 'Empresa', cargo: 'Estágio', periodo: '2025 — atual' },
    { empresa: 'Empresa', cargo: 'Freelancer', periodo: '2024 — 2025' },
    { empresa: 'Escola', cargo: 'Design', periodo: '2023 — 2026' },
    { empresa: 'Outros', cargo: 'Projetos pessoais', periodo: '2020 — 2023' },
];

const LINKS = [
    { nome: 'Projetos', href: '/' },
    { nome: 'Behance', href: 'https://www.behance.net/joaostopiglia' },
    { nome: 'Instagram', href: 'https://www.instagram.com/joao_stopiglia/' },
    { nome: 'Email', href: 'mailto:joao.stopiglia4@gmail.com' },
];

export default function Curriculo() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const rootRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('[data-linha]', {
                yPercent: 110,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.1,
                delay: 0.15,
            });
            gsap.from('[data-bloco]', {
                opacity: 0,
                y: 16,
                duration: 0.9,
                stagger: 0.12,
                delay: 0.5,
                ease: 'power2.out',
            });
        }, rootRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={rootRef} className={styles.page} data-tema={isDarkMode ? 'escuro' : 'claro'}>
            <div className={styles.painel}>
                <div className={styles.topo}>
                    <Link href="/" className={styles.marca}>
                        stopiglia
                    </Link>
                    <button
                        type="button"
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={styles.tema}
                        aria-label="Alternar tema">
                        {isDarkMode ? 'Claro' : 'Escuro'}
                    </button>
                </div>

                <h1 className={styles.nome}>
                    {['João', 'Stopiglia'].map((palavra) => (
                        <span key={palavra} className={styles.mascara}>
                            <span data-linha>{palavra}</span>
                        </span>
                    ))}
                </h1>

                <p data-bloco className={styles.bio}>
                    {BIO}
                </p>

                <section data-bloco className={styles.bloco}>
                    <h2 className={styles.rotulo}>Experiência</h2>
                    <ul className={styles.lista}>
                        {EXPERIENCIAS.map((exp) => (
                            <li key={exp.periodo}>
                                <span className={styles.periodo}>{exp.periodo}</span>
                                <span className={styles.empresa}>{exp.empresa}</span>
                                <span className={styles.cargo}>{exp.cargo}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                <section data-bloco className={styles.bloco}>
                    <h2 className={styles.rotulo}>Contato</h2>
                    <nav className={styles.links}>
                        {LINKS.map((link) =>
                            link.href.startsWith('/') ? (
                                <Link key={link.nome} href={link.href}>
                                    {link.nome}
                                </Link>
                            ) : (
                                <a key={link.nome} href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.nome} ↗
                                </a>
                            ),
                        )}
                    </nav>
                </section>

                <p className={styles.rodape}>{LOCALIZACAO}</p>
            </div>

            <div className={styles.shader}>
                <Dithering
                    style={{ position: 'absolute', inset: 0 }}
                    colorBack={isDarkMode ? '#0b0a09' : '#ece6da'}
                    colorFront="#f2600c"
                    shape="swirl"
                    type="4x4"
                    size={3}
                    scale={0.8}
                    speed={0.1}
                />
            </div>
        </div>
    );
}
