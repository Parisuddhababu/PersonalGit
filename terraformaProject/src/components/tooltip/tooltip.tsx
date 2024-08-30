import React from 'react';

interface PropsToolTip {
  align?: string,
  tooltipText?: string,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cls = (...classes: any) =>
  classes.filter(Boolean).length > 0 ? classes.filter(Boolean).join(' ') : null;
  

export function Tooltip(props: Readonly<PropsToolTip>) {
  return (
    <span
      className={cls(
        `${[
          'text-white text-base bg-black invisible transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 group-hover:visible absolute z-50 px-4 py-2 left-1/2 top-8 -translate-x-1/2 w-72 sm:w-[375px] after:content-[\'\'] after:absolute after:border-8 after:border-transparent after:border-b-black after:-top-4 after:left-2/4 after:-translate-x-1/2',
        ]}`,
        `${props?.align === 'right'
          ? 'md:left-[calc(100%+1rem)] md:-translate-x-0 md:!top-2/4  md:after:!-left-4 md:-translate-y-1/2 md:after:!border-b-transparent md:after:!border-r-black md:after:!top-2/4  md:after:-translate-y-1/2 md:after:!translate-x-0'
          : ''
        }`,
        `${props?.align === 'left'
          ? 'md:right-[calc(100%+1rem)] md:-translate-x-0 md:top-2/4 md:-translate-y-1/2 md:left-auto md:after:!border-b-transparent md:after:!border-l-black md:after:!-right-4 md:after:left-auto md:after:!top-2/4 md:after:-translate-y-1/2 md:after:!translate-x-0'
          : ''
        }`,
        `${props?.align === 'top'
          ? 'md:top-auto md:bottom-[calc(100%+1rem)] md:after:!border-b-transparent md:after:!border-t-black md:after:!-bottom-4 md:after:top-auto'
          : ''
        }`,
        `${props?.align === 'none'
          ? 'hidden'
          : ''
        }`
      )}
    >
      {props?.tooltipText}
    </span>
  );
}
