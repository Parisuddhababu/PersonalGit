import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import React, { useEffect, useMemo, useState } from "react";
import { IBlueDartProps } from ".";

const BlueDartTracking = ({ productId }: IBlueDartProps) => {
  const [deliveryData, setDeliveryData] = useState<any>();

  const getBludartTrackingData = async () => {
    try {
      const response = await pagesServices.postPage(APICONFIG.BLUE_DART_TRACKING, {
        uuid: productId,
      });
      if (!response?.meta?.status) {
        return;
      }
      setDeliveryData(response?.data?.Shipment?.Scans?.ScanDetail);
    } catch (error) {
    }
  };

  useEffect(() => {
    getBludartTrackingData();
  }, []);

  const isStarted = useMemo(() => {
    return Array.isArray(deliveryData)
  }, [deliveryData])

  const isDone = (scan: string) => {
    if (!isStarted) {
      return undefined
    }
    return deliveryData?.filter((i: any) => String(i?.ScanType).toLocaleUpperCase() === scan)
  }

  return (
    <div className="order-items-box">
      <br />
      <h4>Order Tracking</h4>

      <div className="bluedart-container">
        <div className="flex-row">
          <div
            className={`order-tracking completed`}
          >
            <span className="is-complete"></span>
            <p>
              Pickup registered
              <br />
              <span>{isDone('PU')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div>

          <div
            className={`order-tracking ${isStarted && isDone('UD')?.length ? "completed" : ""}`}
          >
            <span className="is-complete"></span>
            <p>
              In Transits
              <br />
              <span>{isDone('UD')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div>
          <div
            className={`order-tracking ${isStarted && isDone('DL')?.length ? "completed" : ""}`}
          >
            <span className="is-complete"></span>
            <p>
              Delivered
              <br />
              <span>{isDone('DL')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div>
          {/* <div
            className={`order-tracking ${isStarted && isDone('SHIPMENT ARRIVED')?.length ? "completed" : ""}`}
          >
            <span className="is-complete"></span>
            <p>
              Order shipped
              <br />
              <span>{isDone('PICKUP HAS BEEN REGISTERED')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div>
          <div
            className={`order-tracking ${isStarted && isDone('SHIPMENT OUT FOR DELIVERY')?.length ? "completed" : ""}`}
          >
            <span className="is-complete"></span>
            <p>
              Out for delivery
              <br />
              <span>{isDone('PICKUP HAS BEEN REGISTERED')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div>
          <div
            className={`order-tracking ${isStarted && isDone('SHIPMENT DELIVERED')?.length ? "completed" : ""}`}
          >
            <span className="is-complete"></span>
            <p>
              Order delivered
              <br />
              <span>{isDone('PICKUP HAS BEEN REGISTERED')?.[0]?.ScanDate ?? ''}</span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default BlueDartTracking;
