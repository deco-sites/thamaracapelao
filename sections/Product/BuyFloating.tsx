import { BuyFloating } from "deco-sites/fast-fashion/components/product/BuyFloating.tsx";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import { AppContext } from "$store/apps/site.ts";

export interface BuyFloatingSectionProps {
  page: ProductDetailsPage | null;
}

const BuyFloatingSection = ({ page, isMobile }: ReturnType<typeof loader>) => {
  if (!page || !page.product) return null;

  return (
    <>
      {isMobile && <BuyFloating product={page.product} />}
    </>
  );
};

export function loader(
  props: BuyFloatingSectionProps,
  _req: Request,
  ctx: AppContext,
) {
  const isMobile = ctx.device !== "desktop";
  return { ...props, isMobile };
}

export default BuyFloatingSection;
