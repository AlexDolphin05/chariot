import { applySeedLocale } from "../bootstrap";
import { BoardPane, GlobalHermitBar } from "@chariot/board";
import { useChariotI18n } from "@chariot/kernel";

export function HomePage() {
  const { locale, t } = useChariotI18n();

  return (
    <div className="chariot-curtain-shell">
      <header className="chariot-curtain-header">
        <div className="chariot-curtain-copy">
          <div className="chariot-microcopy">{t("curtain.microcopy")}</div>
          <div className="chariot-curtain-title">{t("curtain.title")}</div>
          <div className="chariot-curtain-subtitle">
            {t("curtain.subtitle")}
          </div>
        </div>
        <div className="chariot-curtain-locale">
          <button
            type="button"
            onClick={() => applySeedLocale("zh-CN")}
            className={`chariot-locale-button${
              locale === "zh-CN" ? " is-active" : ""
            }`}
          >
            {t("shell.zh")}
          </button>
          <button
            type="button"
            onClick={() => applySeedLocale("en")}
            className={`chariot-locale-button${
              locale === "en" ? " is-active" : ""
            }`}
          >
            {t("shell.en")}
          </button>
        </div>
      </header>

      <main className="chariot-curtain-main">
        <BoardPane />
      </main>

      <footer className="chariot-curtain-footer">
        <GlobalHermitBar />
      </footer>
    </div>
  );
}
