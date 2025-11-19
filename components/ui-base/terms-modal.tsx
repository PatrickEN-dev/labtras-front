import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  trigger: React.ReactNode;
  title?: string;
  children: React.ReactNode;
  acceptButtonText?: string;
  cancelButtonText?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

export function TermsModal({
  trigger,
  title = "Termos de Uso",
  children,
  acceptButtonText = "Aceitar",
  cancelButtonText = "Cancelar",
  onAccept,
  onCancel,
}: TermsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Leia atentamente os termos antes de aceitar.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96 pr-4">
          <div className="space-y-4 text-sm text-gray-700">{children}</div>
        </ScrollArea>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            {cancelButtonText}
          </Button>
          <Button onClick={onAccept} className="bg-blue-600 hover:bg-blue-700">
            {acceptButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
