'use client';
import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '@/context/pedidos/PedidoContext';

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

const clientes = [
    { id: 1, nombre: 'Juan' },
    { id: 2, nombre: 'Pablo' },
    { id: 3, nombre: 'Juan Pablo' },
];

const AsignarCliente = () => {
    const [cliente, setCliente] = useState([]);

    //Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarCliente } = pedidoContext;

    //Consulta BBDD
    const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

    useEffect(() => {
        agregarCliente(cliente);
    }, [cliente]);

    const seleccionarCliente = (clientes) => {
        setCliente(clientes);
    };

    //Resultados consulta bbdd
    if (loading) return null;

    const { obtenerClientesVendedor } = data;
    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
                1.-Asigna un Cliente a un pedido
            </p>
            <Select
                className='mt-3'
                options={obtenerClientesVendedor}
                isMulti={false}
                onChange={(opcion) => seleccionarCliente(opcion)}
                getOptionValue={(opciones) => opciones.id}
                getOptionLabel={(opciones) => opciones.nombre}
                placeholder='Selecciona un cliente'
                noOptionsMessage={() => 'No hay resultados'}
            />
        </>
    );
};

export default AsignarCliente;
