'use client';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import Pedido from '../components/Pedido';

const OBTENER_PEDIDOS = gql`
    query ExampleQuery {
        obtenerPedidosVendedor {
            id
            pedido {
                id
                cantidad
                nombre
            }
            total
            cliente {
                nombre
                id
                apellido
                email
                telefono
            }
            vendedor
            fecha
            estado
        }
    }
`;

export default function Pedidos() {
    const { data, loading, error } = useQuery(OBTENER_PEDIDOS);

    if (loading) return 'Cargando...';

    const { obtenerPedidosVendedor } = data;

    return (
        <div className='px-4'>
            <h2 className='text-3xl text-gray-800 font-light p-2'>Pedidos</h2>
            <Link
                href='/neworder'
                className='!bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:!bg-gray-800 mb-3 uppercase font-bold'>
                Nuevo Pedido
            </Link>

            {obtenerPedidosVendedor.length === 0 ? (
                <p className='mt-5 text-center text-2-xl'>
                    No hay pedidos todavía
                </p>
            ) : (
                obtenerPedidosVendedor.map((pedido) => (
                    <Pedido key={pedido.id} pedido={pedido} />
                ))
            )}
        </div>
    );
}
