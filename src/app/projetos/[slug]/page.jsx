import { notFound } from 'next/navigation';
import Projeto from '@/components/Projeto';
import { PROJETOS } from '@/data/projetos';

export function generateStaticParams() {
    return PROJETOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const projeto = PROJETOS.find((p) => p.slug === slug);
    return { title: projeto ? `Stopiglia — ${projeto.titulo}` : 'Stopiglia' };
}

export default async function PaginaProjeto({ params }) {
    const { slug } = await params;
    const index = PROJETOS.findIndex((p) => p.slug === slug);
    if (index === -1) notFound();

    const projeto = PROJETOS[index];
    const proximo = PROJETOS[(index + 1) % PROJETOS.length];

    return <Projeto projeto={projeto} proximo={proximo} numero={index + 1} total={PROJETOS.length} />;
}
