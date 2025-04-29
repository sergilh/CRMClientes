import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '@/context/pedidos/PedidoContext';
import ProductoResumen from './ProductoResumen';

const ResumenPedido = () => {
    //Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { productos } = pedidoContext;
    return (
        <>
            <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
                2.-Selecciona la cantidad del Producto
            </p>
            {productos.length > 0 ? (
                <>
                    {productos.map((producto) => (
                        <ProductoResumen
                            key={producto.id}
                            producto={producto}
                        />
                    ))}
                </>
            ) : (
                <p className='mt-5 text-sm font-bold'>Aún no hay productos</p>
            )}
        </>
    );
};

export default ResumenPedido;
