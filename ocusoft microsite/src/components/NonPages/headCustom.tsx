import { Head } from "next/document";

class HeadCustom extends Head {
  getPreloadMainLinks() {
    return [];
  }

  getPreloadDynamicChunks() {
    return [];
  }
}

export default HeadCustom;
