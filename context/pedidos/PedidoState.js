import React, { useReducer } from 'react';
import PedidoContext from './PedidoContext';
import PedidoReducer from './PedidoReducer';

import {
    SELECCIONAR_CLIENTE,
    SELECCIONAR_PRODUCTO,
    CANTIDAD_PRODUCTO,
    ACTUALIZAR_TOTAL,
} from '../../types';

const PedidoState = ({ children }) => {
    //State de Pedidos
    const initialState = {
        cliente: {},
        productos: [],
        total: 0,
    };

    const [state, dispatch] = useReducer(PedidoReducer, initialState);

    //Modificar Cliente
    const agregarCliente = (cliente) => {
        dispatch({
            type: SELECCIONAR_CLIENTE,
            payload: cliente,
        });
    };
    //Modificar Productos
    const agregarProducto = (productosSeleccionados) => {
        let nuevoState;
        if (state.productos.length > 0) {
            nuevoState = productosSeleccionados.map((producto) => {
                const nuevoObjeto = state.productos.find(
                    (productoState) => productoState.id === producto.id
                );
                return { ...producto, ...nuevoObjeto };
            });
        } else {
            nuevoState = productosSeleccionados;
        }
        dispatch({
            type: SELECCIONAR_PRODUCTO,
            payload: productosSeleccionados,
        });
    };

    //Modifica cantidades productos
    const cantidadesProductos = (nuevoProducto) => {
        dispatch({
            type: CANTIDAD_PRODUCTO,
            payload: nuevoProducto,
        });
    };

    const actualizarTotal = () => {
        dispatch({
            type: ACTUALIZAR_TOTAL,
        });
    };

    return (
        <PedidoContext.Provider
            value={{
                productos: state.productos,
                total: state.total,
                cliente: state.cliente,
                agregarCliente,
                agregarProducto,
                cantidadesProductos,
                actualizarTotal,
            }}>
            {children}
        </PedidoContext.Provider>
    );
};

export default PedidoState;
