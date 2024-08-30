"use client";
import React, { useState, useEffect } from "react";
import { ProductsData, ClickedData } from "@/types";

const Products = () => {
  const [products, setProducts] = useState<ProductsData>();
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [rating, setRating] = useState<number>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [clickedId, setClickedId] = useState<ClickedData>();

  /*fetching data*/
  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);
  /*for category select*/
  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };
  /*for price handler*/
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(+event.target.value);
  };
  /*for rating handler */

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(+event.target.value);
  };
  /*filter products based on user selection*/
  const filteredProducts = products?.products?.filter((item) => {
    if (category && item?.category !== category) return false;
    if (price && item?.price < +price) return false;
    if (rating && item?.rating < +rating) return false;
    return true;
  });
  return (
    <div className="mx-4 my-8">
      <form>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
            id="category"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="">all</option>
            <option value="fragrances">fragrances</option>
            <option value="skincare">skincare</option>
            <option value="groceries">groceries</option>
            <option value="smartphones">smartphones</option>
            <option value="laptops">laptops</option>
          </select>
        </div>
        <div>
          <label htmlFor="Price">Price</label>
          <input
            className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
            type="number"
            id="Price"
            min={0}
            placeholder="enter price above"
            onChange={handlePriceChange}
          />
        </div>
        <div>
          <label htmlFor="rating">rating</label>
          <input
            className=" cursor-pointer block w-full rounded-md border-0 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:max-w-xs sm:text-sm sm:leading-6"
            type="number"
            id="rating"
            min={0}
            placeholder="enter rating above"
            onChange={handleRatingChange}
          />
        </div>
      </form>
      <div className="home__cars-wrapper ">
        {(filteredProducts?.length as number) < 1 && (
          <h1 className="text-blue-500 font-extrabold text-center m-auto">
            No Data Presents
          </h1>
        )}
        {filteredProducts?.map((product) => (
          <div key={product.id} className="car-card text-center">
            <p
              key={product.id}
              className="car-card__content-title mt-5 mb-4 text-blue-600 font-serif"
            >
              {product.title}
            </p>
            <img
              src={product.images[0]}
              className="car-card__image cursor-pointer"
              onClick={() => {
                setShowModal(true);

                setClickedId(product);
              }}
            />
            {/* show model popUp */}
            {showModal && (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl h-20">
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="m-3 text-white bg-red-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        type="button"
                        onClick={() => setShowModal(false)}
                      >
                        Close
                      </button>
                    </div>
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div className="flex items-center justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>
                      {/*body*/}

                      <div
                        key={clickedId?.id}
                        className="relative p-6 flex-auto"
                      >
                        {/* model data */}
                        <div>
                          <img
                            style={{ width: 300, height: 200 }}
                            src={clickedId?.images[0]}
                          />
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Title:{clickedId?.title}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Brand:{clickedId?.brand}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Category:{clickedId?.category}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Price:{clickedId?.price}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Rating:{clickedId?.rating}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Stock:{clickedId?.stock}
                          </p>
                          <p className="mt-5 mb-4 text-blue-600 font-serif ">
                            Discount %:{clickedId?.discountPercentage}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
