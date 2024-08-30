import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { TopSectionData } from "./components/TopSectionData";
import { IIndustrySection, IindustryData } from "src/@types/brainvire_poc";
import { SliderNextArrow, SliderPrevArrow } from "../../assets/Icons";

const IndustryWeServe = (props: IIndustrySection) => {
  const { industry_items } = props;

  const elementRef: MutableRefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);
  const [allIndustries, setAllIndustries] =
    useState<IindustryData[]>(industry_items);
  const [selectedIndustry, setSelectedIndustry] = useState<IindustryData>(
    industry_items[0]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);

  const handleDropdownClick = () => {
    const areasList: Element = document.querySelector(
      ".industry-serve-areas-list"
    );
    if (areasList) {
      areasList.classList.add("show");
    }
  };

  const handleDropdownList = useCallback(
    (item: IindustryData): void => {
      setSelectedIndustry(item);

      setAllIndustries(
        industry_items.filter(
          (el): boolean => el.industry_title !== item.industry_title
        )
      );

      const newIndex = industry_items.findIndex(
        (industry): boolean => industry.industry_title === item.industry_title
      );
      if (newIndex !== -1) {
        setActiveIndex(newIndex);
      }

      const areasList: Element = document.querySelector(
        ".industry-serve-areas-list"
      );
      if (areasList) {
        areasList.classList.remove("show");
      }
    },
    [industry_items]
  );

  const handleOutsideClick = (e: MouseEvent): void => {
    const areasList: Element = document.querySelector(
      ".industry-serve-areas-list"
    );
    const targetNode: EventTarget = e.target;
    const isDropdownVisible: boolean =
      targetNode instanceof Node &&
      areasList &&
      !areasList.contains(e.target as Node) &&
      !document
        .querySelector(".industry-serve-areas-dropdown")
        ?.contains(targetNode);

    isDropdownVisible && areasList.classList.remove("show");
  };

  const handleHorizantalScroll = (direction: number): void => {
    const newIndex: number = activeIndex + direction;
    if (newIndex >= 0 && newIndex < industry_items.length) {
      setActiveIndex(newIndex);
    }
  };

  const handlePrevClick = (): void => {
    if (activeIndex > 0) {
      const newIndex: number = activeIndex - 1;
      setActiveIndex(newIndex);
      if (newIndex < visibleItems - 1 && visibleItems > 4) {
        setVisibleItems(visibleItems - 1);
      }
      handleHorizantalScroll(-1);
    }
  };

  const handleNextClick = (): void => {
    if (activeIndex < industry_items.length - 1) {
      const newIndex: number = activeIndex + 1;
      setActiveIndex(newIndex);
      if (newIndex >= visibleItems) {
        setVisibleItems(visibleItems + 1);
      }
      handleHorizantalScroll(1);
    }
  };

  const handleItemClick = (index: number): void => {
    setSelectedIndustry(industry_items[index]);
    setActiveIndex(index);
  };

  const handleScroll = useCallback((): void => {
    if (elementRef.current) {
      elementRef.current.scrollTo({
        left: activeIndex * elementRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  useEffect((): void => {
    handleScroll();
    handleDropdownList(industry_items[activeIndex]);
    document.addEventListener("click", handleOutsideClick);
  }, [activeIndex, handleDropdownList, handleScroll, industry_items]);

  return (
    <section className="industry-serve-section">
      <div className="container">
        <p className="h6 sub-title">Industry We Serve</p>
        <div className="industry-serve-areas">
          <div
            className="industry-serve-areas-dropdown"
            onClick={handleDropdownClick}
            onKeyDown={(e) => {
              // Handle keyboard events (e.g., Enter key)
              e.key === "Enter" && handleDropdownClick();
            }}
            tabIndex={0}
          >
            <span className="industry-serve-area-name">
              {selectedIndustry.industry_title}
            </span>
          </div>

          {allIndustries?.length > 0 && (
            <ul className={`industry-serve-areas-list`}>
              {allIndustries.map((item: IindustryData) => (
                <li
                  className="industry-serve-areas-item"
                  key={item?.industry_title}
                  data-value={item?.industry_title}
                  onClick={() => handleDropdownList(item)}
                  onKeyDown={(e) => {
                    // Handle keyboard events here, e.g., check for Enter key
                    e.key === "Enter" && handleDropdownList(item);
                  }}
                  tabIndex={0} // Add a tabIndex to make the element focusable
                >
                  <span className={`industry-serve-areas-link`}>
                    {item?.industry_title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <TopSectionData industry={industry_items[activeIndex]} />
        <div className="serve-bottom">
          <div className="serve-pagination">
            <button
              className="serve-prev"
              onClick={handlePrevClick}
              disabled={activeIndex <= 0}
            >
              <SliderPrevArrow />
            </button>
            <button
              className="serve-next"
              onClick={handleNextClick}
              disabled={activeIndex >= industry_items.length - 1}
            >
              <SliderNextArrow />
            </button>
          </div>
          {industry_items?.length > 0 && (
            <div className="serve-slider" ref={elementRef}>
              {industry_items.slice(0, visibleItems).map((industry, index) => (
                <div
                  className={`serve-item ${
                    index === activeIndex ? "active" : ""
                  }`}
                  id={`serve-item-${index}`}
                  key={industry?.industry_title}
                  onClick={() => handleItemClick(index)}
                  onKeyDown={(e) => {
                    // Handle keyboard events (e.g., Enter key)
                    e.key === "Enter" && handleItemClick(index);
                  }}
                  tabIndex={0} // Enables keyboard focus
                >
                  <h5>{industry?.industry_title}</h5>
                  <p>{industry?.descriptions}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IndustryWeServe;
