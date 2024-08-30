import { IDropdownProps } from "@components/countrySelect";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { Message } from "@constant/errorMessage";
import pagesServices from "@services/pages.services";
import { ICountryData } from "@type/Common/Base";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
// Components

const DropdownWithSearch = (props: IDropdownProps) => {
    const [data, setData] = useState<ICountryData[]>();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState<string | undefined>(props.value);
    const [inputId] = useState<string>(props.inputId || "");

    const onHandleChange = (e: any) => {
        let val = [] as any[]
        if (data?.length) {
            // eslint-disable-next-line no-unused-vars
            val = data?.filter(a => a.name === e.target.value)
        }
        const value: string = e.target.value.trimLeft();
        e.target.value = e.target.value.trimLeft();
        setFilter(value);
        if (value === "") {
            setData([]);
        } else {
            if (value.length >= 3 && value) {
                let obj = {} as any
                if (props.label === 'country') {
                    obj.name = value
                } else if (props.label === 'city') {
                    obj.country_id = props.countryId
                    obj.state_id = props.stateId
                    obj.name = value
                } else if (props.label === 'state') {
                    obj.country_id = props.countryId
                    obj.name = value
                }
                getData(obj);
            }
        }
    }


    const countryChange = (selected: ICountryData) => {
        setFilter(selected.name);
        props.onChange(selected)
        toggleClassListHide();
    };








    useEffect(() => {
        setFilter(props.value);
        if (props?.value && props?.value?.length >= 3) {
            let obj = {} as any
            if (props.label === 'country') {
                obj.name = props.value
            } else if (props.label === 'city') {
                obj.country_id = props.countryId
                obj.name = props.value
            } else if (props.label === 'state') {
                obj.country_id = props.countryId
                obj.name = props.value
            }
            getData(obj);
        } else {
            setData([]);
        }
        // eslint-disable-next-line
    }, [props.value])

    const getData = async (value: object) => {
        await pagesServices
            .postPage(props.url, value)
            .then((result) => {
                if (result.meta && result.status_code == 200) {
                    let resData = [] as any
                    if (props.label === 'country') {
                        resData = result?.data?.country_list
                    } else if (props.label === 'city') {
                        resData = result?.data?.city_list

                    } else if (props.label === 'state') {
                        resData = result?.data?.state_list
                    }
                    // let resData = result?.data?.country_list
                    setData(resData);
                }
            });
    };



    const toggleList = () => {
        toggleClassListShow();
    };
    const toggleClassListShow = () => {
        let nodes = document.querySelector(".list-drp");
        if (props?.id) {
            nodes = document.querySelector(`#${props.id}`);
        }
        if (nodes) {

            nodes.classList.add("active");
            nodes.classList.remove("hide");

        }
    };

    const onHandleBlur = (e: any) => {
        e.preventDefault()
        let nodes = document.querySelector(".list-drp");
        if (props?.id) {
            nodes = document.querySelector(`#${props.id}`);
        }


        window.addEventListener("click", function (event) {
            if (nodes) {

                if (nodes?.classList?.contains("active")) {
                    // @ts-ignore
                    if (!event?.target?.name) {
                        toggleClassListHide()
                        // @ts-ignore
                    } else if (event?.target?.name !== props.label) {
                        toggleClassListHide()
                    }
                }
            }
        });
        // toggleClassListHide()
    }


    const toggleClassListHide = () => {
        let nodes = document.querySelector(".list-drp");
        if (props?.id) {
            nodes = document.querySelector(`#${props.id}`);
        }
        if (nodes) {
            nodes.classList.add("hide");
            nodes.classList.remove("active");
            return true;

        }
    };

    const getErrorMessage = () => {
        switch(props.label){
            case 'country' :
                return Message.NOCOUNTRY
            case 'city' :
                return Message.NOCITY
            case 'state' :
                return Message.NOSTATE
        }
    }

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href={
                        APPCONFIG.STYLE_BASE_PATH_COMPONENT +
                        CSS_NAME_PATH.countryWithPhoneSelect +
                        ".min.css"
                    }
                />
            </Head>
            {/* <p>dropdown with search</p> */}

            {/* <input type="text"
                name={props.name}
                className={props.className}
                id={props.id}
                list="country"
                placeholder={props.placeholder}
                onChange={(e) => onHandleChange(e)}
                value={props.value}

            ></input>
            <datalist id="country">
                {data?.map((item, index) => {
                    return (
                        <option className="custom-select form-control"
                            key={index} data-id={item?._id} value={item?.name}></option>
                    )
                })}
            </datalist>


            <div> */}
            <div id="cNum" className="with-otp otp-wrapper">
                <div
                    className={`country-list list-drp hide`}
                    id={props.id}
                    ref={wrapperRef}
                >
                    {/* <div className="input-col search-country-main">
                        <input
                            type="text"
                            className="form-control search-country"
                            name={`SearchCountry`}
                            onChange={(e) => onHandleChange(e)}
                            value={filter}
                            id={`SearchCountry${props.page || ""}`}
                            placeholder="Search"
                            autoComplete="off"
                        />
                    </div> */}
                    <ul>
                        {data &&
                            data?.length > 0 ?
                            data?.map((item: ICountryData, index: number) => {
                                return (
                                    <li
                                        id={`${index}`}
                                        key={index}
                                        onClick={() => countryChange(item)}

                                    >
                                        <div className="d-row" >
                                            {/* <div className="d-col d-col-2 d-col-margin d-col-margin-right">
                                                <img
                                                    src={item?.country_flag?.[0]?.path}
                                                    alt="country-flg"
                                                    className="country-flag"
                                                />
                                            </div> */}
                                            <div className="d-col d-col-2 d-col-margin ">
                                                <label className="country-value">
                                                    {/* {item?.country_phone_code} */}
                                                    &nbsp; {item.name}
                                                </label>
                                            </div>
                                        </div>
                                    </li>
                                );
                            }) :
                            <li>{getErrorMessage()}</li>
                        }

                    </ul>
                </div>

                <div >
                    <input
                        type="text"
                        placeholder={props?.placeholder}
                        className={"form-control " + props?.className}
                        id={inputId + '_' + props.page}
                        name={props.label}
                        value={filter}
                        onFocus={toggleList}
                        onBlur={(e) => onHandleBlur(e)}
                        disabled={false}
                        onChange={(e) => onHandleChange(e)}
                    />
                </div>

            </div>

        </>
    );
};

export default DropdownWithSearch;
