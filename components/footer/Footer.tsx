import type { Logo } from "$store/components/header/Header.tsx";
import Image from "apps/website/components/Image.tsx";
import { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import { asset } from "$fresh/runtime.ts";
import { AppContext } from "$store/apps/site.ts";
import Section from "$store/components/ui/Section.tsx";
import type { SectionProps } from "$store/components/ui/Section.tsx";
import Items, { HTMLSection, ImageSection, TextSection } from "./Items.tsx";

/** @titleBy alt */

export interface PaymentFlag {
  /**
   * @title Imagem
   */
  src: ImageWidget;
  /**
   * @title Texto alternativo
   */
  alt: string;
  /**
   * @title Largura
   */
  width?: number;
  /**
   * @title Altura
   */
  height?: number;
}

export interface Props {
  logo?: Logo;
  /**
   * @title Seções
   */
  sections: (ImageSection | TextSection | HTMLSection)[];
  /**
   * @title Bandeiras de pagamento
   */
  paymentFlags?: PaymentFlag[];
  /**
   * @title Direitos autorais
   */
  copyRight?: HTMLWidget;

  /** @title Configurações da seção */
  sectionProps?: SectionProps;
}

export function loader(props: Props, _req: Request, ctx: AppContext) {
  return { ...props, isMobile: ctx.device !== "desktop" };
}

export default function Footer({
  logo,
  sections,
  paymentFlags,
  copyRight,
  isMobile,
  sectionProps,
}: ReturnType<typeof loader>) {
  return (
    <Section isMobile={isMobile} {...sectionProps}>
      <div class="bg-secondary-200 text-secondary-200-content">
        <div class="container flex flex-col max-md:px-0">
          {logo && (
            <div class="flex max-md:justify-center">
              <a
                href="/"
                aria-label="Store logo"
                class="block mt-4 mb-10 md:mt-8 md:mb-6"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width || 180}
                  height={logo.height || 40}
                />
              </a>
            </div>
          )}
          <div class="flex max-md:flex-col justify-between mb-6">
            <Items sections={sections} isMobile={isMobile} />
          </div>
          {paymentFlags && (
            <div class="flex gap-2 mb-8 max-md:px-5 max-md:grid max-md:w-fit grid-cols-5">
              {paymentFlags.map((flag) => (
                <Image
                  src={flag.src}
                  alt={flag.alt}
                  width={flag.width || 50}
                  height={flag.height || 30}
                />
              ))}
            </div>
          )}
        </div>
        {copyRight && (
          <div class="bg-base-200 text-ne">
            <div
              class="container flex justify-center leading-[14px] text-xs py-3 max-md:text-center"
              dangerouslySetInnerHTML={{ __html: copyRight }}
            />
          </div>
        )}
        <div class="bg-base-100">
          <div class="container flex justify-center py-3">
            <img
              src={asset("/image/agenciaeplus.svg")}
              alt="agenciaeplus"
              width={115}
              height={21}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
