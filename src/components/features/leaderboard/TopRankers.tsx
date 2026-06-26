import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardUser } from "./types";
import { RankIcon } from "./rank";

export function TopRankers({ users }: { users: LeaderboardUser[] }) {
  if (!users.length) {
    return null;
  }

  return (
    <section className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 md:grid-cols-3 md:gap-4">
      {users.map((user, index) => {
        const rank = index + 1;

        return (
          <Card key={user.user_id} className="flora-glass-soft text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-3 flex items-center justify-center">
                <RankIcon rank={rank} />
              </div>
              <Avatar className="mx-auto mb-3 size-12 sm:size-16">
                <AvatarImage
                  src={user.avatar_url || undefined}
                  alt={user.user_name}
                />
                <AvatarFallback className="bg-secondary text-lg font-black text-primary">
                  {user.user_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="truncate text-sm font-black sm:text-base">
                {user.user_name}
              </h3>
              <p className="mt-1 text-2xl font-black text-primary sm:text-3xl">
                {user.plant_count}
              </p>
              <p className="text-xs text-muted-foreground">plants</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
