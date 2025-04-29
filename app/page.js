'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Cliente from './components/Cliente';
import { gql, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';

const OBTENER_CLIENTES_USUARIO = gql`
    query Query {
        obtenerClientesVendedor {
            apellido
            email
            empresa
            nombre
            telefono
            id
        }
    }
`;

export default function Home() {
    const { data, loading } = useQuery(OBTENER_CLIENTES_USUARIO);
    const router = useRouter();

    if (loading) return 'Cargando...';
    if (!loading && !data.obtenerClientesVendedor) {
        router.replace('/login');
        return null;
    }

    return (
        <div className='px-4'>
            <h1 className='text-3xl text-gray-800 font-light p-2'>Clientes</h1>
            <Link href='/cliente'>
                <div className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center'>
                    Nuevo cliente <FontAwesomeIcon icon={faSquarePlus} />
                </div>
            </Link>
            <div className='overflow-x-scroll'>
                <table className='table-auto shadow-md mt-10 w-full '>
                    <thead className='bg-gray-800'>
                        <tr className='text-white'>
                            <th className='w-1/5 py-2'>Nombre</th>
                            <th className='w-1/5 py-2'>Empresa</th>
                            <th className='w-1/5 py-2'>Email</th>
                            <th className='w-1/5 py-2'>Eliminar</th>
                            <th className='w-1/5 py-2'>Editar</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {data.obtenerClientesVendedor.map((cliente) => (
                            <Cliente key={cliente.id} cliente={cliente} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
