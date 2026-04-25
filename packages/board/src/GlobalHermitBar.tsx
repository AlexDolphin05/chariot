import { startTransition, useEffect, useState } from "react";
import {
  getBoardScope,
  publish,
  useChariotI18n,
  useKernelStore,
} from "@chariot/kernel";
import { runHermitInBoardScope } from "@chariot/module-hermit";

export function GlobalHermitBar() {
  const { locale, t } = useChariotI18n();
  const input = useKernelStore((state) => state.globalHermitInput);
  const setInput = useKernelStore((state) => state.setGlobalHermitInput);
  const [lastAnswer, setLastAnswer] = useState(
    t("globalHermit.defaultAnswer"),
  );
  const [isRunning, setIsRunning] = useState(false);
  const scope = getBoardScope();

  useEffect(() => {
    setLastAnswer(t("globalHermit.defaultAnswer"));
  }, [locale]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question) {
      return;
    }

    const scope = getBoardScope();

    publish({
      type: "board/hermit.ask",
      payload: {
        question,
        scope,
      },
    });

    setIsRunning(true);
    const answer = await runHermitInBoardScope(question, locale);

    startTransition(() => {
      setLastAnswer(answer);
    });

    setIsRunning(false);
  }

  return (
    <div className="chariot-curtain-hermit">
      <div className="chariot-curtain-hermit-header">
        <div>
          <div className="chariot-microcopy">{t("globalHermit.title")}</div>
          <div className="chariot-curtain-hermit-subtitle">
            {t("globalHermit.subtitle")}
          </div>
        </div>
        <span className="chariot-chip">
          {t("globalHermit.scopeCount", { count: scope.projectIds.length })}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="chariot-curtain-hermit-form">
        <input
          type="text"
          placeholder={t("globalHermit.placeholder")}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="chariot-curtain-hermit-input"
        />
        <button type="submit" className="chariot-curtain-hermit-button">
          {isRunning ? t("globalHermit.sniffing") : t("globalHermit.ask")}
        </button>
      </form>

      <div className="chariot-curtain-hermit-answer">
        {lastAnswer}
      </div>
    </div>
  );
}
