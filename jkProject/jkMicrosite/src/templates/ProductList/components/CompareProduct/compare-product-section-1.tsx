import { ICompareProductsState } from "@components/Hooks/compareProduct";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import { useRouter } from "next/router";

const ICompareProductSection1 = () => {
  const { getCompareProductList, clearCompareProduct } = useCompareProduct();
  const router = useRouter();
  return getCompareProductList() && getCompareProductList()?.length > 0 ? (
    <div className="compared-product-section">
      <div className="filter-label">Compare Products ({getCompareProductList()?.length} Items) :</div>
      {getCompareProductList()?.map((ele: ICompareProductsState, eInd: number) => (
        <div key={eInd} className="selected-item">
          <p>{ele?.title}</p>
          <button onClick={() => clearCompareProduct(ele?.product_id)} className="btn-icon-close">
            <i className="jkm-close"></i>
          </button>
        </div>
      ))}
      <button className="btn-filter btn-compare" onClick={() => router.push("/compare-products")}>Compare</button>
      <button className="btn-filter btn-clear" onClick={() => clearCompareProduct("")}>
        Clear All
      </button>
    </div>
  ) : (
    <></>
  );
};

export default ICompareProductSection1;
