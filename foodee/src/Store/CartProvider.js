import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultState = {
    items: [],
    totalAmount: 0,
};

function cartReducer(state,action){
    if(action.type==='Add'){
        const updatedTotalAmount = state.totalAmount + action.item.amount*action.item.price;
        const existingItemIndex = state.items.findIndex((x)=>x.id===action.item.id);
        const existingItem = state.items[existingItemIndex];
        let updatedItems;
        if(existingItem){
            const updatedItem = {
                ...existingItem,
                amount: existingItem.amount + action.item.amount
            }
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = updatedItem;
        }
        else{
            updatedItems = state.items.concat(action.item);
        }
        return{
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }
    if(action.type==="Remove"){
        const updatedTotalAmount = state.totalAmount - action.item.amount*action.item.price;
        const existingItemIndex = state.items.findIndex((x)=>x.id===action.item.id);
        const existingItem = state.items[existingItemIndex];
        let updatedItems;
        if(existingItem.amount>1){
            const updatedItem = {
                ...existingItem,
                amount: existingItem.amount - action.item.amount
            }
            updatedItems = [...state.items];
            updatedItems[existingItemIndex] = updatedItem;
        }
        else if(existingItem.amount===1){
            updatedItems = state.items.slice(0,existingItemIndex);
            updatedItems = updatedItems.concat(state.items.slice(existingItemIndex+1));
        }
        return{
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }
    return defaultState;
}

function CartProvider(props){

    const [cartState,dispatchCart] = useReducer(cartReducer,defaultState);

    function addItemHandler(item){
        dispatchCart({type: 'Add', item: item});
    }

    function removeItemHandler(item){
        dispatchCart({type: 'Remove', item: item});
    }

    const context = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemHandler,
        removeItem: removeItemHandler
    };

    return(
        <CartContext.Provider value={context}>
            {props.children}
        </CartContext.Provider>
    );
}

export default CartProvider;