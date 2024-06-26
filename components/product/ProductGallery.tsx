// import { usePlatform } from "$store/sdk/usePlatform.tsx";
// import { Product } from "apps/commerce/types.ts";
// import ProductCard from "$store/components/product/ProductCard.tsx";

// export interface Columns {
//   mobile?: 1 | 2;
//   desktop?: 2 | 3 | 4 | 5;
// }

// export interface Props {
//   products: Product[] | null;
//   offset: number;
//   layout?: {
//     columns?: Columns;
//   };
// }

// function LayoutSwitcher() {
// }

// function ProductGallery({ products, layout, offset }: Props) {
//   const platform = usePlatform();
//   const mobile = MOBILE_COLUMNS[layout?.columns?.mobile ?? 2];
//   const desktop = DESKTOP_COLUMNS[layout?.columns?.desktop ?? 4];

//   return (
//     <div class={`grid ${mobile} gap-2 items-center ${desktop} sm:gap-10`}>
//       {products?.map((product, index) => (
//         <ProductCard
//           product={product}
//           preload={index === 0}
//           index={offset + index}
//           platform={platform}
//         />
//       ))}
//     </div>
//   );
// }

// export default ProductGallery;
