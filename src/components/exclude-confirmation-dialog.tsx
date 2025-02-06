import { Trash, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (value: boolean) => void;
  isDeleting: boolean;
  onYesClick: () => void;
};

export function ExcludeConfirmationDialog({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  onYesClick,
  isDeleting,
}: Props) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={isDeleting} variant="destructive" title="Excluir">
          <Trash className="size-4" /> Excluir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-row items-center text-yellow-600">
            <TriangleAlert className="size-5 mr-2" /> Deseja realmente excluir
            esse registro?
          </DialogTitle>
          <DialogDescription hidden>
            Deseja realmente excluir esse registro?
          </DialogDescription>
        </DialogHeader>
        <p className="italic">
          Essa ação é irreversível e excluirá permanentemente o registro.
        </p>
        <div className="flex gap-2">
          <Button
            className="flex-1 text-destructive font-semibold"
            type="button"
            onClick={onYesClick}
            variant="outline"
          >
            <Trash className="mr-2 size-4" /> Sim
          </Button>
          <DialogClose asChild>
            <Button className="flex-1" type="button" variant="default">
              Não
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
