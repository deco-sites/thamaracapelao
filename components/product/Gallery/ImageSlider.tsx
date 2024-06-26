import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import { useId } from "$store/sdk/useId.ts";
import {
  ImageObject,
  ProductDetailsPage,
  VideoObject,
} from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import SealsList from "$store/components/product/SealsList.tsx";
import { SealConfig } from "$store/loaders/Seals/seals.tsx";
import ZoomableImage from "$store/islands/ZoomableImage.tsx";
import { ProductImageAspectRatio } from "$store/sections/Theme/Theme.tsx";
import { ProductImageFit } from "$store/sections/Theme/Theme.tsx";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  sealsConfig?: SealConfig[];
  isMobile: boolean;
  layout: {
    width: number;
    height: number;
  };
  imageAspectRatio: ProductImageAspectRatio;
  imageFit: ProductImageFit;
}

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { image: images = [], video: videos = [] },
      product,
    },
    isMobile,
    sealsConfig,
    layout: { width, height },
  } = props;
  const aspectRatio = `${width} / ${height}`;

  const videosUrlsAdjusted = videos.map((video) => {
    const videoUrl = video.contentUrl?.replace("watch?v=", "embed/");
    const videoId = videoUrl?.split("embed/")[1];

    return {
      ...video,
      "@id": videoId,
      contentUrl: videoUrl,
    };
  });

  const medias: (VideoObject | ImageObject)[] | undefined = [
    ...videosUrlsAdjusted,
    ...images,
  ];

  return (
    <div
      id={id}
      class="lg:flex gap-5 flex-1 items-start max-lg:relative lg:sticky lg:top-36 h-fit"
    >
      {/* Dots */}
      {isMobile
        ? (
          <ul class="flex justify-center absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
            {medias?.map((_, index) => (
              <li class="carousel-item">
                <Slider.Dot index={index}>
                  <div class="size-2 m-1 bg bg-neutral-400 rounded-full group-disabled:bg-primary" />
                </Slider.Dot>
              </li>
            ))}
          </ul>
        )
        : (
          <div class="flex flex-col">
            <Slider.PrevButton class="no-animation btn btn-ghost px-0 text-neutral-600 disabled:text-neutral-300">
              <Icon size={24} id="ChevronUp" strokeWidth={3} />
            </Slider.PrevButton>
            <Slider.Thumbs class="carousel carousel-center gap-3 flex-col min-w-[100px] max-lg:hidden max-h-[436px]">
              {medias.map((media, index) => (
                <div class="carousel-item max-w-[100px] sm:max-w-[100px]">
                  <Slider.ThumbItem
                    index={index}
                  >
                    {media?.["@type"] === "ImageObject" && (
                      <Image
                        style={{ aspectRatio }}
                        class="group-disabled:border-primary opacity-50 group-disabled:opacity-100 group-disabled:border-2 border border-neutral-300 object-cover w-full h-full transition"
                        width={100}
                        height={100}
                        src={media.url!}
                        alt={media.alternateName}
                      />
                    )}

                    {media?.["@type"] === "VideoObject" &&
                      (
                        <img
                          style={{ aspectRatio }}
                          class="group-disabled:border-primary group-disabled:border-2 opacity-50 group-disabled:opacity-100 border-neutral-300 border object-cover hover:border-2 hover:border-primary "
                          width={100}
                          height={100}
                          src={`https://i.ytimg.com/vi/${
                            media["@id"]
                          }/hqdefault.jpg`}
                          alt={media.alternateName ?? product.name ?? "Produto"}
                        />
                      )}
                  </Slider.ThumbItem>
                </div>
              ))}
            </Slider.Thumbs>

            <Slider.NextButton
              class="no-animation btn btn-ghost px-0 text-neutral-600 disabled:text-neutral-300"
              disabled={images.length < 2}
            >
              <Icon size={24} id="ChevronDown" strokeWidth={3} />
            </Slider.NextButton>
          </div>
        )}

      {/* Image Slider */}
      <div class="lg:flex items-center gap-1 flex-1 relative">
        <Slider.PrevButton
          class="no-animation btn btn-ghost px-0 max-lg:absolute top-1/2 left-1 z-20 cursor-pointer text-neutral-600 disabled:text-neutral-300"
          disabled
        >
          <Icon size={48} id="ChevronLeft" strokeWidth={3} />
        </Slider.PrevButton>

        <div className="flex-1">
          <Slider class="carousel carousel-center w-full">
            <div class="absolute top-4 left-4 lg:left-[70px] gap-1.5 flex flex-col w-full z-10">
              <SealsList
                sealsConfig={sealsConfig}
                product={product}
                limit={2}
                position="image"
              />
            </div>
            {medias.map((media, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-full flex justify-center"
              >
                {media?.["@type"] === "ImageObject" && props.isMobile && (
                  <ZoomableImage
                    factor={2}
                    type="click"
                    // @ts-ignore class is not a valid attribute for Image
                    class="w-full object-cover"
                    sizes="(max-width: 640px) 100vw, 38vw"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    src={media.url ?? ""}
                    alt={media.alternateName}
                    width={width}
                    height={height}
                    preload={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                )}
                {media?.["@type"] === "ImageObject" && !props.isMobile && (
                  <ZoomableImage
                    factor={2}
                    type="click"
                    // @ts-ignore class is not a valid attribute for Image
                    class="w-full object-cover"
                    sizes="(max-width: 640px) 100vw, 38vw"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    src={media.url ?? ""}
                    alt={media.alternateName}
                    width={width}
                    height={height}
                    preload={index < 2}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                )}

                {media?.["@type"] === "VideoObject" && (
                  <iframe
                    src={media.contentUrl}
                    title=""
                    frameBorder="0"
                    style={{ aspectRatio: `${width} / ${height}` }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </Slider.Item>
            ))}
          </Slider>
          <p class="flex justify-center items-center gap-1.5 text-neutral-500 text-sm mt-2">
            <Icon id="Zoom" size={28} />Clique na imagem para dar zoom
          </p>
        </div>

        <Slider.NextButton
          class="no-animation btn btn-ghost px-0 max-lg:absolute top-1/2 right-1 z-20 text-neutral-600 disabled:text-neutral-300"
          disabled={images.length < 2}
        >
          <Icon size={48} id="ChevronRight" strokeWidth={3} />
        </Slider.NextButton>
      </div>

      <SliderJS rootId={id} />
    </div>
  );
}
