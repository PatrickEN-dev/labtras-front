interface StatusBadgeProps {
  status: "available" | "occupied" | "reserved";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const statusConfig = {
    available: {
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      badgeColor: "bg-green-100",
    },
    occupied: {
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      badgeColor: "bg-red-100",
    },
    reserved: {
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      badgeColor: "bg-yellow-100",
    },
  };

  const config = statusConfig[status];

  const statusText = {
    available: "Disponível",
    occupied: "Ocupada",
    reserved: "Reservada",
  };

  return (
    <div
      className={`flex justify-between items-center p-2 ${config.bgColor} rounded`}
      suppressHydrationWarning
    >
      <span className="text-sm font-medium">{children}</span>
      <span className={`text-xs ${config.textColor} ${config.badgeColor} px-2 py-1 rounded-full`}>
        {statusText[status]}
      </span>
    </div>
  );
}
