import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Skeleton className="rounded-md w-24 h-24" />
          <div className="flex-grow space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-5 w-1/3" />
          </div>
          <div className="text-right">
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}