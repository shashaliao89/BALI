import Image from "next/image";
import { FadeIn } from "@/components/motion-section";

type Row = {
  title: string;
  body: string;
  image: string;
  alt: string;
};

const ROWS: Row[] = [
  {
    title: "薩滿呼吸法",
    body: "運用古老薩滿呼吸技巧，進入意識的深層流動，釋放情緒並找回靈魂的力量。",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=85&w=1400&auto=format&fit=crop",
    alt: "冥想與呼吸靜心",
  },
  {
    title: "淨水祝福",
    body: "藉由水的純淨能量進行心靈洗滌，感受身心與大自然的和諧連結與祝福，為靈魂注入寧靜與智慧的啟發。",
    image: "/跑步.jpg",
    alt: "稻田與晨光",
  },
  {
    title: "冰浴體驗",
    body: "挑戰感官與意志的極致體驗，透過冷熱交替活化細胞，學習與恐懼共處，達到深層的修復與覺醒。",
    image: "/冰浴.jpg",
    alt: "水與療癒意象",
  },
  {
    title: "瑜伽與冥想",
    body: "透過溫和的伸展與深度呼吸，讓思緒沉降，開啟身體的覺知，釋放深層壓力。",
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=85&w=1400&auto=format&fit=crop",
    alt: "瑜伽與冥想",
  },
  {
    title: "神聖儀式",
    body: "可可儀式、第三眼啟動，引導能量運作以強化內在視角，重塑對世界的感知。",
    image: "/篝火.JPG",
    alt: "篝火與儀式氛圍",
  },
];

export function KeyExperiences() {
  return (
    <section className="bg-[#F5F5F0] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <h2 className="text-center font-serif text-3xl text-[#3d3428] md:text-4xl">
            AWEKEND YOUR SOUL
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center font-sans text-sm text-[#6b6258] md:text-base">
            精心安排的體驗，每一站都是與自己相遇的儀式。
          </p>
        </FadeIn>

        <div className="mt-16 flex flex-col gap-14 md:gap-20">
          {ROWS.map((row, i) => (
            <FadeIn key={row.title}>
              <div className="grid items-center gap-6 md:gap-10 lg:grid-cols-2">
                <div
                  className={`relative aspect-[4/3] overflow-hidden rounded-sm shadow-[0_20px_60px_-20px_rgba(61,52,40,0.3)] ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={row.image}
                    alt={row.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div
                  className={`flex flex-col justify-center px-1 md:px-4 ${
                    i % 2 === 1 ? "lg:order-1 lg:text-right" : ""
                  }`}
                >
                  <h3 className="font-serif text-2xl text-[#8B4513] md:text-3xl">
                    {row.title}
                  </h3>
                  <p className="mt-3 font-sans text-base leading-[1.8] text-[#5c5348] md:text-lg">
                    {row.body}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
