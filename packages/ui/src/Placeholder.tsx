/** 明确标注的占位块：所有"未来接真实能力"的地方用它，方便全局搜索替换。 */
export function Placeholder(props: { label: string; note?: string }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-400">
      <span className="font-medium">[占位] {props.label}</span>
      {props.note ? <p className="mt-1">{props.note}</p> : null}
    </div>
  );
}
