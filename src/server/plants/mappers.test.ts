import assert from "node:assert/strict";
import test from "node:test";
import { mapLeaderboardRow, mapPlantRow } from "./mappers.ts";

test("mapPlantRow normalizes database rows for the app", () => {
  const mapped = mapPlantRow({
    id: "plant-1",
    pid: 1001,
    name: "Neem Tree",
    description: null,
    category: null,
    image_url: null,
    lat: "29.396",
    lng: "76.97",
    user_id: "user-1",
    user_name: "Admin",
    created_at: new Date("2026-06-24T00:00:00.000Z"),
    updated_at: null,
  });

  assert.equal(mapped.pid, "1001");
  assert.equal(mapped.lat, 29.396);
  assert.equal(mapped.lng, 76.97);
  assert.equal(mapped.description, undefined);
  assert.equal(mapped.image_url, null);
  assert.equal(mapped.created_at, "2026-06-24T00:00:00.000Z");
});

test("mapLeaderboardRow normalizes numeric counts", () => {
  const mapped = mapLeaderboardRow({
    user_id: "user-1",
    user_name: "GreenThumb",
    plant_count: "12",
    avatar_url: "https://example.com/avatar.png",
  });

  assert.equal(mapped.plant_count, 12);
  assert.equal(mapped.avatar_url, "https://example.com/avatar.png");
});
