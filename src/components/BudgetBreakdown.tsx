import { t } from "../lib/i18n";
import type { Language, TimeBudget } from "../types";

type Props = {
  language: Language;
  budget: TimeBudget;
};

const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

function formatYearsAndDays(hours: number, language: Language) {
  const totalDays = Math.round(hours / 24);
  const years = Math.floor(totalDays / 365.2425);
  const days = Math.max(0, Math.round(totalDays - years * 365.2425));
  const yearLabel = getYearLabel(years, language);
  const dayLabel = getDayLabel(days, language);

  if (years <= 0) {
    return `${numberFormat.format(totalDays)} ${getDayLabel(totalDays, language)}`;
  }

  return `${numberFormat.format(years)} ${yearLabel} ${numberFormat.format(days)} ${dayLabel}`;
}

function getYearLabel(value: number, language: Language) {
  if (language === "en") return value === 1 ? "year" : "years";
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "год";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "года";
  return "лет";
}

function getDayLabel(value: number, language: Language) {
  if (language === "en") return value === 1 ? "day" : "days";
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export function BudgetBreakdown({ language, budget }: Props) {
  const rows = [
    ["sleep", budget.sleepHours],
    ["work", budget.workHours],
    ["food", budget.foodHours],
    ["commute", budget.commuteHours],
    ...budget.customActivities.map((activity) => [activity.name || t(language, "custom"), activity.hours] as const),
  ] as const;

  return (
    <section className="budget-panel">
      <h2>{t(language, "requiredTime")}</h2>
      <div className="budget-list">
        {rows.map(([key, hours]) => (
          <div className="budget-row" key={key}>
            <span>{key in { sleep: true, work: true, food: true, commute: true } ? t(language, key as "sleep" | "work" | "food" | "commute") : key}</span>
            <strong>{formatYearsAndDays(hours, language)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
