import { useVariantPossibilities } from "../../sdk/useVariantPossibilities.ts";
import type { Product } from "apps/commerce/types.ts";
import { relative } from "$store/sdk/url.ts";
import Image from "apps/website/components/Image.tsx";
import { clx } from "$store/sdk/clx.ts";
import SizeTables from "$store/components/product/SizeTables.tsx";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";

interface Props {
  product: Product;
  aspectRatio: number;
  imageFit: ProductImageFit;
  variantsToRenderAsImage?: string[];
  sizePropertyName?: string;
  class?: string;
}

function VariantSelector(
  {
    product,
    sizePropertyName,
    variantsToRenderAsImage,
    imageFit,
    aspectRatio,
    class: _class,
  }: Props,
) {
  const { isVariantOf } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, product);

  return (
    <ul class={clx("flex flex-col gap-6", _class)}>
      {Object.keys(possibilities)
        .filter((name) => Object.entries(possibilities[name]).length > 1)
        .map((name) => (
          <li class="flex flex-col gap-4">
            <span class="text-sm font-bold flex items-enter justify-between">
              <span class="capitalize">{name.toLocaleLowerCase()}:</span>
              {sizePropertyName === name && <SizeTables.Trigger />}
            </span>
            <ul class="flex flex-row gap-2 flex-wrap">
              {Object.entries(possibilities[name]).map(
                (
                  [
                    value,
                    { url, imageUrl, isSelected, isSelectable, isAvailable },
                  ],
                ) => {
                  if (!isSelectable) return null;

                  const link = new URL(
                    relative(url) ?? "",
                    "https://www.example.com",
                  );
                  link.searchParams.append("__decoFBT", "0");
                  const renderAsImage = variantsToRenderAsImage?.includes(name);

                  const relativeLink = link.pathname + link.search;

                  return (
                    <li>
                      {renderAsImage
                        ? (
                          <button
                            data-variant-selector
                            f-partial={relativeLink}
                            f-client-nav
                          >
                            <div class="flex flex-col items-center px-1.5">
                              <Image
                                src={imageUrl ?? ""}
                                width={42}
                                height={42 / aspectRatio}
                                fit={imageFit}
                                class={clx(
                                  "mb-3 border-2 border-transparent product-aspect product-fit",
                                  isSelected && "!border-primary",
                                )}
                              />
                              <span class="text-neutral-600 text-xs leading-normal h-[18px]">
                                {value}
                              </span>
                            </div>
                          </button>
                        )
                        : (
                          <button
                            data-variant-selector
                            f-partial={relativeLink}
                            f-client-nav
                          >
                            <div
                              class={clx(
                                "btn relative btn-primary min-w-12 px-3.5 ",
                                !isSelected && "btn-outline text-neutral ",
                                !isAvailable && "diagonal-cross opacity-80",
                                isSelected && !isAvailable &&
                                  "diagonal-cross-inverted opacity-100",
                              )}
                            >
                              <span class="leading-normal font-bold">
                                {value}
                              </span>
                            </div>
                          </button>
                        )}
                    </li>
                  );
                },
              )}
            </ul>
          </li>
        ))}
    </ul>
  );
}

export default VariantSelector;
