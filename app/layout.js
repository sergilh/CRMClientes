'use client';
import './globals.css';
import 'normalize.css';
import Sidebar from './components/Sidebar';
import { usePathname } from 'next/navigation';
import { ApolloProvider } from '@apollo/client';
import PedidoState from '@/context/pedidos/PedidoState';
import client from '../.config/apollo';
import Header from './components/Header';

export default function RootLayout({ children }) {
    const pathName = usePathname();
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
