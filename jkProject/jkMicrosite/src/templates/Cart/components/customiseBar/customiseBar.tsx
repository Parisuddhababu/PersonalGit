import React, { useEffect, useMemo, useState } from "react";
import { ICustomiseBar } from ".";
import { ICustomiseData, IMetalTypeCustomisation } from "../customiseProduct";
import { useToast } from "@components/Toastr/Toastr";

const CustomiseBar: React.FC<ICustomiseBar> = ({
  allAvailableCombinations,
  selectedProducts,
  productCombinations,
  CustomizeProductData,
}) => {
  const [priceTypeList, setPriceTypeList] = useState<string[]>([]);
  const [selectedPriceType, setSelectedPriceType] = useState<string>("");
  const [uniqueMetalCombinations, setUniqueMetalCombinations] =
    useState<IMetalTypeCustomisation | null>(null);
  const [metalPurity, setMetalPurity] = useState<string>("");
  const [metalColor, setMetalColor] = useState<string>("");
  const [diamond, setDiamond] = useState<string>("");
  const [colorStone, setColorStone] = useState<string>("");
  const { showError } = useToast();

  const getAllProductCombinations = () => {
    const uniqueAllProductCombinations: IMetalTypeCustomisation = {};

    const allProductCombinations = productCombinations?.map((combination) =>
      combination?.metal_customisation !== null
        ? combination.metal_customisation
        : {}
    );

    allProductCombinations?.forEach((combination) => {
      Object.keys(combination).forEach((key) => {
        if (uniqueAllProductCombinations.hasOwnProperty(key)) {
          uniqueAllProductCombinations[key] = [
            ...uniqueAllProductCombinations[key],
            ...combination[key],
          ];
        } else {
          uniqueAllProductCombinations[key] = [...combination[key]];
        }
      });
    });

    const priceType: string[] = [];
    Object.keys(uniqueAllProductCombinations).forEach((i) => {
      priceType.push(i);
    });
    setPriceTypeList(priceType);
    setSelectedPriceType(priceType[0]);
    // !diamond &&
    //   setDiamond(
    //     allAvailableCombinations?.customizable_diamonds?.[0]?.diamond_quality_id
    //   );
    // !colorStone &&
    //   setColorStone(
    //     allAvailableCombinations?.customizable_color_stones?.[0]?.color_stone_id
    //   );
    setUniqueMetalCombinations(uniqueAllProductCombinations);
  };

  useEffect(() => {
    getAllProductCombinations();
  }, [selectedProducts, productCombinations]);

  const applyCustomisationHandler = () => {
    let obj: ICustomiseData = {};
    const customiseData: ICustomiseData[] = [];
    if (diamond) {
      obj["diamond_quality_id"] = diamond;
    }
    if (selectedPriceType) {
      obj["metal_type"] = selectedPriceType;
    }
    if (metalColor) {
      obj["metal_type_id"] = metalColor;
    }
    if (metalPurity) {
      obj["metal_purity_id"] = metalPurity;
    }
    if (colorStone) {
      obj["color_stone_id"] = colorStone;
    }
    if (Object.keys(obj)?.length > 0 && selectedProducts?.length > 0) {
      selectedProducts?.map((product) =>
        customiseData.push({
          cart_item: product?._id,
          item_id: product?.item_id,
          qty: product?.qty,
          net_weight: product?.total_rate_card_Details?.net_weight,
          product_id: product?.product_id,
          ...obj,
        })
      );
      CustomizeProductData(customiseData);
      setDiamond("");
      setColorStone("");
    }else{
      showError("Please select any product")
    }
  };

  const metalPurityList = useMemo(() => {
    const metal = uniqueMetalCombinations?.[selectedPriceType!];
    if (!metal?.length) {
      return [];
    }
    const metalPurityList = metal
      .filter(
        (obj, index: number, self) =>
          index ===
          self.findIndex(
            (o) =>
              o.metal_purity_id === obj.metal_purity_id &&
              o.metal_purity_name === obj.metal_purity_name
          )
      )
      .map((i) => {
        return {
          metal_purity_id: i.metal_purity_id,
          metal_purity_name: i.metal_purity_name,
        };
      });
    if (metalPurityList?.length) {
      setMetalPurity(metalPurityList[0]?.metal_purity_id);
    }
    return metalPurityList;
  }, [selectedPriceType, uniqueMetalCombinations]);

  const metalColorList = useMemo(() => {
    const metal = uniqueMetalCombinations?.[selectedPriceType];
    if (!metal?.length) {
      return [];
    }
    const metalColorList = metal.filter(
      (obj) => obj.metal_purity_id === metalPurity
    );

    if (!metalColor) {
      setMetalColor(metalColorList?.[0]?.metal_type_id);
    }
    if (metalColorList?.length <= 0) {
      setMetalColor("");
    }
    return metalColorList;
  }, [uniqueMetalCombinations, selectedPriceType, metalColor, metalPurity]);

  return (
    <section className="filter-section">
      <div className="container">
        <form>
          <div className="form-group">
            <label>Metal Type</label>
            <select
              className="form-control custom-select"
              onChange={(e) => setSelectedPriceType(e.target.value)}
              value={selectedPriceType}
            >
              {priceTypeList?.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Metal Purity</label>
            <select
              className="form-control custom-select"
              onChange={(e) => setMetalPurity(e.target.value)}
              value={metalPurity}
            >
              {metalPurityList?.map((options) => (
                <option
                  key={options?.metal_purity_id}
                  value={options?.metal_purity_id}
                >
                  {options?.metal_purity_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Metal Color</label>
            <select
              className="form-control custom-select"
              onChange={(e) => setMetalColor(e.target.value)}
              value={metalColor}
            >
              {metalColorList?.map((options) => (
                <option
                  key={options?.metal_type_id}
                  value={options?.metal_type_id}
                >
                  {options?.metal_type_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Diamond</label>
            <select
              className="form-control custom-select"
              onChange={(e) => setDiamond(e.target.value)}
              value={diamond}
            >
              <option value="">Select Diamond</option>
              {allAvailableCombinations?.customizable_diamonds?.map(
                (options) => (
                  <option
                    key={options?._id}
                    value={options?.diamond_quality_id}
                  >
                    {options?.diamond_quality_name}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="form-group">
            <label>Color Stone</label>
            <select
              className="form-control custom-select"
              onChange={(e) => setColorStone(e.target.value)}
              value={colorStone}
            >
              <option value="">Select Color Stone</option>
              {allAvailableCombinations?.customizable_color_stones?.map(
                (options) => (
                  <option key={options?._id} value={options?.color_stone_id}>
                    {options?.color_stone_name}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={() => applyCustomisationHandler()}
          >
            Apply
          </button>
        </form>
      </div>
    </section>
  );
};

export default CustomiseBar;
