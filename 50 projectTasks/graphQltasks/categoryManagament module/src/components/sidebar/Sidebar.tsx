import { ROUTES } from "@config/constant";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Sidebar.module.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <aside className='min-w-[12vw] text-white h-100 overflow-y-auto py-10 sticky top-0 bg-slate-700'>
      <ul className='max-h-full overflow-y-auto'>
        <li className='hover:bg-red-600 '>
          <p
            onClick={() => navigate(`/${ROUTES.app}/${ROUTES.category}`)}
            className='inline-block align-baseline font-serif text-sm
                                text-white  px-3 m-1'
          >
            {t(" Category")}
          </p>
        </li>
      </ul>
    </aside>
  );
};

export default React.memo(Sidebar);
