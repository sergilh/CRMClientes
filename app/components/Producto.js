'use client';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const ELIMINAR_PRODUCTO = gql`
    mutation Mutation($eliminarProductoId: ID!) {
        eliminarProducto(id: $eliminarProductoId)
    }
`;

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

const Producto = ({ producto }) => {
    const router = useRouter();
    const { nombre, precio, existencia, id } = producto;
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS,
            });
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(
                        (productoActual) => productoActual.id !== id
                    ),
                },
            });
        },
    });

    const deleteProduct = async (id) => {
        Swal.fire({
            title: 'Quieres eliminar este producto?',
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
                    const { data } = await eliminarProducto({
                        variables: {
                            eliminarProductoId: id,
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

    const editProduct = async (id) => {
        router.push(`/editproduct/${id}`);
    };
    return (
        <tr>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                {nombre}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                {existencia}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold'>
                $ {precio}
            </td>
            <td className='border px-4 py-2 text-center text-gray-800 font-bold text-gray-800 font-bold'>
                <button
                    type='button'
                    className='flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-gray-800 uppercase font-bold cursor-pointer'
                    onClick={() => deleteProduct(id)}>
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
                    onClick={() => editProduct(id)}>
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

export default Producto;
