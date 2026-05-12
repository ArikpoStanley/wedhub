import { Fragment } from "react";
import { dressCodeChipVariant, type DressCodeColor } from "@shared/wedding-palette";

export function DressCodeChips({
  colors,
  className = "",
}: {
  colors: DressCodeColor[];
  className?: string;
}) {
  if (colors.length === 0) return null;
  return (
    <div className={`flex flex-wrap items-center justify-center gap-x-2 gap-y-2 ${className}`}>
      {colors.map((c, i) => {
        const variant = dressCodeChipVariant(c.hex);
        return (
          <Fragment key={`${c.hex}-${i}`}>
            {i > 0 ? <span className="text-gray-500 text-sm font-serif self-center">and</span> : null}
            {variant === "filled" ? (
              <span
                className="inline-flex items-center rounded px-3 py-1 text-sm font-medium text-white shadow-sm"
                style={{ backgroundColor: c.hex }}
              >
                {c.name}
              </span>
            ) : (
              <span
                className="inline-flex items-center rounded border-2 bg-white px-3 py-1 text-sm font-medium"
                style={{ borderColor: c.hex, color: c.hex }}
              >
                {c.name}
              </span>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
