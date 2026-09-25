'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONFIG, LINKS, LOCALIZACAO } from '@/data/projetos';
import styles from './Cantos.module.css';

// Relógio de São Paulo
function Relogio() {
    const [time, setTime] = useState({ hours: '--', minutes: '--' });

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            timeZone: CONFIG.timeZone,
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
        const interval = setInterval(updateTime, CONFIG.timeUpdateInterval);
        return () => clearInterval(interval);
    }, []);

    return (
        <time>
            {time.hours}
            <span className={styles.timeBlink}>:</span>
            {time.minutes} SP
        </time>
    );
}

// Barra fixa no topo: nome e links
export default function Cantos() {
    return (
        <header className={styles.topo}>
            <Link href="/" className={styles.marca}>
                <span className={styles.cornerSquare} aria-hidden="true" />
                <span className={styles.nome}>stopiglia</span>
            </Link>
            <nav className={styles.nav}>
                {LINKS.map((link) =>
                    link.href.startsWith('/') ? (
                        <Link key={link.nome} href={link.href}>
                            {link.nome}
                        </Link>
                    ) : (
                        <a key={link.nome} href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.nome}
                        </a>
                    ),
                )}
            </nav>
        </header>
    );
}

// Rodapé: coordenadas, assinatura e hora
export function Rodape() {
    return (
        <footer className={styles.rodape}>
            <span>{LOCALIZACAO}</span>
            <span className={styles.assinatura}>© {new Date().getFullYear()} João Stopiglia</span>
            <Relogio />
        </footer>
    );
}
