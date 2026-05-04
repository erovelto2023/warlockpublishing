import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function MarketplaceSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full">
                    <Skeleton className="aspect-video w-full rounded-t-lg" />
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-4 w-16 rounded-full" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-9 w-24" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}


