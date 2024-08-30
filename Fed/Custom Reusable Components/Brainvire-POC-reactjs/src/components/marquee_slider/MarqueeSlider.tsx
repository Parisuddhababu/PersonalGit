import { IBrands, IBrandsList } from "src/@types/brainvire_poc";
import { uuid } from "../../utils/uuid";

const MarqueeSlider = ({ title, client_logo }: IBrands) => {
  const renderLogo = (item: IBrandsList) => (
    <div key={uuid()} className="marquee-item">
      <img
        src={item.logo}
        alt={item.title}
        title={item.title}
        height={65}
        width={180}
        loading="lazy"
      />
    </div>
  );
  return (
    <main className="bv-request-quote">
      <section className="trusted-client-section">
        <div className="trusted-client-box">
          <div className="container">
            <h2
              className="trusted-client-box-title"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </div>
          {client_logo?.length > 0 && (
            <>
              <div className="marquee">
                <div className="marquee__group">
                  {client_logo?.map(renderLogo)}
                </div>
                <div aria-hidden="true" className="marquee__group">
                  {client_logo?.map(renderLogo)}
                </div>
              </div>

              <div className="marquee marquee--reverse">
                <div className="marquee__group">
                  {client_logo?.map(renderLogo)}
                </div>
                <div aria-hidden="true" className="marquee__group">
                  {client_logo?.map(renderLogo)}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default MarqueeSlider;
