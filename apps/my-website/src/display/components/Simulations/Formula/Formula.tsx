import React from "react";

// Renders plain-text formulas with "_x" / "_{xy}" as subscripts and
// "^x" / "^{xy}" as superscripts, e.g. "g_μν dx^μ" or "e^−η".
const TOKEN = /([_^])(\{[^}]*\}|[^\s·,.;:()/+=<>[\]]+)/g;

const Formula: React.FC<{ text: string }> = ({ text }) => {
  const parts: Array<React.ReactNode> = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    parts.push(text.slice(last, at));
    const content = m[2].startsWith("{") ? m[2].slice(1, -1) : m[2];
    parts.push(m[1] === "_" ? <sub key={at} className="text-[0.72em]">{content}</sub> : <sup key={at} className="text-[0.72em]">{content}</sup>);
    last = at + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
};

export default Formula;
