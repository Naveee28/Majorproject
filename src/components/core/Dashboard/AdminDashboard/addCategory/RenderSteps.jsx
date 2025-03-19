import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

import CategoryBuilderForm from "./CategoryBuilder/categoryBuilderForm";
import PublishCategory from "./CategoryBuilder/publishCategory";

export default function RenderSteps() {
  const { step } = useSelector((state) => state.category);
  console.log("step in render :",step);
  const steps = [
    {
      id: 1,
      title: "Category Information",
    },
    {
      id: 2,
      title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Publish",
    },
  ];

  return (
    <>
      <div className="relative mb-2 flex w-full justify-center">
        {steps.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <button
              className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                step === item.id
                  ? "border-yellow-50 bg-yellow-900 text-yellow-50"
                  : "border-richblack-700 bg-richblack-800 text-richblack-300"
              } ${step > item.id && "bg-yellow-50 text-yellow-50"}`}
            >
              {step > item.id ? (
                <FaCheck className="font-bold text-richblack-900" />
              ) : (
                item.id
              )}
            </button>
            {item.id !== steps.length && (
              <div
                className={`h-[calc(34px/2)] w-[33%] border-dashed border-b-2 ${
                  step > item.id ? "border-yellow-50" : "border-richblack-500"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      <div className="relative mb-16 w-full select-none">
        <div className="flex justify-center">
          {steps.map((item) => (
            <div key={item.id} className="flex min-w-[130px] flex-col items-center gap-y-2 mx-14">
              <p
                className={`text-sm ${
                  step >= item.id ? "text-richblack-5" : "text-richblack-500"
                }`}
                dangerouslySetInnerHTML={{ __html: item.title }} // to display &nbsp as space
              />
            </div>
          ))}
        </div>
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CategoryBuilderForm />}
      {step === 2 && <PublishCategory />}
    </>
  );
}
