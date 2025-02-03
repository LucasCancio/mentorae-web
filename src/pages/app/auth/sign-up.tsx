import { Helmet } from "react-helmet-async";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { Book, GraduationCap } from "lucide-react";

export function SignUp() {
  return (
    <>
      <Helmet title="Cadastro" />

      <div className="p-8">
        <Button asChild variant="ghost" className="absolute right-4 top-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Escolha entre ser estudante ou professor(a)
            </p>
            <section className="grid grid-cols-2 gap-4 mt-8">
              <Button variant="default" asChild>
                <Link to="/sign-up-student">
                  <Book className="mr-2" /> Estudante
                </Link>
              </Button>

              <Button variant="default" asChild>
                <Link to="/sign-up-teacher">
                  <GraduationCap className="mr-2" /> Professor(a)
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
