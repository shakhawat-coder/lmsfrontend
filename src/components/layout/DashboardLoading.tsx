import { Loader2Icon } from "lucide-react";

export function DashboardLoading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <Loader2Icon className="h-10 w-10 animate-spin text-primary opacity-20" />
    </div>
  );
}
