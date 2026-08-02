import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import type { Language } from "../features/submission/types";

const languageExtensions: Record<Language, ReturnType<typeof javascript>> = {
  javascript: javascript(),
  python: python(),
  java: java(),
  cpp: cpp(),
};

interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  return (
    <CodeMirror
      value={value}
      height="420px"
      theme="dark"
      extensions={[languageExtensions[language]]}
      onChange={onChange}
      basicSetup={{ tabSize: 2 }}
    />
  );
}
