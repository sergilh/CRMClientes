'use client';
import React from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const ELIMINAR_CLIENTE = gql`
    mutation Mutation($eliminarClienteId: ID!) {
        eliminarCliente(id: $eliminarClienteId)
    }
`;

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

const Cliente = ({ cliente }) => {
    const router = useRouter();
    const { nombre, apellido, empresa, email, id } = cliente;
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE, {
        update(cache) {
            //Obtenemos el objeto de cache
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO,
            });

            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(
                        (clienteActual) => clienteActual.id !== id
                    ),
                },
            });
        },
    });

    const deleteClient = (id) => {
        Swal.fire({
            title: 'Estás seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar!',
            cancelButtonText: 'No, Cancelar',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //Eliminar por ID y mostrar alerta
                    const { data } = await eliminarCliente({
                        variables: {
                            eliminarClienteId: id,
                        },
                    });
                    console.log(data);

                    Swal.fire('Eliminado!', data.eliminarCliente, 'success');
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };
    const editClient = () => {
        router.push(`/editclient/${id}`);
    };
    return (
        <tr>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                {cliente.nombre} {cliente.apellido}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                {cliente.empresa}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                {cliente.email}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-gray-800 uppercase font-bold cursor-pointer'
                    onClick={() => deleteClient(id)}>
                    Eliminar{' '}
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='size-6 ml-2'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                        />
                    </svg>
                </button>
            </td>

            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs hover:bg-gray-800 uppercase font-bold cursor-pointer'
                    onClick={() => editClient()}>
                    Editar{' '}
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth='1.5'
                        stroke='currentColor'
                        className='size-6 ml-2'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10'
                        />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

export default Cliente;
