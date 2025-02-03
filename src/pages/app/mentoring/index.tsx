import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyMentoring } from "@/components/mentoring/my-mentoring";
import { MentoringList } from "@/components/mentoring/mentoring-list";
import { Presentation } from "lucide-react";

export function Mentoring() {
  return (
    <>
      <Helmet title="Mentorias" />

      <div className="mt-2 w-full mx-auto space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
          <Presentation size={45} /> Mentorias
        </h1>

        <Tabs defaultValue="mentoring" className="w-full">
          <TabsList>
            <TabsTrigger value="mentoring">Mentorias</TabsTrigger>
            <TabsTrigger value="my-mentoring">Minhas mentorias</TabsTrigger>
          </TabsList>

          <TabsContent value="mentoring">
            <MentoringList />
          </TabsContent>
          <TabsContent value="my-mentoring">
            <MyMentoring />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
