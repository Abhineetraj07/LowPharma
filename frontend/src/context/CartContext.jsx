import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    try {
      const res = await API.get('/api/cart/');
      setCartItems(res.data);
      setCartCount(res.data.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      setCartItems([]);
      setCartCount(0);
    }
  }, []);

  const addToCart = async (medicineId, quantity = 1) => {
    await API.post('/api/cart/add', { medicine_id: medicineId, quantity });
    await fetchCart();
  };

  const updateCartItem = async (itemId, quantity) => {
    if (quantity <= 0) {
      await API.delete(`/api/cart/${itemId}`);
    } else {
      await API.put(`/api/cart/${itemId}`, { quantity });
    }
    await fetchCart();
  };

  const removeCartItem = async (itemId) => {
    await API.delete(`/api/cart/${itemId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    try {
      await API.delete('/api/cart/');
    } catch { /* ignore */ }
    setCartItems([]);
    setCartCount(0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
