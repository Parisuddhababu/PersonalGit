import { Fragment } from "react";
import { ILink, IServiceWeServedData } from "src/@types/brainvire_poc";
import {
  BottomLeftCurveSvg,
  BottomRightCurveSvg,
  ButtonDownArrowIcon,
  RightSquareCornerSvg,
} from "../../../assets/Icons";
import { uuid } from "../../../utils/uuid";

const ServicesList = ({
  data,
  activeBoxRef,
  activeBoxRowRef,
  handleBoxClick,
}) => {
  return (
    <div className="services-box-grid">
      {data?.map((item: IServiceWeServedData, index: number) => (
        <Fragment key={uuid()}>
          <div
            id={`services-box-${index}`}
            className={`services-box-item ${
              activeBoxRef.current &&
              activeBoxRef.current.id === `services-box-${index}`
                ? "active"
                : ""
            }`}
            onKeyDown={(event): void => {
              // Handle keyboard events (e.g., Enter key)
              event.key === "Enter" && handleBoxClick(index);
            }}
            tabIndex={0} // Add a tabIndex to make it focusable
            onClick={() => handleBoxClick(index)}
          >
            <div className="services-box-item-header">
              <div className="services-box-item-left">
                <div className="services-box-icon">
                  <img
                    src={item?.service_icon}
                    alt="Services Icon"
                    height={50}
                    width={45}
                    title="Services Icon"
                  />
                </div>

                <div className="h6 services-box-title">
                  {item?.service_title}
                </div>
              </div>

              <span className="services-box-down-icon">
                <ButtonDownArrowIcon />
              </span>
            </div>

            <div className="services-box-right-corner">
              <RightSquareCornerSvg />
            </div>

            <div className="bottom-left-curve">
              <BottomLeftCurveSvg />
            </div>

            <div className="bottom-right-curve">
              <BottomRightCurveSvg />
            </div>
          </div>
          <div
            id={`services-box-row-${index}`}
            className={`services-box-item services-box-item-row ${
              activeBoxRowRef.current === `services-box-row-${index}`
                ? "show"
                : ""
            }`}
          >
            <ul className="services-box-list-nav">
              {item?.links.map((link_item: ILink) => (
                <li key={uuid()}>
                  <a href={link_item?.url} target={link_item?.target}>
                    {link_item?.title}
                  </a>
                </li>
              ))}
            </ul>
            <div className="services-box-right-corner">
              <RightSquareCornerSvg />
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default ServicesList;
