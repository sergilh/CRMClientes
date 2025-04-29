'use client';
import React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
const NUEVO_USUARIO = gql`
    mutation Mutation($input: UsuarioInput) {
        nuevoUsuario(input: $input) {
            apellido
            creado
            email
            id
            nombre
        }
    }
`;

export default function Register() {
    const router = useRouter();
    const [message, setMessage] = useState(null);
    //Mutation para crear usuario
    const [nuevoUsuario] = useMutation(NUEVO_USUARIO);
    //Validación de formularios
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            email: Yup.string()
                .email('El email no es válido')
                .required('El email es obligatorio'),
            password: Yup.string()
                .required('La contraseña no puede ser vacía')
                .min(6, 'La contraseá debe ser de mínimo 6 caracteres'),
        }),

        onSubmit: async (valores) => {
            const { nombre, apellido, email, password } = valores;
            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre: nombre,
                            apellido: apellido,
                            email: email,
                            password: password,
                        },
                    },
                });
                console.log(data);
                //Usuario creado con éxito
                setMessage(`Se ha creado el usuario correctamente`);
                setTimeout(() => {
                    setMessage(null);
                    router.push('/login');
                }, 3000);

                //Redirigir al usuario al final
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
        <div>
            {message && showMessage()}
            <h1 className='text-center text-2xl text-white font-light'>
                Registro
            </h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form
                        className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}>
                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='nombre'>
                                Nombre
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='nombre'
                                type='text'
                                placeholder='Nombre'
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
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='apellido'
                                type='text'
                                placeholder='Apellido'
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                            />
                        </div>

                        {formik.touched.apellido && formik.errors.apellido ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.apellido}</p>
                            </div>
                        ) : null}
                        <div className='mb-4'>
                            <label
                                className='block text-gray-700 text-sm font-bold mb-2'
                                htmlFor='email'>
                                Email
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='email'
                                type='email'
                                placeholder='Email '
                                value={formik.values.email}
                                onChange={formik.handleChange}
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
                                htmlFor='password'>
                                Password
                            </label>
                            <input
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:shadow-outline'
                                id='password'
                                type='password'
                                placeholder='Contraseña'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                <p className='font-bold'>Error</p>
                                <p>{formik.errors.password}</p>
                            </div>
                        ) : null}
                        <input
                            type='submit'
                            className='bg-gray-800 w-full mt-5 p-2 text-white hover:bg-gray-900'
                            value='Crear Cuenta'
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
