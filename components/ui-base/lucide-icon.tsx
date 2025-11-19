import { cn } from "@/lib/utils";
import { LucideIcon as LucideIconType, LucideProps } from "lucide-react";
import { ComponentType, CSSProperties, forwardRef } from "react";

interface IconProps extends LucideProps {
  icon: LucideIconType | ComponentType<LucideProps>;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const LucideIcon = forwardRef<SVGSVGElement, IconProps>((props: IconProps, ref) => {
  const size = (props.size ?? 24) / 16;

  const IconComponent = props.icon;

  return (
    <IconComponent
      {...props}
      ref={ref}
      className={cn(props.className)}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        ...props.style,
      }}
    />
  );
});

LucideIcon.displayName = "LucideIcon";

export default LucideIcon;
