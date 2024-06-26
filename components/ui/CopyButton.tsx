import { useSignal } from "@preact/signals";
import { asset } from "$fresh/runtime.ts";
import { clx } from "$store/sdk/clx.ts";

interface Props {
  contentToCopy: string;
}

export default function CopyButton({ contentToCopy }: Props) {
  const copied = useSignal(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contentToCopy);
    copied.value = true;
    setTimeout(() => (copied.value = false), 3000);
  };

  return (
    <button
      class={clx(
        "flex items-center justify-center bg-neutral-100 rounded-md",
        copied.value && "tooltip tooltip-open max-md:tooltip-left",
      )}
      onClick={copyToClipboard}
      data-tip="Link copiado!"
    >
      <img
        class="lg:max-w-7 lg:max-h-7"
        height={32}
        width={32}
        src={asset("/image/copy.svg")}
        alt="Copy"
        loading="lazy"
      />
    </button>
  );
}
