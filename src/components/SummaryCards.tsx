import { t } from "../lib/i18n";
import { formatYearsMonthsDays } from "../lib/durationFormat";
import { Tooltip } from "./Tooltip";
import type { Language, TimeBreakdown, TimeBudget } from "../types";

type Props = {
  language: Language;
  age: number;
  livedDays: number;
  remaining: TimeBreakdown;
  budget: TimeBudget;
};

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

export function SummaryCards({ language, age, livedDays, remaining, budget }: Props) {
  return (
    <section className="summary-grid">
      <article className="metric-card">
        <span className="metric-label">{t(language, "currentAge")} <Tooltip text={t(language, "currentAgeTooltip")} /></span>
        <strong>{age}</strong>
      </article>
      <article className="metric-card">
        <span className="metric-label">{t(language, "livedTime")} <Tooltip text={t(language, "livedTimeTooltip")} /></span>
        <strong>{formatYearsMonthsDays(livedDays, language)}</strong>
      </article>
      <article className="metric-card featured">
        <span className="metric-label">{t(language, "cleanTime")} <Tooltip text={t(language, "cleanTimeTooltip")} /></span>
        <strong>{formatYearsMonthsDays(budget.cleanDays, language)}</strong>
      </article>
      <article className="metric-card wide">
        <span className="metric-label">{t(language, "grossRemainingTime")} <Tooltip text={t(language, "grossRemainingTooltip")} /></span>
        <strong>{formatYearsMonthsDays(remaining.totalDays, language)}</strong>
      </article>
    </section>
  );
}
