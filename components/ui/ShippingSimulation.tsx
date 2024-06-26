import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useCart } from "apps/vtex/hooks/useCart.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { clx } from "$store/sdk/clx.ts";

export interface Props {
  items: Array<SKU>;
  variant?: "pdp" | "cart";
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

function ShippingContent({
  simulation,
  variant,
  maxItems,
}: {
  simulation: Signal<SimulationOrderForm | null>;
  variant: "pdp" | "cart";
  maxItems?: number;
}) {
  const { cart } = useCart();

  let methods = simulation.value?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  if (maxItems) {
    methods = methods.slice(0, maxItems);
  }

  const locale = cart.value?.clientPreferencesData?.locale || "pt-BR";
  const currencyCode = cart.value?.storePreferencesData.currencyCode || "BRL";

  if (simulation.value == null) {
    return null;
  }

  if (methods.length === 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <div
      class={clx(
        "w-full py-2",
        variant === "cart"
          ? "border-b border-solid border-neutral-300 pb-1.5"
          : "pb-2",
      )}
    >
      <table class="gap-4 w-full">
        {methods.map((method) => (
          <tr class="">
            <th class="font-bold text-left w-auto">{method.name}</th>
            <th class="font-normal text-left px-3 w-28">
              {formatShippingEstimate(method.shippingEstimate)}
            </th>
            <th class="font-bold text-right py-1.5 w-auto">
              {method.price === 0
                ? "Grátis"
                : formatPrice(method.price / 100, currencyCode, locale)}
            </th>
          </tr>
        ))}
      </table>
    </div>
  );
}

function ShippingSimulation({ items, variant = "pdp" }: Props) {
  const postalCode = useSignal("");
  const loading = useSignal(false);
  const simulateResult = useSignal<SimulationOrderForm | null>(null);
  const { simulate, cart } = useCart();

  const handleSimulation = useCallback(async () => {
    if (postalCode.value.length > 9) {
      return;
    }

    try {
      loading.value = true;
      simulateResult.value = await simulate({
        items: items,
        postalCode: postalCode.value,
        country: cart.value?.storePreferencesData.countryCode || "BRA",
      });
    } finally {
      loading.value = false;
    }
  }, []);

  return (
    <div class="flex flex-col gap-2">
      <div
        class={clx(
          "flex justify-between gap-4",
          variant === "pdp" ? "items-start max-lg:flex-col" : "items-center",
        )}
      >
        <div class={clx("flex flex-col", variant === "pdp" && "font-bold")}>
          <span>{variant === "cart" ? "Frete" : "Calcule o Frete:"}</span>
        </div>

        {(simulateResult.value === null || variant === "pdp")
          ? (
            <div
              class={clx(
                "flex-1 max-w-[264px]",
                variant === "pdp" ? "max-lg:max-w-none w-full" : "",
              )}
            >
              <form
                class="flex gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimulation();
                }}
              >
                <div
                  class="relative w-full group/input"
                  data-success={Boolean(simulateResult.value)}
                >
                  <input
                    as="input"
                    type="text"
                    class="input h-12 text-sm placeholder:text-neutral-400 border border-neutral-300 w-full focus:outline-none bg-transparent group-data-[success='true']/input:border-success-500"
                    placeholder="Digite seu CEP"
                    value={postalCode.value}
                    maxLength={9}
                    size={9}
                    onChange={(e: { currentTarget: { value: string } }) => {
                      postalCode.value = e.currentTarget.value;
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  class="btn-primary h-12 w-24"
                  loading={loading.value}
                >
                  Calcular
                </Button>
              </form>
              {variant === "pdp" && (
                <a
                  class="block text-info-500 underline mt-2"
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                >
                  Não sei meu CEP
                </a>
              )}
            </div>
          )
          : (
            <Button
              class="gap-2 text-primary btn-ghost h-8 min-h-8 hover:bg-transparent p-0"
              onClick={() => {
                postalCode.value = "";
                simulateResult.value = null;
              }}
            >
              {postalCode.value}{" "}
              <Icon id="Close" size={24} class="text-neutral-600" />
            </Button>
          )}
      </div>

      <ShippingContent
        simulation={simulateResult}
        variant={variant}
        maxItems={variant === "cart" ? 1 : undefined}
      />
    </div>
  );
}

export default ShippingSimulation;
