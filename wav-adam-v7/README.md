# WAV · ADAM Member Area · v7 (all 7 specialists)

Ivory Edition, premium. Every specialist from the FAS Build Specification now has
its own talk page and its own output page.

## Open it
1. Unzip `wav-adam-v7.zip`.
2. Open the `wav-adam-v7` folder.
3. Double-click `index.html`. Stay online so the brand fonts load.

## Pages (16)
| Step | Specialist | Talk page | Output page | Built from the spec |
|---|---|---|---|---|
| | Dashboard | `index.html` | | Member map |
| 1 | ANCHOR | `anchor.html` | `anchor-output.html` | Trusted Expert Blueprint: 6 lessons, workbook, Trusted Expert Statement (6 parts) |
| 2 | EXTRACT | `extract.html` | `extract-output.html` | Expertise Extraction Coach: 8 interview parts, Expertise Map (7 parts) |
| 3 | RADAR | `radar.html` | `radar-output.html` | Buyer Psychology Tool: 9 parts, Buyer Intelligence Brief (8 blocks), buyer scoring table |
| 4 | FORGE | `forge.html` | `forge-output.html` | Brand Identity Generator: 8 parts, Brand Identity Brief (8 blocks), shortlist scores, stress test, screening checklist |
| 5 | ARCHITECT | `architect.html` | `architect-output.html` | Signature System Builder: Mike's videos, 9 parts, 6 deliverables, curriculum map |
| 6 | VOICE | `voice.html` | `voice-output.html` | Words That Sell: 8 parts, message brief (7 items), 6 copy packs |
| 7 | LAUNCH | `launch-talk.html` | `launch.html` | Million Dollar Rollout Plan: 10 parts, readiness, plan, calendar, sales tracker |
| | My vault | `vault.html` | | Project record |

## Demo state
- Step 1 is complete, step 2 is in progress, steps 3 to 7 are locked.
- Locked steps open in **Preview** mode: you can see every question and every output section,
  but the answer box and Approve button are disabled.

## Each talk page has
Type and Talk modes (voice orb), the step's parts across the top, the first question,
hint or choice chips, "Saved so far", "Uses from your vault" (what this step reads from earlier steps),
and ADAM's promise (the guardrails from the spec for that tool).

## Developer hooks (assets/js/adam.js)
`fas:send`, `fas:hint`, `fas:not-sure`, `fas:mic`, `fas:voice-end`, `fas:orb-state`
`FAS.chat.addMessage()`, `FAS.chat.setTyping()`, `FAS.orb.setState()`, `FAS.voice.setTranscript()`, `FAS.mode()`
New: buttons with `data-chat-fill` put their text into the answer box (used for choices like "Beta launch").

## Before launch
- Replace the "WAV" text mark with the official logo file.
- Delete the "Preview states (build team only)" row on every Talk view.
- `[Bracketed]` text is placeholder data. Mike's video titles are placeholders.
- Specialist names are working names until Dan approves them.
