import { MapPin, Phone, Info } from "lucide-react";

export default function CampingDetailInfoCard({ site }: { site: any }) {
  const isResveAvailable = site.resveUrl && site.resveUrl !== "null";

  return (
    <div className="lg:col-span-4">
      <div className="sticky top-32 space-y-10 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
            Information
          </p>
          <h4 className="text-2xl font-black text-slate-900">상세 정보</h4>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Address
              </span>
            </div>
            <p className="text-base font-bold text-slate-700 leading-snug">
              {site.addr1}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Contact
              </span>
            </div>
            <p className="text-base font-bold text-slate-700">
              {site.tel || "연락처 미등록"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                Environment
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              {site.posblFcltyCl || "주변 자연경관이 수려합니다."}
            </p>
          </div>
        </div>

        <a
          href={isResveAvailable ? site.resveUrl : "#"}
          target="_blank"
          rel="noreferrer"
          className="block pt-6"
        >
          <button
            disabled={!isResveAvailable}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-sm hover:bg-teal-600 transition-all duration-500 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95"
          >
            {isResveAvailable ? "예약하기" : "예약 정보 없음"}
          </button>
        </a>
      </div>
    </div>
  );
}
