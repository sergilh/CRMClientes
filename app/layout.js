'use client';
import './globals.css';
import 'normalize.css';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { usePathname } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import PedidoState from '@/context/pedidos/PedidoState';
import client from '../.config/apollo';
import Header from './components/Header';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
    const pathName = usePathname();
    const router = useRouter();

    // Verificar si el usuario tiene un token (o está autenticado)

    // Si no hay token y la ruta no es de login o registro, redirige a login
    const token = localStorage.getItem('authToken'); // O cómo lo estés guardando
    useEffect(() => {
        if (!token && pathName !== '/login' && pathName !== '/register') {
            router.push('/login');
        }
    }, [token]);
    return (
        <html lang='es'>
            <head>
                <title>CRM-ADMIN</title>
            </head>
            <body>
                <ApolloProvider client={client}>
                    <PedidoState>
                        {pathName === '/login' || pathName === '/register' ? (
                            <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
                                <div>{children}</div>
                            </div>
                        ) : (
                            <div className='bg-gray-200 min-h-screen'>
                                <div className='sm:flex min-h-scren'>
                                    <Sidebar />
                                    <main className='sm:w-2/3 xl:w-4/5 sm: min-h-screen '>
                                        <Header />
                                        {children}
                                    </main>
                                </div>
                            </div>
                        )}
                    </PedidoState>
                </ApolloProvider>
            </body>
        </html>
    );
}
