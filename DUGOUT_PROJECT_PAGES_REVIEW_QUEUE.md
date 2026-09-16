# Dugout Project Pages — Lar Review Queue

This file documents the current status of the four published Dugout project pages after the placeholder-content build-out.

## What changed

- All four published project pages now include address/map data where a source was found, narrative copy across every expected section, team copy, investment-thesis copy, returns review copy, risk/disclaimer copy, and a closing review CTA.
- The pages intentionally do **not** state facility-specific operating metrics or financial-return claims that were not supported by available source material.
- Metrics that still require Tim/Lar approval are visible as `Needs source data`, `Needs Lar review`, `Pending source`, or `Pending approval` rather than blank values or invented numbers.
- Existing project videos were converted into still-image assets so the YAML no longer references missing `hero.jpg`, `photo-1.jpg`, and `photo-2.jpg` files.

## Source-backed fields added

| Page | Address source used | Address now in YAML | Media now available |
|---|---|---|---|
| Dugout Millsap | NCS site page / search result for Dugout Millsap | `497 FM 3028, Millsap, TX 76066` | `hero.jpg`, `photo-1.jpg`, `photo-2.jpg` |
| Dugout Temple | NCS site page for Dugout Temple | `5110 Knob Creek Rd, Temple, TX 76501` | `hero.jpg`, `photo-1.jpg`, `photo-2.jpg` |
| Dugout Whitewright | NCS site page / locations page for Dugout Whitewright | `12321 SH 11, Whitewright, TX 75491` | `hero.jpg`, `photo-1.jpg`, `photo-2.jpg` |
| Dugout Greenville | NCS site page / locations page for Dugout Greenville | `230 County Road 2260, Greenville, TX 75402` | `hero.jpg`, `photo-1.jpg`, `photo-2.jpg` |

## Still needs Lar / operator review

These items remain intentionally unresolved for all four pages unless noted otherwise:

1. Confirm whether each location should remain `published: true` while values are visibly marked as pending.
2. Approve the final hero/gallery image selections and confirm media rights for external investor use.
3. Provide or approve the facility opening / operational-since date.
4. Provide or approve total acreage.
5. Provide or approve baseball and softball field counts.
6. Provide or approve average capacity utilization.
7. Provide or approve annual revenue / trailing-12-month revenue.
8. Provide or approve anchor tenant, partner, and recurring organization wording.
9. Provide market metrics for the exact 60-mile trade area:
   - population within 60 miles
   - median household income
   - youth sports participation rate
   - annual tournament market size
10. Approve Tim Truman bio wording and title.
11. Provide approved expansion scope, capital need, and investment-thesis bullets if these pages are meant to solicit investor interest.
12. Provide approved preferred return, target payback, timeline milestones, and exit/refinance strategy for each location.
13. Confirm legal/disclosure language before investor circulation.
14. Confirm that Gunter/Grayson assumptions should **not** be reused for Millsap, Temple, Whitewright, or Greenville unless a source document says they apply.

## Source files consulted

Local project / venture sources:

- `PROJECTS_INFO_NEEDED.md`
- `content/projects/dugout-millsap.yml`
- `content/projects/dugout-temple.yml`
- `content/projects/dugout-whitewright.yml`
- `content/projects/dugout-greenville.yml`
- `content/index.yml`
- `content/investments/dugout-gunter.yml`
- `content/investments/q2-2026-investor.yml`
- `/Users/larryontruman/ArryoRuma/0_Projects/Efforts/Active/PineTar Dugout - V/2026-09-05-pinetar-dugout-operating-brief.md`
- `/Users/larryontruman/ArryoRuma/0_Projects/Efforts/Active/PineTar Dugout - V/heritage-park-presentation.md`

External/public sources fetched into the kanban workspace for review:

- `sources/dugout-millsap.html` — `https://playncs.com/baseball/Sites/Details/2130/dugout-millsap`
- `sources/dugout-temple.html` — `https://playncs.com/baseball/Sites/Details/2129/dugout-temple`
- `sources/dugout-whitewright.html` — `https://playncs.com/baseball/Sites/Details/2132/dugout-whitewright`
- `sources/dugout-greenville.html` — `https://www.playncs.com/baseball/Sites/Details/2003/dugout-greenville`
- `sources/dugout-turf-wars.html` — `https://playncs.com/baseball/Events/Locations/12319/dugout-turf-wars`
- `sources/pinetar-sports.html` — `https://www.pinetar-sports.com/`

## Notes on claims

- NCS supports the address/location and event-site usage claims.
- The local venture notes support the general Dugout/Pine Tar operating model language.
- The Pine Tar homepage content supports the generic Tim Truman operator-led positioning already used elsewhere in this same site.
- No reviewed source supported location-specific revenue, capacity, acreage, field counts, preferred return, payback, or exit strategy for these four pages; those remain review-gated.
