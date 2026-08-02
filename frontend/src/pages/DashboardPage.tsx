import { useState } from "react";
import { useMe } from "../features/auth/hooks";
import { useRunCode, useSubmissionResult } from "../features/submission/hooks";
import { LANGUAGES, type Language } from "../features/submission/types";
import { CodeEditor } from "../components/CodeEditor";
import { Spinner } from "../components/Spinner";
import { getErrorMessage } from "../lib/api";

const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

const STARTER_CODE: Record<Language, string> = {
  javascript: `console.log("Hello, world!");\n`,
  python: `print("Hello, world!")\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}\n`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}\n`,
};

export function DashboardPage() {
  const { data: user } = useMe();
  const [language, setLanguage] = useState<Language>("javascript");
  const [codeByLanguage, setCodeByLanguage] =
    useState<Record<Language, string>>(STARTER_CODE);
  const [input, setInput] = useState("");
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const runCodeMutation = useRunCode();
  const result = useSubmissionResult(submissionId);

  const isWaitingForResult = Boolean(submissionId) && !result;
  const isRunning = runCodeMutation.isPending || isWaitingForResult;

  const handleRun = () => {
    setSubmissionId(null);
    runCodeMutation.mutate(
      { code: codeByLanguage[language], language, input },
      { onSuccess: (id) => setSubmissionId(id) },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome back{user ? `, ${user.username}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Write some code, run it, and see the output below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-500"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang]}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-60"
            >
              {isRunning && <Spinner className="h-4 w-4" />}
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-300">
            <CodeEditor
              language={language}
              value={codeByLanguage[language]}
              onChange={(value) =>
                setCodeByLanguage((prev) => ({ ...prev, [language]: value }))
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              placeholder="stdin passed to your program (optional)"
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-3 font-mono text-sm text-slate-900 outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-slate-500">
              Separate values with spaces or newlines to match how your program reads stdin (e.g. Scanner.nextInt in Java, cin in C++).
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Output</label>
            <div className="min-h-32 whitespace-pre-wrap rounded-md border border-slate-300 bg-slate-900 p-3 font-mono text-sm text-slate-100">
              {runCodeMutation.isError && (
                <div className="text-red-400">
                  {getErrorMessage(runCodeMutation.error, "Failed to submit code")}
                </div>
              )}

              {!runCodeMutation.isError && isRunning && (
                <div className="text-slate-400">Waiting for result...</div>
              )}

              {!runCodeMutation.isError && !isRunning && result && (
                <>
                  {result.output && <div>{result.output}</div>}
                  {result.error && (
                    <div className="mt-2 text-red-400">{result.error}</div>
                  )}
                  {!result.output && !result.error && (
                    <div className="text-slate-400">No output.</div>
                  )}
                </>
              )}

              {!runCodeMutation.isError && !isRunning && !result && (
                <div className="text-slate-400">Run your code to see output here.</div>
              )}
            </div>
            {result?.executionTime != null && (
              <p className="text-xs text-slate-500">
                Executed in {result.executionTime} ms
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
