import type { Platform } from "$store/apps/site.ts";
import AddToCartButton from "$store/components/product/AddToCartButton/AddToCartButton.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { relative } from "$store/sdk/url.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useVariantPossibilities } from "../../sdk/useVariantPossibilities.ts";

import type { Product } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import SealsList from "$store/components/product/SealsList.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import {
  default as WishlistButtonVtex,
  default as WishlistButtonWake,
} from "../../islands/WishlistButton/vtex.tsx";
import Rating from "$store/components/product/Rating.tsx";
import type {
  ProductImageAspectRatio,
  ProductImageFit,
} from "$store/sections/Theme/Theme.tsx";
import { toAnalytics } from "deco-sites/fast-fashion/sdk/ga4/transform/toAnalytics.ts";
import { toProductItem } from "deco-sites/fast-fashion/sdk/ga4/transform/toProductItem.ts";
import { SendEventOnClick } from "deco-sites/fast-fashion/components/Analytics.tsx";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  nameRender?: "concat" | "productGroup" | "product";

  /** @description index of the product card in the list */
  index?: number;
  sealsConfig?: SealConfig[];
  platform: Platform;
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
  itemListId?: string;
  itemListName?: string;
  isMobile?: boolean;
}

const WIDTH = 200;
// const HEIGHT = 200;

function ProductCard({
  product,
  preload,
  itemListId,
  itemListName,
  platform,
  nameRender = "product",
  index = 1,
  sealsConfig,
  imageAspectRatio,
  imageFit,
  isMobile = true,
}: Props) {
  const {
    url,
    productID,
    name,
    image: images,
    offers,
    isVariantOf,
    additionalProperty = [],
  } = product;
  const id = `product-card-${productID}`;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const productGroupID = isVariantOf?.productGroupID;
  const possibilities = useVariantPossibilities(hasVariant, product);
  const variants = Object.entries(Object.values(possibilities)[0] ?? {});

  const {
    listPrice,
    price,
    installments,
    seller = "1",
    availability,
  } = useOffer(offers);

  const isAvailable = availability === "https://schema.org/InStock";

  const [front, back] = images ?? [];

  const relativeUrl = url ? relative(url) : "";

  const discountPercentage = listPrice && price
    ? Math.round(((listPrice - price) / listPrice) * 100)
    : 0;

  const aspectRatio = Number(imageAspectRatio.split("/")[0]) /
    Number(imageAspectRatio.split("/")[1]);

  const analytics = {
    items: [toProductItem(product, { index, quantity: 1 })],
    view: { id: itemListId ?? "product_card", name: itemListName ?? "Produto" },
  };

  const selectItemEvent = toAnalytics({
    type: "select_item",
    data: analytics,
  });

  return (
    <div
      id={id}
      class="group/product-cart flex flex-col gap-2 w-full group-has-[#layout-type-list:checked]:flex-row group-has-[#layout-type-list:checked]:justify-between group-has-[#layout-type-list:checked]:gap-6 md:group-has-[#layout-type-list:checked]:gap-10"
      data-deco="view-product"
    >
      {/* Top/Left */}
      <div class="flex flex-col justify-between relative w-full group-has-[#layout-type-list:checked]:w-[160px] group-has-[#layout-type-list:checked]:shrink-0 lg:group-has-[#layout-type-list:checked]:w-[200px]">
        {/* Floating */}
        <div>
          <div class="absolute top-2 left-2 gap-1.5 flex flex-col">
            {discountPercentage > 0 && (
              <div class="flex items-center justify-center text-[10px] size-9 bg-neutral-400 text-neutral-content rounded-full bold">
                {`-${discountPercentage}%`}
              </div>
            )}

            <SealsList
              sealsConfig={sealsConfig}
              product={product}
              limit={2}
              position="image"
            />
          </div>

          {/* Wishlist button */}
          <div class="absolute top-0 right-0 z-10 flex items-center">
            {platform === "vtex" && (
              <WishlistButtonVtex
                productGroupID={productGroupID}
                productID={productID}
              />
            )}
            {platform === "wake" && (
              <WishlistButtonWake
                productGroupID={productGroupID}
                productID={productID}
              />
            )}
          </div>
        </div>

        {/* Product Images */}
        <figure class="product-aspect overflow-hidden">
          <a
            href={relativeUrl}
            aria-label="view product"
            class="grid grid-cols-1 grid-rows-1 w-full h-full border-solid border border-neutral-300"
          >
            <Image
              src={front.url!}
              alt={front.alternateName}
              width={WIDTH}
              height={WIDTH / aspectRatio}
              class="bg-base-100 col-span-full row-span-full product-fit h-full w-full "
              sizes="(max-width: 640px) 50vw, 20vw"
              preload={preload}
              loading={preload ? "eager" : "lazy"}
              decoding="async"
              fit={imageFit}
            />
            <Image
              src={back?.url ?? front.url!}
              alt={back?.alternateName ?? front.alternateName}
              width={WIDTH}
              height={WIDTH / aspectRatio}
              class="bg-base-100 col-span-full row-span-full h-full w-full opacity-0 lg:group-hover/product-cart:opacity-100 product-fit"
              sizes="(max-width: 640px) 50vw, 20vw"
              loading="lazy"
              decoding="async"
            />
          </a>
        </figure>

        {/* Text seals */}
        {/* TODO Remover bordar e after */}
        <div class="flex justify-center items-center h-5 [&>div]:min-w-0">
          <SealsList
            sealsConfig={sealsConfig}
            product={product}
            limit={2}
            position="info"
          />
        </div>
      </div>

      {/* Bottom/Right */}
      <div class="flex flex-col md:group-has-[#layout-type-list:checked]:flex-row md:group-has-[#layout-type-list:checked]:justify-between group-has-[#layout-type-list:checked]:flex-1 sm:group-has-[#layout-type-list:checked]:gap-5">
        {/* Left (desktop list mode) */}
        <div>
          {/* Name */}
          <h2 class="h-10 font-bold text-sm text-neutral-500 line-clamp-2">
            {nameRender === "concat"
              ? `${isVariantOf?.name} ${name}`
              : nameRender === "productGroup"
              ? isVariantOf?.name
              : name}
          </h2>
          {/* Reviews */}
          <div class="mt-5 h-3 group-has-[#layout-type-list:checked]:mt-3">
            {product.aggregateRating &&
              (
                <Rating
                  size={12}
                  rating={product.aggregateRating?.ratingValue ?? 0}
                />
              )}
          </div>
        </div>

        {/* Right (desktop list mode) */}
        <div class="">
          {/* Pricing */}
          {isAvailable
            ? (
              <div class="grid grid-rows-3 items-center h-[58px] mt-1 group-has-[#layout-type-list:checked]:mt-0 w-full sm:group-has-[#layout-type-list:checked]:min-w-52">
                {/* Price */}
                <div class="text-neutral-400 text-xs line-through font-bold">
                  {discountPercentage > 0 && (
                    <>De {formatPrice(listPrice, offers?.priceCurrency)}</>
                  )}
                </div>

                <div class="text-primary-500 text-sm font-bold">
                  {listPrice ? "Por " : "A partir de "}
                  {formatPrice(price, offers?.priceCurrency)}
                </div>

                {/* Installments */}
                {installments && installments.billingDuration > 1 && (
                  <span class="text-xs text-neutral-500 leading-[20px]">
                    {isMobile ? "" : "ou "}

                    <strong class="font-bold">
                      {installments.billingDuration}x
                    </strong>{" "}
                    de{" "}
                    <strong class="font-bold">
                      {formatPrice(
                        installments.billingIncrement,
                        offers?.priceCurrency,
                      )}
                    </strong>

                    {isMobile
                      ? (
                        installments.withTaxes ? " c/ juros" : " s/ juros"
                      )
                      : (
                        installments.withTaxes ? " com juros" : " sem juros"
                      )}
                  </span>
                )}
              </div>
            )
            : (
              <div class="flex flex-col mt-1 group-has-[#layout-type-list:checked]:mt-0 justify-end group-has-[#layout-type-list:checked]:h-auto h-[58px] w-full sm:group-has-[#layout-type-list:checked]:min-w-52">
                <span class="flex flex-col group-has-[#layout-type-list:checked]:items-start items-center justify-end h-full text-neutral-400 text-sm font-bold">
                  Produto indisponível
                </span>
              </div>
            )}

          {/* Add to cart */}
          <div class="invisible opacity-0 group-hover/product-cart:opacity-100 group-hover/product-cart:visible max-xl:opacity-100 max-xl:visible mt-4 w-full group-has-[#layout-type-list:checked]:mt-3 group-has-[#layout-type-list:checked]:opacity-100 group-has-[#layout-type-list:checked]:visible">
            {isAvailable
              ? variants.length === 0
                ? (
                  <AddToCartButton
                    productGroupID={productGroupID ?? ""}
                    additionalProperty={additionalProperty}
                    items={[{ id: productID, quantity: 1, seller }]}
                    platform={platform}
                    analytics={analytics}
                  />
                )
                : (
                  <a
                    href={relativeUrl}
                    class="btn btn-outline w-full"
                    aria-label="view product"
                  >
                    Ver mais detalhes
                  </a>
                )
              : (
                <a
                  href={relativeUrl}
                  class="btn btn-outline w-full"
                  aria-label="view product"
                >
                  Avise-me quando chegar
                </a>
              )}
          </div>
        </div>
      </div>

      <SendEventOnClick id={id} event={selectItemEvent} />
    </div>
  );
}

export default ProductCard;
