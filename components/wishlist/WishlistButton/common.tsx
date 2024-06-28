import { useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";
import Button from "$store/components/ui/Button.tsx";
import { sendEvent } from "$store/sdk/analytics/index.tsx";
import { clx } from "$store/sdk/clx.ts";
import { useEffect } from "preact/hooks";
import { twMerge } from "$store/sdk/twMerge.ts";

export interface Props {
  productID: string;
  productGroupID?: string;
  variant?: "icon" | "full";
  removeItem: () => Promise<void>;
  addItem: () => Promise<void>;
  loading: boolean;
  inWishlist: boolean;
  isUserLoggedIn: boolean;
  class?: string;
}

function ButtonCommon({
  productGroupID,
  productID,
  loading,
  inWishlist,
  isUserLoggedIn,
  removeItem,
  addItem,
  class: _class,
}: Props) {
  const fetching = useSignal(false);
  const showTooltip = useSignal(false);

  useEffect(() => {
    if (inWishlist) {
      showTooltip.value = true;
      const timeout = setTimeout(() => {
        showTooltip.value = false;
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [inWishlist]);

  const onCLick = async (e: Event) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isUserLoggedIn) {
      globalThis.window.alert(
        "Por favor, faça login para adicionar à lista de desejos.",
      );

      return;
    }

    if (loading) {
      return;
    }

    try {
      fetching.value = true;

      if (inWishlist) {
        await removeItem();
      } else if (productID && productGroupID) {
        await addItem();

        sendEvent({
          name: "add_to_wishlist",
          params: {
            items: [
              {
                item_id: productID,
                item_group_id: productGroupID,
                quantity: 1,
              },
            ],
          },
        });
      }
    } finally {
      fetching.value = false;
    }
  };

  return (
    <div
      class={clx(
        "",
        showTooltip.value && "tooltip tooltip-left tooltip-open",
      )}
      data-tip="Favoritado!"
    >
      <Button
        class={twMerge(
          "btn-circle btn-ghost group/wishlist gap-2 swap hover:text-danger-500 data-[wishlisted=true]:text-danger-500 relative flex",
          _class,
        )}
        data-wishlisted={inWishlist}
        loading={fetching.value}
        aria-label="Adicionar à lista de desejos"
        onClick={onCLick}
      >
        <Icon
          id="HeartLine"
          size={24}
          strokeWidth={2}
          class="text-neutral-400"
        />
        <Icon
          id="Heart"
          size={24}
          strokeWidth={2}
          class={clx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] opacity-0 lg:group-hover/wishlist:opacity-100 transition-opacity group-data-[wishlisted='true']/wishlist:opacity-100",
          )}
        />
      </Button>
    </div>
  );
}

export default ButtonCommon;
