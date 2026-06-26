import assert from "node:assert/strict";
import test from "node:test";
import {
  formatValidationError,
  parseCreatePlantFormData,
  parseOptionalUuid,
} from "./validation.ts";

function validFormData() {
  const formData = new FormData();
  formData.set("name", "Monstera Deliciosa");
  formData.set("description", "A leafy houseplant");
  formData.set("category", "Houseplant");
  formData.set("lat", "0");
  formData.set("lng", "0");
  formData.set(
    "image",
    new File(["plant"], "plant.jpg", { type: "image/jpeg" }),
  );
  return formData;
}

test("parseCreatePlantFormData accepts valid plant input including zero coordinates", () => {
  const parsed = parseCreatePlantFormData(validFormData());

  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.name, "Monstera Deliciosa");
    assert.equal(parsed.data.lat, 0);
    assert.equal(parsed.data.lng, 0);
  }
});

test("parseCreatePlantFormData rejects unsupported image types", () => {
  const formData = validFormData();
  formData.set("image", new File(["plant"], "plant.txt", { type: "text/plain" }));

  const parsed = parseCreatePlantFormData(formData);

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.match(formatValidationError(parsed.error), /JPEG, PNG, WebP, or GIF/);
  }
});

test("parseCreatePlantFormData rejects out-of-range coordinates", () => {
  const formData = validFormData();
  formData.set("lat", "120");

  const parsed = parseCreatePlantFormData(formData);

  assert.equal(parsed.success, false);
  if (!parsed.success) {
    assert.match(formatValidationError(parsed.error), /lat/);
  }
});

test("parseOptionalUuid validates UUID filters", () => {
  assert.equal(parseOptionalUuid(null).success, true);
  assert.equal(parseOptionalUuid("not-a-uuid").success, false);
  assert.equal(
    parseOptionalUuid("00000000-0000-4000-8000-000000000000").success,
    true,
  );
});

