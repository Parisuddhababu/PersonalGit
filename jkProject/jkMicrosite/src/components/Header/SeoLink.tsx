import React from "react";

const SeoLink = () => {
  let menus: { url: string; name: string }[] = [];

  menus = menus.filter((link) => link.url !== "#");

  return (
    <div className="clone">
      {menus?.map((link) => (
        <a href={link.url} data-link="seo-link" key={link.name}>
          {link.name}
        </a>
      ))}
    </div>
  );
};

export default SeoLink;
