import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import APPCONFIG from "@config/app.config";
import { getUserDetails } from "@util/common";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { MouseEvent } from "react";

interface ProductBoxProps {
  item: any;
}

const ProductBox: React.FC<ProductBoxProps> = ({ item }) => {
  const router = useRouter();
  const { adddtoCartProduct } = useAddtoCart();
  const currencySymbol = useCurrencySymbol();

  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent Link redirection
    if (!getUserDetails()) {
      router.replace("/sign-in");
    } else {
      adddtoCartProduct({
        item_id: item?.product_id,
        qty: APPCONFIG.DEFAULT_QTY_TYPE,
      });
    }
  };

  return (
    <Link href={`/product/detail/${item?.slug}`} key={item?.product_id}>
      <a key={item?.product_id}>
        <div className="product-box">
          <figure>
            <picture>
              <img
                src={item?.base_image || "/assets/images/product1.jpg"}
                alt={item?.title}
                title={item?.title}
                height="280"
                width="280"
              />
            </picture>
          </figure>
          <p className="product-description">{`${item?.title} ${item?.is_prescribed_for ? `(${item?.is_prescribed_for})` : ''}`}</p>
          {
            item?.selling_price > 0 &&
            <span className="product-price">
              {currencySymbol ?? "$"}
              {Number(item?.selling_price)?.toFixed(2)}
            </span>
          }
          <button className="btn btn-border" onClick={handleAddToCartClick}>
            ADD TO CART
          </button>
        </div>
      </a>
    </Link>
  );
};

export default ProductBox;
