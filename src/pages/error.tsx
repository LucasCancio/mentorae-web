import { Frown } from "lucide-react";
import { Link, useRouteError } from "react-router";

export function Error() {
  const error = useRouteError() as Error;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold flex items-center gap-4">
        <Frown size={30} /> Whoops, algo aconteceu...
      </h1>
      <p className="text-muted">
        Um erro aconteceu na aplicação, abaixo você encontra mais detalhes:
      </p>
      <pre>
        <code className="text-red-500 dark:text-red-400">
          {error?.message || JSON.stringify(error)}
        </code>
      </pre>
      <pre className="text-muted mt-6">
        Voltar para a{" "}
        <Link to="/" className="text-sky-500 dark:text-sky-400">
          Página principal
        </Link>
      </pre>
    </div>
  );
}
