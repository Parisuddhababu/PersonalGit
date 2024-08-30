import "@/styles/pages/cms.scss";
import { getPrivacyPolicy } from "@/utils/api/preFetch";

const PrivacyPolicy = async () => {
  const privacyContent = await getPrivacyPolicy();

  return (
    <section className="cms-section">
      <div className="cms-title">
        <div className="container-md">
          <h1>Privacy Policy</h1>
        </div>
      </div>
      <div className="cms-content container-md">
        <div
          dangerouslySetInnerHTML={{
            __html: privacyContent || "",
          }}
        ></div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
