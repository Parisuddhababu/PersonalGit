import { Check } from '@components/icons/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { CoursesManagementState, Step, StepperProps } from 'src/types/common';

const Stepper: React.FC<StepperProps> = ({ steps, createYourContent, dynamicWidth }) => {
  const { activeStep, createNewAccountStep } = useSelector((state: { coursesManagement: CoursesManagementState }) => state.coursesManagement);

  return (
    <>
      {createYourContent && <div>
        <div className='flex justify-between px-0 py-5 mb-5 border border-solid md:mb-7 md:px-5 lg:px-10 border-border-primary rounded-xl bg-accents-2'>
          {steps.map((data: Step, key: number) => (
            <div className={`w-1/5 mx-2 text-center relative z-1 before:content-[''] before:h-px before:bg-border-primary before:w-[125.5%] before:absolute before:right-[calc(50%-4.7px)] md:before:right-[calc(50%-10px)] lg:before:right-[calc(50%-15px)] before:top-[20px] md:before:top-[25px] lg:before:top-[32px] before:-z-1 first:before:content-none [&>div]:bg-white ${(key < activeStep) && 'before:bg-primary [&>.icon]:bg-primary'} ${activeStep === key && 'before:bg-primary'}`} key={data.title}>
              <div className={`inline-block p-[9px] md:p-3 lg:p-[14px] border border-solid rounded-full border-border-primary mb-2 text-light-grey [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6 lg:[&>svg]:w-8 lg:[&>svg]:h-8 icon ${(key < activeStep) && 'text-white border-primary'} ${activeStep === key && 'border-primary text-primary'}`}>{data.icon}</div>
              <h6 className={`text-xs md:text-sm lg:text-xl font-bold lg:leading-7 text-light-grey ${(key < activeStep) && 'text-primary'} ${activeStep === key && 'text-primary'}`} >{data.title}</h6>
            </div>
          ))}
        </div>
        <div>{steps[activeStep].content}</div>
      </div>}
      {!createYourContent && <div className='w-full'>
        <div className='flex py-4 mb-5 rounded-xl bg-accents-2'>
          {steps.map((data: Step, key: number) => (
            <div className={`${dynamicWidth} px-2 text-center relative z-1 before:content-[''] before:w-full before:absolute before:right-[calc(50%-5px)] before:top-[14px] md:before:top-[15px] before:-z-1 first:before:content-none ${(createNewAccountStep === key) ? '[&+]:before:w-[calc(100%-8px)] md:[&+]:before:w-full md:[&+div]:z-0' : ''} ${((key < createNewAccountStep) || (createNewAccountStep === key)) ? 'before:h-[3px] before:bg-primary' : 'before:h-px before:bg-border-primary'}`} key={data.title}>
              <div className='inline-block mb-2 h-[25px] md:h-[30px] align-sub md:align-text-top'>
                <span className={`rounded-full ${(createNewAccountStep === key) ? 'min-w-[25px] min-h-[25px] md:min-h-[30px] md:min-w-[30px] flex items-center justify-center' : 'inline-block w-2 h-2 md:h-2.5 md:w-2.5'} ${(key < createNewAccountStep) ? 'flex items-center justify-center text-xs md:text-sm bg-primary min-w-[25px] min-h-[25px] md:min-h-[30px] md:min-w-[30px]' : 'bg-dark-grey'}`}>
                  {(createNewAccountStep === key) && <span className='h-2 w-2 md:h-2.5 md:w-2.5 bg-white rounded-full'></span>}
                  {(key < createNewAccountStep) && <Check className='fill-white' />}
                </span>
              </div>
              <p className={`text-xs-10 leading-[14px] md:text-sm break-words ${(key < createNewAccountStep) && 'text-primary font-bold'}`} >{data.title}</p>
            </div>
          ))}
        </div>
        <div>{steps[createNewAccountStep].content}</div>
      </div>}
    </>
  );
};

export default Stepper;