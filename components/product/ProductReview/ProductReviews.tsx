// import { ResponseReviews } from "deco-sites/trisexultimate/loaders/reviewsandrating.ts";
import { useUser } from "apps/vtex/hooks/useUser.ts";
import Button from "$store/components/ui/Button.tsx";
import { computed, useComputed, useSignal } from "@preact/signals";
import { useCallback, useState } from "preact/hooks";
import Icon from "$store/components/ui/Icon.tsx";
import { invoke } from "$store/runtime.ts";
import ReviewsPercentage from "$store/components/product/ProductReview/ReviewsPercentage.tsx";
import Rating from "$store/components/product/Rating.tsx";
import { ProductDetailsPage, Review } from "apps/commerce/types.ts";
import Section from "$store/components/ui/Section.tsx";
import { AppContext } from "$store/apps/site.ts";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import { Select } from "$store/components/ui/Select.tsx";

const createRating = invoke["site"].actions.createReview;

const NewRatingForm = ({ productId }: { productId: string }) => {
  const [reviewerName, setReviewerName] = useState<string | undefined>(
    undefined,
  );
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [text, setText] = useState<string | undefined>(undefined);
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formSent, setFormSent] = useState<boolean>(false);

  const createReview = useCallback(
    async (body: {
      productVariantId: string;
      rating: number;
      text: string;
      name: string;
    }) => {
      setIsLoading(true);
      try {
        await createRating({
          productId: body.productVariantId,
          rating: body.rating,
          title: "",
        });
        setFormSent(true);
        setText(undefined);
        setReviewerName(undefined);
        setIsLoading(false);
        await new Promise((resolveOuter, _reject) => {
          resolveOuter("a");
        });
        setIsLoading(false);
      } catch (_error) {
        setIsLoading(false);
      }
    },
    [],
  );

  return (
    <form
      className="form-control w-full mt-8"
      onSubmit={(e) => {
        e.preventDefault();
        createReview({
          text: text!,
          rating,
          name: reviewerName!,
          productVariantId: productId,
        });
      }}
    >
      <label className="label mt-4">
        <span className="text-base font-normal">Título</span>
      </label>
      <input
        type="text"
        value={title}
        className="input input-bordered w-full font-normal text-lg  border-[#808080]"
        onClick={() => {
          if (!title) setTitle("");
        }}
        onChange={(e) => e.target && setTitle(e.currentTarget.value)}
        required
      />
      {title?.length == 0 && (
        <p class="text-red-500 text-sm">
          Escreva um título para a sua avaliação
        </p>
      )}
      <div class="">
        <label className="label mt-4">
          <span className=" font-normal text-base pb-0">
            Avalie o produto de 1 a 5 estrelas
          </span>
        </label>
        <div className="rating mt-2">
          {Array.from([0, 1, 2, 3, 4]).map((_, index) => {
            return (
              <Icon
                id={rating > index ? "FilledStar" : "OutlineStar"}
                class="stroke-1 h-6 w-6"
              />
            );
          })}
          <div class="absolute">
            <input
              type="radio"
              name="rating-1"
              className="opacity-0 cursor-default"
              onClick={() => setRating(1)}
            />
            <input
              type="radio"
              name="rating-1"
              className="opacity-0 cursor-default"
              onClick={() => setRating(2)}
            />
            <input
              type="radio"
              name="rating-1"
              className="opacity-0 cursor-default"
              onClick={() => setRating(3)}
            />
            <input
              type="radio"
              name="rating-1"
              className="opacity-0 cursor-default"
              onClick={() => setRating(4)}
            />
            <input
              type="radio"
              name="rating-1"
              className="opacity-0 cursor-default"
              onClick={() => setRating(5)}
            />
          </div>
          {rating == 0 && (
            <p class="text-red-500 text-sm">escolha uma avaliação</p>
          )}
        </div>

        <label className="label mt-4">
          <span className="text-base font-normal">Seu nome</span>
        </label>
        <input
          type="text"
          value={reviewerName}
          className="input input-bordered w-full font-normal text-lg border-[#808080]"
          onClick={() => {
            if (!reviewerName) setReviewerName("");
          }}
          onChange={(e) => e.target && setReviewerName(e.currentTarget.value)}
          required
        />
        {reviewerName?.length == 0 && (
          <p class="text-red-500 text-sm">Informe seu nome</p>
        )}
        <label className="label mt-4">
          <span className="text-base font-normal">Escreva uma avaliação</span>
        </label>
        <textarea
          className="textarea textarea-bordered w-full font-normal text-lg border-[#808080] h-36"
          value={text}
          onClick={() => {
            if (!text) setText("");
          }}
          onChange={(e) => e.target && setText(e.currentTarget.value)}
          // required
        >
        </textarea>
        {text?.length == 0 && (
          <p class="text-red-500 text-sm">
            Escreva um comentário para a sua avaliação
          </p>
        )}
      </div>
      <div class="text-left">
        {formSent
          ? <span class="text-green-600">Sua avaliação foi enviada!</span>
          : (
            <Button
              class="bg-primary hover:bg-primary-400  rounded-lg w-full lg:w-52 text-white shadow-none font-semibold text-base px-11 py-4  mt-6"
              type={"submit"}
              aria-label={"Enviar avaliação"}
            >
              {isLoading
                ? <span class="loading loading-spinner loading-sm"></span>
                : (
                  "Enviar avaliação"
                )}
            </Button>
          )}
      </div>
    </form>
  );
};

export interface Props {
  page: ProductDetailsPage | null;
  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

function ProductReviews(
  { page, isMobile, sectionProps }: ReturnType<typeof loader>,
) {
  const userHasReviewed = computed(() =>
    page?.product.review?.some((r) =>
      r.author?.some((a) => a.identifier === user.value?.email)
    )
  );

  const { user } = useUser();
  const isUserLoggedIn = Boolean(user.value?.email);
  const inputReviewSignal = useSignal(false);
  const sorting = useSignal("greater");
  const filter = useSignal("all");

  const reviews = useComputed(() => {
    const sorts: Record<string, (a: Review, b: Review) => number> = {
      mostRecent: (a: Review, b: Review) =>
        b.datePublished && a.datePublished
          ? new Date(b.datePublished).valueOf() -
            new Date(a.datePublished).valueOf()
          : 0,
      lastRecent: (a: Review, b: Review) =>
        b.datePublished && a.datePublished
          ? new Date(a.datePublished).valueOf() -
            new Date(b.datePublished).valueOf()
          : 0,
      greater: (a: Review, b: Review) =>
        (b.reviewRating?.ratingValue ?? 0) - (a.reviewRating?.ratingValue ?? 0),
      smaller: (a: Review, b: Review) =>
        (a.reviewRating?.ratingValue ?? 0) - (b.reviewRating?.ratingValue ?? 0),
    };

    return page?.product.review?.sort(sorts[sorting.value]).filter((a) =>
      filter.value == "all"
        ? true
        : a.reviewRating?.ratingValue == Number(filter.value)
    ) ?? [];
  });

  if (!page) return null;

  return (
    <Section
      isMobile={isMobile}
      {...sectionProps}
      class="w-full px-auto flex justify-center mb-5 container  mx-auto"
      id="reviewsInfo"
    >
      <div class="w-full">
        <h2 class="text-neutral-500 font-bold text-2xl text-center text-neutral-700 font-secondary mb-12">
          Avaliações
        </h2>
        <div class="flex-col gap-2 lg:gap-0 lg:flex-row  flex justify-between">
          <div class="lg:w-2/5">
            <div className="rating mt-2">
              <Rating
                rating={page?.product.aggregateRating?.ratingValue ?? 0}
              />
            </div>
            <div>
              <span class="text-[12px] font-semibold ">
                <strong class="font-bold">
                  Avaliação Média: {page?.product.aggregateRating?.ratingValue}
                  {" "}
                  ({page?.product.aggregateRating?.ratingCount ?? 0}
                  {" "}
                </strong>
                {(page?.product.aggregateRating?.ratingCount ?? 0) === 1
                  ? "avaliação"
                  : "avaliações"}
                )
              </span>
            </div>
            <ReviewsPercentage
              reviews={page?.product.review}
              aggregateRating={page?.product.aggregateRating}
            />
            {!isUserLoggedIn && (
              <a
                href={`/login?returnUrl=${page.seo?.canonical}`}
                class="text-xs font-normal underline text-info-500"
              >
                Por favor, inscreva-se para escrever uma avaliação.
              </a>
            )}
          </div>

          <div class="lg:w-1/2">
            <div class="text-left mb-6 flex gap-2 py-2 px-4 bg-neutral-200">
              <Select
                class="relative flex-[1.125] max-w-[12rem] border border-neutral-600 bg-neutral-100"
                defaultValue="Mais recentes"
                onChange={(e) => {
                  sorting.value = e.currentTarget.value;
                }}
                options={[
                  {
                    name: "Mais recentes",
                    value: "mostRecent",
                  },
                  {
                    name: "Mais antigas",
                    value: "lastRecent",
                  },
                  {
                    name: "Mais alta",
                    value: "greater",
                  },
                  {
                    name: "Mais baixa",
                    value: "smaller",
                  },
                ]}
              />
              <Select
                class="relative flex-[1.125] max-w-[12rem] border border-neutral-600 bg-neutral-100"
                defaultValue="Mais recentes"
                onChange={(e) => {
                  filter.value = e.currentTarget.value;
                }}
                options={[
                  {
                    name: "Todas",
                    value: "all",
                  },
                  {
                    name: "1 estrela",
                    value: "1",
                  },
                  {
                    name: "2 estrelas",
                    value: "2",
                  },
                  {
                    name: "3 estrelas",
                    value: "3",
                  },
                  {
                    name: "4 estrelas",
                    value: "4",
                  },
                  {
                    name: "5 estrelas",
                    value: "5",
                  },
                ]}
              />
            </div>
            {reviews.value?.length
              ? (
                <div class="mt-5">
                  {reviews.value.map((review) => {
                    return (
                      <div class="border-b border-neutral-300 py-4 last:border-none flex justify-between">
                        <div>
                          <div class="flex items-center mb-3">
                            <div className="rating rating-md ">
                              <Rating
                                rating={review.reviewRating?.ratingValue ?? 0}
                              />
                            </div>
                            {review.reviewHeadline && (
                              <span class="text-neutral-500 font-bold ml-2 font-secondary">
                                {review.reviewHeadline}
                              </span>
                            )}
                          </div>
                          <div class="mt-2">
                            <span class="text-sm font-semibold text-neutral-500">
                              {review.reviewBody}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span class="text-sm">
                            <p>
                              Enviado em{"   "}
                              <span class="font-bold">
                                {new Date(review.datePublished ?? 0)
                                  .toLocaleString(
                                    "pt-BR",
                                    {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                              </span>
                            </p>
                            <p>
                              por{" "}
                              <span class="font-bold">
                                {review.author?.[0].name}
                              </span>
                            </p>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
              : (
                <div class="text-center">
                  <h2 class="text-2xl font-bold">Nenhuma Avaliação</h2>
                  <span>Seja o primeiro a avaliar este produto</span>
                </div>
              )}
            {isUserLoggedIn
              ? (
                <div class="text-left mt-4">
                  <div
                    tabIndex={0}
                    className="collapse collapse-arrow bg-white rounded-none shadow-none font-semibold text-base p-0 text-black"
                  >
                    <input
                      type="checkbox"
                      className="peer"
                      onInput={() => (inputReviewSignal.value =
                        !inputReviewSignal.value)}
                    />
                    <div className="h-12 text-base  rounded-lg px-4 font-medium w-80 bg-secondary-200 text-black absolute flex items-center justify-between">
                      Escrever uma avaliação
                      <em class="not-italic">
                        {inputReviewSignal.value ? "-" : "+"}
                      </em>
                    </div>
                    <div className="collapse-content !px-0 transition   duration-[800ms]">
                      {userHasReviewed.value
                        ? (
                          <div>
                            <span>
                              Você já enviou uma avaliação para este produto
                            </span>
                          </div>
                        )
                        : <NewRatingForm productId={page.product.productID} />}
                    </div>
                  </div>
                </div>
              )
              : (
                ""
              )}
          </div>
        </div>
      </div>
    </Section>
  );
}

export default ProductReviews;
