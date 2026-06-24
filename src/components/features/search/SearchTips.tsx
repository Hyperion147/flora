import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const tips = [
  {
    title: "Plant Names",
    items: [
      'Search by common names: "Monstera", "Fiddle Leaf"',
      'Search by scientific names: "Deliciosa", "Lyrata"',
      'Partial matches work: "mon" will find "Monstera"',
    ],
  },
  {
    title: "Descriptions",
    items: [
      'Search care tips: "low maintenance", "drought"',
      'Search characteristics: "trailing", "air purifier"',
      'Search environments: "indoor", "low light"',
    ],
  },
  {
    title: "Users",
    items: [
      "Find plants by specific users",
      "Search by display names",
      "Discover community members",
    ],
  },
  {
    title: "Advanced",
    items: [
      "Search by plant ID numbers",
      "Combine multiple terms",
      "Results are ranked by relevance",
    ],
  },
];

export function SearchTips() {
  return (
    <section className="mt-8">
      <Card className="flora-glass-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-2xl bg-secondary text-primary">
              <TrendingUp className="h-5 w-5" />
            </span>
            Search Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title} className="rounded-2xl bg-card/45 p-4">
                <h4 className="font-black">{tip.title}</h4>
                <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                  {tip.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 size-1.5 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

