import Markdown from "react-markdown";

type Props = {
  content: string;
};

export function ContentMarkdown({ content }: Props) {
  return (
    <Markdown
      components={{
        li: ({ children }) => <li className="list-disc ml-6">{children}</li>,
        h1: ({ children }) => (
          <h2 className="text-2xl font-bold">{children}</h2>
        ),
        h2: ({ children }) => <h2 className="text-xl font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold">{children}</h3>,
        h4: ({ children }) => (
          <h4 className="text-base font-bold">{children}</h4>
        ),
        h5: ({ children }) => <h5 className="text-sm font-bold">{children}</h5>,
        a: ({ children }) => (
          <a className="text-blue-500 hover:text-blue-400 transition-colors">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
