import { useCallback, useEffect, useRef, useState } from "react";
import ServicesList from "./components/ServicesList ";
import ServiceSidePanel from "./components/ServiceSidePanel";
import { Section } from "../../common/Section";
import { IServiceWeServed } from "src/@types/brainvire_poc";

const ServicesWeServed = (props: IServiceWeServed) => {
  const { title, data, sub_line, case_study_url, text_for_the_search_product } =
    props;
  const [shouldDisplay, setShouldDisplay] = useState(window.innerWidth > 990);

  const activeBoxRef = useRef(null);
  const activeBoxRowRef = useRef(null);
  const setActiveBox = (index: number): void => {
    const clickedBoxRef: HTMLElement = document.getElementById(
      `services-box-${index}`
    );
    const clickedBoxRowRef: HTMLElement = document.getElementById(
      `services-box-row-${index}`
    );

    if (activeBoxRef.current) {
      activeBoxRef.current.classList.remove("active");
      activeBoxRowRef.current.classList.remove("show");
    }

    if (index !== null && clickedBoxRef && clickedBoxRowRef) {
      clickedBoxRef.classList.add("active");
      clickedBoxRowRef.classList.add("show");
    }

    activeBoxRef.current = index !== null ? clickedBoxRef : null;
    activeBoxRowRef.current = index !== null ? clickedBoxRowRef : null;
  };
  const handleBoxClick = useCallback((index: number): void => {
    const isActive: boolean =
      activeBoxRef.current !== null &&
      activeBoxRef.current.id === `services-box-${index}`;
    setActiveBox(isActive ? null : index);
  }, []);

  useEffect((): void => {
    setActiveBox(0);
    const handleResize = () => {
      setShouldDisplay(window.innerWidth > 990);
    };

    window.addEventListener("resize", handleResize);
  }, [handleBoxClick]);

  return (
    <Section
      className="services-we-served"
      header={{
        title: title,
        title_tag: "h2",
        title_class: "",
      }}
      containerInclude={true}
    >
      <div className="section-grid">
        <div className="section-grid-item services-we-served-list">
          <ServicesList
            data={data}
            activeBoxRef={activeBoxRef}
            activeBoxRowRef={activeBoxRowRef}
            handleBoxClick={handleBoxClick}
          />
        </div>
        {shouldDisplay && (
          <ServiceSidePanel
            title={title}
            sub_line={sub_line}
            case_study_url={case_study_url}
            product_search_text={text_for_the_search_product}
          />
        )}
      </div>
    </Section>
  );
};

export default ServicesWeServed;
