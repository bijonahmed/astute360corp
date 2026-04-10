"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

// Helper: stringify attributes safely
const getAttrKey = (attr) => JSON.stringify(attr || {});

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    // ======================= CART =======================
    case "ADD_TO_CART": {
      const { id, selectedAttr } = action.payload;
      const attrKey = getAttrKey(selectedAttr);

      const existingIndex = state.cart.findIndex(
        (item) => item.id === id && getAttrKey(item.selectedAttr) === attrKey
      );

      if (existingIndex >= 0) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].qty += action.payload.qty || 1;
        toast.success("Quantity updated in cart!");
        return { ...state, cart: updatedCart };
      }

      toast.success("Added to cart!");
      return {
        ...state,
        cart: [
          ...state.cart,
          { ...action.payload, qty: action.payload.qty || 1 },
        ],
      };
    }

    case "REMOVE_FROM_CART": {
      const { id, selectedAttr } = action.payload;
      const attrKey = getAttrKey(selectedAttr);
      const newCart = state.cart.filter(
        (item) => !(item.id === id && getAttrKey(item.selectedAttr) === attrKey)
      );
      return { ...state, cart: newCart };
    }

    case "UPDATE_QTY": {
      const { id, selectedAttr, qty } = action.payload;
      const attrKey = getAttrKey(selectedAttr);
      const newQty = qty > 0 ? qty : 1;
      const updatedCart = state.cart.map((item) =>
        item.id === id && getAttrKey(item.selectedAttr) === attrKey
          ? { ...item, qty: newQty }
          : item
      );
      return { ...state, cart: updatedCart };
    }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    // ======================= WISHLIST =======================
    case "ADD_TO_WISHLIST": {
      const { id } = action.payload;
      const exists = state.wishlist.find((item) => item.id === id);
      if (exists) {
        toast("Already in wishlist!");
        return state;
      }
      toast.success("Added to wishlist!");
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }

    case "REMOVE_FROM_WISHLIST": {
      const { id } = action.payload;
      const newWishlist = state.wishlist.filter((item) => item.id !== id);
      return { ...state, wishlist: newWishlist };
    }

    case "CLEAR_WISHLIST":
      return { ...state, wishlist: [] };

    default:
      return state;
  }
};

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    { cart: [], wishlist: [] },
    () => {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem("cart");
        const storedWishlist = localStorage.getItem("wishlist");
        return {
          cart: storedCart ? JSON.parse(storedCart) : [],
          wishlist: storedWishlist ? JSON.parse(storedWishlist) : [],
        };
      }
      return { cart: [], wishlist: [] };
    }
  );

  // Sync cart & wishlist with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("wishlist", JSON.stringify(state.wishlist));
    }
  }, [state]);

  // ========== CART ACTIONS ==========
  const addToCart = (product) =>
    dispatch({ type: "ADD_TO_CART", payload: product });
  const removeFromCart = (product) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: product });
  const updateQty = (product, qty) =>
    dispatch({ type: "UPDATE_QTY", payload: { ...product, qty } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  // ========== WISHLIST ACTIONS ==========
  const addToWishlist = (product) =>
    dispatch({ type: "ADD_TO_WISHLIST", payload: product });
  const removeFromWishlist = (product) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: product });
  const clearWishlist = () => dispatch({ type: "CLEAR_WISHLIST" });

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        wishlist: state.wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
