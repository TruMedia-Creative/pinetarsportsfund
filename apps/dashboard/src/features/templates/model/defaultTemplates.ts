import type { SlideTemplate } from "./types";

export const defaultTemplates: SlideTemplate[] = [
  // ─── 1. Investor Pitch Deck ───────────────────────────────────────────────
  {
    id: "tpl-investor-pitch",
    name: "Investor Pitch Deck",
    description:
      "A full-featured pitch deck designed for equity investors evaluating Pine Tar Sports Fund opportunities.",
    supportedAudienceTypes: ["investor"],
    recommendedGoals: ["raise_equity", "teaser"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Pine Tar Sports Fund",
        defaultContent:
          "Investing in the Future of Sports Infrastructure. [Project Name] | [City, State] | [Year]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Executive Summary",
        defaultContent:
          "Pine Tar Sports Fund is acquiring and developing a premier multi-use sports complex in [City]. This project targets [X]% preferred returns for accredited investors through a [X]-year hold strategy anchored by long-term anchor tenant leases.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "investment_thesis",
        defaultTitle: "Investment Thesis",
        defaultContent:
          "Sports and recreation real estate is an under-served, recession-resilient asset class. Pine Tar Sports Fund targets facilities with strong community demand, verified anchor tenants, and scalable operating models that deliver consistent cash flow.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "market",
        defaultTitle: "Market Opportunity",
        defaultContent:
          "The U.S. sports facility market exceeds $XX billion and is growing at X% annually. [Target Market] has [X] youth athletes, [X] adult leagues, and limited premium indoor sports space — creating significant demand for this project.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "opportunity",
        defaultTitle: "The Opportunity",
        defaultContent:
          "This offering presents accredited investors with a $[X]M equity raise at a [X]x equity multiple over [X] years. First-mover advantage in an underserved market, with a clear exit strategy via refinance or asset sale.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "project_overview",
        defaultTitle: "Project Overview",
        defaultContent:
          "[Facility Name] will be a [X] sq ft multi-sport complex featuring [X] courts, turf fields, training areas, and concession facilities. Located at [Address], the site is accessible to [X]+ residents within a [X]-mile radius.",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Use of Funds",
        defaultContent:
          "Total Raise: $[X]M — Land Acquisition: [X]% | Construction: [X]% | FF&E & Fit-Out: [X]% | Operating Reserve: [X]% | Closing Costs & Fees: [X]%",
        isRequired: true,
        sortOrder: 7,
      },
      {
        type: "returns",
        defaultTitle: "Projected Returns",
        defaultContent:
          "Preferred Return: [X]% | Target IRR: [X]% | Equity Multiple: [X]x | Hold Period: [X] Years | Distributions: Quarterly",
        isRequired: true,
        sortOrder: 8,
      },
      {
        type: "projections",
        defaultTitle: "Financial Projections",
        defaultContent:
          "Year 1 Revenue: $[X]M | Year 3 Revenue: $[X]M | EBITDA Margin: [X]% | NOI at Stabilization: $[X]M | Debt Service Coverage Ratio: [X]x",
        isRequired: false,
        sortOrder: 9,
      },
      {
        type: "team",
        defaultTitle: "The Team",
        defaultContent:
          "Our leadership brings [X]+ years of combined experience in real estate development, sports facility operations, and alternative investment management.",
        isRequired: true,
        sortOrder: 10,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Risk Factors & Disclaimer",
        defaultContent:
          "This presentation is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Investing involves risk, including loss of principal. Past performance is not indicative of future results.",
        isRequired: true,
        sortOrder: 11,
      },
      {
        type: "closing_cta",
        defaultTitle: "Get Involved",
        defaultContent:
          "Minimum Investment: $[X]K | Offering Close: [Date] | Contact: invest@pinetarsportsfund.com | Schedule a call to learn more.",
        isRequired: true,
        sortOrder: 12,
      },
    ],
  },

  // ─── 2. Lender / Financing Deck ───────────────────────────────────────────
  {
    id: "tpl-lender-financing",
    name: "Lender / Financing Deck",
    description:
      "A structured financing presentation for banks, credit unions, and private lenders evaluating a debt position in Pine Tar Sports Fund projects.",
    supportedAudienceTypes: ["lender"],
    recommendedGoals: ["secure_debt"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Pine Tar Sports Fund — Financing Request",
        defaultContent:
          "[Project Name] | Loan Request: $[X]M | [City, State] | [Year]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Transaction Summary",
        defaultContent:
          "Pine Tar Sports Fund is requesting a $[X]M [construction / bridge / permanent] loan for the development of [Project Name], a [X] sq ft multi-use sports complex in [City, State]. The loan is secured by the underlying real estate asset and supported by pre-signed anchor tenant commitments.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "project_overview",
        defaultTitle: "Project Overview",
        defaultContent:
          "[Facility Name] is a [X] sq ft sports and recreation complex located at [Address]. The project includes [X] courts, turf fields, and ancillary retail space. Estimated completion: [Month, Year]. Total project cost: $[X]M.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "market",
        defaultTitle: "Market & Demand Analysis",
        defaultContent:
          "Located in [MSA / Market], the facility serves a population of [X]+ within a [X]-mile radius. Youth sports participation in [County] has grown [X]% over five years, with current indoor sports supply meeting only [X]% of estimated demand.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Sources & Uses",
        defaultContent:
          "Total Project Cost: $[X]M | Senior Loan: $[X]M ([X]% LTC) | Equity: $[X]M | Mezzanine (if applicable): $[X]M | Land Basis: $[X]M | Hard Costs: $[X]M | Soft Costs: $[X]M | Reserves: $[X]M",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "projections",
        defaultTitle: "Financial Projections & Debt Coverage",
        defaultContent:
          "Stabilized NOI: $[X]M | DSCR: [X]x | LTV at Stabilization: [X]% | Break-Even Occupancy: [X]% | Projected Refinance / Takeout: Year [X]",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "returns",
        defaultTitle: "Loan Structure & Terms",
        defaultContent:
          "Requested Loan Amount: $[X]M | Loan Type: [Construction / Bridge / Permanent] | LTC / LTV: [X]% | Requested Rate: [X]% | Term: [X] Months | Recourse: [Full / Limited / Non-Recourse] | Collateral: First Lien on Real Estate",
        isRequired: true,
        sortOrder: 7,
      },
      {
        type: "team",
        defaultTitle: "Borrower & Sponsor Profile",
        defaultContent:
          "Pine Tar Sports Fund principals bring [X]+ years of combined real estate development and sports venue operations experience. The sponsor has successfully completed [X] prior projects totaling $[X]M in value.",
        isRequired: true,
        sortOrder: 8,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Risk Mitigation & Disclaimer",
        defaultContent:
          "Key risks and mitigants: Construction risk (fixed-price GMP contract), lease-up risk (anchor tenant pre-commitment), and market risk (diversified revenue streams). This document is confidential and intended solely for the named recipient.",
        isRequired: true,
        sortOrder: 9,
      },
      {
        type: "closing_cta",
        defaultTitle: "Next Steps",
        defaultContent:
          "We welcome a follow-up call to discuss underwriting details, site visits, and due diligence materials. Contact: finance@pinetarsportsfund.com | [Phone]",
        isRequired: true,
        sortOrder: 10,
      },
    ],
  },

  // ─── 3. Sponsorship Deck ─────────────────────────────────────────────────
  {
    id: "tpl-sponsorship",
    name: "Sponsorship Deck",
    description:
      "A brand-forward sponsorship proposal targeting corporate partners, local businesses, and national brands seeking visibility at Pine Tar Sports Fund facilities.",
    supportedAudienceTypes: ["sponsor"],
    recommendedGoals: ["win_sponsor"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Sponsorship Opportunities",
        defaultContent:
          "Partner with Pine Tar Sports Fund | [Facility Name] | [City, State] | [Season / Year]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Why Partner With Us",
        defaultContent:
          "Pine Tar Sports Fund facilities serve [X]K+ athletes, families, and fans annually. Our venues are gathering places for the community — delivering your brand unmatched dwell time, repeat visits, and authentic local connections.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "opportunity",
        defaultTitle: "Sponsorship Opportunity",
        defaultContent:
          "[Facility Name] opens [Month, Year] in [City, State]. With [X] courts, [X] turf fields, and a projected [X]K annual visitor count, the facility offers year-round brand visibility across youth leagues, adult tournaments, and community events.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "market",
        defaultTitle: "Our Audience",
        defaultContent:
          "Primary demographic: Families with children ages 6–18, household income $[X]K+, within [X] miles. Secondary demographic: Adult recreational athletes and corporate wellness program participants. Annual event attendance projection: [X]K+.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "project_overview",
        defaultTitle: "Facility Highlights",
        defaultContent:
          "[X] Indoor Courts | [X] Turf Fields | [X] Sq Ft Training Center | Pro Shop & Concessions | Digital Scoreboard & PA System | Streaming & Broadcast Infrastructure",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Sponsorship Packages",
        defaultContent:
          "Presenting Sponsor: $[X]K/yr — Naming rights, premium signage, digital presence, hospitality suite\nGold Sponsor: $[X]K/yr — Branded court / field, LED display ads, event booth\nSilver Sponsor: $[X]K/yr — Signage package, social media mentions, program listing\nCommunity Sponsor: $[X]K/yr — Facility directory listing, website logo",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "returns",
        defaultTitle: "What You Get",
        defaultContent:
          "Logo placement on signage, uniforms, and digital boards | Brand mentions at events | Dedicated social media posts | Access to event and tournament data | Custom activation opportunities",
        isRequired: false,
        sortOrder: 7,
      },
      {
        type: "team",
        defaultTitle: "Our Team",
        defaultContent:
          "Pine Tar Sports Fund's operations team brings deep experience managing high-traffic sports venues and executing sponsorship activations that deliver measurable ROI for partners.",
        isRequired: false,
        sortOrder: 8,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Terms & Conditions",
        defaultContent:
          "Sponsorship packages are subject to availability. All placements and activations are outlined in a formal agreement. Projected attendance figures are estimates based on comparable facilities and are not guaranteed.",
        isRequired: true,
        sortOrder: 9,
      },
      {
        type: "closing_cta",
        defaultTitle: "Become a Partner",
        defaultContent:
          "Contact our partnerships team to reserve your sponsorship package. Spots are limited for the Presenting Sponsor tier. Contact: partnerships@pinetarsportsfund.com | [Phone]",
        isRequired: true,
        sortOrder: 10,
      },
    ],
  },

  // ─── 4. Municipality / Partnership Deck ──────────────────────────────────
  {
    id: "tpl-municipality-partnership",
    name: "Municipality / Partnership Deck",
    description:
      "A civic-focused partnership presentation for city governments, economic development agencies, and public-private partnership opportunities.",
    supportedAudienceTypes: ["municipality"],
    recommendedGoals: ["municipal_partnership"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "A Community Investment Proposal",
        defaultContent:
          "Pine Tar Sports Fund × [Municipality Name] | [Project Name] | [City, State] | [Year]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Project Summary",
        defaultContent:
          "Pine Tar Sports Fund proposes to develop [Project Name], a [X] sq ft community sports and recreation complex in [City]. The project will be privately funded, requiring no direct municipal capital outlay, while delivering significant economic and community benefits.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "opportunity",
        defaultTitle: "Community Opportunity",
        defaultContent:
          "[City] currently lacks sufficient indoor recreational infrastructure to serve its growing youth and adult sports population. [Project Name] will fill this gap, creating a permanent community asset that supports youth development, health and wellness, and local economic activity.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "market",
        defaultTitle: "Community Need & Demand",
        defaultContent:
          "[City / County] has [X]K registered youth athletes, [X] active adult sports leagues, and [X] recreation programs — all competing for limited facility time. Surveys indicate [X]% of families travel outside [City] for sports activities, representing lost local economic activity.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "project_overview",
        defaultTitle: "Project Overview",
        defaultContent:
          "[Facility Name] will be a [X] sq ft, privately developed sports complex located at [Address / Site]. The facility will include [X] multi-sport courts, [X] turf fields, a fitness center, community meeting rooms, and concessions serving [X]+ users annually.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "investment_thesis",
        defaultTitle: "Public Benefits",
        defaultContent:
          "Estimated economic impact: $[X]M annually | [X]+ permanent jobs created | [X]+ construction jobs | $[X]K+ annual property and sales tax revenue | Priority access for [City] youth programs during daytime hours",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Project Funding Structure",
        defaultContent:
          "Total Project Cost: $[X]M | Private Equity: $[X]M | Debt Financing: $[X]M | Municipal Partnership (if applicable): Land Lease / Tax Abatement / Infrastructure Contribution | No direct capital expenditure required from [City]",
        isRequired: true,
        sortOrder: 7,
      },
      {
        type: "projections",
        defaultTitle: "Economic Impact Projections",
        defaultContent:
          "Year 1 Visitors: [X]K | Year 3 Visitors: [X]K | Annual Spending at Facility: $[X]M | Indirect Spending in Local Economy: $[X]M | Tax Revenue (Property + Sales): $[X]K/yr",
        isRequired: false,
        sortOrder: 8,
      },
      {
        type: "team",
        defaultTitle: "Development Team",
        defaultContent:
          "Pine Tar Sports Fund is led by experienced real estate developers and sports venue operators with a track record of delivering community-focused facilities on time and on budget.",
        isRequired: true,
        sortOrder: 9,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Disclaimer",
        defaultContent:
          "This presentation is intended for informational purposes and does not constitute a binding commitment. Projections are estimates based on comparable projects. All partnership terms are subject to negotiation and formal agreement.",
        isRequired: true,
        sortOrder: 10,
      },
      {
        type: "closing_cta",
        defaultTitle: "Let's Build Together",
        defaultContent:
          "Pine Tar Sports Fund is ready to engage your economic development and parks & recreation departments. Next steps: site assessment, community needs review, and partnership term sheet. Contact: partnerships@pinetarsportsfund.com",
        isRequired: true,
        sortOrder: 11,
      },
    ],
  },
  {
    id: "tpl-investor-teaser",
    name: "Investor Teaser Deck",
    description:
      "A concise first-meeting deck for investor outreach and quick qualification calls.",
    supportedAudienceTypes: ["investor"],
    recommendedGoals: ["teaser", "raise_equity"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Opportunity Snapshot",
        defaultContent:
          "[Project Name] | [City, State] | high-level investment snapshot",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Why This Deal",
        defaultContent:
          "A one-slide summary of the market gap, asset thesis, and expected investor outcome.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "market",
        defaultTitle: "Demand Signal",
        defaultContent:
          "Show 2-3 datapoints validating demand and undersupply in target market.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Capital Plan",
        defaultContent:
          "Show raise amount, primary uses, and total capitalization at a glance.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "returns",
        defaultTitle: "Target Outcomes",
        defaultContent:
          "Preferred return, IRR range, hold period, and high-level exit pathway.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "team",
        defaultTitle: "Sponsor Credibility",
        defaultContent:
          "Who is executing and why they can deliver this strategy.",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "closing_cta",
        defaultTitle: "Next Step",
        defaultContent:
          "Invite to diligence room or partner call with timeline to allocation.",
        isRequired: true,
        sortOrder: 7,
      },
    ],
  },
  {
    id: "tpl-investment-committee-memo",
    name: "Investment Committee Memo Deck",
    description:
      "A diligence-forward format for IC review with assumptions, sensitivities, and key risks.",
    supportedAudienceTypes: ["investor", "internal"],
    recommendedGoals: ["raise_equity", "board_update"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Investment Committee Review",
        defaultContent:
          "[Project Name] | IC packet | decision date [Date]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Recommendation",
        defaultContent:
          "State proposed decision, ticket size, and rationale in one page.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "investment_thesis",
        defaultTitle: "Core Thesis",
        defaultContent:
          "Outline demand, unit economics, moat, and downside protection.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "projections",
        defaultTitle: "Model & Sensitivities",
        defaultContent:
          "Base, downside, and upside scenarios with assumptions and triggers.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "returns",
        defaultTitle: "Expected Returns",
        defaultContent:
          "IRR, MOIC, distribution cadence, and expected timing.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Key Risks & Mitigants",
        defaultContent:
          "Top risks, mitigation owners, and monitoring cadence.",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "closing_cta",
        defaultTitle: "Decision Required",
        defaultContent:
          "Define approval thresholds and immediate post-approval actions.",
        isRequired: true,
        sortOrder: 7,
      },
    ],
  },
  {
    id: "tpl-board-update",
    name: "Internal Board Update Deck",
    description:
      "A recurring governance update format for leadership and board reporting.",
    supportedAudienceTypes: ["internal"],
    recommendedGoals: ["board_update"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "Board Update",
        defaultContent:
          "[Quarter] update | [Project Name] | [Date]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "executive_summary",
        defaultTitle: "Headline Updates",
        defaultContent:
          "Top wins, blockers, and decisions required this period.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "project_overview",
        defaultTitle: "Milestones",
        defaultContent:
          "Progress vs plan across construction, leasing, operations.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Budget vs Actual",
        defaultContent:
          "Variance by line item and explanation of changes.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "projections",
        defaultTitle: "Forward View",
        defaultContent:
          "Updated forecast and confidence ranges for next 2-3 quarters.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "risks_disclaimer",
        defaultTitle: "Risk Register",
        defaultContent:
          "Top open risks, owner, timeline, and mitigation status.",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "closing_cta",
        defaultTitle: "Decisions & Requests",
        defaultContent:
          "Specific decisions requested from the board this cycle.",
        isRequired: true,
        sortOrder: 7,
      },
    ],
  },
  {
    id: "tpl-operator-jv",
    name: "Operator / JV Partnership Deck",
    description:
      "A partnership deck for co-developers or operators covering roles, economics, and governance.",
    supportedAudienceTypes: ["investor", "internal", "municipality"],
    recommendedGoals: ["raise_equity", "municipal_partnership"],
    sectionDefinitions: [
      {
        type: "cover",
        defaultTitle: "JV Partnership Proposal",
        defaultContent:
          "[Project Name] | Operator/JV proposal | [City, State]",
        isRequired: true,
        sortOrder: 1,
      },
      {
        type: "opportunity",
        defaultTitle: "Partnership Opportunity",
        defaultContent:
          "What this partnership unlocks and why now.",
        isRequired: true,
        sortOrder: 2,
      },
      {
        type: "project_overview",
        defaultTitle: "Operating Model",
        defaultContent:
          "Roles, responsibilities, and decision rights.",
        isRequired: true,
        sortOrder: 3,
      },
      {
        type: "use_of_funds",
        defaultTitle: "Economics & Capital Stack",
        defaultContent:
          "Capital contribution, fee structure, and waterfall summary.",
        isRequired: true,
        sortOrder: 4,
      },
      {
        type: "returns",
        defaultTitle: "Partner Economics",
        defaultContent:
          "Returns by partner and milestones for value creation.",
        isRequired: true,
        sortOrder: 5,
      },
      {
        type: "team",
        defaultTitle: "Team & Governance",
        defaultContent:
          "Named owners by function and governance cadence.",
        isRequired: true,
        sortOrder: 6,
      },
      {
        type: "closing_cta",
        defaultTitle: "Partnership Next Steps",
        defaultContent:
          "Commercial terms workshop, diligence exchange, and term sheet timeline.",
        isRequired: true,
        sortOrder: 7,
      },
    ],
  },
];
