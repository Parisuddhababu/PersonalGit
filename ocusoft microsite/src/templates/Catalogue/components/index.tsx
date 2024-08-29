import { getTypeWiseComponentName } from "@util/common";

import CatalogueBanner from "@templates/Catalogue/components/CatalogueBanner";
import CatalogueList from "@templates/Catalogue/components/CatalogueList";
import { ICatalogueList1Props } from "@type/Pages/catalogue";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    catalogue_banner_1: CatalogueBanner,
    catalogue_list_1 : CatalogueList
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */

export const getComponents = (type: string, name: string, props: ICatalogueList1Props) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
