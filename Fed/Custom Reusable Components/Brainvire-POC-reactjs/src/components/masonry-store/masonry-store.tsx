import { useRef } from "react";
import ContactUsButtonBg from "../../assets/images/contact-us-btn-bg.png";
import Section from "../../common/Section/Section";
import { IListItem, ISectionTwo } from "src/@types/brainvire_poc";
import { uuid } from "../../utils/uuid";
import {
  BtnRightArrow,
  ButtonDownArrowIcon,
  TopRightAngleArrow,
} from "../../assets/Icons";

const MasonryStore = (props: ISectionTwo) => {
  const cts_link: IListItem = props?.list?.find((item: IListItem) => item?.cta);
  const activeBoxRef = useRef<HTMLElement | null>(null);
  const columnHalfIndices = [
    {
      id: 0,
      set: [3, 4],
    },
    {
      id: 1,
      set: [3, 4],
    },
    {
      id: 2,
      set: [4, 5],
    },
    {
      id: 3,
      set: [6, 7],
    },
    {
      id: 4,
      set: [6, 7],
    },
    {
      id: 5,
      set: [1, 2],
    },
    {
      id: 6,
      set: [3, 4],
    },
    {
      id: 7,
      set: [4, 5],
    },
  ];
  const toggleClassById = (
    elementId: string,
    className: string,
    toggle: boolean
  ): void => {
    const element: HTMLElement = document.getElementById(elementId);
    if (element) {
      if (toggle) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  };
  const addColumnHalfClasses = (index: number): void => {
    const columnHalfSet = columnHalfIndices.find(
      (item): boolean => item.id === index
    );
    if (columnHalfSet && window.innerWidth >= 1024) {
      columnHalfSet.set.forEach((setIndex: number): void => {
        toggleClassById(`masonry-box-${setIndex}`, "column-half", true);
      });
    }
  };
  const removeClasses = (): void => {
    if (activeBoxRef.current) {
      toggleClassById(activeBoxRef.current.id, "active", false);
      if (window.innerWidth >= 1024) {
        columnHalfIndices.forEach((item): void => {
          item.set.forEach((setIndex: number): void => {
            toggleClassById(`masonry-box-${setIndex}`, "column-half", false);
          });
        });
      }
    }
  };
  const handleToggleBox = (index: number): void => {
    if (
      activeBoxRef.current &&
      activeBoxRef.current.id === `masonry-box-${index}`
    ) {
      removeClasses();
      activeBoxRef.current = null;
    } else {
      removeClasses();
      addColumnHalfClasses(index);
      toggleClassById(`masonry-box-${index}`, "active", true);
      activeBoxRef.current = document.getElementById(`masonry-box-${index}`);
    }
  };
  const handleDropDown = (index: number): void => {
    handleToggleBox(index);
  };
  return (
    <Section
      className="masonry-store-section"
      header={{
        title: props?.title,
        title_tag: "h2",
      }}
      containerInclude={true}
    >
      {props?.list?.length > 0 && (
        <div className="masonry-store-grid">
          {props?.list.map((item: IListItem, index: number) => (
            <div
              key={uuid()}
              id={`masonry-box-${index}`}
              tabIndex={0} // Make the element focusable
              className={`masonry-store-item ${
                activeBoxRef.current &&
                activeBoxRef.current.id === `masonry-box-${index}`
                  ? "active"
                  : ""
              }`}
              onClick={(): void => {
                handleDropDown(index);
              }}
              onKeyDown={(event): void => {
                // Trigger the same action on Enter key press
                event.key === "Enter" && handleDropDown(index);
              }}
            >
              <div className="top-right-arrow">
                <span className="arrow-desktop">
                  <TopRightAngleArrow />
                </span>
                <span className="arrow-mobile">
                  <ButtonDownArrowIcon />
                </span>
              </div>

              <div className="masonry-store-item-header">
                <div className="masonry-store-icon">
                  <img  
                    src={item?.image}
                    alt={item?.title}
                    height={30}
                    width={30}
                  />
                </div>

                <div className="h6 masonry-store-title">{item?.title}</div>
              </div>

              <div className="masonry-store-item-content">
                <p>{item?.description}</p>
              </div>
            </div>
          ))}
          <a
            className="btn btn-primary btn-icon btn-contact-us"
            href={cts_link?.cta?.url}
          >
            <img src={ContactUsButtonBg} alt="" />

            <span className="btn-content">{cts_link?.cta?.title}</span>

            <span className="btn-svg-icon">
              <BtnRightArrow />
            </span>
          </a>
        </div>
      )}
    </Section>
  );
};

export default MasonryStore;
