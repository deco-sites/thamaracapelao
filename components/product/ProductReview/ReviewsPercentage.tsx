// import { Reviews } from "deco-sites/saddi-center/loaders/reviewsandrating.ts";
import { Product } from "apps/commerce/types.ts";

export interface ReviewsPercentageProps {
  reviews: Product["review"];
  aggregateRating: Product["aggregateRating"];
}

function ReviewsPercentage({
  aggregateRating,
  reviews = [],
}: ReviewsPercentageProps) {
  const quantityOptions = {
    1: { quantity: 0 },
    2: { quantity: 0 },
    3: { quantity: 0 },
    4: { quantity: 0 },
    5: { quantity: 0 },
  } as Record<number, { quantity: number }>;

  const dataReview = reviews.reduce((acc, cur) => {
    const rating: number = cur?.reviewRating?.ratingValue ?? 0;
    return { ...acc, [rating]: { quantity: acc[rating].quantity + 1 } };
  }, quantityOptions);

  return (
    <div class="my-5">
      {Array.from([0, 1, 2, 3, 4]).map((_i, index) => {
        const percentageInfo = dataReview[index + 1];
        const widthPercentage =
          percentageInfo && reviews.length && aggregateRating
            ? `${
              Math.floor(
                (percentageInfo?.quantity /
                  (aggregateRating.ratingCount ?? 0)) *
                  100,
              )
            }%`
            : "0%";

        return (
          <div class="flex items-center mb-3">
            <span class="w-16 text-xs font-bold font-rubick text-neutral-600 shrink-0">
              {index + 1} Estrela{index + 1 === 1 ? "" : "s"}
            </span>
            <div class="w-[70%]  lg:w-[736px] mx-3 relative ">
              <span class="w-full h-8 flex bg-neutral-200"></span>
              <span
                style={{ width: widthPercentage }}
                class={`h-8 flex bg-neutral-400 absolute top-0 left-0`}
              >
              </span>
            </div>
            <span class="w-9 text-xs font-bold font-rubik text-neutral-600 shrink-0 text-end">
              {widthPercentage}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewsPercentage;
