import {
  createFinancialModelSchema,
  financialModelSchema,
} from "./schemas";

describe("financial model schemas", () => {
  it("validates a complete financial model", () => {
    const parsed = financialModelSchema.parse({
      id: "fm-1",
      projectName: "Pine Tar Fieldhouse",
      minimumInvestment: "$50,000",
      targetRaise: "$4,200,000",
      preferredReturn: "8%",
      equityStructure: "LP/GP 70/30",
      useOfFunds: [{ category: "Construction", amount: "$2,000,000" }],
      forecastRows: [{ label: "Year 1 Revenue", value: "$1,000,000" }],
      assumptions: "Conservative occupancy ramp.",
      notes: "Investor deck draft.",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    });

    expect(parsed.useOfFunds[0]?.category).toBe("Construction");
  });

  it("rejects missing assumptions", () => {
    expect(() =>
      createFinancialModelSchema.parse({
        projectName: "Pine Tar Fieldhouse",
        useOfFunds: [{ category: "Construction", amount: "$2,000,000" }],
        forecastRows: [{ label: "Year 1 Revenue", value: "$1,000,000" }],
        assumptions: "",
      }),
    ).toThrow();
  });
});
