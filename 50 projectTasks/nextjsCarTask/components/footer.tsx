import { footerLinks } from "@/constants";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col text-black-100  mt-5 border-t border-gray-100">
      <div className="flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16 px-6 py-10">
        <div className="className='flex flex-col justify-start items-start gap-6'">
          <p className="text-base text-gray-700">
            Carhub 2023 <br />
            All Rights Reserved &copy;
          </p>
        </div>

        <div className="footer__links-container">
          <div className="footer__links">
            {footerLinks.map((link) => (
              <div className="footer__link" key={link.title}>
                <h3 className="font-bold">{link.title}</h3>
                {link.links.map((item) => (
                  <Link
                    className="text-gray-500"
                    href={item.url}
                    key={item.title}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap mt-10 border-t border-gray-100 sm:px-16 px-6 py-10">
          <p>@2023 CarHub. All rights reserved</p>

          <div className="footer__copyrights-link">
            <Link href="/" className="text-gray-500">
              Privacy & Policy
            </Link>
            <Link href="/" className="text-gray-500">
              Terms & Condition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
