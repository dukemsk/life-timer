import { t } from "../lib/i18n";
import type { Language } from "../types";

type Props = {
  language: Language;
  livedDays: number;
  remainingDays: number;
  committedDays: number;
};

type GridConfig = {
  labelKey: "years" | "months" | "weeks" | "days";
  unitDays: number;
  maxCells: number;
};

const grids: GridConfig[] = [
  { labelKey: "years", unitDays: 365.2425, maxCells: 130 },
  { labelKey: "months", unitDays: 30.436875, maxCells: 420 },
  { labelKey: "weeks", unitDays: 7, maxCells: 520 },
  { labelKey: "days", unitDays: 1, maxCells: 700 },
];

function buildRows(livedDays: number, remainingDays: number, committedDays: number, unitDays: number, maxCells: number) {
  const lived = Math.floor(livedDays / unitDays);
  const left = Math.floor(remainingDays / unitDays);
  const committed = Math.min(left, Math.floor(committedDays / unitDays));
  const clean = Math.max(0, left - committed);
  const full = lived + committed + clean;

  return {
    full,
    rows: [
      { key: "lived" as const, label: "lived" as const, count: lived, cells: Math.min(lived, maxCells) },
      { key: "occupied" as const, label: "occupied" as const, count: committed, cells: Math.min(committed, maxCells) },
      { key: "left" as const, label: "cleanRemaining" as const, count: clean, cells: Math.min(clean, maxCells) },
    ],
  };
}

export function GridSection({ language, livedDays, remainingDays, committedDays }: Props) {
  return (
    <section className="grid-stack">
      {grids.map((grid) => {
        const { rows, full } = buildRows(livedDays, remainingDays, committedDays, grid.unitDays, grid.maxCells);
        return (
          <article className="time-grid-card" key={grid.labelKey}>
            <div className="grid-heading">
              <h3>
                {t(language, grid.labelKey)} <span>{full.toLocaleString()}</span>
              </h3>
            </div>
            <div className="grid-rows">
              {rows.map((row) => (
                <div className="grid-row" key={`${grid.labelKey}-${row.key}`}>
                  <div className="grid-row-label">
                    <span>{t(language, row.label)}</span>
                    <strong>{row.count.toLocaleString()}</strong>
                  </div>
                  <div className={`cell-grid ${grid.labelKey} ${row.key}`}>
                    {Array.from({ length: row.cells }, (_, index) => (
                      <span className={`cell ${row.key}`} key={`${grid.labelKey}-${row.key}-${index}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
