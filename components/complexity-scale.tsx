type ComplexityScaleProps = {
  value: number;
};

export function ComplexityScale({ value }: ComplexityScaleProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      aria-label={`Complexity level ${clamped} out of 100`}
      className="complexity-scale"
      role="img"
    >
      <div className="complexity-scale__labels">
        <span>eli5</span>
        <span>expert</span>
      </div>
      <div className="complexity-scale__track">
        <div className="complexity-scale__fill" style={{ width: `${clamped}%` }} />
        <span className="complexity-scale__dot" style={{ left: `${clamped}%` }} />
      </div>
    </div>
  );
}
