import { ISection } from ".";
import cn from "classnames";

const SectionHead = ({ header }: ISection) => {
  const {
    title_tag: HeadTag,
    title,
    title_class,
    sub_title,
    sub_title_class,
    custom_Header,
  } = header;

  return (
    <div className="title">
      <div>
        <HeadTag className={cn({ [title_class]: title_class })}>
          {title}
        </HeadTag>
        {sub_title && <div className={sub_title_class}>{sub_title}</div>}
      </div>
      {custom_Header}
    </div>
  );
};
export default SectionHead;
