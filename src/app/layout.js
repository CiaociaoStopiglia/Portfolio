import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { EB_Garamond, IBM_Plex_Mono, UnifrakturMaguntia } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const medieval = UnifrakturMaguntia({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-medieval',
});

const serif = EB_Garamond({
    weight: ['400', '500'],
    style: ['normal', 'italic'],
    subsets: ['latin'],
    variable: '--font-serif',
});

const mono = IBM_Plex_Mono({
    weight: ['400', '500'],
    subsets: ['latin'],
    variable: '--font-mono',
});

export const metadata = {
    title: 'Stopiglia — Portfólio',
    description: 'Portfólio de design de João Stopiglia',
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR" className={`${medieval.variable} ${serif.variable} ${mono.variable}`}>
            <body className="min-h-screen antialiased">
                <AntdRegistry>{children}</AntdRegistry>
                <Toaster />
            </body>
        </html>
    );
}
