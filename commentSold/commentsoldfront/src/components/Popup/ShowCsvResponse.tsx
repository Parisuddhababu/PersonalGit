"use client";
import React from "react";
import { ICsvPopupProps } from "@/types/components";
import Modal from "react-modal";
import "@/styles/pages/product-catalog-management.scss";
import "@/styles/pages/influencer.scss";

const ShowCsvResponse = ({ open, onClose, data }: ICsvPopupProps) => {

  return (
    <Modal isOpen={open} contentLabel="Example Modal">
      <h3 className='spacing-40'>Rejected Products</h3>
      <button onClick={onClose} className="modal-close">
        <i className="icon-close"></i>
      </button>
        <div className='modal-body scrollbar-sm rejected-products-modal-body'>
          <div className="table-responsive spacing-40">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((product) => {
                  return (
                    <tr key={product?.reason?.data?.sku}>
                      <td>{product?.reason?.data.name ?? ""}</td>
                      <td>{product?.reason?.data.sku ?? ""}</td>
                      <td>{product?.reason?.data.size ?? ""}</td>
                      <td>{product?.reason?.data.price ?? ""}</td>
                      <td>
                        {product?.reason?.error?.details?.reduce(
                          (pre, current) =>
                            `${pre && pre + ","}${current.message}`,
                          ""
                        ) ?? ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
    </Modal>
  );
};

export default ShowCsvResponse;
