import assert from "node:assert/strict";
import test from "node:test";
import {
  escapeIlikePattern,
  mergePlantRows,
  sortPlantsByRelevance,
} from "./search.ts";

test("escapeIlikePattern escapes wildcard characters", () => {
  assert.equal(escapeIlikePattern("100%_plant\\"), "100\\%\\_plant\\\\");
});

test("mergePlantRows keeps the last row for duplicate ids", () => {
  const rows = mergePlantRows([
    {
      id: "1",
      pid: "1001",
      name: "Old",
      lat: 0,
      lng: 0,
      user_id: "user-1",
      user_name: "A",
      created_at: "2026-06-23",
    },
    {
      id: "1",
      pid: "1001",
      name: "New",
      lat: 0,
      lng: 0,
      user_id: "user-1",
      user_name: "A",
      created_at: "2026-06-24",
    },
  ]);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].name, "New");
});

test("sortPlantsByRelevance prioritizes exact and prefix matches", () => {
  const sorted = sortPlantsByRelevance(
    [
      {
        id: "3",
        pid: "1003",
        name: "Other Plant",
        lat: 0,
        lng: 0,
        user_id: "user-1",
        user_name: "A",
        created_at: "2026-06-24",
      },
      {
        id: "2",
        pid: "1002",
        name: "Monstera Thai",
        lat: 0,
        lng: 0,
        user_id: "user-1",
        user_name: "A",
        created_at: "2026-06-22",
      },
      {
        id: "1",
        pid: "1001",
        name: "Monstera",
        lat: 0,
        lng: 0,
        user_id: "user-1",
        user_name: "A",
        created_at: "2026-06-20",
      },
    ],
    "Monstera",
  );

  assert.deepEqual(
    sorted.map((plant) => plant.id),
    ["1", "2", "3"],
  );
});

