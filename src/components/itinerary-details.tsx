import { FadeIn } from "@/components/motion-section";
import { MAX_CAPACITY, MIN_GROUP_SIZE } from "@/lib/booking-config";

const SCHEDULE = [
  { day: "Day1", time: "07:30 - 08:30", activity: "陰瑜珈 (Yin Yoga)" },
  { day: "Day1", time: "09:30 - 13:00", activity: "淨水祝福 (Water Blessing)" },
  { day: "Day1", time: "14:00 - 16:00", activity: "冰浴療法 (Ice Bath Therapy)" },
  { day: "Day1", time: "17:30 - 19:30", activity: "可可儀式 (Cacao Ceremony)" },
  {
    day: "Day2",
    time: "10:00 - 12:00",
    activity: "薩滿呼吸法 (Shamanic Breathwork)",
  },
  { day: "Day2", time: "14:00 - 15:00", activity: "心靈對話 (Spiritual Talk)" },
  {
    day: "Day2",
    time: "16:30 - 20:30",
    activity: "第三眼啟動 (3rd Eye Activation)",
  },
] as const;

const DAY1 = SCHEDULE.filter((item) => item.day === "Day1");
const DAY2 = SCHEDULE.filter((item) => item.day === "Day2");

export function ItineraryDetails() {
  return (
    <section className="bg-[#f5f5f0] px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center font-sans text-xs uppercase tracking-[0.28em] text-[#6b6b66]">
            Itinerary
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl text-[#2e2f2f] md:text-4xl">
            行程細節
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center font-sans text-sm leading-relaxed text-[#4b4c4c] md:text-base">
            從身體甦醒到內在沉澱，每一天都循序展開。
          </p>
        </FadeIn>

        <div className="mt-12">
          <FadeIn>
            <div className="border border-[#d8dbdb] bg-[#f7f9f9] p-6 md:p-7">
              <h3 className="font-serif text-2xl text-[#2f3333]">旅程節奏</h3>
              <div className="mt-5 space-y-5 font-sans text-sm text-[#3f4747]">
                <div className="border border-[#dbe1e1] bg-white/55 p-4">
                  <p className="font-serif text-lg text-[#2f3939]">Day1</p>
                  <ul className="mt-3 space-y-2.5">
                    {DAY1.map((item) => (
                      <li
                        key={`${item.day}-${item.time}`}
                        className="flex gap-3 border-b border-[#e5eaea] pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="min-w-[108px] whitespace-nowrap text-[#5a6565]">
                          {item.time}
                        </span>
                        <span className="text-[#2f3939]">{item.activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-[#dbe1e1] bg-white/55 p-4">
                  <p className="font-serif text-lg text-[#2f3939]">Day2</p>
                  <ul className="mt-3 space-y-2.5">
                    {DAY2.map((item) => (
                      <li
                        key={`${item.day}-${item.time}`}
                        className="flex gap-3 border-b border-[#e5eaea] pb-2 last:border-b-0 last:pb-0"
                      >
                        <span className="min-w-[108px] whitespace-nowrap text-[#5a6565]">
                          {item.time}
                        </span>
                        <span className="text-[#2f3939]">{item.activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.08} className="mt-8">
            <div className="border border-[#d8dbdb] bg-[#f7f9f9] p-6 md:p-7">
              <h3 className="font-serif text-2xl text-[#2f3333]">費用資訊</h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#4b5252] md:text-base">
              </p>
              <ul className="mt-4 space-y-2.5 font-sans text-sm leading-relaxed text-[#3f4747] md:text-base">
                <li>
                  包場方案：<span className="font-semibold">NTD 612,000</span>
                </li>
                <li>
                  非包場方案：
                  <span className="font-semibold"> NTD 36,000 / 人</span>
                  （最低成行人數 {MIN_GROUP_SIZE} 人，上限 {MAX_CAPACITY} 人）
                </li>
                <li className="text-[#5b6363]">
                  出發前 30 天若人數未滿，則另外私訊通知。
                </li>
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
