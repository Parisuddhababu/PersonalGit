import React, { useCallback, useEffect, useState, useRef } from "react";
import { ICustomRangeProps } from "@components/customRangeSlider";
import Head from "next/head";
import APPCONFIG from "@config/app.config";

const CustomRangeSlider = ({
  min,
  max,
  onChange,
  currentApplyRange,
  setApplyClick,
  isDisplayApplyBtn = true,
  resetFilterButton,
}: ICustomRangeProps) => {
  const [minVal, setMinVal] = useState(currentApplyRange?.min ? currentApplyRange?.min : min);
  const [maxVal, setMaxVal] = useState(currentApplyRange?.max ? currentApplyRange?.max : max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(currentApplyRange?.min || minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Preceding with '+' converts the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent, currentApplyRange]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(currentApplyRange?.max || maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent, currentApplyRange]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  const resetApplyFilter = () => {
    setMinVal(min);
    setMaxVal(max);
    resetFilterButton();
  };

  return (
    <>
      <Head>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + "custom_range_slider.min.css"} />
      </Head>
      <div className="container range-slider">
        <input
          type="range"
          min={min}
          max={max}
          value={currentApplyRange?.min}
          ref={minValRef}
          onChange={(event) => {
            const value = Math.min(+event.target.value, currentApplyRange?.max - 1);
            setMinVal(value);
            event.target.value = value.toString();
          }}
          className={`thumb thumb--zindex-3 ${minVal > max - 100 ? "thumb--zindex-5" : ""}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={currentApplyRange?.max}
          ref={maxValRef}
          onChange={(event) => {
            const value = Math.max(+event.target.value, currentApplyRange?.min + 1);
            setMaxVal(value);
            event.target.value = value.toString();
          }}
          className="thumb thumb--zindex-4"
        />

        <div className="slider">
          <div className="slider-track" />
          <div ref={range} className="slider-range" />
          <div className="slider-left-value">{currentApplyRange?.min}</div>
          <div className="slider-right-value">{currentApplyRange?.max}</div>
        </div>
      </div>
      {isDisplayApplyBtn ? (
        <div className="apply-button">
          <button
            type="button"
            onClick={() => resetApplyFilter()}
            className="btn btn-primary btn-small ml-1"
          >
            Reset
          </button>
          <button type="button" onClick={() => setApplyClick()} className="btn btn-secondary btn-small">
            Apply
          </button>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => resetApplyFilter()}
            className="btn btn-primary btn-small ml-1"
            id="resetFilter"
            style={{display: "none"}}
          >
            Reset
          </button>
        </>
      )}
    </>
  );
};

export default CustomRangeSlider;
