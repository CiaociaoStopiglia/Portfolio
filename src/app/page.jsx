import Portfolio from '@/components/Portfolio';
import { FRASE, PROJETOS } from '@/data/projetos';

export default function Home() {
    return <Portfolio projetos={PROJETOS} frase={FRASE} />;
}
