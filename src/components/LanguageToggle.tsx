import type { Language } from "../types";

type Props = {
  language: Language;
  onChange: (language: Language) => void;
};

export function LanguageToggle({ language, onChange }: Props) {
  return (
    <div className="language-toggle" aria-label="Language">
      <button className={language === "en" ? "active" : ""} onClick={() => onChange("en")} type="button">
        EN
      </button>
      <button className={language === "ru" ? "active" : ""} onClick={() => onChange("ru")} type="button">
        RU
      </button>
    </div>
  );
}
