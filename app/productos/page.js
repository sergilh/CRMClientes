'use client';
import { gql, useQuery } from '@apollo/client';
import Producto from '../components/Producto';
import Link from 'next/link';

const OBTENER_PRODUCTOS = gql`
    query ObtenerProductos {
        obtenerProductos {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;
export default function Productos() {
    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    if (loading) return 'Cargando...';
    console.log(data);

    return (
        <div className='px-4'>
            <h2 className='text-3xl text-gray-800 font-light p-2'>Productos</h2>
            <div className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800  hover: transition duration:500 text-gray-200 mb-3 rounded  font-bold text:sm'>
                <Link href='/newproduct'>Crear nuevo producto</Link>
            </div>
            <table className='table-auto shadow-md mt-10 w-full '>
                <thead className='bg-gray-800'>
                    <tr className='text-white'>
                        <th className='w-1/5 py-2'>Nombre</th>
                        <th className='w-1/5 py-2'>Existencias</th>
                        <th className='w-1/5 py-2'>Precio</th>
                        <th className='w-1/5 py-2'>Eliminar</th>
                        <th className='w-1/5 py-2'>Editar</th>
                    </tr>
                </thead>
                <tbody className='bg-white'>
                    {data.obtenerProductos.map((producto) => (
                        <Producto key={producto.id} producto={producto} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
