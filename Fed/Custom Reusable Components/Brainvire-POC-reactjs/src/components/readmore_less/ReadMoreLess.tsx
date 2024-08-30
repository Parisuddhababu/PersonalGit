import { useEffect, useRef } from "react";
import TextTrimData from "./components/TextTrimData";
import { Section } from "../../common/Section";
import { accordionScreenValidation } from "../../hooks/accordionScreenValidation";
import { useAccordion } from "../../hooks/useAccordion";
import { RightSquareCornerSvg } from "../../assets/Icons";
import { ILatestThinkingSectionProps } from ".";

const ReadMoreLess = (props: ILatestThinkingSectionProps) => {
  const activeBoxRef = useRef(null);
  const scrollToElement = useAccordion();

  const setActiveBox = (indexPosition: number): void => {
    if (activeBoxRef.current !== null) {
      const prevActiveBoxRef: HTMLElement = document.getElementById(
        `services-offering-item-${activeBoxRef.current}`
      );
      if (prevActiveBoxRef) {
        prevActiveBoxRef.classList.remove("active");
      }
    }

    if (indexPosition !== null) {
      const clickedBoxRef: HTMLElement = document.getElementById(
        `services-offering-item-${indexPosition}`
      );
      if (clickedBoxRef) {
        clickedBoxRef.classList.add("active");
      }
    }

    activeBoxRef.current = indexPosition as null;
  };

  const sortedItemData = (itemArr) => {
    const oddItemData = [];
    const evenItemData = [];
    itemArr.forEach((data, indexPosition): void => {
      const container = indexPosition % 2 === 0 ? evenItemData : oddItemData;
      container.push({ data, indexPosition });
    });

    return { oddItemData, evenItemData };
  };

  const { oddItemData, evenItemData } = sortedItemData(props?.list);

  const handleBoxClick = (index: number): void => {
    accordionScreenValidation(
      index,
      activeBoxRef,
      setActiveBox,
      768,
      `services-offering-item-${index}`,
      9,
      scrollToElement
    );
  };

  useEffect((): void => {
    setActiveBox(0);
  }, []);

  const renderServiceItem = (item, index: number) =>
    item?.data?.description && (
      <div
        id={`services-offering-item-${item.indexPosition}`}
        className={`services-offering-item ${
          activeBoxRef.current &&
          activeBoxRef.current.id ===
            `services-offering-item-${item?.indexPosition}`
            ? "active"
            : ""
        }`}
        key={index}
        onClick={(): void => {
          handleBoxClick(item?.indexPosition);
        }}
        onKeyDown={(event): void => {
          // Handle keyboard events (e.g., Enter key)
          event.key === "Enter" && handleBoxClick(item?.indexPosition);
        }}
        tabIndex={0} // Add a tabIndex to make it focusable
      >
        <div className="services-offering-item-wrapper">
          <div className="services-offering-item-inner">
            <div className="services-offering-item-header">
              <div className="services-offering-icon">
                {item?.data?.image && (
                  <img
                    src={item?.data?.image}
                    alt={item?.data?.title}
                    title={item?.data?.title}
                    height={50}
                    width={50}
                    loading="lazy"
                  />
                )}
              </div>
              <div
                className="h5 services-offering-title"
                dangerouslySetInnerHTML={{ __html: item?.data?.title }}
              />
            </div>
            <TextTrimData
              textData={item?.data?.description}
              dataIndex={item?.indexPosition}
            />
          </div>
          <div className="services-offering-right-corner">
            <RightSquareCornerSvg />
          </div>
        </div>
      </div>
    );

  return (
    <Section
      className="individual-services-offering"
      header={{
        title: props?.title,
        title_tag: "h2",
        sub_title: props?.description,
        sub_title_class: "sub-title",
      }}
      containerInclude={true}
    >
      {props?.list?.length > 0 && (
        <div className="services-offering-grid">
          <div> {oddItemData?.map(renderServiceItem)}</div>
          <div> {evenItemData?.map(renderServiceItem)}</div>
        </div>
      )}
    </Section>
  );
};

export default ReadMoreLess;
