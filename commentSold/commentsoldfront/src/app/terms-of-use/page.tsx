import "@/styles/pages/cms.scss";
import { getTermsOfUse } from "@/utils/api/preFetch";

const TermsOfUse = async () => {
    const privacyContent = await getTermsOfUse();

    return (
        <section className="cms-section">
            <div className="cms-title">
                <div className="container-md">
                    <h1>Terms of use</h1>
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
    )
}

export default TermsOfUse