import SearchResult, {
  Props as SearchResultProps,
} from "$store/components/search/SearchResult.tsx";
import { SectionProps } from "deco/types.ts";
import { ProductListingPage } from "apps/commerce/types.ts";
import { AppContext } from "$store/apps/site.ts";
import { AppContext as VTEXAppContext } from "apps/vtex/mod.ts";

export type Props = SearchResultProps;

export async function loader(
  props: Props,
  req: Request,
  ctx: AppContext & VTEXAppContext,
) {
  const productsIds = props.page?.products.map((product) => product.productID);

  const products = productsIds?.length && productsIds?.length > 0
    ? await ctx.invoke.vtex.loaders.intelligentSearch.productList({
      props: {
        ids: productsIds,
      },
    })
    : [];

  return {
    ...props,
    isMobile: ctx.device !== "desktop",
    url: req.url,
    productImageAspectRatio: "1/1",
    productImageFit: "cover",
    page: {
      ...props.page,
      products,
    } as ProductListingPage,
  };
}

function WishlistGallery(props: SectionProps<typeof loader>) {
  const isEmpty = !props.page || props.page.products.length === 0;

  if (isEmpty) {
    return (
      <div class="container mx-4 sm:mx-auto">
        <div class="mx-10 my-20 flex flex-col gap-4 justify-center items-center">
          <span class="font-medium text-2xl">
            Sua lista de favoritos esta vazia
          </span>
          <span>
            Faça login e adicione produtos na sua lista de favoritos para que
            eles apareçam aqui.
          </span>
        </div>
      </div>
    );
  }

  return <SearchResult {...props} />;
}

export default WishlistGallery;
