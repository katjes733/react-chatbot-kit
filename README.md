# react-chatbot-kit

This is a maintained fork of the original react-chatbot-kit. It includes small improvements and fixes (for example: multi-line input support) to keep downstream projects working.

Contributions are welcome — PRs are appreciated. I review when possible.

## Development

### Prerequisites

- Node 18+
- Yarn 1.22+

#### Compatibility

- React: Keep `react` and closely related packages pinned to major version **19**. This preserves compatibility with downstream projects that cannot migrate from React 18. Coordinate any React major-version upgrades with downstream consumers before changing this constraint.

### Setup

1. Install dependencies:

```bash
yarn install
```

2. Run the full verification (formatting + tests):

```bash
yarn verify
```

3. Run tests:

```bash
yarn test
```

## Dependencies

Keep dependencies up to date with each PR. See the **Compatibility** subsection under *Prerequisites* for exceptions to automatic upgrades (for example, the React major-version guidance).

### VS Code

- Recommended: install common extensions (Prettier, ESLint, TypeScript).

## Contributing

- Keep test coverage at current levels.
- Open an issue describing the problem before or alongside a PR.
- Include the issue number in your PR and complete the PR template.
- Set this repository's `main` branch as the PR base.
- Run `yarn verify` and fix any failures before requesting review.

## Notes

- This repo is not actively maintained full-time, but improvements and fixes are accepted.
- See the original project for context: https://github.com/FredrikOseberg/react-chatbot-kit
