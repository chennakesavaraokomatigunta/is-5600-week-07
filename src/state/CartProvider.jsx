import React, { useReducer, useContext } from 'react'


const CartContext = React.createContext()


const initialState = {
  itemsById: {},
  allItems: [],
}


const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY'


const cartReducer = (state, action) => {
  const { payload } = action;

  console.log({state})

  switch (action.type) {
    case ADD_ITEM:
      const newState = {
        ...state,
        itemsById: {
          ...state.itemsById,
          [payload._id]: {
            ...payload,// this is the product object
            quantity: state.itemsById[payload._id]
              ? state.itemsById[payload._id].quantity + 1
              : 1,
          },
        },
        
        allItems: Array.from(new Set([...state.allItems, action.payload._id])),
      };
      console.log({ newState })
      return newState

    case REMOVE_ITEM:
      const updatedState = {
        ...state,
        itemsById: Object.entries(state.itemsById)
          .filter(([key, value]) => key !== action.payload._id)
          .reduce((obj, [key, value]) => {
            obj[key] = value
            return obj
          }, {}),
        allItems: state.allItems.filter(
          (itemId) => itemId !== action.payload._id
        ),
      }
      return updatedState
    case UPDATE_ITEM_QUANTITY:
      const currentItem = state.itemsById[payload._id]
      const updatedItemState = {
        ...state,
        itemsById: {
          ...state.itemsById,
          [payload._id]: {
            ...currentItem,
            quantity: currentItem.quantity + payload.quantity,
          },
        },
      }
      return updatedItemState

    default:
      return state
  }
}


const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Remove an item from the cart
  const removeFromCart = (product) => {
    dispatch({ type: REMOVE_ITEM, payload: product })
  }

  // Add an item to the cart
  const addToCart = (product) => {
    dispatch({ type: ADD_ITEM, payload: product })
  }

 
  const updateItemQuantity = (product, quantity) => {
   
  }

 
  const getCartTotal = () => {
    return getCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  const getCartItems = () => {
    return state.allItems.map((itemId) => state.itemsById[itemId]) ?? [];
  }

  return (
    <CartContext.Provider
      value={{
        cartItems: getCartItems(),
        allItems: state.allItems,
        addToCart,
        updateItemQuantity,
        removeFromCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
export { CartProvider, CartContext }
