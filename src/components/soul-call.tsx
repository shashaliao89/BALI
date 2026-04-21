import { FadeIn, ParallaxLayer } from "@/components/motion-section";

const VIDEO_SRC = "/NAFAS%20~%20BALI%20Soulventure%20Nov%202018.mp4";

export function SoulCall() {
  return (
    <section className="bg-[#F5F5F0] px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <p className="font-serif text-2xl leading-relaxed text-[#3d3428] md:text-3xl md:leading-relaxed">
            你記得上一次感受到自己活著是什麼時候嗎？
          </p>
        </FadeIn>
        <FadeIn delay={0.12} className="mt-12">
          <p className="font-sans text-base leading-[1.85] text-[#5c5348] md:text-lg">
            這是一趟為靈魂量身打造的喘息空間。在峇里島的晨光與晚風之間，我們為你保留一段可以慢下來、與自我重新連結的時間——讓身體被好好安放，讓心再次聽見自己的聲音。
          </p>
        </FadeIn>
      </div>
      <ParallaxLayer className="mx-auto mt-20 max-w-5xl" offset={32}>
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm shadow-[0_24px_80px_-24px_rgba(61,52,40,0.35)]">
          <video
            className="h-full w-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            muted
            loop
            playsInline
            controls
          />
        </div>
      </ParallaxLayer>
    </section>
  );
}
