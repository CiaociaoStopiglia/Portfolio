// Edite aqui seus projetos. Para trocar as fotos, substitua os arquivos em /public/projetos
// (ou aponte "imagem" para outro caminho/URL).
// "slug" é o endereço da página do projeto: /projetos/<slug>
// "galeria" são as imagens da página do projeto (1ª e 4ª largas, 2ª e 3ª verticais).
export const PROJETOS = [
    {
        id: 1,
        titulo: 'PROJETO UM',
        cliente: 'CLIENTE A',
        categoria: 'IDENTIDADE VISUAL',
        tipo: 'BRANDING',
        ano: '2026',
        imagem: '/projetos/projeto-1.jpg',
        slug: 'projeto-um',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-1-1.jpg',
            '/projetos/projeto-1-2.jpg',
            '/projetos/projeto-1-3.jpg',
            '/projetos/projeto-1-4.jpg',
        ],
    },
    {
        id: 2,
        titulo: 'PROJETO DOIS',
        cliente: 'CLIENTE B',
        categoria: 'EDITORIAL',
        tipo: 'REVISTA',
        ano: '2026',
        imagem: '/projetos/projeto-2.jpg',
        slug: 'projeto-dois',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-2-1.jpg',
            '/projetos/projeto-2-2.jpg',
            '/projetos/projeto-2-3.jpg',
            '/projetos/projeto-2-4.jpg',
        ],
    },
    {
        id: 3,
        titulo: 'PROJETO TRÊS',
        cliente: 'CLIENTE C',
        categoria: 'UI / UX',
        tipo: 'APLICATIVO',
        ano: '2025',
        imagem: '/projetos/projeto-3.jpg',
        slug: 'projeto-tres',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-3-1.jpg',
            '/projetos/projeto-3-2.jpg',
            '/projetos/projeto-3-3.jpg',
            '/projetos/projeto-3-4.jpg',
        ],
    },
    {
        id: 4,
        titulo: 'PROJETO QUATRO',
        cliente: 'PESSOAL',
        categoria: 'TIPOGRAFIA',
        tipo: 'EXPERIMENTO',
        ano: '2025',
        imagem: '/projetos/projeto-4.jpg',
        slug: 'projeto-quatro',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-4-1.jpg',
            '/projetos/projeto-4-2.jpg',
            '/projetos/projeto-4-3.jpg',
            '/projetos/projeto-4-4.jpg',
        ],
    },
    {
        id: 5,
        titulo: 'PROJETO CINCO',
        cliente: 'CLIENTE D',
        categoria: 'EMBALAGEM',
        tipo: 'PRODUTO',
        ano: '2024',
        imagem: '/projetos/projeto-5.jpg',
        slug: 'projeto-cinco',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-5-1.jpg',
            '/projetos/projeto-5-2.jpg',
            '/projetos/projeto-5-3.jpg',
            '/projetos/projeto-5-4.jpg',
        ],
    },
    {
        id: 6,
        titulo: 'PROJETO SEIS',
        cliente: 'CLIENTE E',
        categoria: 'WEB DESIGN',
        tipo: 'SITE',
        ano: '2024',
        imagem: '/projetos/projeto-6.jpg',
        slug: 'projeto-seis',
        descricao:
            'Descrição do projeto: o desafio, o processo e o resultado. Troque este texto por um resumo de dois ou três parágrafos contando o que você fez.',
        galeria: [
            '/projetos/projeto-6-1.jpg',
            '/projetos/projeto-6-2.jpg',
            '/projetos/projeto-6-3.jpg',
            '/projetos/projeto-6-4.jpg',
        ],
    },
];

export const CONFIG = {
    timeZone: 'America/Sao_Paulo',
    timeUpdateInterval: 1000,
    idleDelay: 4000,
};

export const LINKS = [
    { nome: 'Sobre', href: '/sobre' },
    { nome: 'Behance', href: 'https://www.behance.net/joaostopiglia' },
    { nome: 'Instagram', href: 'https://www.instagram.com/joao_stopiglia/' },
    { nome: 'Email', href: 'mailto:joao.stopiglia4@gmail.com' },
];

export const LOCALIZACAO = '23.5505° S, 46.6333° W';

export const FRASE = {
    texto: 'Menos, porém melhor.',
    autor: 'Dieter Rams',
};
