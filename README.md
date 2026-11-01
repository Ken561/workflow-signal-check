# Signal Check

Five questions. An honest read on whether an AI-assisted workflow idea is actually worth building, or whether it's smaller than it sounds.

## Why I built this

I've got a three-layer way of thinking about AI impact, individual velocity, workflow redesign, organizational compounding, and I noticed I was running the same mental exercise informally every time someone pitched me a workflow idea. So I built the actual instrument instead of just carrying it around in my head.

The thing worth knowing before you use it: most ideas pitched as "this will transform how the team works" are actually a twenty-minutes-a-day time saver wearing a bigger title. Nothing wrong with the twenty minutes, that's real, but it's a different investment decision than something meant to compound across an org. This tool is built to catch that gap, specifically. If you say you're building something for organizational compounding and admit the smaller pattern underneath it was never actually proven, the tool tells you so, live, instead of quietly scoring you low at the end.

## What it actually does

Walks through five questions: what the workflow is, which of the three layers it's targeting, a layer-specific follow-up, and an honest measurability check. Ends with a real verdict, build now, scope it down, not worth it, or need more information, plus the reasoning, plus a markdown export you can drop straight into a ticket or a doc.

## Running it locally

```
npm install
npm run dev
```

## Stack

Single React component, no backend, nothing stored anywhere, every answer lives in memory for the session and disappears on refresh. That's intentional, this is a thinking tool, not a form that needs to remember you.

## Where the actual model comes from

The three-layer framing and the full written-out worksheet version of this live in [ai-workflow-audit-toolkit](https://github.com/Ken561/ai-workflow-audit-toolkit). This repo is the interactive version of that same thinking, built so you can actually run it instead of filling out markdown by hand.

## License

MIT.
