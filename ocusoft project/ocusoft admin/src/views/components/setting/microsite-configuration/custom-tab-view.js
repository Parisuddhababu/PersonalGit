import React from "react";

const CustomTabView = props => {
    return (
        <div className="p-tabview p-component">
            <div className="p-tabview-nav-container">
                {
                    props.scrollDirection === "right" && (
                        <button
                            type="button"
                            onClick={() => { props.scrollTabTo("left"); }}
                            className="p-tabview-nav-prev p-tabview-nav-btn p-link"
                        >
                            <span className="pi pi-chevron-left"></span>
                        </button>
                    )
                }

                <div className="p-tabview-nav-content">
                    <ul className="p-tabview-nav" id="section-navbar" role={'tablist'}>
                        {props.children[0]}
                    </ul>
                </div>

                {
                    props?.scrollDirection === "left" && (
                        <button
                            type="button"
                            onClick={() => { props.scrollTabTo("right"); }}
                            className="p-tabview-nav-next p-tabview-nav-btn p-link"
                        >
                            <span className="pi pi-chevron-right"></span>
                        </button>
                    )
                }
            </div>

            <div className="p-tabview-panels">
                <div className="p-tabview-panel" role={'tabpanel'}>
                    {props.children[1]}
                </div>
            </div>
        </div>
    )
}

export default CustomTabView;
