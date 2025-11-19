import { cn } from "@/lib/utils";
import { DialogContentProps } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface ModalProps extends DialogContentProps {
  title?: string;
  children: React.ReactNode;
  open: boolean;
  subtitle?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "full";
  toggle: () => void;
  id?: string;
  titleIcon?: React.ElementType;
  titleIconColor?: string;
  className?: string;
  hideHeader?: boolean;
  contentClassName?: string;
  hideClose?: boolean;
  modal?: boolean;
  overlayClassName?: string;
}

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const {
    title,
    children,
    className,
    open,
    toggle,
    subtitle,
    footer,
    size,
    id,
    titleIcon: Icon,
    titleIconColor,
    hideHeader,
    contentClassName,
    hideClose,
    modal,
    overlayClassName,
    ...dialogProps
  } = props;
  return (
    <Dialog modal={modal} open={open} onOpenChange={() => toggle()}>
      <DialogContent
        {...dialogProps}
        hideClose={hideClose}
        size={size}
        className={cn("max-h-[90%] px-0 flex flex-col gap-0", className)}
        id={id}
        overlayClassName={overlayClassName}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event);
          const chantExpress = document.getElementById("chat-express");
          const target = event.target as HTMLElement;
          if (target.closest("#alert-dialog")) {
            event.preventDefault();
          }
          const isChatExpressCLick = chantExpress?.contains(event.target as Node);
          if (isChatExpressCLick) {
            event.preventDefault();
          }
        }}
      >
        {!hideHeader && (
          <DialogHeader className="px-6 pb-3">
            <div className="flex gap-2">
              {Icon && <Icon size={16} className={titleIconColor} />}
              <DialogTitle>{title}</DialogTitle>
            </div>
            <DialogDescription>{subtitle}</DialogDescription>
          </DialogHeader>
        )}
        <div className={cn("px-6 w-full overflow-y-auto scrollbar-medium", contentClassName)}>
          {children}
        </div>
        <div className="px-6">{footer}</div>
      </DialogContent>
    </Dialog>
  );
};
