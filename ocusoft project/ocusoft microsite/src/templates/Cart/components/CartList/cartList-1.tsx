import BreadCrumbs from "@components/BreadCrumbs";
import CartSummary from "@components/Cart/CartSummary";
import NoItemsFound from "@components/Cart/NoItemsFound";
import DeleteConfirmationBox from "@components/Deletepopup/DeleteConfirmationBox";
import { IUpdateCart } from "@components/Hooks/addtoCart";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ICartData, IcartItems } from "@type/Pages/cart";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React, { Fragment, useState, useEffect } from "react";
import { toast } from "react-toastify";

const CartList1 = () => {
  const [cartData, setCartData] = useState<ICartData>();
  const currency = useCurrencySymbol();
  const currencySymbol = currency ?? '$'
  const [deleteId, setDeleteId] = useState<any>()
  const [isDeleteAll, setIsDeleteAll] = useState<boolean>(false);
  const [onDeletePopup, setOnDeletePopup] = useState(false)
  const {
    getCartData,
    deleteCartItem,
    updateCart,
  } = useAddtoCart();


  useEffect(() => {
    getCartDataItem()
  }, [])

  const getCartDataItem = async () => {
    const result = await getCartData();
    if (result?.data) {
      setCartData(result?.data)
      localStorage.setItem('cart-items', JSON.stringify(result.data))
      return
    }
    setCartData(undefined)
  };

  const increaseCount = async (data: IcartItems) => {
    if (!data || (data.qty >= Number(data?.products?.product_detail?.product_purchase_limit))) {
      toast.error(`You have reached the purchase limit for this item.`)
      return;
    }
    const response = await updateCart({
      qty: Number(data?.qty) + 1,
      cart_item: data?._id,
    } as IUpdateCart,
      cartData?.cart_details?.cart_id!,
    );

    if (response?.meta?.status_code == 200) {
      await getCartDataItem();
    }
  };
  const decreaseCount = async (data: IcartItems) => {

    if (!data || (data.qty <= 1)) {
      toast.error(`Minimum Quantity for this product is 1`)
      return;
    }
    const response = await updateCart({
      qty: Number(data?.qty) - 1,
      cart_item: data?._id,
    },
      cartData?.cart_details?.cart_id!,
    );
    if (response?.meta?.status_code == 200) {
      await getCartDataItem();
    }
  };

  const onDeleteCartItem = async () => {
    if (!cartData?.cart_items?.length) {
      return
    }
    let deleteIds = [deleteId]
    if (isDeleteAll) {
      deleteIds = cartData?.cart_items?.map((i: IcartItems) => i?._id)
    }
    if (!deleteIds?.length) {
      return
    }
    setOnDeletePopup(false)
    const response = await deleteCartItem({
      cart_items_id: deleteIds,
      cart_id: cartData?.cart_details?.cart_id,
    });

    if (response?.meta?.status_code == 200) {
      getCartDataItem();
      setDeleteId(undefined)
      setOnDeletePopup(false)
      setIsDeleteAll(false)
    }
  };

  const onDelete = (i: string) => {
    setDeleteId(i)
    setOnDeletePopup(true)
  }

  const onDeleteAll = () => {
    setOnDeletePopup(true)
    setIsDeleteAll(true)
  }

  return (
    <Fragment>
      <Head>
        <title>Shopping Cart</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingAddress)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderSummary)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shoppingsection)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.estimateshipping)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.standardshipping)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.summarysection)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingto)}
        />
      </Head>
      <BreadCrumbs item={[
        { slug: '/cart/list', title: 'Shopping Cart' },
      ]} />
      <section className="shipping-address-section">
        {
          !cartData?.cart_items?.length ?
            <NoItemsFound /> :
            <div className="container">
              <div className="shipping-address-methods-wrap">
                <div className="shipping-address-wrap">
                  <h2 className="shipping-title">SHOPPING CART</h2>
                  <div className="product-list-table-wrap">
                    <table className="product-list-table">
                      <thead>
                        <tr>
                          <th className="Product">Product</th>
                          <th className="Price">Price</th>
                          <th className="Quantity">Quantity</th>
                          <th className="Total">Total</th>
                          <th className="action"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          cartData?.cart_items?.map((i: IcartItems) => (
                            <tr key={i?.product_id}>
                              <td>
                                <table>
                                  <tr>
                                    <td>
                                      <figure>
                                        <picture>
                                          <source srcSet={i?.products?.product_detail?.base_image ?? "/assets/images/shipping-product-img1.webp"} type="image/webp" />
                                          <Link href={`/product/detail/${i?.products?.product_detail?.url_key}`}>
                                           <a>
                                            <img src={i?.products?.product_detail?.base_image ?? "/assets/images/shipping-product-img1.jpg"} alt="shipping-product" title="shipping-product" height="85" width="85" />
                                           </a>
                                          </Link>
                                        </picture>
                                      </figure>
                                    </td>
                                    <td className="product-wrapper">
                                      <p className="product-name">
                                        <Link href={`/product/detail/${i?.products?.product_detail?.url_key}`}>
                                          {i?.products?.product_detail?.name}
                                        </Link>
                                      </p>
                                      <span className="product-title">
                                        SKU: {i?.products?.product_detail?.sku}
                                      </span>
                                      <br />
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td>{currencySymbol}{Number(i?.products?.selling_price).toFixed(2)}</td>
                              <td>
                                <button type="button" className="qty-btn" aria-label="qty-btn">
                                  <em className="osicon-minus" onClick={() => decreaseCount(i)}></em>
                                  <input type="text" value={i?.qty} />
                                  <em className="osicon-plus" onClick={() => increaseCount(i)}></em>
                                </button>
                              </td>
                              <td className="total">
                                <span>
                                  {currencySymbol}{(i?.products?.selling_price * Number(i?.qty)).toFixed(2)}
                                </span>
                              </td>
                              <td className="action">
                                <ul>
                                  <li>
                                    <a onClick={() => onDelete(i?._id)}>
                                      <i className="osicon-trash"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))
                        }
                        <tr>
                          <td colSpan={5} className="subtotal">
                            <span>SubTotal:</span>
                            <span>{currencySymbol}{cartData?.cart_details?.sub_total}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="multiple-buttons">
                    <Link href='/products'>
                      <button className="btn btn-primary-large">
                        <i className="osicon-low-stock"></i>
                        <span>CONTINUE SHOPPING</span>
                      </button>
                    </Link>

                    <button className="btn btn-border-large" onClick={onDeleteAll}>
                      CLEAR SHOPPING CART
                    </button>
                  </div>
                </div>
              </div>
              <div className="order-summary-section">
                <h2>Order Summary</h2>
                <CartSummary
                  data={cartData?.cart_details}
                />

              </div>
            </div>
        }

      </section>
      {
        onDeletePopup &&
        <DeleteConfirmationBox
          onClose={() => setOnDeletePopup(false)}
          onDelete={onDeleteCartItem}
          message={isDeleteAll ? 'Are you sure want to clear all cart products?' :
            "Are you sure you want delete this product from cart?"}
        />
      }
    </Fragment>
  );
};

export default CartList1;
