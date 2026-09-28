'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Cantos, { Rodape } from './Cantos';
import styles from './Projeto.module.css';

gsap.registerPlugin(ScrollTrigger);

const dois = (n) => String(n).padStart(2, '0');

export default function Projeto({ projeto, proximo, numero, total }) {
    const rootRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Título sobe palavra por palavra, como na home
            gsap.from('[data-linha]', {
                yPercent: 110,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.1,
                delay: 0.15,
            });
            gsap.from('[data-ficha] > div', {
                opacity: 0,
                y: 10,
                duration: 0.8,
                stagger: 0.07,
                delay: 0.6,
                ease: 'power2.out',
            });

            // Capa abre de baixo pra cima e depois faz parallax na rolagem
            gsap.fromTo(
                '[data-capa]',
                { clipPath: 'inset(100% 0% 0% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut', delay: 0.4 },
            );
            gsap.fromTo(
                '[data-capa] img',
                { scale: 1.25 },
                { scale: 1.15, duration: 1.8, ease: 'power3.out', delay: 0.4 },
            );
            gsap.to('[data-capa] img', {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: { trigger: '[data-capa]', start: 'top top', end: 'bottom top', scrub: true },
            });

            gsap.from('[data-texto]', {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: { trigger: '[data-texto]', start: 'top 85%' },
            });

            // Galeria: cada imagem abre ao entrar na tela
            gsap.utils.toArray('[data-figura]').forEach((fig) => {
                const img = fig.querySelector('img');
                const tl = gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 85%' } });
                tl.fromTo(
                    fig,
                    { clipPath: 'inset(100% 0% 0% 0%)' },
                    { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'power4.inOut' },
                ).fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
            });
        }, rootRef);

        return () => ctx.revert();
    }, []);

    const ficha = [
        ['Cliente', projeto.cliente],
        ['Disciplina', projeto.categoria],
        ['Formato', projeto.tipo],
        ['Ano', projeto.ano],
    ];

    return (
        <div ref={rootRef} className={styles.page}>
            <Cantos />

            <header className={styles.intro}>
                <div className={styles.topoIntro}>
                    <span>
                        Projeto {dois(numero)} de {dois(total)}
                    </span>
                    <Link href="/" className={styles.voltar}>
                        ← Índice
                    </Link>
                </div>
                <h1 className={styles.titulo}>
                    {projeto.titulo.split(' ').map((palavra) => (
                        <span key={palavra} className={styles.mascara}>
                            <span data-linha>{palavra}</span>
                        </span>
                    ))}
                </h1>
                <dl data-ficha className={styles.ficha}>
                    {ficha.map(([rotulo, valor]) => (
                        <div key={rotulo}>
                            <dt>{rotulo}</dt>
                            <dd>{valor}</dd>
                        </div>
                    ))}
                </dl>
            </header>

            <figure data-capa className={styles.capa}>
                {/* biome-ignore lint/performance/noImgElement: imagens trocadas pelo usuário */}
                <img src={projeto.imagem} alt={projeto.titulo} />
            </figure>

            <section className={styles.texto}>
                <h2 className={styles.rotulo}>Sobre o projeto</h2>
                <p data-texto className={styles.descricao}>
                    {projeto.descricao}
                </p>
            </section>

            <section className={styles.galeria}>
                {projeto.galeria?.map((src, i) => (
                    <figure key={src} className={`${styles.figura} ${i % 3 === 0 ? styles.larga : ''}`}>
                        <div data-figura className={styles.moldura}>
                            {/* biome-ignore lint/performance/noImgElement: imagens trocadas pelo usuário */}
                            <img src={src} alt={`${projeto.titulo}, imagem ${i + 1}`} loading="lazy" />
                        </div>
                        <figcaption>
                            {dois(i + 1)} / {dois(projeto.galeria.length)}
                        </figcaption>
                    </figure>
                ))}
            </section>

            <Link
                href={`/projetos/${proximo.slug}`}
                className={styles.proximo}>
                <div
                    className={styles.proximoFundo}
                    style={{ backgroundImage: `url(${proximo.imagem})` }}
                    aria-hidden="true"
                />
                <span className={styles.proximoRotulo}>Próximo projeto</span>
                <span className={styles.proximoTitulo}>
                    {proximo.titulo}
                </span>
            </Link>

            <Rodape />
        </div>
    );
}
