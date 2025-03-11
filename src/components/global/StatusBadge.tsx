import clsx from "clsx";
import { IStatusBadgeProps } from "../../types";

const StatusBadge = ({ text, variant }: IStatusBadgeProps) => {
  const badgeClasses = clsx("text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm", {
    "bg-blue-100 text-blue-800": variant === "DEFAULT",
    "bg-red-100 text-red-800": variant === "TODO",
    "bg-yellow-100 text-yellow-800": variant === "IN_PROGRESS",
    "bg-green-100 text-green-800": variant === "DONE",
  });

  return <span className={badgeClasses}>{text}</span>;
};

export default StatusBadge;
