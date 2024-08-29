import { LoaderReduxState } from "./loader"
import { ProductReduxState } from "./product"

export type ReducerState = {
    productReducer: ProductReduxState
    loaderRootReducer: LoaderReduxState
}