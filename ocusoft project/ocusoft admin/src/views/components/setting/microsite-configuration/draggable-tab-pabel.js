import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import "../../../../scss/microsite.scss";

import React from "react";
import CIcon from "@coreui/icons-react";
import { cilCursorMove } from "@coreui/icons";

const DraggableTabPanel = ({
    activeIndex,
    onTabChange,
    header,
    keyIndex,
    dragStart,
    dragEnter,
    dragEnd,
    removeSectionTab,
    isRemovable,
}) => {
    return (
        <li
            className={
                `p-unselectable-text ${keyIndex === activeIndex ? 'p-tabview-selected p-highlight' : ''
                }`
            }
            role="presentation"
            draggable
            onDragStart={() => dragStart()}
            onDragEnter={() => dragEnter()}
            onDragEnd={() => dragEnd()}
        >
            <a role="tab" className="p-tabview-nav-link" tabIndex="0" onClick={() => onTabChange()}>
                <div className="p-tabview-title">
                    <CIcon icon={cilCursorMove} />&nbsp;&nbsp;{header}&nbsp;&nbsp;
                </div>

                {
                    isRemovable && (
                        <span className={'close-tab'} onClick={e => removeSectionTab(e)}>
                            &times;
                        </span>
                    )
                }
            </a>
        </li>
    )
}

export default DraggableTabPanel;
