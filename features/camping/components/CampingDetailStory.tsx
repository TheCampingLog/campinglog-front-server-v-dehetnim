export default function CampingDetailStory({ intro }: { intro?: string }) {
  return (
    <section>
      <div className="flex items-center gap-4 mb-10">
        <div className="w-2 h-2 bg-teal-500 rounded-full" />
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
          캠핑장 스토리
        </h3>
      </div>
      <div className="text-xl text-slate-600 leading-[1.8] font-light break-all whitespace-pre-line border-l border-slate-100 pl-10">
        {intro ||
          "이곳에 대한 상세한 기록이 아직 준비되지 않았습니다. 하지만 자연이 주는 조용한 위로만큼은 변함없이 기다리고 있습니다."}
      </div>
    </section>
  );
}
