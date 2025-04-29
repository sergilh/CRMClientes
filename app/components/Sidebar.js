'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
    const router = useRouter();
    const pathName = usePathname();
    return (
        <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
            <div>
                <p className='text-white text-5xl font-bold'>CRM Clientes</p>
            </div>

            <nav className='mt-5 list-none text-center'>
                <li
                    className={
                        pathName === '/'
                            ? 'bg-blue-800 p-2 hover:transition duration-400'
                            : 'p-2'
                    }>
                    <Link
                        className='text-white mb-3 mt-2 block text-2xl'
                        href='/'>
                        Clientes
                    </Link>
                </li>
                <li
                    className={
                        pathName === '/pedidos'
                            ? 'bg-blue-800 p-2 hover:transition duration-400'
                            : 'p-2'
                    }>
                    <Link
                        className='text-white mb-3 mt-2 block text-2xl'
                        href='/pedidos'>
                        Pedidos
                    </Link>
                </li>
                <li
                    className={
                        pathName === '/productos'
                            ? 'bg-blue-800  p-2 hover:transition duration-400'
                            : 'p-2'
                    }>
                    <Link
                        className='text-white mb-3 mt-2 block text-2xl'
                        href='/productos'>
                        Productos
                    </Link>
                </li>
            </nav>
            <div className='sm mt-10'>
                <p className='text-white text-5xl font-bold'>Opciones</p>
            </div>
            <nav className='mt-5 list-none text-center'>
                <li
                    className={
                        pathName === '/bestsellers'
                            ? 'bg-blue-800 p-2 hover:transition duration-400'
                            : 'p-2'
                    }>
                    <Link
                        className='text-white mb-3 mt-2 block text-2xl'
                        href='/bestsellers'>
                        Mejores Vendedores
                    </Link>
                </li>
                <li
                    className={
                        pathName === '/bestclients'
                            ? 'bg-blue-800 p-2 hover:transition duration-400'
                            : 'p-2'
                    }>
                    <Link
                        className='text-white mb-3 mt-2 block text-2xl'
                        href='/bestclients'>
                        Mejores Clientes
                    </Link>
                </li>
            </nav>
        </aside>
    );
};

export default Sidebar;
