export {
  default,
  loader,
} from "../../components/product/BuyTogether/BuyTogether.tsx";

export function LoadingFallback() {
  return (
    <div style={{ height: "716px" }} class="flex justify-center items-center">
      <span class="loading loading-spinner" />
    </div>
  );
}
