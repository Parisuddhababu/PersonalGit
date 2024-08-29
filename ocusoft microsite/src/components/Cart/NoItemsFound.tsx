import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ReducerState } from "@type/Redux";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useSelector } from "react-redux";

const NoItemsFound = () => {
  const { loadingState } = useSelector((state: ReducerState) => state.loaderRootReducer)
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.noItemsFound)}
        />
      </Head>
      <main>
        <section className="no-items-found-section">
          <div className="container">
            <div className="no-items-found-wrap">
              <figure>
                <picture>
                  <source
                    srcSet="/assets/images/no-item-found.webp"
                    type="image/webp"
                  />
                  <img
                    src="/assets/images/no-item-found.webp"
                    alt="no-item-found"
                    title="no-item-found"
                    height={400}
                    width={400}
                  ></img>
                </picture>
              </figure>
              {
                !loadingState &&
                <>
                  <h2>No Cart Item found!</h2>
                  <Link href='/' aria-label="go-to-home-btn">
                    Go to home
                  </Link>
                </>
              }
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default NoItemsFound;
