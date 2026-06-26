import { useEffect, useState } from "react";
import { t } from "../lib/i18n";
import { calculateFinalDate, formatDateForLanguage, formatDateTypingInput, parseLocalizedDateInput, parseDateOnly } from "../lib/dateMath";
import { normalizeNumericInput, parseFlexibleNumber } from "../lib/numberInput";
import { Tooltip } from "./Tooltip";
import type { UserSettings } from "../types";

type Props = {
  settings: UserSettings;
  onChange: (settings: Partial<UserSettings>) => void;
};

const numericFields: Array<keyof Pick<
  UserSettings,
  | "expectedLifespan"
  | "retirementAge"
  | "sleepHoursPerDay"
  | "workHoursPerWorkday"
  | "workdaysPerWeek"
  | "foodHoursPerDay"
  | "commuteHoursPerWorkday"
>> = [
  "expectedLifespan",
  "retirementAge",
  "sleepHoursPerDay",
  "workHoursPerWorkday",
  "workdaysPerWeek",
  "foodHoursPerDay",
  "commuteHoursPerWorkday",
];

const maxByField: Record<(typeof numericFields)[number], number> = {
  expectedLifespan: 130,
  retirementAge: 130,
  sleepHoursPerDay: 24,
  workHoursPerWorkday: 24,
  workdaysPerWeek: 7,
  foodHoursPerDay: 24,
  commuteHoursPerWorkday: 24,
};

export function SettingsForm({ settings, onChange }: Props) {
  const language = settings.language;
  const [birthDateText, setBirthDateText] = useState(() => formatDateForLanguage(settings.birthDate, language));
  const [settingDrafts, setSettingDrafts] = useState<Partial<Record<(typeof numericFields)[number], string>>>({});
  const [activityDrafts, setActivityDrafts] = useState<Record<string, Record<string, string>>>({});
  const birthDate = parseDateOnly(settings.birthDate);
  const finalYear = birthDate ? calculateFinalDate(birthDate, settings.expectedLifespan).getFullYear() : null;

  useEffect(() => {
    setBirthDateText(formatDateForLanguage(settings.birthDate, language));
  }, [language, settings.birthDate]);

  function updateBirthDate(value: string) {
    const formattedValue = formatDateTypingInput(value, language);
    setBirthDateText(formattedValue);
    if (!formattedValue.trim()) {
      onChange({ birthDate: "" });
      return;
    }

    const parsed = parseLocalizedDateInput(formattedValue, language);
    if (parsed) {
      onChange({ birthDate: parsed });
    }
  }

  function updateActivity(id: string, next: Partial<UserSettings["customActivities"][number]>) {
    onChange({
      customActivities: settings.customActivities.map((activity) =>
        activity.id === id ? { ...activity, ...next } : activity,
      ),
    });
  }

  function addActivity() {
    onChange({
      customActivities: [
        ...settings.customActivities,
        {
          id: `activity-${Date.now()}`,
          name: "",
          sessionsPerWeek: 1,
          hoursPerSession: 1,
          commuteHoursPerSession: 0,
          years: 0,
        },
      ],
    });
  }

  function removeActivity(id: string) {
    onChange({ customActivities: settings.customActivities.filter((activity) => activity.id !== id) });
  }

  function updateSettingNumber(field: (typeof numericFields)[number], value: string) {
    const normalized = normalizeNumericInput(value);
    setSettingDrafts((current) => ({ ...current, [field]: normalized }));

    const parsed = parseFlexibleNumber(normalized);
    if (parsed !== null) {
      onChange({ [field]: parsed });
    }
  }

  function getSettingNumberValue(field: (typeof numericFields)[number]) {
    return settingDrafts[field] ?? String(settings[field]);
  }

  function clearZeroSettingNumber(field: (typeof numericFields)[number]) {
    if (settings[field] === 0) {
      setSettingDrafts((current) => ({ ...current, [field]: "" }));
    }
  }

  function commitSettingNumber(field: (typeof numericFields)[number]) {
    const draft = settingDrafts[field];
    const parsed = draft === undefined ? settings[field] : parseFlexibleNumber(draft);
    const nextValue = parsed ?? settings[field];
    onChange({ [field]: nextValue });
    setSettingDrafts((current) => ({ ...current, [field]: String(nextValue) }));
  }

  function updateActivityNumber(
    id: string,
    field: "sessionsPerWeek" | "hoursPerSession" | "commuteHoursPerSession" | "years",
    value: string,
  ) {
    const normalized = normalizeNumericInput(value);
    setActivityDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: normalized,
      },
    }));

    const parsed = parseFlexibleNumber(normalized);
    if (parsed !== null) {
      updateActivity(id, { [field]: parsed });
    }
  }

  function getActivityNumberValue(
    id: string,
    field: "sessionsPerWeek" | "hoursPerSession" | "commuteHoursPerSession" | "years",
    value: number,
  ) {
    return activityDrafts[id]?.[field] ?? String(value);
  }

  function clearZeroActivityNumber(id: string, field: "sessionsPerWeek" | "hoursPerSession" | "commuteHoursPerSession" | "years", value: number) {
    if (value === 0) {
      setActivityDrafts((current) => ({
        ...current,
        [id]: {
          ...current[id],
          [field]: "",
        },
      }));
    }
  }

  function commitActivityNumber(id: string, field: "sessionsPerWeek" | "hoursPerSession" | "commuteHoursPerSession" | "years", fallback: number) {
    const draft = activityDrafts[id]?.[field];
    const parsed = draft === undefined ? fallback : parseFlexibleNumber(draft);
    const nextValue = parsed ?? fallback;
    updateActivity(id, { [field]: nextValue });
    setActivityDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: String(nextValue),
      },
    }));
  }

  return (
    <section className="settings-panel">
      <h2>{t(language, "settings")}</h2>
      <label className="field">
        <span>{t(language, "birthDate")}</span>
        <input
          aria-label={t(language, "birthDate")}
          inputMode="numeric"
          placeholder={t(language, "birthDatePlaceholder")}
          type="text"
          value={birthDateText}
          onBlur={() => setBirthDateText(formatDateForLanguage(settings.birthDate, language))}
          onChange={(event) => updateBirthDate(event.target.value)}
        />
      </label>
      {numericFields.map((field) => (
        <label className="field" key={field}>
          <span className="field-title-row">
            {t(language, field)}
            {field === "expectedLifespan" && <Tooltip text={t(language, "expectedLifespanTooltip")} />}
          </span>
          <input
            aria-label={t(language, field)}
            inputMode="decimal"
            min={field === "expectedLifespan" ? 1 : 0}
            max={maxByField[field]}
            step={field === "workdaysPerWeek" ? 1 : 0.25}
            type="text"
            value={getSettingNumberValue(field)}
            onBlur={() => commitSettingNumber(field)}
            onChange={(event) => updateSettingNumber(field, event.target.value)}
            onFocus={() => clearZeroSettingNumber(field)}
          />
          {field === "expectedLifespan" && finalYear && (
            <small className="field-hint">
              {finalYear} {language === "ru" ? "г." : ""}
            </small>
          )}
        </label>
      ))}
      <section className="custom-activities">
        <div className="section-heading-row">
          <h3>{t(language, "customActivities")}</h3>
          <button aria-label={t(language, "addActivity")} className="icon-button" onClick={addActivity} type="button">
            +
          </button>
        </div>
        {settings.customActivities.map((activity) => (
          <div className="activity-card" key={activity.id}>
            <label className="field">
              <span className="field-title-row">
                {t(language, "activityName")}
                <button
                  aria-label={t(language, "removeActivity")}
                  className="minus-button"
                  onClick={() => removeActivity(activity.id)}
                  type="button"
                >
                  -
                </button>
              </span>
              <input
                aria-label={t(language, "activityName")}
                placeholder={t(language, "activityNamePlaceholder")}
                type="text"
                value={activity.name}
                onChange={(event) => updateActivity(activity.id, { name: event.target.value })}
              />
            </label>
            <div className="activity-grid">
              <label className="field compact">
                <span>{t(language, "sessionsPerWeek")}</span>
                <input
                  inputMode="decimal"
                  min="0"
                  max="21"
                  step="1"
                  type="text"
                  value={getActivityNumberValue(activity.id, "sessionsPerWeek", activity.sessionsPerWeek)}
                  onBlur={() => commitActivityNumber(activity.id, "sessionsPerWeek", activity.sessionsPerWeek)}
                  onChange={(event) => updateActivityNumber(activity.id, "sessionsPerWeek", event.target.value)}
                  onFocus={() => clearZeroActivityNumber(activity.id, "sessionsPerWeek", activity.sessionsPerWeek)}
                />
              </label>
              <label className="field compact">
                <span>{t(language, "hoursPerSession")}</span>
                <input
                  inputMode="decimal"
                  min="0"
                  max="24"
                  step="0.25"
                  type="text"
                  value={getActivityNumberValue(activity.id, "hoursPerSession", activity.hoursPerSession)}
                  onBlur={() => commitActivityNumber(activity.id, "hoursPerSession", activity.hoursPerSession)}
                  onChange={(event) => updateActivityNumber(activity.id, "hoursPerSession", event.target.value)}
                  onFocus={() => clearZeroActivityNumber(activity.id, "hoursPerSession", activity.hoursPerSession)}
                />
              </label>
              <label className="field compact">
                <span>{t(language, "commuteHoursPerSession")}</span>
                <input
                  inputMode="decimal"
                  min="0"
                  max="24"
                  step="0.25"
                  type="text"
                  value={getActivityNumberValue(activity.id, "commuteHoursPerSession", activity.commuteHoursPerSession)}
                  onBlur={() => commitActivityNumber(activity.id, "commuteHoursPerSession", activity.commuteHoursPerSession)}
                  onChange={(event) => updateActivityNumber(activity.id, "commuteHoursPerSession", event.target.value)}
                  onFocus={() => clearZeroActivityNumber(activity.id, "commuteHoursPerSession", activity.commuteHoursPerSession)}
                />
              </label>
              <label className="field compact">
                <span>{t(language, "activityYears")}</span>
                <input
                  inputMode="decimal"
                  min="0"
                  max="130"
                  step="0.5"
                  title={t(language, "activityYearsHint")}
                  type="text"
                  value={getActivityNumberValue(activity.id, "years", activity.years)}
                  onBlur={() => commitActivityNumber(activity.id, "years", activity.years)}
                  onChange={(event) => updateActivityNumber(activity.id, "years", event.target.value)}
                  onFocus={() => clearZeroActivityNumber(activity.id, "years", activity.years)}
                />
              </label>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}
