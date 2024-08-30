import { getShippingSummaryQuery } from '@graphql/common/getShippingSummary.gql';
import { useContext, createContext, useReducer, useMemo } from 'react'

export type CartContextProps = {
  children: React.ReactNode;
}

export interface State {
    cartSummaryDetails: getShippingSummaryQuery['GetSummaryShoppingCart']
}

interface Values extends State {
    setCartSummaryDetails: (scrollToReview?: any) => void
}

interface Action extends State {
    type:
        | 'SET_CART_SUMMARY'
}

const initialState = {
  cartSummaryDetails: {},
}

const cartReducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SET_CART_SUMMARY': {
            return {
                ...state,
                cartSummaryDetails: action.cartSummaryDetails
            }
        }
    }
}

const ReviewContext = createContext(initialState as Values)

export const useCartContext = () => useContext(ReviewContext)

export const CartContext = ({ children }: CartContextProps) => {
    const [state, dispatch] = useReducer(cartReducer, initialState)

    const setCartSummaryDetails = (cartSummaryDetails = {}) =>
        dispatch({ type: 'SET_CART_SUMMARY', cartSummaryDetails })

    const value = useMemo(
        () => ({
            ...state,
            setCartSummaryDetails,
        }),
        [state]
    )
    return (
        <ReviewContext.Provider value={value as Values}>
            {children}
        </ReviewContext.Provider>
    )
}
