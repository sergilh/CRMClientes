'use client';
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const NUEVO_PRODUCTO = gql`
    mutation Mutation($input: ProductoInput) {
        nuevoProducto(input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
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

const NuevoProducto = () => {
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache) {
            const { obtenerProductos } = cache.readQuery({
                query: OBTENER_PRODUCTOS,
            });
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: {
                        ...obtenerProductos,
                        nuevoProducto,
                    },
                },
            });
        },
    });
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: '',
            precio: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number().required('La cantidad es obligatoria'),
            precio: Yup.number().required('El precio es obligatorio'),
        }),
        onSubmit: async (valores) => {
            const { nombre, existencia, precio } = valores;
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre: nombre,
                            existencia: existencia,
                            precio: precio,
                        },
                    },
                });
                Swal.fire({
                    title: `Producto creado!`,
                    icon: 'success',
                    draggable: true,
                });
                router.push('/productos');
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <div className='px-4'>
            <h2 className='text-3xl text-gray-800 font-light p-2'>
                Crear nuevo producto
            </h2>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='nombre'>
                                Nombre
                            </label>
                            <input
                                className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='nombre'
                                type='text'
                                placeholder='Nombre Producto'
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='existencia'>
                                Cantidad disponible
                            </label>
                            <input
                                className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='existencia'
                                type='number'
                                placeholder='Cantidad disponible'
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.existencia &&
                        formik.errors.existencia ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.existencia}</p>
                            </div>
                        ) : null}

                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='precio'>
                                Precio
                            </label>
                            <input
                                className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='precio'
                                type='number'
                                placeholder='Precio Producto'
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                            value='Agregar nuevo producto'></input>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NuevoProducto;
