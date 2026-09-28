import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Inter, Inter_Tight, UnifrakturMaguntia } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const medieval = UnifrakturMaguntia({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-medieval',
});

const display = Inter_Tight({
    subsets: ['latin'],
    variable: '--font-display',
});

const sans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata = {
    title: 'Stopiglia — Portfólio',
    description: 'Portfólio de design de João Stopiglia',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" className={`${display.variable} ${medieval.variable} ${sans.variable}`}>
            <body className="min-h-screen antialiased">
                <AntdRegistry>{children}</AntdRegistry>
                <Toaster />
            </body>
        </html>
    );
}
