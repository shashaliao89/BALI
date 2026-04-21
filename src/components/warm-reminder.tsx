import { FadeIn } from "@/components/motion-section";

/** 四項內文共用：字級、行高、區塊間距一致 */
const noticeBody =
  "space-y-3 font-sans text-sm leading-[1.75] text-[#3d484a] [&_ul]:list-none [&_ul]:space-y-3 [&_ul]:pt-0";

const NOTICE_ITEMS = [
  {
    title: "1. 住宿地點限制 (Accommodation Requirements)",
    content: (
      <div className={noticeBody}>
        <p>
          考量與主要活動地點之距離，並確保您的旅程體驗從容且優雅，請務必將住宿安排於「Canggu
          市中心區域」。優越的地理位置，將讓您在沉浸於心靈探索之餘，亦能無縫接軌峇里島獨有的濱海度假氛圍。
        </p>
      </div>
    ),
  },
  {
    title: "2. 取消政策 (Cancellation & Refund Policy)",
    content: (
      <div className={noticeBody}>
        <p>
          我們深知這趟特別的心靈之旅背後的期待，然而由於高品質場域與引導師資源皆需提前專屬保留，針對取消行程之相關規範如下：
        </p>
        <ul>
          <li>
            - 行程開始前 40 日（含）以上：可全額退還已付費用之 90%（扣除 10%
            行政處理費）。
          </li>
          <li>- 行程開始前 15 至 39 日：退還已付費用之 50%。</li>
          <li>- 行程開始前 14 日內：恕不接受取消退費，但可將名額轉讓予親友參與。</li>
          <li>
            - 不可抗力因素：若因天候或天然災害等不可抗力因素導致活動無法進行，STEPC
            將主動協助辦理全額退費或行程更換。
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "3. 費用包含與不包含 (Inclusions & Exclusions)",
    content: (
      <div className={noticeBody}>
        <p>這是一場專為靈魂量身打造的昇華計畫，我們為您妥帖安排了以下內容：</p>
        <p>
          費用包含：兩日專屬心靈探索活動、全球大師級講師引導、專屬場域使用、瀑布洗滌行程之包車接送、以及滋養身心的療癒餐食。
        </p>
        <p>
          費用不包含：來回機票、住宿費用、兩日活動外之私人消費及自由行期間之交通與餐飲支出。
        </p>
      </div>
    ),
  },
  {
    title: "4. 注意事項 (Important Notices)",
    content: (
      <div className={noticeBody}>
        <p>
          關於您的旅程守護者：STEPC
          作為峇里島心靈探索盛事之台灣區官方行銷代理，致力於為高端客群提供最純粹的兩日專屬探索行程。請留意，行程兩日以外的食宿、機票及個人旅行規劃均需由您自理。若您需要任何關於行程機票安排之專業建議，歡迎隨時與
          STEPC 專屬顧問團隊聯繫，我們將竭誠為您的靈魂之旅提供最周全的協助。
        </p>
      </div>
    ),
  },
] as const;

export function WarmReminder() {
  return (
    <section className="bg-[#f3f5f5] px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-center font-sans text-sm uppercase tracking-[0.2em] text-[#5f6b6d]">
            Kindly Notice
          </p>
          <h2 className="mt-3 text-center font-serif text-3xl text-[#263033] md:text-4xl">
            溫馨提醒
          </h2>
        </FadeIn>

        <div className="mt-10 space-y-3">
          {NOTICE_ITEMS.map((item, idx) => (
            <FadeIn key={item.title} delay={idx * 0.04}>
              <details className="group border border-[#d4dcde] bg-[#f8faf9]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-sans text-[15px] text-[#2f3a3c] marker:content-none md:text-base">
                  <span>{item.title}</span>
                  <span className="text-sm text-[#5b696b] transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-[#dde4e5] px-5 py-4">{item.content}</div>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
