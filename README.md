# PeaceQuest

**Play. Understand. Resolve. Grow.**

A social-emotional learning game for children aged 8–14. Students explore an illustrated island with six regions. Each region is a game mode with branching stories and challenges. Teachers get a separate dashboard to follow progress, write their own scenarios and assign missions.

## Run it

Double-click `start.bat`, or:

```
npm install
npm run seed      # demo class (wipes data/peacequest.db)
npm run build
npm start         # http://localhost:4180
```

For development (hot reload on :5180, API on :4180): `npm run dev`

Requires Node 22.5+ (uses the built-in `node:sqlite`).

### Demo accounts

| Role | Login | Password |
|---|---|---|
| Teacher (Ms. Uwase) | teacher@peacequest.school | peace1234 |
| Students | amani, keza, leo, zara, kofi, mei, tomas, nia | peace123 |

Class code for new students: **SUN-42**

## What's inside

| Region | Mode | Content |
|---|---|---|
| Calm Cove | Calm Down Zone | Balloon & box breathing, 5-4-3-2-1 grounding, squeeze & release, feelings check-in, private reflection journal |
| Mirror Lake | Emotion Detective | 3 case files (faces, body language, hidden feelings in stories), magnifier clues, second-look retries |
| Harmony Bridge | Conflict Resolver | 7 branching stories (football bump, borrowed markers, group project, exclusion, rumour, shared tablet, bullying) + teacher scenarios |
| Friendship Forest | Friendship Quest | 5 branching stories (new kid, picking teams, disagreeing, boundaries, a friend's hard day) |
| Lantern Tower | Communication | 3 chat-style dialogues (listening, disagreeing, asking for help) + I-message and apology builders |
| Echo Valley | Empathy Journey | 3 two-sided stories with a feelings wheel |

- 15 branching stories with **61 endings**. Every choice gets a kind explanation from Sola the guide bird. Every ending covers what happened, how others feel, why, and what else to try. Players can rewind any choice.
- XP is calculated **on the server** from the actual path taken, so it can't be faked. Thoughtful choices earn more, but every path earns XP, and reflection, exploring new endings and rewinding are rewarded too.
- 12 levels, 12 badges, 3 daily challenges per day, regions unlock by level and missions unlock in sequence (teacher assignments override locks).

## Privacy

- Reflection text is visible only to the student who wrote it. Teachers only see a count.
- Feelings check-ins are private unless the student switches on "Let my teacher see this check-in".
- Students get a 403 from every `/api/teacher/*` route and a friendly block page in the UI.

## Checks

- `npm run check`: validates every story graph (no dead ends, unreachable nodes or unknown characters)
- `node scripts/smoke.js` (server running): 24 API checks including auth, anti-cheat and privacy
