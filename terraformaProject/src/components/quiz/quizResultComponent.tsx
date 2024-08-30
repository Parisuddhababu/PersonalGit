import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Check, Cross } from '@components/icons/icons';
import { CourseQuizQuestionOptions, QuizResultData } from 'src/types/common';
import { ROUTES } from '@config/constant';

const QuizResultComponent: React.FC = () => {
  const { quizResultData } = useSelector(((state: { coursesManagement: QuizResultData }) => state.coursesManagement));


  useEffect(() => {
    return () => {
      if (Object.keys(quizResultData)?.length === 0) {
        window.location.href = `/${ROUTES.app}/${ROUTES.allCourses}`
      }
    };
  }, [])

  return (
    <>
      {quizResultData?.data?.userQuizDetails?.map((question, index) => (
        <div className="px-5 border-b border-solid last:border-none py-7 first:pt-4 last:pb-4 border-border-primary result" key={`quizResult-${index + 1}`}>
          <p className="mb-5 text-base font-bold md:text-lg md:mb-7">{question?.question}</p>
          <ul>
            {question?.courseQuizQuestionOptions?.map((option: CourseQuizQuestionOptions, optionIndex: number) => {
              return (
                <li className="flex items-center mb-3 md:mb-5 last:mb-0" key={`quiz-result-page-${optionIndex + 1}`}>
                  {
                    option?.uuid === question?.selectedOption && option?.is_correct &&
                    <p className="flex flex-col w-full gap-2 xmd:gap-4 xmd:flex-row xmd:items-center">
                      <span className="text-p-list-box-btn bg-border-secondary border-p-list-box-btn px-5 py-[9px] md:py-3 xmd:max-w-[487px] border xmd:w-[calc(100%-120px)] flex items-center border-solid rounded-xl">
                        {option?.option} <span className="ml-auto"><Check /></span>
                      </span>
                    </p>
                  }
                  {
                    option?.uuid === question?.selectedOption && !option?.is_correct && !question?.is_right &&
                    <p className="flex flex-col w-full gap-2 xmd:gap-4 xmd:flex-row xmd:items-center">
                      <span className="px-5 py-[9px] md:py-3 xmd:max-w-[487px] border xmd:w-[calc(100%-120px)] flex items-center border-solid bg-light-red border-error text-error rounded-xl">
                        {option?.option} <span className="ml-auto"><Cross /></span>
                      </span>
                    </p>
                  }
                  {
                    (option?.uuid !== question?.selectedOption && option?.is_correct && !question?.is_right && !!quizResultData?.data?.is_show_correct_ans) &&
                    <p className="flex flex-col w-full gap-2 xmd:gap-4 xmd:flex-row xmd:items-center">
                      <span className="text-p-list-box-btn bg-border-secondary border-p-list-box-btn px-5 py-[9px] md:py-3 xmd:max-w-[487px] border xmd:w-[calc(100%-120px)] flex items-center border-solid rounded-xl">
                        {option?.option}
                      </span>
                      <span className="text-right whitespace-nowrap text-xs-14 xmd:text-left">Correct Answer</span>
                    </p>
                  }
                  {
                    option?.uuid !== question?.selectedOption && !option?.is_correct &&
                    <p className="flex flex-col w-full gap-2 xmd:gap-4 xmd:flex-row xmd:items-center">
                      <span className="px-5 py-[9px] md:py-3 xmd:max-w-[487px] border xmd:w-[calc(100%-120px)] flex items-center border-solid border-border-primary rounded-xl">
                        {option?.option}
                      </span>
                    </p>
                  }
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  );
};

export default QuizResultComponent;
