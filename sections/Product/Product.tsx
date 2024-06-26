export { default, loader } from "$store/components/product/Product.tsx";
export type { Props } from "$store/components/product/Product.tsx";

export function LoadingFallback() {
  return (
    <div style={{ height: "716px" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
