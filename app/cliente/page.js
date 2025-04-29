'use client';
import React from 'react';
import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const NUEVO_CLIENTE = gql`
    mutation Mutation($input: ClienteInput) {
        nuevoCliente(input: $input) {
            nombre
            apellido
            empresa
            email
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
const NuevoCliente = () => {
    const router = useRouter();
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } }) {
            //Obtener el objeto de  cache
            const { obtenerClientesVendedor } = cache.readQuery({
                query: OBTENER_CLIENTES_USUARIO,
            });
            //Reescribir el cache(no modificar nunca)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: [
                        ...obtenerClientesVendedor,
                        nuevoCliente,
                    ],
                },
            });
        },
    });
    const [message, setMessage] = useState(null);
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            empresa: '',
            telefono: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            empresa: Yup.string().required('La empresa es obligatoria'),
        }),
        onSubmit: async (valores) => {
            const { nombre, apellido, email, empresa, telefono } = valores;
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre: nombre,
                            apellido: apellido,
                            email: email,
                            empresa: empresa,
                            telefono: telefono,
                        },
                    },
                });
                //Usuario creado
                setMessage('Se ha creado el cliente correctamente');
                setTimeout(() => {
                    setMessage(null);
                    router.push('/');
                }, 3000);
            } catch (error) {
                setMessage(error.message);
                setTimeout(() => {
                    setMessage(null);
                }, 3000);
            }
        },
    });
    const showMessage = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto rounded'>
                <p>{message}</p>
            </div>
        );
    };
    return (
        <>
            <div className='px-4'>
                <h2 className='text-3xl text-gray-800 font-light p-2 '>
                    Nuevo Cliente
                </h2>
                {message && showMessage()}

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
                                    placeholder='Nombre Cliente'
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
                                    htmlFor='apellido'>
                                    Apellido
                                </label>
                                <input
                                    className='shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                    id='apellido'
                                    type='text'
                                    placeholder='Apellido Cliente'
                                    value={formik.values.apellido}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.apellido &&
                            formik.errors.apellido ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.apellido}</p>
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
                                    value={formik.values.empresa}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.empresa && formik.errors.empresa ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.empresa}</p>
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
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.email && formik.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.email}</p>
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
                                    value={formik.values.telefono}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                            </div>
                            {formik.touched.telefono &&
                            formik.errors.telefono ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.telefono}</p>
                                </div>
                            ) : null}
                            <input
                                type='submit'
                                className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                                value='Registrar Cliente'></input>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NuevoCliente;
