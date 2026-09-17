import { marked } from "marked";

// Content is authored by Sheila via the CMS (trusted), so rendering the
// generated HTML directly is acceptable here.
export function Markdown({ text, className }: { text: string; className?: string }) {
  const html = marked.parse(text, { async: false }) as string;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
