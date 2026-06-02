# Nearley + Moo Math Equation Parser

A small React + TypeScript demo app that parses arithmetic and comparison expressions with
[Nearley](https://nearley.js.org/) and [Moo](https://github.com/no-context/moo), displays the AST,
and evaluates comparison statements to `true` or `false`.

## Demo

View the live demo: https://nearley-moo-math-equation-parser.vercel.app/

## Supported Syntax

- Arithmetic operators: `+`, `-`, `*`, `/`
- Comparison operators: `=`, `!=`
- Parentheses for arithmetic grouping
- Whitespace-insensitive input
- Standard arithmetic precedence: parentheses, then `*` and `/`, then `+` and `-`, then comparison

Comparisons are statement-level expressions, so inputs like `1 + (2 = 3)` are rejected instead of
being treated as arithmetic.

## Run Locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Test and Build

```sh
npm test
npm run lint
npm run build
```

The parser grammar lives in `src/parser/math.ne`. The checked-in compiled Nearley artifact is in
`src/parser/generated/mathParser.cjs`, and the browser-friendly equivalent used by the app is in
`src/parser/generated/mathParser.ts`.

Regenerate the Nearley CommonJS artifact with:

```sh
npm run generate:parser
```

## Example Cases

| Input | Expected |
| --- | --- |
| `1 + 2 = 3` | `true` |
| `2 * 3 + 4 = 10` | `true` |
| `2 * (3 + 4) = 10` | `false` |
| `6 = 10 / 2 + 1` | `true` |
| `12 + 3 != 4 / 2 + 5` | `true` |
| `2 + 3 * 2 = 10` | `false` |
| `2 * 3 + 4 != 10` | `false` |
| `1 + (2 = 3` | invalid, reports line and column |

Additional test cases cover decimals, nested parentheses, arithmetic-only expressions, and inequality
edge cases.

## GitHub Repository

No remote is configured in this local checkout yet. After creating the GitHub repository:

```sh
git remote add origin <repository-url>
git push -u origin main
```

Then share the repository URL here for review.
