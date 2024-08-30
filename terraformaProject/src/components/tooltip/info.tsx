import React from 'react'
import { Tooltip } from './tooltip'

interface TooltipProps {
  toolTipPosition?: string,
  infoTipText?: string,
  infoText?: string,
  onClick?: React.MouseEventHandler<SVGSVGElement>,
  onLabelClick?: React.MouseEventHandler<HTMLLabelElement>,
  type?: string,
}

function Info({ toolTipPosition, infoTipText, infoText, onClick, onLabelClick, type }: Readonly<TooltipProps>) {

  const svgErrorClass = (type === 'error' ? '#D1444B' : '#76767F')
  const labelErrorClass = (type === 'error' ? 'text-themeRed font-bold' : 'text-textGrey')

  return (
    <div className='relative flex items-center mt-2 cursor-pointer group'>

      {type === 'success'
        ?
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
          <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18V18ZM9.003 14L4.76 9.757L6.174 8.343L9.003 11.172L14.659 5.515L16.074 6.929L9.003 14Z" fill="#248565" />
        </svg>
        :
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
          <path d="M8 15.5C3.85775 15.5 0.5 12.1423 0.5 8C0.5 3.85775 3.85775 0.5 8 0.5C12.1423 0.5 15.5 3.85775 15.5 8C15.5 12.1423 12.1423 15.5 8 15.5ZM8 14C9.5913 14 11.1174 13.3679 12.2426 12.2426C13.3679 11.1174 14 9.5913 14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8C2 9.5913 2.63214 11.1174 3.75736 12.2426C4.88258 13.3679 6.4087 14 8 14ZM7.25 10.25H8.75V11.75H7.25V10.25ZM8.75 9.01625V9.5H7.25V8.375C7.25 8.17609 7.32902 7.98532 7.46967 7.84467C7.61032 7.70402 7.80109 7.625 8 7.625C8.21306 7.62499 8.42173 7.56447 8.60174 7.4505C8.78175 7.33652 8.9257 7.17377 9.01683 6.98119C9.10796 6.7886 9.14253 6.5741 9.11651 6.36263C9.0905 6.15117 9.00497 5.95144 8.86987 5.78668C8.73478 5.62193 8.55568 5.49892 8.35342 5.43198C8.15115 5.36503 7.93403 5.3569 7.72732 5.40853C7.52061 5.46016 7.33281 5.56942 7.18577 5.72361C7.03874 5.8778 6.93851 6.07057 6.89675 6.2795L5.42525 5.98475C5.51647 5.52881 5.72713 5.10528 6.03569 4.75744C6.34425 4.4096 6.73964 4.14994 7.18144 4.00499C7.62325 3.86004 8.09561 3.83501 8.55026 3.93246C9.00491 4.02991 9.42553 4.24634 9.76911 4.55962C10.1127 4.8729 10.3669 5.2718 10.5058 5.71555C10.6447 6.15929 10.6633 6.63196 10.5596 7.08523C10.456 7.5385 10.2338 7.95612 9.91589 8.2954C9.59794 8.63467 9.1956 8.88343 8.75 9.01625Z" fill={`${type === 'success' ? '#248565' : svgErrorClass}`} />
        </svg>
      }

      <Tooltip
        align={toolTipPosition}
        tooltipText={infoTipText}
      />

      <label
        htmlFor="infoText"
        onClick={onLabelClick}
        className={`text-xs ml-2.5 cursor-pointer ${type === 'success' ? 'text-themeGreen font-bold' : labelErrorClass}`}>
        {infoText}
      </label>

    </div>
  )
}

export default Info;