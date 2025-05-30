'use client';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useQuery, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const OBTENER_PRODUCTO = gql`
    query ExampleQuery($obtenerProductoId: ID!) {
        obtenerProducto(id: $obtenerProductoId) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;
const ACTUALIZAR_PRODUCTO = gql`
    mutation Mutation($actualizarProductoId: ID!, $input: ProductoInput) {
        actualizarProducto(id: $actualizarProductoId, input: $input) {
            id
            nombre
            existencia
            precio
            creado
        }
    }
`;

const EditarProducto = ({ params }) => {
    const router = useRouter();
    const { id } = React.use(params);
    const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO, {
        variables: {
            obtenerProductoId: id,
        },
    });
    if (loading) return 'Cargando...';
    const { obtenerProducto } = data;
    console.log(obtenerProducto);

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        existencia: Yup.number().required('La cantidad es obligatoria'),
        precio: Yup.number().required('El precio es obligatorio'),
    });

    const actualizarInfoProducto = async (valores) => {
        const { nombre, existencia, precio } = valores;
        try {
            const { data } = await actualizarProducto({
                variables: {
                    actualizarProductoId: id,
                    input: {
                        nombre: nombre,
                        existencia: existencia,
                        precio: precio,
                    },
                },
            });
            console.log(data);
            Swal.fire(
                'Actualizado!',
                'El cliente se actualizó correctamente',
                'success'
            );
            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='px-4'>
            <h1>Editar Producto</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerProducto}
                        onSubmit={(valores) => {
                            actualizarInfoProducto(valores);
                        }}>
                        {(props) => {
                            return (
                                <form
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                    onSubmit={props.handleSubmit}>
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
                                            value={props.values.nombre}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.nombre &&
                                    props.errors.nombre ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label
                                            className='block text-gray-700 text-sm font-bold mb-2'
                                            htmlFor='existencia'>
                                            Cantidad
                                        </label>
                                        <input
                                            className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                            id='existencia'
                                            type='number'
                                            placeholder='Existencia Producto'
                                            value={props.values.existencia}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.existencia &&
                                    props.errors.existencia ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.existencia}</p>
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
                                            value={props.values.precio}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.precio &&
                                    props.errors.precio ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.precio}</p>
                                        </div>
                                    ) : null}

                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 cursor-pointer'
                                        value='Editar Producto'></input>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </div>
    );
};
export default EditarProducto;
