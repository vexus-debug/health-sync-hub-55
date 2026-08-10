import { Badge } from "@/components/ui/badge";
import { TestStatus } from "@/lib/labCatalog";
import { cn } from "@/lib/utils";

const styles: Record<TestStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  Processing: "bg-sky-100 text-sky-800 hover:bg-sky-100",
  Completed: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

export const StatusBadge = ({ status, className }: { status: TestStatus; className?: string }) => (
  <Badge className={cn("rounded-full font-medium border-transparent", styles[status], className)}>
    <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full",
      status === "Pending" && "bg-amber-500",
      status === "Processing" && "bg-sky-500",
      status === "Completed" && "bg-emerald-500",
    )} />
    {status}
  </Badge>
);
