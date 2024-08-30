import { ROUTES } from "@/config/staticUrl.config";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const useHandleCMSScroll = () => {
  const path = usePathname();

  useEffect(() => {
    if (path !== `/${ROUTES.public.privacyPolicy}` && path !== `/${ROUTES.public.termsOfUse}`) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      event.preventDefault();
      const id = (event.currentTarget as HTMLAnchorElement).getAttribute("value");
      if (id) {
        const targetElement = document.getElementById(id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    const elements = document.querySelectorAll(".privacyContent") as NodeListOf<HTMLAnchorElement>;
    elements.forEach((element) => {
      element.addEventListener("click", handleClick);
    });

    // Cleanup event listeners when the component unmounts or when privacyContent changes
    return () => {
      elements.forEach((element) => {
        element.removeEventListener("click", handleClick);
      });
    };
  }, [path]);
};

export default useHandleCMSScroll;
