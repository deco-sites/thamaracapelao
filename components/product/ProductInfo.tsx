import AddToCartButton from "$store/components/product/AddToCartButton/AddToCartButton.tsx";
import ShippingSimulation from "$store/islands/ShippingSimulation.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useId } from "$store/sdk/useId.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { usePlatform } from "$store/sdk/usePlatform.tsx";
import { Product, ProductDetailsPage } from "apps/commerce/types.ts";

import Notify from "$store/islands/OutOfStock.tsx";
import CrossSelling from "$store/components/product/CrossSelling.tsx";
import Rating from "$store/components/product/Rating.tsx";
import SealsList from "$store/components/product/SealsList.tsx";
import { Share, ShareOptions } from "$store/components/product/Share.tsx";
import SizeTables, {
  SizeTable,
} from "$store/components/product/SizeTables.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";
import WishlistButtonVtex from "../../islands/WishlistButton/vtex.tsx";
import WishlistButtonWake from "../../islands/WishlistButton/wake.tsx";
import PaymentMethods, { CustomMethod } from "./PaymentMethods.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import { toProductItem } from "$store/sdk/ga4/transform/toProductItem.ts";
import { toAnalytics } from "$store/sdk/ga4/transform/toAnalytics.ts";
import { SendEventOnView } from "$store/components/Analytics.tsx";

interface Props {
  page: ProductDetailsPage | null;
  sealsConfig?: SealConfig[];
  customMethods?: CustomMethod[];
  shareOptions?: ShareOptions;
  variantsToRenderAsImage?: string[];
  crossSelling?: {
    title: string;
    titleProperty?: string;
    products: Product[] | null;
  };
  sizeTable?: {
    sizePropertyName: string;
    tables: SizeTable[];
  };
  layout: {
    /**
     * @title Product Name
     * @description How product title will be displayed. Concat to concatenate product and sku names.
     * @default product
     */
    name?: "concat" | "productGroup" | "product";
  };
  aspectRatio: number;
  imageFit: ProductImageFit;
}

interface ProductPricesProps {
  product: Product;
  variant?: "default" | "buyFloating";
}

interface ProductAddToCartProps {
  product: Product;
  quantitySelector?: boolean;
  variant?: "plp" | "pdp";
  hideIcon?: boolean;
}

export const ProductPriceUnavailable = () => {
  return (
    <span class="text-neutral-400 text-lg text font-bold">
      Produto indisponível
    </span>
  );
};

export const ProductPrices = (
  { product, variant = "default" }: ProductPricesProps,
) => {
  const { offers } = product;
  const { price = 0, listPrice, installments, methods, availability } =
    useOffer(offers);

  const formattedListPrice = formatPrice(listPrice, offers?.priceCurrency);
  const formattedPrice = formatPrice(price, offers?.priceCurrency);
  const formattedInstallments = installments &&
    formatPrice(installments.billingIncrement, offers?.priceCurrency);
  const isAvailable = availability === "https://schema.org/InStock";

  if (!isAvailable) {
    return <ProductPriceUnavailable />;
  }

  if (variant === "buyFloating") {
    return (
      <div class="flex flex-col gap-2">
        <div class="flex flex-col">
          {(listPrice ?? 0) > price && (
            <span class="font-bold text-neutral-400 text-sm line-through">
              De {formattedListPrice}
            </span>
          )}
          <span class="text-primary font-extrabold text-lg leading-[22px]">
            Por {formattedPrice}
          </span>
        </div>
        {installments && installments.billingDuration > 1 && (
          <div class="flex justify-between items-baseline max-md:flex-col max-md:gap-2">
            <span class="text-xs text-neutral-500 leading-[20px]">
              ou{" "}
              <strong class="font-bold">
                {installments.billingDuration}x
              </strong>{" "}
              de{" "}
              <strong class="font-bold">
                {formattedInstallments}
              </strong>
              {installments.withTaxes ? " com juros" : " sem juros"}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-row gap-4 items-baseline">
        {(listPrice ?? 0) > price && (
          <span class="font-bold text-neutral-400 text-sm line-through">
            De {formattedListPrice}
          </span>
        )}
        <span class="text-primary font-extrabold text-lg leading-[22px]">
          Por {formattedPrice}
        </span>
      </div>
      {installments && installments.billingDuration > 1 && (
        <div class="flex justify-between items-baseline max-md:flex-col max-md:gap-2">
          <span class="text-xs text-neutral-500 leading-[20px]">
            ou{" "}
            <strong class="font-bold">
              {installments.billingDuration}x
            </strong>{" "}
            de{" "}
            <strong class="font-bold">
              {formattedInstallments}
            </strong>
            {installments.withTaxes ? " com juros" : " sem juros"}
          </span>
          {methods && methods.length > 1 && <PaymentMethods.Trigger />}
        </div>
      )}
    </div>
  );
};

export const ProductAddToCartUnavailable = () => {
  return (
    <a
      class="md:w-full md:max-w-[294px] btn btn-outline btn-primary disabled:loading group"
      href="#header"
    >
      <span class="text-neutral lg:group-hover:text-primary-content">
        Avise-me
      </span>
    </a>
  );
};

export const ProductAddToCart = (
  { product, quantitySelector = true, hideIcon = false }: ProductAddToCartProps,
) => {
  const platform = usePlatform();
  const {
    offers,
    isVariantOf,
    additionalProperty = [],
  } = product;

  const {
    seller = "1",
    availability,
  } = useOffer(offers);

  const productGroupID = isVariantOf?.productGroupID ?? "";
  const isAvailable = availability === "https://schema.org/InStock";

  const VTEX_ANALYTICS = {
    items: [toProductItem(product, { index: 0, quantity: 1 })],
    view: { id: "product_page", name: "Página de produto" },
  };

  if (!isAvailable) {
    return <ProductAddToCartUnavailable />;
  }
  return (
    <AddToCartButton
      productGroupID={productGroupID ?? ""}
      additionalProperty={additionalProperty}
      variant="pdp"
      platform={platform}
      items={[
        {
          id: product.sku,
          quantity: 1,
          seller: seller,
        },
      ]}
      analytics={VTEX_ANALYTICS}
      quantitySelector={quantitySelector}
      hideIcon={hideIcon}
    />
  );
};

function ProductInfo({
  page,
  layout,
  sealsConfig,
  customMethods = [],
  crossSelling,
  shareOptions,
  variantsToRenderAsImage,
  sizeTable,
  aspectRatio,
  imageFit,
}: Props) {
  const platform = usePlatform();
  const productInfoID = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { product } = page;
  const { productID, offers, name = "", sku, isVariantOf } = product;

  const {
    seller = "1",
    methods,
    availability,
  } = useOffer(offers);
  const productGroupID = isVariantOf?.productGroupID ?? "";

  const isAvailable = availability === "https://schema.org/InStock";

  const VTEX_ANALYTICS = {
    items: [toProductItem(product, { index: 0, quantity: 1 })],
    view: { id: "product_page", name: "Página de produto" },
  };

  const VTEX_VIEW_ITEM = toAnalytics({
    type: "view_item",
    data: VTEX_ANALYTICS,
  });

  return (
    <>
      <div
        class="flex flex-col flex-1 lg:sticky top-36 h-fit lg:max-w-[424px] text-neutral-600 text-sm group/product-info"
        id={productInfoID}
      >
        {/* Seals */}
        <div class="flex">
          <div class="flex-1">
            <div class="hidden gap-2 h-5 text-[10px] w-min has-[div]:mb-4 has-[div]:flex">
              <SealsList
                sealsConfig={sealsConfig}
                product={product}
                limit={2}
                position="info"
              />
            </div>
            {/* Code and name */}
            <div class="max-w-[80%] mb-8">
              <h1 class="mb-2">
                <span class="font-bold  text-2xl leading-7">
                  {layout?.name === "concat"
                    ? `${isVariantOf?.name} ${name}`
                    : layout?.name === "productGroup"
                    ? isVariantOf?.name
                    : name}
                </span>
              </h1>
              <div class="flex gap-4 items-center">
                {sku && (
                  <span class="text-xs text-neutral-500 leading-[10px]">
                    sku: {sku}
                  </span>
                )}
                <Rating
                  size={12}
                  rating={product.aggregateRating?.ratingValue ?? 0}
                />
              </div>
            </div>
          </div>
          {/* Wishlist button */}
          <div class="relative -top-3 -right-3">
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
        <div class="mb-8">
          <ProductPrices product={product} />
        </div>
        {/* Product Colors */}
        {crossSelling && crossSelling?.products &&
          crossSelling?.products?.length > 0 && (
          <div class="mb-6">
            <CrossSelling
              products={crossSelling.products}
              title={crossSelling.title}
              titleProperty={crossSelling.titleProperty}
              currentProduct={product}
              aspectRatio={aspectRatio}
              imageFit={imageFit}
            />
          </div>
        )}

        {/* Sku Selector */}
        <div>
          <ProductSelector
            product={product}
            aspectRatio={aspectRatio}
            imageFit={imageFit}
            variantsToRenderAsImage={variantsToRenderAsImage}
            class="mb-8 empty:hidden"
            sizePropertyName={sizeTable?.sizePropertyName}
          />
        </div>
        {isAvailable
          ? (
            <>
              <div class="group-has-[[data-variant-selector]:focus]/product-info:pointer-events-none group-has-[[data-variant-selector]:focus]/product-info:opacity-80">
                {isAvailable && <ProductAddToCart product={product} />}
              </div>

              {/* Shipping Simulation */}
              {platform === "vtex" && (
                <div class="mt-8 pb-6 border-b border-solid border-neutral-300 mb-6">
                  <ShippingSimulation
                    items={[
                      {
                        id: Number(product.sku),
                        quantity: 1,
                        seller: seller,
                      },
                    ]}
                    variant="pdp"
                  />
                </div>
              )}
              {shareOptions && product.url && (
                <Share
                  options={shareOptions}
                  url={product.url}
                  productImageURL={product.image?.[0].url}
                />
              )}
            </>
          )
          : <Notify productID={productID} />}
      </div>
      {methods && methods.length > 1 && (
        <PaymentMethods.Modal
          methods={methods}
          customMethods={customMethods}
        />
      )}
      {sizeTable && (
        <SizeTables.Modal product={product} tables={sizeTable.tables} />
      )}
      <SendEventOnView id={productInfoID} event={VTEX_VIEW_ITEM} />
    </>
  );
}

export default ProductInfo;
