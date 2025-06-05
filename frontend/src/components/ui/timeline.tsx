import { formatTanggal } from "@/lib/formatTanggal";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface TimelineItemProps {
  title: string;
  date: string;
  description?: string;
  status: "completed" | "current" | "upcoming";
  isLast?: boolean;
}

interface TimelineProps {
  items: TimelineItemProps[];
  className?: string;
}

const statusIcons = {
  completed: <CheckCircle className="h-6 w-6 text-green-500" />,
  current: <Clock className="h-6 w-6 text-blue-500" />,
  upcoming: <Clock className="h-6 w-6 text-gray-300" />,
};

export function TimelineItem({
  title,
  date,
  description,
  status,
  isLast = false
}: TimelineItemProps) {
  return (
    <li className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className="flex h-6 w-6 items-center justify-center">
          {statusIcons[status]}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-px grow",
              status === "completed" ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <div className={cn(
        "flex flex-col pb-8",
        isLast ? "pb-0" : ""
      )}>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-medium">{title}</h3>
          <time className="text-xs text-muted-foreground">{formatTanggal(date)}</time>
        </div>
        {/* {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description.length > 100 ? `${description.slice(0, 100)}...` : description}</p>
        )} */}
      </div>
    </li>
  );
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <ol className={cn("relative space-y-2", className)}>
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </ol>
  );
}