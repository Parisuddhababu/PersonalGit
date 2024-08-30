"use client";

import { useRouter } from "next/navigation";

import { ShowMoreProps } from "@types";
import { updateSearchParams } from "@utils";
import { CustomButton } from "@components";

const ShowMore = ({ pageNumber, isNext }: ShowMoreProps) => {
  const router = useRouter();

  const handleNavigation = () => {
    /*setting limit for dispalying cars*/
    const newLimit = (pageNumber + 1) * 10;
    const newPathname = updateSearchParams("limit", `${newLimit}`);
    router.push(newPathname);
  };

  return (
    <div className="w-full flex-center gap-5 mt-10">
      {/* for ten more products  */}
      {!isNext && (
        <CustomButton
          btnType="button"
          title="Show More Cars"
          containerStyles="bg-primary-blue rounded-full text-white"
          handleClick={handleNavigation}
        />
      )}
    </div>
  );
};

export default ShowMore;
