import Icon from "$store/components/ui/Icon.tsx";

type Props = {
  rating: number;
  size?: number;
};

function Rating({ rating, size = 16 }: Props) {
  return (
    <a class="flex gap-[1px]" href="#reviewsInfo">
      {new Array(5).fill(null).map((_, index) => {
        const startIconId = rating > index && rating < index + 1
          ? "HalfStar"
          : index + 1 <= rating
          ? "FilledStar"
          : "OutlineStar";

        return <Icon id={startIconId} class="text-primary" size={size} />;
      })}
    </a>
  );
}

export default Rating;
