import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/compat";

export interface Props {
  /**
   * @format URL
   */
  src: string;
  width?: number;
  height?: number;
}

export default function Iframe({ src, height: initialHeight, width }: Props) {
  const ref = useRef<HTMLIFrameElement>(null);

  const height = useSignal(initialHeight || "100%");

  useEffect(() => {
    const resizeIframe = () => {
      setTimeout(() => {
        height.value = ref.current?.contentWindow?.document.body.clientHeight ||
          "100%";
      }, 2000);
    };

    const redirectIframe = () => {
      resizeIframe();

      if (ref.current?.contentWindow?.location.pathname === "/") {
        globalThis.location.href = "/";
      }
    };

    if (ref.current && ref.current.contentWindow) {
      ref.current.addEventListener("load", redirectIframe);
      ref.current.contentWindow.addEventListener("resize", resizeIframe);
    }

    return () => {
      ref.current?.removeEventListener("load", redirectIframe);
      ref.current?.contentWindow?.removeEventListener("resize", resizeIframe);
    };
  }, []);

  return (
    <iframe
      style="border: none;"
      width={width || "100%"}
      height={height.value}
      title="Iframe"
      src={src}
      loading="lazy"
      frameBorder={0}
      allowFullScreen={true}
      ref={ref}
    />
  );
}
