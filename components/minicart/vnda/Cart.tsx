import { useCart } from "apps/vnda/hooks/useCart.ts";
import BaseCart, { MinicartConfig } from "../common/Cart.tsx";

const normalizeUrl = (url: string) =>
  url.startsWith("//") ? `https:${url}` : url;

function Cart({ minicartConfig }: { minicartConfig?: MinicartConfig }) {
  const { cart, loading, updateItem, update } = useCart();
  const items = cart.value?.orderForm?.items ?? [];

  const total = cart.value?.orderForm?.total ?? 0;
  const subtotal = cart.value?.orderForm?.subtotal ?? 0;
  const discounts = cart.value?.orderForm?.subtotal_discount ?? 0;
  const locale = "pt-BR";
  const currency = "BRL";
  const coupon = cart.value?.orderForm?.coupon_code ?? undefined;
  const token = cart.value?.orderForm?.token;

  // TODO: Add analytics from VNDA
  return (
    <BaseCart
      minicartConfig={minicartConfig}
      items={items.map((item) => ({
        image: {
          src: normalizeUrl(item.image_url ?? ""),
          alt: item.product_name,
        },
        url: item.product_url,
        quantity: item.quantity,
        name: item.variant_name,
        price: {
          sale: item.variant_price,
          list: item.variant_price,
        },
      }))}
      total={total}
      subtotal={subtotal}
      discounts={discounts}
      locale={locale}
      currency={currency}
      loading={loading.value}
      coupon={coupon}
      checkoutHref={`/checkout/${token}`}
      onAddCoupon={(code) => update({ coupon_code: code })}
      onUpdateQuantity={async (quantity: number, index: number) => {
        const item = items[index];

        if (!item || typeof item.id === "undefined") return;

        return await updateItem({ quantity, itemId: item.id });
      }}
    />
  );
}

export default Cart;
