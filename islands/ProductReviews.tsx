import Component, {
  loader,
} from "$store/components/product/ProductReview/ProductReviews.tsx";

function Island(props: ReturnType<typeof loader>) {
  return <Component {...props} />;
}

export default Island;
