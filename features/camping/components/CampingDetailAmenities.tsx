import { Zap, Wind, Coffee, Tent } from "lucide-react";

export default function CampingDetailAmenities({
  sbrsCl,
}: {
  sbrsCl?: string;
}) {
  const amenityItems = [
    { key: "전기", icon: Zap, label: "전기 사용" },
    { key: "온수", icon: Wind, label: "온수 제공" },
    { key: "무선인터넷", icon: Coffee, label: "와이파이" },
    { key: "취사", icon: Tent, label: "취사 가능", forceActive: true },
  ];

  return (
    <section>
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-2 bg-teal-500 rounded-full" />
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          편의 및 부대시설
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {amenityItems.map((item) => {
          const isActive = item.forceActive || sbrsCl?.includes(item.key);
          return (
            <div
              key={item.label}
              className={`flex flex-col items-center p-8 rounded-[2rem] border transition-all duration-500 ${
                isActive
                  ? "border-teal-100 bg-teal-50/30"
                  : "border-slate-50 bg-slate-50/50 opacity-40"
              }`}
            >
              <item.icon
                className={`w-6 h-6 mb-4 ${
                  isActive ? "text-teal-600" : "text-slate-300"
                }`}
              />
              <span
                className={`text-xs font-bold ${
                  isActive ? "text-teal-900" : "text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
