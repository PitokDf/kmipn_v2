import { cn } from "@/lib/utils";

type StatusType = 
  | "approve" 
  | "pending" 
  | "rejected" 
  | "passed" 
  | "failed" 
  | "verified" 
  | "unverified";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  approve: { 
    color: "bg-green-100 text-green-800 border-green-200", 
    label: "Approved" 
  },
  pending: { 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    label: "Pending" 
  },
  rejected: { 
    color: "bg-red-100 text-red-800 border-red-200", 
    label: "Rejected" 
  },
  passed: { 
    color: "bg-green-100 text-green-800 border-green-200", 
    label: "Passed" 
  },
  failed: { 
    color: "bg-red-100 text-red-800 border-red-200", 
    label: "Failed" 
  },
  verified: { 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    label: "Verified" 
  },
  unverified: { 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    label: "Unverified" 
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}