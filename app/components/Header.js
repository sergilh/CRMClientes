'use client';
import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client';

const OBTENER_USUARIO = gql`
    query Query {
        obtenerUsuario {
            apellido
            id
            nombre
        }
    }
`;

const Header = () => {
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    const router = useRouter();
    const client = useApolloClient();

    useEffect(() => {
        if (!loading && !data?.obtenerUsuario) {
            router.replace('/login');
        }
    }, [loading, router, data]);

    //Proteger que no se acceda a data antes de tener resultados
    if (loading) return null;

    if (!data || !data?.obtenerUsuario) return null;

    const { nombre, apellido } = data.obtenerUsuario;

    const cerrarSesion = async () => {
        localStorage.removeItem('token');
        await client.clearStore();
        router.push('/login');
    };

    return (
        <div className='sm:flex py-4 px-4 bg-gray-300 justify-between mb-6 pb-3 border-b-4 border-gray-800'>
            <p className='mr-2 mb-4 lg:mb-0 text-xl'>
                Hola: {nombre} {apellido}
            </p>

            <button
                onClick={() => cerrarSesion()}
                type='button'
                className=' w-full sm:w-auto bg-blue-800 py-2 px-5 mt-3 inline-block text-white  rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold cursor-pointer'>
                Cerrar sesión
            </button>
        </div>
    );
};

export default Header;
