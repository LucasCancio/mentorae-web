import { TCategory } from "@/api/categories/get-categories";
import { Badge } from "./ui/badge";

type Props = {
  categories: TCategory[];
};

export function CategoryList({ categories }: Props) {
  return (
    <div className="space-x-2 mt-auto">
      {categories.map((category) => (
        <Badge
          variant="outline"
          className="text-foreground border-[0.5px] text-[10px]"
          key={category.id}
          style={{
            color: category.color,
            borderColor: category.color,
          }}
        >
          {category.name}
        </Badge>
      ))}
    </div>
  );
}
