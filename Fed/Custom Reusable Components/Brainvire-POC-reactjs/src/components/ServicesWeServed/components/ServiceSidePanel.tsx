import { CaseStudiesIcon, SearchIcon } from "../../../assets/Icons";

const ServiceSidePanel = ({
  title,
  sub_line,
  case_study_url,
  product_search_text,
}) => {
  return (
    <div className="section-grid-item">
      <div className="services-we-served-header">
        <h2>{title}</h2>
        <p>{sub_line}</p>
        {case_study_url && (
          <a href={case_study_url?.url} className="btn-link btn-icon-left">
            <span className="btn-icon">
              <CaseStudiesIcon />
            </span>
            {case_study_url?.title}
          </a>
        )}
      </div>

      <div className="services-we-served-search">
        <div
          className="h6 services-we-served-search-content"
          dangerouslySetInnerHTML={{ __html: product_search_text }}
        />
        <div className="form-row search-input-box">
          <div className="input-col">
            <input
              type="text"
              className="form-control"
              name="search-product"
              id="search-product"
              placeholder="Search... E.g, Saas product"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            aria-label="Search button"
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ServiceSidePanel;
