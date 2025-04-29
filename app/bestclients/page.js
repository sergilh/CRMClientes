'use client';
import React, { useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const MEJORES_CLIENTES = gql`
    query Query {
        mejoresClientes {
            total
            cliente {
                nombre
            }
        }
    }
`;

const MejoresClientes = () => {
    const { data, loading, error, startPolling, stopPolling } =
        useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (loading) return 'Cargando...';

    const { mejoresClientes } = data;

    const clientesGrafica = [];

    mejoresClientes.map((cliente, index) => {
        clientesGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total,
        };
    });

    return (
        <div className='px-4'>
            <h1 className='text-3xl text-gray-800 font-light p-2'>
                Mejores Clientes
            </h1>
            <ResponsiveContainer width='50%' height={500}>
                <BarChart
                    className='mt-10'
                    width={600}
                    height={500}
                    data={clientesGrafica}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='nombre' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey='total'
                        fill='#3182CE'
                        activeBar={<Rectangle fill='#3182CE' stroke='blue' />}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MejoresClientes;
