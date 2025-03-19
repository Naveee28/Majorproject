import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Seamless Services and Rentals",
    highliteText: "Anytime, Anywhere",
    description:
      "serviceXrentals partners with over 300+ trusted providers and businesses to offer flexible, convenient, and reliable service and rental solutions to individuals and organizations across the globe.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Service Offerings Aligned with Market Demands",
    description:
      "ServiceXrentals ensures users save time and money by offering easy access to in-demand services and rentals. Our platform's offerings are designed to meet the evolving needs of both consumers and providers.",
  },
  {
    order: 2,
    heading: "Streamlined Booking Experience",
    description:
      "Simplifying the booking process, ServiceXrentals offers an intuitive interface for seamless service and rental reservations.",
  },
  {
    order: 3,
    heading: "Comprehensive Service Management",
    description:
      "Providers can efficiently manage their listings, track bookings, and analyze performance with our robust management tools.",
  },
  {
    order: 4,
    heading: `User-Centric Dashboard"`,
    description:
      "A personalized dashboard gives users full control over their bookings, wishlist, and service history for easy access.",
  },
  {
    order: 5,
    heading: "Real-Time Availability and Updates",
    description:
      "ServiceXrentals ensures real-time updates on availability and bookings, keeping users and providers informed and in sync.",
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] xl:w-fit grid-cols-1 xl:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "xl:col-span-2 xl:h-[294px]"}  ${
              card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                ? "bg-richblack-800 h-[294px]"
                : "bg-transparent"
            } ${card.order === 3 && "xl:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="xl:w-[90%] flex flex-col gap-3 pb-10 xl:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highliteText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
