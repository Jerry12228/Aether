---
schema_version: 1
open_count: 2
waived_count: 0
fixed_count: 4
total_count: 6
last_updated: 2026-10-09T10:15:48.399Z
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
| 5 | 03 | unrun-verify | .planning/phases/03-virtual-display-feasibility/03-03-PLAN.md |  | 03-03 Task3 actual Win10/11 matrix, All clean-checkout verification and Task4 review remain unrun pending concrete machine authorization/environment | open |  | 2026-10-09T10:15:48.113Z |  |
| 6 | 03 | unrun-verify | scripts/check-virtual-display.ps1 |  | Machine Install fake-authorization negative invocation was rejected before execution by automatic approval review; independent native contract negative passed, no actual Machine fail-closed evidence | open |  | 2026-10-09T10:15:48.399Z |  |

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
  },
  {
    "id": 5,
    "kind": "unrun-verify",
    "phase": "03",
    "file": ".planning/phases/03-virtual-display-feasibility/03-03-PLAN.md",
    "line": null,
    "description": "03-03 Task3 actual Win10/11 matrix, All clean-checkout verification and Task4 review remain unrun pending concrete machine authorization/environment",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-10-09T10:15:48.113Z",
    "resolved_at": null,
    "milestone": null
  },
  {
    "id": 6,
    "kind": "unrun-verify",
    "phase": "03",
    "file": "scripts/check-virtual-display.ps1",
    "line": null,
    "description": "Machine Install fake-authorization negative invocation was rejected before execution by automatic approval review; independent native contract negative passed, no actual Machine fail-closed evidence",
    "status": "open",
    "reason": "",
    "recorded_at": "2026-10-09T10:15:48.399Z",
    "resolved_at": null,
    "milestone": null
  }
]
````
