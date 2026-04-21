import Image from "next/image";
import { FadeIn } from "@/components/motion-section";

const GUIDES = [
  {
    name: "Walid Aboulnaga",
    image: "/男.png",
    alt: "Walid Aboulnaga",
    bio: "全球企業家轉型呼吸引導師與轉化導師。曾管理來自14國、1,400+人的團隊，後投入身心靈療癒領域。已在23+國家帶領課程，影響25,000+人，且與 PwC、Danaher、New York University 等機構合作推廣呼吸療癒。",
  },
  {
    name: "Katrina Aboulnaga",
    image: "/女.png",
    alt: "Katrina Aboulnaga",
    bio: "身體療癒與呼吸整合引導者，自幼接觸身心平衡實踐。整合順勢療法、按摩、顱薦療法、呼吸練習、冥想、瑜珈與舞動。以安全、尊重與個別需求為核心，協助人們找回內在平衡。",
  },
] as const;

export function GuidesIntro() {
  return (
    <section className="bg-[#faf9f6] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center font-sans text-xs uppercase tracking-[0.28em] text-[#6b6b66]">
            Guides
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl text-[#3d3428] md:text-4xl">
            導師介紹
          </h2>
        </FadeIn>

        <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-12 md:gap-14">
          {GUIDES.map((g, i) => (
            <FadeIn key={g.name} delay={i * 0.06}>
              <article className="flex flex-row items-start gap-5 sm:gap-8">
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-sm shadow-[0_12px_36px_-14px_rgba(61,52,40,0.25)] sm:h-40 sm:w-32 md:h-44 md:w-36">
                  <Image
                    src={g.image}
                    alt={g.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 96px, 144px"
                  />
                </div>
                <div className="min-w-0 flex-1 pt-0">
                  <h3 className="font-serif text-xl text-[#8B4513] sm:text-2xl md:text-3xl">
                    {g.name}
                  </h3>
                  <p className="mt-2.5 font-sans text-sm leading-[1.8] text-[#5c5348] sm:text-base md:text-lg">
                    {g.bio}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
