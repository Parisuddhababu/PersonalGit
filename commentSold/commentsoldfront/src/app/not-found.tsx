import { IMAGE_PATH } from "@/constant/imagePath";
import Image from "next/image";
import Link from "next/link";
import "@/styles/pages/page-not-found.scss";
import "@/styles/components/header.scss";

export default async function NotFound({ isBrandRegister }: { isBrandRegister: boolean }) {
  let isBrandRegistered = isBrandRegister ?? true;
  return (
    <div className="page-not-found-section text-center">
      <Image className="spacing-30 page-not-found-image" src={IMAGE_PATH.pageNotFound} alt="page not found" width={300} height={229} style={{ objectFit: "contain" }} />
      <h1 className="spacing-10">Page Not Found</h1>
      <p className="spacing-30">
        {isBrandRegistered ? (
          "We are sorry the page you requested could not be found."
        ) : (
          <>
            No brand domain has been registered with this name yet. If you want to register please{" "}
            <Link className="link" href="https://buy.live/" target="_top">
              click here
            </Link>{" "}
            to submit your request.
          </>
        )}
      </p>
      {isBrandRegistered && (
        <Link href="/">
          <button className="btn btn-primary">Back to Home</button>
        </Link>
      )}
    </div>
  );
}
