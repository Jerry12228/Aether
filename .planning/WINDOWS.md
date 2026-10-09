---
schema_version: 1
open_count: 0
waived_count: 0
fixed_count: 4
total_count: 4
last_updated: 2026-10-09T08:58:25.100Z
---

# Broken Windows Ledger

> Cross-phase defect register. With `workflow.windows_enforce` enabled, `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 03 | deviation | scripts/prepare-helios-display-research.cjs |  | 03-02 necessary driver lifecycle prerequisite repair and package re-audit, historical evidence preserved | fixed |  | 2026-10-09T08:57:20.051Z | 2026-10-09T08:58:23.679Z |
| 2 | 03 | deviation | apps/helios/display_registry.cpp |  | 03-02 redacted runtime logs use private owner directory; validation logs remain ignored artifacts/phase03 | fixed |  | 2026-10-09T08:57:20.520Z | 2026-10-09T08:58:24.156Z |
| 3 | 03 | deviation | docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json |  | 03-02 source repair required rebuilt package and affected admission re-audit, old hashes preserved | fixed |  | 2026-10-09T08:58:22.702Z | 2026-10-09T08:58:24.633Z |
| 4 | 03 | deviation | native/platform/windows/virtual_display_mutation.cpp |  | 03-02 uses current admitted dossier and separately owned native mutation module instead of stale historical references | fixed |  | 2026-10-09T08:58:23.202Z | 2026-10-09T08:58:25.100Z |

````json
[
  {
    "id": 1,
    "kind": "deviation",
    "phase": "03",
    "file": "scripts/prepare-helios-display-research.cjs",
    "line": null,
    "description": "03-02 necessary driver lifecycle prerequisite repair and package re-audit, historical evidence preserved",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-10-09T08:57:20.051Z",
    "resolved_at": "2026-10-09T08:58:23.679Z",
    "milestone": null
  },
  {
    "id": 2,
    "kind": "deviation",
    "phase": "03",
    "file": "apps/helios/display_registry.cpp",
    "line": null,
    "description": "03-02 redacted runtime logs use private owner directory; validation logs remain ignored artifacts/phase03",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-10-09T08:57:20.520Z",
    "resolved_at": "2026-10-09T08:58:24.156Z",
    "milestone": null
  },
  {
    "id": 3,
    "kind": "deviation",
    "phase": "03",
    "file": "docs/phase03/PROVIDER-ADMISSION-RECONSTRUCTED.json",
    "line": null,
    "description": "03-02 source repair required rebuilt package and affected admission re-audit, old hashes preserved",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-10-09T08:58:22.702Z",
    "resolved_at": "2026-10-09T08:58:24.633Z",
    "milestone": null
  },
  {
    "id": 4,
    "kind": "deviation",
    "phase": "03",
    "file": "native/platform/windows/virtual_display_mutation.cpp",
    "line": null,
    "description": "03-02 uses current admitted dossier and separately owned native mutation module instead of stale historical references",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-10-09T08:58:23.202Z",
    "resolved_at": "2026-10-09T08:58:25.100Z",
    "milestone": null
  }
]
````
