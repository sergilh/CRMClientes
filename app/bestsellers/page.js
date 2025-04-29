'use client';
import React, { PureComponent, useEffect } from 'react';
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

import { gql, useQuery } from '@apollo/client';

const MEJORES_VENDEDORES = gql`
    query Query {
        mejoresVendedores {
            total
            vendedor {
                nombre
                email
            }
        }
    }
`;

const MejoresVendedores = () => {
    const { data, loading, error, startPolling, stopPolling } =
        useQuery(MEJORES_VENDEDORES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    if (loading) return 'Cargando...';

    const { mejoresVendedores } = data;

    const vendedorGrafica = [];

    mejoresVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total,
        };
    });

    return (
        <div className='px-4'>
            <h1 className='text-3xl text-gray-800 font-light p-2'>
                Mejores Vendedores
            </h1>
            <ResponsiveContainer width='50%' height={500}>
                <BarChart
                    className='mt-10'
                    width={600}
                    height={500}
                    data={vendedorGrafica}
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

export default MejoresVendedores;
