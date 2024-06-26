import { usePlatform } from "$store/sdk/usePlatform.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";
import { ProductImageAspectRatio } from "$store/sections/Theme/Theme.tsx";

export interface Props {
  page: ProductListingPage;
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
  listId: string;
  listName: string;
}

function Gallery(
  { page, imageAspectRatio, imageFit, listId, listName }: Props,
) {
  const platform = usePlatform();

  const { products, pageInfo } = page;
  const { recordPerPage = 0 } = pageInfo ?? {};
  const offset = (pageInfo.currentPage - 1) * recordPerPage;

  return (
    <div class="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16 group-has-[#layout-type-list:checked]:grid-cols-1">
      {products.map((product, index) => (
        <ProductCard
          itemListId={listId}
          itemListName={listName}
          product={product}
          preload={index === 0}
          index={offset + index}
          platform={platform}
          imageAspectRatio={imageAspectRatio}
          imageFit={imageFit}
        />
      ))}
    </div>
  );
}

export default Gallery;
