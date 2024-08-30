import Header from "@/components/Header";
import { ToastContainer } from "react-toastify";
import { ApolloWrapper } from "@/framework/graphql";
import { Providers } from "@/framework/redux/Provider";
import Loader from "@/components/Loader/Loader";
import LandingPageFooter from "@/components/LandingPage/landing-page-footer";
import "react-toastify/dist/ReactToastify.css";
import { headers } from "next/headers";
import { getPrimaryColor } from "@/utils/api/preFetch";
import NotFound from "./not-found";
export const revalidate = 2;

async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = headers().get("host");
  let isBrandRegister = true;
  const defaultPrimaryColor = await getPrimaryColor(host);

  // if(host){
  //    isBrandRegister = await findBrandRegister(host);
  // }

  return (
    <html lang="en">
      <body>
        {isBrandRegister ? (
          <Providers>
            <ApolloWrapper>
              <Loader />
              <Header primaryColor={defaultPrimaryColor} />
              <ToastContainer />
              <div className="body-middle-content">{children}</div>
              <LandingPageFooter />
            </ApolloWrapper>
          </Providers>
        ) : (
          <NotFound isBrandRegister={isBrandRegister}/>
        )}
      </body>
    </html>
  );
}

export default RootLayout;
