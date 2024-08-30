// Components
import { ISection } from "./index";
import SectionHead from "./SectionHead";

const Section = (props: ISection) => {
  return (
    <section className={props.className}>
      <div className="container">
        <SectionHead {...props} />
        {props.containerInclude && props.children}
      </div>
      {!props.containerInclude && props.children}
    </section>
  );
};

export default Section;
