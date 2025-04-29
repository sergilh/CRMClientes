'use client';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

//Consulta para loguearse
const LOGIN_USUARIO = gql`
    mutation Mutation($input: LoginInput) {
        loginUsuario(input: $input) {
            token
        }
    }
`;

export default function Login() {
    //Mutation para loguearse
    const [loginUsuario] = useMutation(LOGIN_USUARIO);
    const [message, setMessage] = useState(null);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('El email no es válido')
                .required('El email no puede ir vacío'),
            password: Yup.string().required('La contraseña es obligatoria'),
        }),
        onSubmit: async (valores) => {
            const { email, password } = valores;
            try {
                const { data } = await loginUsuario({
                    variables: {
                        input: {
                            email: email,
                            password: password,
                        },
                    },
                });
                console.log(data);
                setMessage('Autenticando');
                setTimeout(() => {
                    //Guardar token en local storage
                    const { token } = data.loginUsuario;
                    localStorage.setItem('token', token);
                }, 1000);
                //Usuario logueado con éxito
                setMessage('Se ha iniciado sesión correctamente');
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
        <div>
            {message && showMessage()}
            <h1 className='text-center text-2xl text-white font-light'>
                Login
            </h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form
                        className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}>
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
                                placeholder='Email usuario'
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
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
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
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
                            value='Iniciar sesión'
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
