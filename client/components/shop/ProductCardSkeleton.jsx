import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductCardSkeleton() {
  return (
    <Card className="border-none shadow-none rounded-lg">
      <CardContent className="p-0">
        <Skeleton className="relative h-[380px] sm:h-[480px] w-full" />
        <div className="pt-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </CardContent>
    </Card>
  );
}