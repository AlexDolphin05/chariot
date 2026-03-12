/**
 * @chariot/ui — 占位组件
 */
type PlaceholderProps = {
  label: string;
  className?: string;
};

export function Placeholder({ label, className = "" }: PlaceholderProps) {
  return (
    <div
      className={className}
      style={{
        padding: "24px",
        textAlign: "center",
        color: "rgba(128,128,128,0.8)",
        fontSize: "14px",
        border: "1px dashed rgba(128,128,128,0.3)",
        borderRadius: "6px",
      }}
    >
      {label}
    </div>
  );
}
