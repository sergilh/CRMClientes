import React, { useContext } from 'react';
import PedidoContext from '@/context/pedidos/PedidoContext';

const Total = () => {
    //Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { total } = pedidoContext;
    console.log(total);

    return (
        <div className='flex items-center mt-5 mb-3 justify-between bg-white p-4 border rounded border-solid border-2 border-gray-800'>
            <h2 className='text-gray-800 text-lg'>Total a pagar:</h2>
            <p className='text-gray-800 mt-0'>${total}</p>
        </div>
    );
};

export default Total;
