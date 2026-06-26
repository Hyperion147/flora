import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { getRankClassName, getRankLabel, RankIcon } from "./rank";
import { LeaderboardUser } from "./types";

export function LeaderboardTable({
  leaderboard,
  loading,
}: {
  leaderboard: LeaderboardUser[];
  loading: boolean;
}) {
  return (
    <Card className="flora-glass-soft overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-secondary text-primary">
            <Trophy className="h-5 w-5" />
          </span>
          Top Plant Trackers
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Plants Tracked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LeaderboardSkeletonRows />
              ) : leaderboard.length === 0 ? (
                <EmptyLeaderboardRow />
              ) : (
                leaderboard.map((user, index) => {
                  const rank = index + 1;

                  return (
                    <TableRow key={user.user_id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <RankIcon rank={rank} />
                          <span className={getRankClassName(rank)}>
                            {rank}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 sm:size-10">
                            <AvatarImage
                              src={user.avatar_url || undefined}
                              alt={user.user_name}
                            />
                            <AvatarFallback className="bg-secondary text-sm font-black text-primary">
                              {user.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold">
                              {user.user_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getRankLabel(rank)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-lg font-black">
                            {user.plant_count}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            plants
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderboardSkeletonRows() {
  return Array.from({ length: 10 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="ml-auto h-4 w-12" />
      </TableCell>
    </TableRow>
  ));
}

function EmptyLeaderboardRow() {
  return (
    <TableRow>
      <TableCell colSpan={3} className="py-8 text-center">
        <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="font-black">No data available</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Start tracking plants to appear on the leaderboard.
        </p>
      </TableCell>
    </TableRow>
  );
}
