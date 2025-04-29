'use client';
import { useContext, useState } from 'react';
import React from 'react';
import AsignarCliente from '../components/pedidos/AsignarCliente';
import AsignarProductos from '../components/pedidos/AsignarProductos';
import ResumenPedido from '../components/pedidos/ResumenPedido';
import Total from '../components/pedidos/Total';
import { gql, useMutation,useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

//Context Pedidos
import PedidoContext from '@/context/pedidos/PedidoContext';

const NUEVO_PEDIDO = gql`
    mutation Mutation($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;
const OBTENER_PEDIDOS = gql`
    query Query {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
                precio
            }
            total
            cliente {
                id
                nombre
                apellido
                empresa
                creado
                email
                telefono
                vendedor
            }
            vendedor
            fecha
            estado
        }
    }
`;

const NuevoPedido = () => {
    const router = useRouter();
    const [mensaje, setMensaje] = useState(null);
    //Utilizar context y extraer sus funciones y valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total } = pedidoContext;
    const { data } = useQuery(OBTENER_PEDIDOS);

    const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
        update(cache, { data: { nuevoPedido } }) {
            const { obtenerPedidosVendedor } = cache.readQuery({
                query: OBTENER_PEDIDOS,
            });
            cache.writeQuery({
                query: OBTENER_PEDIDOS,
                data: {
                    obtenerPedidosVendedor: [
                        ...obtenerPedidosVendedor,
                        nuevoPedido,
                    ],
                },
            });
        },
    });

    const validacionPedido = () => {
        return !productos.every((producto) => producto.cantidad > 0) ||
            total === 0 ||
            Object.keys(cliente).length === 0
            ? 'opacity-50 cursor-not-allowed'
            : '';
    };
    const crearNuevoPedido = async () => {
        const { id } = cliente;
        const pedido = productos.map(
            ({ __typename, existencia, ...producto }) => producto
        );
        try {
            const { data } = await nuevoPedido({
                variables: {
                    input: {
                        cliente: id,
                        total,
                        pedido,
                    },
                },
            });
            router.push('/pedidos');

            Swal.fire(
                'Correcto',
                'El pedido se registró correctamente',
                'success'
            );
        } catch (error) {
            setMensaje(error.message.replace('GraphQL error: ', ''));
            setTimeout(() => {
                setMensaje(null);
            }, 4000);
        }
    };
    const mostrarMensaje = () => {
        return (
            <div className='bg-red-100 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto border-l-4 border-red-600 font-bold'>
                <p>{mensaje}</p>
            </div>
        );
    };

    return (
        <div className='px-4'>
            <h1 className='text-3xl text-gray-800 font-light'>
                Crear Nuevo Pedido
            </h1>
            {mensaje && mostrarMensaje()}
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <AsignarCliente />
                    <AsignarProductos />
                    <ResumenPedido />
                    <Total />

                    <button
                        type='button'
                        onClick={() => crearNuevoPedido()}
                        className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validacionPedido()}`}>
                        Registrar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NuevoPedido;
