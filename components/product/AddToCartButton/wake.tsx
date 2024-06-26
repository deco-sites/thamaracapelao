import { useCart } from "apps/wake/hooks/useCart.ts";
import Button, { Props as BtnProps } from "./common.tsx";

export interface Props extends Omit<BtnProps, "onAddItem"> {
  productID: string;
  quantity?: number;
}

function AddToCartButton({
  productID,

  quantity = 1,
  variant,
}: Props) {
  const { addItem } = useCart();
  const onAddItem = () => {
    // TODO: Implement analytics mapping

    return addItem({
      productVariantId: Number(productID),
      quantity,
    });
  };

  return <Button onAddItem={onAddItem} variant={variant} />;
}

export default AddToCartButton;
