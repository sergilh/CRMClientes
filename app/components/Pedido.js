'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useMutation, gql } from '@apollo/client';

const ACTUALIZAR_PEDIDO = gql`
    mutation Mutation($input: PedidoInput, $actualizarPedidoId: ID!) {
        actualizarPedido(input: $input, id: $actualizarPedidoId) {
            estado
        }
    }
`;
const ELIMINAR_PEDIDO = gql`
    mutation Mutation($eliminarPedidoId: ID!) {
        eliminarPedido(id: $eliminarPedidoId)
    }
`;
const OBTENER_PEDIDOS = gql`
    query ExampleQuery {
        obtenerPedidosVendedor {
            id
        }
    }
`;

const Pedido = ({ pedido }) => {
    console.log(pedido);
    const {
        id,
        total,
        cliente: { nombre, apellido, telefono, email },
        estado,
        cliente,
    } = pedido;

    const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
    const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
        update(cache) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: obtenerPedidosVendedor.filter(
                        (pedido) => pedido.id !== id
                    ),
                },
            });
        },
    });

    const [estadoPedido, setEstadoPedido] = useState(estado);
    const [clase, setClase] = useState('');

    useEffect(() => {
        if (estadoPedido) {
            setEstadoPedido(estadoPedido);
        }
        clasePedido();
    }, [estadoPedido]);

    //Funcion que modifica el color del pedido según estado
    const clasePedido = () => {
        if (estadoPedido === 'PENDIENTE') {
            setClase('border-yellow-500');
        } else if (estadoPedido === 'COMPLETADO') {
            setClase('border-green-500');
        } else {
            setClase('border-red-800');
        }
    };

    const cambiarEstadoPedido = async (nuevoEstado) => {
        try {
            const { data } = await actualizarPedido({
                variables: {
                    actualizarPedidoId: id,
                    input: {
                        estado: nuevoEstado,
                        cliente: cliente.id,
                    },
                },
            });
            setEstadoPedido(data.actualizarPedido.estado);
        } catch (error) {
            console.log(error);
        }
    };

    const borrarPedido = () => {
        Swal.fire({
            title: 'Estás seguro de que quieres eliminarlo?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await eliminarPedido({
                        variables: {
                            eliminarPedidoId: id,
                        },
                    });
                    Swal.fire({
                        title: 'Pedido Eliminado',
                        text: 'El pedido ha sido eliminado.',
                        icon: 'success',
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        });
    };
    return (
        <div
            className={`${clase} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
            <div>
                <p className='font-bold text-gray-800 '>
                    Cliente: {nombre} {apellido}
                </p>
                {email && (
                    <p className='flex items-center my-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-5 h-5 mr-2'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
                            />
                        </svg>
                        {email}
                    </p>
                )}
                {telefono && (
                    <p className='flex items-center my-2'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            class='w-5 h-5 mr-2'>
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z'
                            />
                        </svg>

                        {telefono}
                    </p>
                )}
                <h2 className='text-gray-800 font-bold mt-10 mb-3'>
                    Estado pedido:{' '}
                </h2>

                <select
                    className='mt-2 appearance-none bg-blue-600 border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus_bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold'
                    value={estadoPedido}
                    onChange={(e) => cambiarEstadoPedido(e.target.value)}>
                    <option value='COMPLETADO'>COMPLETADO</option>
                    <option value='PENDIENTE'>PENDIENTE</option>
                    <option value='CANCELADO'>CANCELADO</option>
                </select>
            </div>
            <div>
                <h2 className='font-bold text-gray-800 mt-2'>
                    Resumen del Pedido
                </h2>
                {pedido.pedido.map((articulo) => (
                    <div key={articulo.id} className='mt-4'>
                        <p className='text-sm text-gray-600'>
                            Producto: {articulo.nombre}
                        </p>
                        <p className='text-sm text-gray-600'>
                            Cantidad: {articulo.cantidad}
                        </p>
                    </div>
                ))}
                <p className='text-gray-800 mt-3 mb-2 font-bold'>
                    Total a pagar: <span className='font-light'>$ {total}</span>
                </p>
                <button
                    className='flex items-center mt-4 bg-red-800 px-5 py-2 text-white rounded leading-tight uppercase text-xs font-bold'
                    onClick={() => borrarPedido()}>
                    Eliminar Pedido
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
            </div>
        </div>
    );
};

export default Pedido;
