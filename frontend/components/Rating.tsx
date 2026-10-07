import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { Star } from "lucide-react";

type RatingProps = {
  /** Controlled value (0–max). Supports halves, e.g. 3.5 */
  value?: number;
  /** Initial value when uncontrolled */
  defaultValue?: number;
  /** Called with the new value when the user picks a rating */
  onChange?: (value: number) => void;
  /** Display only – no hover, click or keyboard input */
  readOnly?: boolean;
  /** Allow picking half stars by clicking the left half of a star */
  allowHalf?: boolean;
  /** Clicking the currently selected value resets the rating to 0 */
  clearable?: boolean;
  /** Number of stars */
  max?: number;
  /** Icon size in px */
  size?: number;
  className?: string;
  /** Accessible label */
  label?: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const roundToHalf = (n: number) => Math.round(n * 2) / 2;

export function Rating({
  value,
  defaultValue = 0,
  onChange,
  readOnly = false,
  allowHalf = true,
  clearable = false,
  max = 5,
  size = 24,
  className = "",
  label = "Rating",
}: RatingProps) {
  const [internal, setInternal] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);

  const isControlled = value !== undefined;
  const current = clamp(isControlled ? value : internal, 0, max);
  const interactive = !readOnly;
  const step = allowHalf ? 0.5 : 1;

  // What we actually draw: hover preview while hovering, otherwise the value
  const display = roundToHalf(interactive && hover !== null ? hover : current);

  const commit = (next: number) => {
    let v = clamp(next, 0, max);
    if (clearable && v === current) v = 0;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const valueFromPointer = (e: MouseEvent<HTMLSpanElement>, index: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = allowHalf && e.clientX - left < width / 2;
    return index + (isLeftHalf ? 0.5 : 1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      Home: 0,
      End: max,
    };
    if (e.key in keys) {
      e.preventDefault();
      // keyboard should never toggle-clear, so bypass `clearable`
      const v = clamp(keys[e.key], 0, max);
      if (!isControlled) setInternal(v);
      onChange?.(v);
    }
  };

  const valueText = `${current} of ${max} stars`;

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-citrus focus-visible:ring-offset-2 ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
      {...(interactive
        ? {
            role: "slider",
            tabIndex: 0,
            "aria-label": label,
            "aria-valuemin": 0,
            "aria-valuemax": max,
            "aria-valuenow": current,
            "aria-valuetext": valueText,
            onKeyDown: handleKeyDown,
            onMouseLeave: () => setHover(null),
          }
        : { role: "img", "aria-label": `${label}: ${valueText}` })}
    >
      {Array.from({ length: max }, (_, i) => {
        const fill = clamp(display - i, 0, 1); // 0, 0.5 or 1

        return (
          <span
            key={i}
            className="inline-flex relative transition-transform duration-100 hover:scale-110 shrink-0"
            style={{ width: size, height: size }}
            onMouseMove={
              interactive ? (e) => setHover(valueFromPointer(e, i)) : undefined
            }
            onClick={
              interactive ? (e) => commit(valueFromPointer(e, i)) : undefined
            }
          >
            {/* Empty star */}
            <Star
              size={size}
              strokeWidth={1.5}
              className="text-border fill-border"
              aria-hidden
            />
            {/* Filled star, clipped to the fill amount */}
            <span
              className="overflow-hidden absolute inset-y-0 left-0 pointer-events-none"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                strokeWidth={1.5}
                className="max-w-none text-citrus fill-citrus"
                aria-hidden
              />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default Rating;
