import { useEffect, useMemo, useState } from "react";
import { BudgetBreakdown } from "./components/BudgetBreakdown";
import { GridSection } from "./components/GridSection";
import { LanguageToggle } from "./components/LanguageToggle";
import { SettingsForm } from "./components/SettingsForm";
import { SummaryCards } from "./components/SummaryCards";
import { calculateAge, calculateElapsedDays, calculateFinalDate, calculateRemainingBreakdown, diffDays, hasReachedFinalDate, parseDateOnly } from "./lib/dateMath";
import { t } from "./lib/i18n";
import { loadSettings, saveSettings } from "./lib/storage";
import { calculateTimeBudget } from "./lib/timeBudget";
import type { UserSettings } from "./types";

function App() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const now = useMemo(() => new Date(), []);
  const language = settings.language;

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const birthDate = parseDateOnly(settings.birthDate);
  const timeline = useMemo(() => {
    if (!birthDate) return null;
    const finalDate = calculateFinalDate(birthDate, settings.expectedLifespan);
    const retirementDate = calculateFinalDate(birthDate, settings.retirementAge);
    const remaining = calculateRemainingBreakdown(now, finalDate);
    const workEligibleDays = Math.min(remaining.totalDays, diffDays(now, retirementDate));
    const budget = calculateTimeBudget(remaining.totalHours, remaining.totalDays, settings, workEligibleDays);

    return {
      finalDate,
      age: calculateAge(birthDate, now),
      livedDays: calculateElapsedDays(birthDate, now),
      remaining,
      budget,
      reached: hasReachedFinalDate(now, finalDate),
    };
  }, [birthDate, now, settings]);

  function updateSettings(next: Partial<UserSettings>) {
    setSettings((current) => ({ ...current, ...next }));
  }

  const visibleTimeline = timeline && !timeline.reached ? timeline : null;

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">{t(language, "approx")}</p>
          <h1>{t(language, "appTitle")}</h1>
          <p className="subtitle">{t(language, "subtitle")}</p>
        </div>
        <LanguageToggle language={language} onChange={(nextLanguage) => updateSettings({ language: nextLanguage })} />
      </section>

      <div className="layout">
        <SettingsForm settings={settings} onChange={updateSettings} />

        <section className="results-panel" aria-live="polite">
          {!birthDate && <div className="empty-state">{t(language, "enterBirthDate")}</div>}
          {timeline?.reached && <div className="empty-state">{t(language, "reached")}</div>}

          {visibleTimeline && (
            <>
              <SummaryCards
                language={language}
                age={visibleTimeline.age}
                livedDays={visibleTimeline.livedDays}
                remaining={visibleTimeline.remaining}
                budget={visibleTimeline.budget}
              />
              <GridSection
                language={language}
                livedDays={visibleTimeline.livedDays}
                remainingDays={visibleTimeline.remaining.totalDays}
                committedDays={visibleTimeline.budget.committedHours / 24}
              />
              <BudgetBreakdown language={language} budget={visibleTimeline.budget} />
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
