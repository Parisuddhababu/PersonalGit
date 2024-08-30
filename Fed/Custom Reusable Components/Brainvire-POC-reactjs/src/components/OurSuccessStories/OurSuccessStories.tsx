import { useCallback, useEffect, useRef, useState } from "react";
import { Section } from "../../common/Section";

import OurStoriesAllBgImage from "../../assets/images/our-stories-all-bg-img.png";
import {
  ICaseStudyDetailList,
  ICaseStudyHomeList,
  ICaseStudyHomePage,
} from "src/@types/brainvire_poc";
import { uuid } from "../../utils/uuid";
import { ReadMoreIcon } from "../../assets/Icons";

const OurSuccessStories = (props: ICaseStudyHomePage) => {
  const { category_title, data } = props;
  const activeIndexRef = useRef<number | null>(0);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const activeIconRef = useRef<HTMLSpanElement | null>(null);
  const activeNameRef = useRef<HTMLSpanElement | null>(null);
  const [shouldDisplay, setShouldDisplay] = useState(window.innerWidth > 980);

  const handleDropdownClick = (): void => {
    dropdownRef.current?.classList.toggle("show");
  };

  const handleItemClick = useCallback(
    (index: number): void => {
      const areasLinks: NodeListOf<Element> = document.querySelectorAll(
        ".our-stories-areas-link"
      );
      const storiesLists: NodeListOf<Element> =
        document.querySelectorAll(".our-stories-list");

      areasLinks[activeIndexRef.current]?.classList.remove("active");
      storiesLists[activeIndexRef.current]?.classList.remove("show");

      areasLinks[index].classList.add("active");
      storiesLists[index].classList.add("show");

      // Update the active index
      activeIndexRef.current = index;

      dropdownRef.current?.classList?.remove("show");

      const selectedData: ICaseStudyHomeList = data[index];
      // Update the selected icon and name refs
      activeIconRef.current.innerHTML = `<Image src="${selectedData?.category_icon}" alt="${selectedData?.industry}"
                  title="${selectedData?.industry}"
                  layout="responsive"  width="20" height="20" />`;
      activeNameRef.current.textContent = selectedData?.industry;
    },
    [data]
  );

  const handleOutsideClick = (e: MouseEvent): void => {
    const targetNode: EventTarget = e.target;
    const isDropdownVisible: boolean =
      targetNode instanceof Node &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      !document
        .querySelector(".our-stories-areas-dropdown")
        ?.contains(targetNode);

    isDropdownVisible && dropdownRef.current.classList.remove("show");
  };

  useEffect(() => {
    handleItemClick(activeIndexRef.current);
    const handleResize = () => {
      setShouldDisplay(window.innerWidth > 767);
    };
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeIndexRef, handleItemClick]);

  return (
    <Section
      className="our-success-stories"
      header={{
        title: `${category_title}`,
        title_tag: "h2",
        title_class: "",
      }}
      containerInclude={true}
    >
      <div className="our-success-stories-areas">
        <div
          className="our-stories-areas-dropdown"
          onClick={handleDropdownClick}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              // Handle keyboard interaction here, e.g., call handleDropdownClick()
              handleDropdownClick();
            }
          }}
          tabIndex={0} // This makes the div focusable
        >
          <span className="our-stories-area-icon" ref={activeIconRef} />
          <span className="our-stories-area-name" ref={activeNameRef} />
        </div>

        <ul
          className={`our-stories-areas-list${
            dropdownRef.current?.classList.contains("show") ? "show" : ""
          }`}
          ref={dropdownRef}
        >
          {data?.map((item: ICaseStudyHomeList, index: number) => (
            <li
              className="our-stories-areas-item"
              data-index={index}
              key={uuid()}
            >
              <span
                className={`our-stories-areas-link`}
                onClick={() => {
                  handleItemClick(index);
                }}
                onKeyDown={(event) => {
                  event.key === "Enter" || event.key === " " &&
                    // Handle keyboard interaction here, e.g., call handleItemClick(index)
                    handleItemClick(index);
                  
                }}
                tabIndex={0} // This makes the span focusable
              >
                <span className="our-stories-area-icon">
                  <img
                    src={item?.category_icon}
                    alt={item?.industry}
                    title={item?.industry}
                    height={20}
                    width={20}
                    loading="lazy"
                  />
                </span>
                {item?.industry}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="our-stories-wrapper">
        {data?.map((item: ICaseStudyHomeList, categoryIndex: number) => (
          <div
            className={`our-stories-list`}
            data-index={categoryIndex}
            key={uuid()}
          >
            {item?.casestudy?.map((caseStudyItem: ICaseStudyDetailList) => (
              <div className="our-stories-item" key={uuid()}>
                <div className="our-stories-info">
                  <div className="our-stories-image">
                    <span className="figure">
                      <img
                        src={caseStudyItem?.image}
                        alt="Our Success Stories"
                        title="Our Success Storie"
                        width={476}
                        height={306}
                        loading="lazy"
                      />
                    </span>
                  </div>
                  <div className="our-stories-details">
                    <div className="h4">{caseStudyItem?.title}</div>
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: caseStudyItem.description,
                        }}
                      />
                      <span className="btn-link">Read More</span>
                    </p>
                    <div className="our-stories-details-footer">
                      <a
                        href={caseStudyItem?.link.url}
                        className="btn-link btn-link-white"
                      >
                        {caseStudyItem?.link.title}
                        <span className="btn-icon btn-icon-lg">
                          <ReadMoreIcon />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="our-stories-all">
              <div className="our-stories-all-bg">
                {shouldDisplay && (
                  <img
                    src={OurStoriesAllBgImage}
                    alt="Our Stories All"
                    title="Our Stories All"
                    width={200}
                    height={306}
                    loading="lazy"
                  />
                )}

                <a
                  href={item?.page_link?.url}
                  className="btn btn-primary btn-square btn-icon"
                >
                  {item.page_link?.title}
                  <span className="btn-svg-icon">
                    <ReadMoreIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default OurSuccessStories;
