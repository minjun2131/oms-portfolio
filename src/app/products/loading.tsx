import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductsLoading() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-[150px]" />
          <Skeleton className="h-4 w-[250px]" />
        </div>
        <Skeleton className="h-10 w-[120px]" />
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 flex-1" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <Skeleton className="h-6 w-[120px]" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/30">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-[200px]" />
                    <Skeleton className="h-4 w-[120px]" />
                  </div>
                </div>
                <div className="flex items-center gap-8 justify-end">
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center pt-4">
        <Skeleton className="h-10 w-[300px]" />
      </div>
    </div>
  );
}
