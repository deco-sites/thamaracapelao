import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "Account"
  | "Alert"
  | "AlertError"
  | "AlertInfo"
  | "AlertSuccess"
  | "AlertWarning"
  | "ArrowBreadcrumb"
  | "ArrowsPointingOut"
  | "Bars3"
  | "Check"
  | "ChevronDown"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "Close"
  | "Copy"
  | "CreditCards"
  | "Deco"
  | "Diners"
  | "Discord"
  | "Discount"
  | "Elo"
  | "Elos"
  | "Email"
  | "Equals"
  | "Facebook"
  | "FilledStar"
  | "FilterList"
  | "Filters"
  | "Grid"
  | "HalfStar"
  | "Heart"
  | "HeartLine"
  | "Home"
  | "Instagram"
  | "Linkedin"
  | "List"
  | "MagnifyingGlass"
  | "MapPin"
  | "Mastercard"
  | "Mastercards"
  | "Message"
  | "Minus"
  | "Orders"
  | "OutlineStar"
  | "Phone"
  | "Pix"
  | "Pixs"
  | "Plus"
  | "QuestionMarkCircle"
  | "Reload"
  | "Return"
  | "Rule"
  | "Ruler"
  | "ShoppingCart"
  | "Star"
  | "Tiktok"
  | "Trash"
  | "TriangleLeft"
  | "TriangleRight"
  | "Truck"
  | "Twitter"
  | "User"
  | "Visa"
  | "Visas"
  | "WhatsApp"
  | "XMark"
  | "Zoom";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  id: AvailableIcons;
  size?: number;
}

function Icon(
  { id, strokeWidth = 16, size, width, height, ...otherProps }: Props,
) {
  return (
    <svg
      {...otherProps}
      width={width ?? size}
      height={height ?? size}
      strokeWidth={strokeWidth}
    >
      <use href={asset(`/sprites.svg#${id}`)} />
      <title>{id}</title>
    </svg>
  );
}

export default Icon;
