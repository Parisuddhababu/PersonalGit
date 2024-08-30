import { FC } from "react";
import { IindustryData } from "src/@types/brainvire_poc";

interface TopSectionDataProps {
  industry: IindustryData;
}

export const TopSectionData: FC<TopSectionDataProps> = ({ industry }) => {
  return (
    <div className="serve-top">
      <div
        id={industry.industry_title}
        className={`serve-panel active`}
        key={industry.industry_title}
        data-value={industry.industry_title}
      >
        <div className="serve-panel-right">
          <div className="serve-panel-right-image">
            <img
              src={industry.industry_image}
              alt={industry.industry_title}
              title={industry.industry_title}
              height={284}
              width={464}
              loading="lazy"
            />
          </div>
        </div>
        <div className="serve-panel-left">
          <h2 className="title">{industry.industry_title}</h2>
          <p dangerouslySetInnerHTML={{ __html: industry.descriptions }} />
          <div className="serve-panel-action">
            <a href={industry.cta.url} className="btn btn-outline-primary">
              {industry.cta.title}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
