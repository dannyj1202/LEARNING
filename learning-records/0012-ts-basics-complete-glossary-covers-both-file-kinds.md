---
name: ts-basics-complete-glossary-covers-both-file-kinds
description: TS (basics) onboarding task is complete — glossary now spans component files and SDK type files; only generics, narrowing, and utility types remain deferred
metadata:
  type: project
  status: active
---

# TS (basics) closed out — the glossary now covers both kinds of file

The dashboard task "typescript (basics)" asked for a plain-language glossary of every TS construct the user didn't recognize in real repo files. The first pass (Aug 12) covered three *component* files in `packages/app/app-common` and left the SDK type files — the ones the task's own "where to look" list named first — untouched. Lesson 0006 (`lessons/0006-read-a-real-types-file.html`) closes that gap from `packages/sdk/src/types/{sort,filters,transport,home-page,index}.ts`, and `notes/ts-glossary.html` gained Group F (interface, `T[]`, recursive type, union `|`, barrel export, `@/` path alias) and Group G (the `?` vs `| null` three-state table, plus the `strict: false` landmine from [[0011-repo-has-strict-false-nullability-is-unenforced]]).

Against the task's own definition of done: the glossary is reviewed, it's written in plain language against real cited lines, and the genuinely-unresolved list is down to three named items — generics `<T>`, discriminated unions / narrowing, and utility types (`Partial`, `Pick`, `Omit`). None of those appear in any file read so far, so they stay honestly deferred rather than taught against invented examples.

## Implications
- Lesson numbering shifted: `useState` was going to be 0006 and is now next as 0007. The React arc (0007 useState → 08a lifting state → 08b MobX) is unchanged otherwise.
- The three deferred constructs are the natural trigger for a "TS intermediate" session — but only once they show up in a file the user actually has to read. Watch for generics appearing in an SDK utility or a generic API-response type; that's the moment to teach them, not before.
- Two lesson-design patterns worth keeping, both of which came from working against a real repo rather than a synthetic example: (1) reading order matters — teach the 4-line file before the 65-line one, so the shape of a type file is known before its content; (2) a verified compiler transcript pasted into the lesson (actual command, actual error code) is far more convincing than a prose claim, and is cheap to produce.
