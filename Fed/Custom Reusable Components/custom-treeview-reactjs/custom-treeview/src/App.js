import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

import React, { useState } from 'react';
import about_us_t1 from './assets/images/about_us_t1.png';
import about_us_t2 from './assets/images/about_us_t2.png';
import about_us_t3 from './assets/images/about_us_t3.png';
import customise_t1 from './assets/images/customise_t1.png';
import customise_t2 from './assets/images/customise_t2.png';
import customise_t3 from './assets/images/customise_t3.png';
import download_app_t1 from './assets/images/download_app_t1.png';
import download_app_t2 from './assets/images/download_app_t2.png';
import download_app_t3 from './assets/images/download_app_t3.png';
import our_product_t1 from './assets/images/our_product_t1.png';
import our_product_t2 from './assets/images/our_product_t2.png';
import our_product_t3 from './assets/images/our_product_t3.png';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

function App() {
  let [pageList, setPageList] = useState([
    {
      label: 'Home Page',
      value: 'home',
      children: [
        {
          label: 'About Us',
          value: 'about_us',
          children: [
            {
              label: about_us_t1,
              value: 'about_us_t1',
            },
            {
              label: about_us_t2,
              value: 'about_us_t2',
            },
            {
              label: about_us_t3,
              value: 'about_us_t3',
            },
          ],
        },
        {
          label: 'Customize Your Jewellery',
          value: 'customize_jewellery',
          children: [
            {
              label: customise_t1,
              value: 'customise_t1',
            },
            {
              label: customise_t2,
              value: 'customise_t2',
            },
            {
              label: customise_t3,
              value: 'customise_t3',
            },
          ],
        },
        {
          label: 'Our Product Category',
          value: 'product_category',
          children: [
            {
              label: our_product_t1,
              value: 'our_product_t1',
            },
            {
              label: our_product_t2,
              value: 'our_product_t2',
            },
            {
              label: our_product_t3,
              value: 'our_product_t3',
            },
          ],
        },
        {
          label: 'Download Our App',
          value: 'download_app',
          children: [
            {
              label: download_app_t1,
              value: 'download_app_t1',
            },
            {
              label: download_app_t2,
              value: 'download_app_t2',
            },
            {
              label: download_app_t3,
              value: 'download_app_t3',
            },
          ],
        },
      ],
    },
    {
      label: 'Product Page',
      value: 'product',
      children: [
        { label: 'Product Filter', value: 'product_filter' },
        { label: 'Product List', value: 'product_list' },
      ],
    },
    {
      label: 'Blog Page',
      value: 'blog',
      children: [
        { label: 'Blog List', value: 'blog_list' },
        { label: 'Follow Us', value: 'follow_us' },
        { label: 'Recent Posts', value: 'recent_post' },
      ],
    },
  ]);

  const expandCollapseChild = (idx) => {
    pageList[idx].open = !pageList[idx].open;
    setPageList([...pageList]);
  };

  const onHandleChangeParent = (event, idx) => {
    // Parent selection
    pageList[idx].selected = event.target.checked;
    // Select all children
    pageList[idx].children.map(
      (val, key) =>
        (pageList[idx].children[key].selected = event.target.checked)
    );
    setPageList([...pageList]);
  };
  const onHandleChangeChild = (event, idx, cidx) => {
    // Child selection
    pageList[idx].children[cidx].selected = event.target.checked;
    const selectedLength = pageList[idx].children.filter((val) => val.selected);
    // Parent selection
    if (pageList[idx].children?.length === selectedLength?.length) {
      pageList[idx].selected = true;
    } else {
      pageList[idx].selected = false;
    }
    setPageList([...pageList]);
  };
  const onHandleChangeSubChild = (event, idx, cidx, scidx) => {
    pageList[idx].children[cidx].children.map((val, key) => {
      if (key === scidx) {
        pageList[idx].children[cidx].children[key].selected = event.checked;
        return pageList[idx].children[cidx].children[key].selected;
      } else {
        pageList[idx].children[cidx].children[key].selected = false;
        return pageList[idx].children[cidx].children[key].selected;
      }
    });
    setPageList([...pageList]);
  };

  return (
    <Card>
      <div className='custom-tree'>
        {pageList.map((val, id, index) => (
          <div
            key={index}
            className={`parent ${
              val.open ? 'collapse-child' : 'expanded-child'
            }`}
          >
            <div className='col-md-12 mb-2 d-flex align-items-center custom-checkbox'>
              <Button
                icon={`pi ${val.open ? 'pi-plus' : 'pi-minus'}`}
                iconPos='right'
                className='p-button-danger collapse-expand-btn'
                onClick={() => expandCollapseChild(id)}
              />
              <Checkbox
                className='mr-2'
                inputId={`page${id}`}
                checked={val.selected}
                name={`page_${id}`}
                onChange={(e) => onHandleChangeParent(e, id)}
              ></Checkbox>
              <label className='mb-0 parent-label' htmlFor={`page${id}`}>
                {val.label}
              </label>
            </div>
            {val.children &&
              val.children.map((cval, cid) => (
                <div key={JSON.stringify(cid)} className='child'>
                  <div className='col-md-12 mb-2 d-flex align-items-center custom-checkbox child-checkbox'>
                    <Checkbox
                      className='mr-2'
                      inputId={`child${id}${cid}`}
                      checked={cval.selected}
                      name={`child_${id}_${cid}`}
                      onChange={(e) => onHandleChangeChild(e, id, cid)}
                    ></Checkbox>
                    <label className='mb-0' htmlFor={`child${id}${cid}`}>
                      {cval.label}
                    </label>
                  </div>
                  {cval.children && (
                    <div className='subchild'>
                      {cval.children.map((scval, scid) => (
                        <div
                          key={JSON.stringify(scid)}
                          className='mr-4 mb-2 d-flex align-items-center custom-checkbox'
                        >
                          <RadioButton
                            className='mr-2'
                            inputId={`subchild${id}${cid}${scid}`}
                            checked={scval.selected}
                            value={scval.selected}
                            name={`subchild_${id}_${cid}_${scid}`}
                            onChange={(e) =>
                              onHandleChangeSubChild(e, id, cid, scid)
                            }
                          ></RadioButton>
                          <label htmlFor={`subchild${id}${cid}${scid}`}>
                            <img
                              src={scval.label}
                              width='200'
                              height='100'
                              alt='template'
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default App;
