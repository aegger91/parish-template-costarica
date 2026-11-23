/** Renders text where [[words]] get the accent color, e.g. "Our Lady of [[Vladimir]] Church". */
export default function Highlight({ text, className = 'text-accent-300' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/(\[\[.+?\]\])/).map((part, i) =>
        part.startsWith('[[') ? (
          <span key={i} className={className}>
            {part.slice(2, -2)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}