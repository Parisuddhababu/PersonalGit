import { useState } from "react";
import {
  Bars3BottomRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { uuid } from "../utils/uuid";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [selectedSubMenu, setSelectedSubMenu] = useState(null);

  const Links = [
    { name: "HOME", link: "/" },
    {
      name: "Services",
      sublinks: [
        { name: "Masonry Store", link: "/masonry-store" },
        { name: "Industry we serve", link: "/industry-we-serve" },
        { name: "Youtube Video", link: "/youtube_video" },
        { name: "Services We Served", link: "/ServicesWeServed" },
        { name: "OurSuccessStories", link: "/OurSuccessStories" },
        { name: "OurClientSay", link: "/OurClientSay" },
        { name: "Marquee Slider", link: "/marquee_slider" },
        { name: "Readmore & Less", link: "/readmore_less" },
      ],
    },
  ];

  const handleSubMenuClick = (index) => {
    setSelectedSubMenu(index);
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-50">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        {/* logo section */}
        <div className="font-bold text-2xl cursor-pointer flex items-center gap-1">
          {/* <BookOpenIcon className="w-7 h-7 text-blue-600" /> */}
          <a href="/">
            <img
              src="https://i.ibb.co/whpM3Tc/Brainvire-Logo.png"
              alt="Brainvire-Logo"
              className="w-7"
            />
          </a>
          <span>Brainvire</span>
        </div>
        {/* Menu icon */}
        <div
          onClick={() => setOpen(!open)}
          className="absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7"
        >
          {open ? <XMarkIcon /> : <Bars3BottomRightIcon />}
        </div>
        {/* link items */}
        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-blue-50 md:z-auto z-40 left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-12" : "top-[-490px]"
          }`}
        >
          {Links.map((link, index) => (
            <li
              className="md:ml-8 md:my-0 my-7 font-semibold relative"
              key={index}
            >
              {link.sublinks ? (
                <>
                  <div
                    className="text-gray-800 cursor-pointer hover:text-blue-400 duration-500"
                    onClick={() => handleSubMenuClick(index)}
                  >
                    {link.name}
                  </div>
                  {subMenuOpen && selectedSubMenu === index && (
                    <ul className="absolute top-0 no-underline mt-10 bg-white shadow-lg md:shadow-none" >
                      {link.sublinks.map((sublink) => (
                        <li className="py-2 px-4" key={uuid()}>
                          <a
                            href={sublink.link}
                            className="text-gray-800 hover:text-blue-400 duration-500 block"
                          >
                            {sublink.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <a
                  href={link.link}
                  className="text-gray-800 hover:text-blue-400 duration-500"
                >
                  {link.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Header;
