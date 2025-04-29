'use client';
import React from 'react';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query Query($obtenerClienteId: ID!) {
        obtenerCliente(id: $obtenerClienteId) {
            nombre
            apellido
            email
            empresa
            telefono
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
    mutation Mutation($actualizarClienteId: ID!, $input: ClienteInput) {
        actualizarCliente(id: $actualizarClienteId, input: $input) {
            nombre
            apellido
            email
            empresa
            telefono
        }
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

const EditarCliente = ({ params }) => {
    const router = useRouter();
    const { id } = React.use(params);
    const { data, loading, error } = useQuery(OBTENER_CLIENTE, {
        variables: {
            obtenerClienteId: id,
        },
    });

    const [actualizarCliente] = useMutation(ACTUALIZAR_CLIENTE, {
        update: (cache, { data: { actualizarCliente } }) => {
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO,
            });
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: {
                        ...obtenerClientesVendedor,
                        actualizarCliente,
                    },
                },
            });
        },
    });
    //Schema validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        email: Yup.string()
            .email('El email no es válido')
            .required('El email es obligatorio'),
        empresa: Yup.string().required('La empresa es obligatoria'),
    });
    if (loading) return 'Cargando...';
    if (error) return <p>Error: {error.message}</p>;

    const { obtenerCliente } = data;
    console.log(obtenerCliente);
    console.log(data);

    const actualizarInfoCliente = async (valores) => {
        const { nombre, apellido, empresa, telefono, email } = valores;
        try {
            const { data } = await actualizarCliente({
                variables: {
                    actualizarClienteId: id,
                    input: {
                        nombre,
                        apellido,
                        email,
                        empresa,
                        telefono,
                    },
                },
            });
            console.log('Cliente actualizado');
            Swal.fire(
                'Actualizado!',
                'El cliente se actualizó correctamente',
                'success'
            );
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1>Editar Cliente</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={(valores) => {
                            actualizarInfoCliente(valores);
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
                                            placeholder='Nombre Cliente'
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
                                            htmlFor='apellido'>
                                            Apellido
                                        </label>
                                        <input
                                            className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                            id='apellido'
                                            type='text'
                                            placeholder='Apellido Cliente'
                                            value={props.values.apellido}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.apellido &&
                                    props.errors.apellido ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label
                                            className='block text-gray-700 text-sm font-bold mb-2'
                                            htmlFor='empresa'>
                                            Empresa
                                        </label>
                                        <input
                                            className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                            id='empresa'
                                            type='text'
                                            placeholder='Empresa Cliente'
                                            value={props.values.empresa}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.empresa &&
                                    props.errors.empresa ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label
                                            className='block text-gray-700 text-sm font-bold mb-2'
                                            htmlFor='email'>
                                            Email
                                        </label>
                                        <input
                                            className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                            id='email'
                                            type='email'
                                            placeholder='Email Cliente'
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.email &&
                                    props.errors.email ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null}

                                    <div className='mb-4'>
                                        <label
                                            className='block text-gray-700 text-sm font-bold mb-2'
                                            htmlFor='telefono'>
                                            Teléfono
                                        </label>
                                        <input
                                            className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                            id='telefono'
                                            type='tel'
                                            placeholder='Teléfono Cliente'
                                            value={props.values.telefono}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.telefono &&
                                    props.errors.telefono ? (
                                        <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                            <p className='font-bold'>Error</p>
                                            <p>{props.errors.telefono}</p>
                                        </div>
                                    ) : null}
                                    <input
                                        type='submit'
                                        className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                                        value='Editar Cliente'></input>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </>
    );
};

export default EditarCliente;
