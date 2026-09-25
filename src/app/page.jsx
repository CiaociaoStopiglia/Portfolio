import Portfolio from '@/components/Portfolio';
import { CONFIG, FRASE, LINKS, LOCALIZACAO, PROJETOS } from '@/data/projetos';

export default function Home() {
    return (
        <Portfolio
            projetos={PROJETOS}
            config={CONFIG}
            links={LINKS}
            localizacao={LOCALIZACAO}
            frase={FRASE}
        />
    );
}
