type Props = {
  value: string;
  onChange: (val: string) => void;
  allowedValues: string[];
};

export function Test({ value, onChange, allowedValues }: Props) {
  return (
    <div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {allowedValues.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}

export function HideCourb({ value, onChange, allowedValues }: Props) {
  return (
    <div>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {allowedValues.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </div>
  );
}
