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
        color: "var(--text-muted)",
        fontSize: "14px",
        border: "1px dashed var(--border-strong)",
        borderRadius: "14px",
        background: "rgba(255, 255, 255, 0.02)",
      }}
    >
      {label}
    </div>
  );
}
