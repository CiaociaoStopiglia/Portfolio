import Portfolio from '@/components/Portfolio';
import { CONFIG, FRASE, PROJETOS } from '@/data/projetos';

export default function Home() {
    return <Portfolio projetos={PROJETOS} config={CONFIG} frase={FRASE} />;
}
