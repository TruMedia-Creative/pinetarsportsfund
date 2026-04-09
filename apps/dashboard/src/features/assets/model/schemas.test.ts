import { assetSchema, createAssetSchema } from "./schemas";

describe("asset schemas", () => {
  it("validates a complete asset", () => {
    const parsed = assetSchema.parse({
      id: "a-1",
      name: "Facility Rendering",
      type: "rendering",
      url: "https://example.com/rendering.png",
      alt: "Exterior rendering",
      tags: ["facility"],
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    expect(parsed.type).toBe("rendering");
  });

  it("rejects invalid asset type", () => {
    expect(() =>
      assetSchema.parse({
        id: "a-1",
        name: "Invalid",
        type: "video",
        url: "https://example.com/file",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      }),
    ).toThrow();
  });

  it("requires create payload without id and timestamps", () => {
    const parsed = createAssetSchema.parse({
      name: "Logo",
      type: "logo",
      url: "https://example.com/logo.svg",
    });

    expect(parsed).toEqual({
      name: "Logo",
      type: "logo",
      url: "https://example.com/logo.svg",
    });
  });
});
