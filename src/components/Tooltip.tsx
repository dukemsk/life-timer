import { useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  text: string;
};

export function Tooltip({ text }: Props) {
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null);

  function showTooltip(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const width = 260;
    const margin = 16;
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, margin), window.innerWidth - width - margin);
    const top = rect.bottom + 10;
    setPosition({ left, top });
  }

  return (
    <span
      aria-label={text}
      className="tooltip"
      onBlur={() => setPosition(null)}
      onFocus={(event) => showTooltip(event.currentTarget)}
      onMouseEnter={(event) => showTooltip(event.currentTarget)}
      onMouseLeave={() => setPosition(null)}
      tabIndex={0}
    >
      ?
      {position &&
        createPortal(
          <span
            aria-hidden="true"
            className="tooltip-content"
            style={{
              left: position.left,
              top: position.top,
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  );
}
