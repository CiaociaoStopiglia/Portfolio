'use client';

import { Dithering } from '@paper-design/shaders-react';
import Link from 'next/link';
import { useState } from 'react';

// Edite aqui suas experiências e links
const EXPERIENCIAS = [
    { empresa: 'Empresa', cargo: 'Estágio', periodo: '2025 → ....' },
    { empresa: 'Empresa', cargo: 'Freelancer', periodo: '2024 → 2025' },
    { empresa: 'Escola', cargo: 'Design', periodo: '2023 → 2026' },
    { empresa: 'Outros', cargo: '', periodo: '2020 → 2023' },
];

const LINKS = [
    { nome: 'Projetos', href: '/' },
    { nome: 'Behance', href: 'https://www.behance.net/seu-usuario' },
    { nome: 'Instagram', href: 'https://www.instagram.com/seu-usuario' },
    { nome: 'Email', href: 'mailto:joao.stopiglia4@gmail.com' },
];

export default function Curriculo() {
    const [isDarkMode, setIsDarkMode] = useState(true);

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden md:flex-row">
            <div
                className={`relative z-10 flex min-h-[60vh] flex-col p-8 font-[family-name:var(--font-mono)] text-sm uppercase tracking-wide md:min-h-screen md:w-1/2 ${
                    isDarkMode ? 'bg-[#0b0a09] text-[#ece6da]' : 'bg-[#ece6da] text-[#0b0a09]'
                }`}>
                <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`absolute top-8 right-8 cursor-pointer rounded-full p-2 transition-colors ${
                        isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                    }`}
                    aria-label="Alternar tema">
                    {isDarkMode ? (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    ) : (
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Cabeçalho */}
                <header className="mb-12">
                    <Link
                        href="/"
                        className="mb-10 block font-[family-name:var(--font-medieval)] text-3xl normal-case tracking-normal">
                        Stopiglia
                    </Link>
                    <h1 className="font-[family-name:var(--font-medieval)] text-6xl normal-case leading-none tracking-normal md:text-7xl">
                        <span className="text-[#b3261e]">J</span>oão Stopiglia
                    </h1>
                    <p className="mt-4 opacity-60">Designer</p>
                </header>

                {/* Experiências */}
                <ul className="mb-16 space-y-1">
                    {EXPERIENCIAS.map((exp) => (
                        <li key={exp.periodo} className="grid grid-cols-[7rem_7rem_1fr] gap-2">
                            <span>{exp.empresa}</span>
                            <span className="opacity-60">{exp.cargo}</span>
                            <span>{exp.periodo}</span>
                        </li>
                    ))}
                </ul>

                {/* Links */}
                <nav className="mt-auto flex flex-wrap gap-x-4 gap-y-1">
                    {LINKS.map((link) => (
                        <Link
                            key={link.nome}
                            href={link.href}
                            className="transition-colors hover:text-[#b3261e]">
                            {link.nome}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="relative h-[40vh] md:h-auto md:w-1/2">
                <Dithering
                    style={{ position: 'absolute', inset: 0 }}
                    colorBack={isDarkMode ? '#0b0a09' : '#ece6da'}
                    colorFront={isDarkMode ? '#b3261e' : '#0b0a09'}
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
