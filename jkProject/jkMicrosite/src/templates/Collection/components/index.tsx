import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import CollectionBanner from "@templates/Collection/components/CollectionBanner";
import CollectionList from "@templates/Collection/components/CollectionList"


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  collection_banner_1: CollectionBanner,
  collection_list_1: CollectionList
};

/**
 * Render Dynamic Component
 * @param type
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
