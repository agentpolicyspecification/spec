# Contributing to APS

## Where to Discuss

- **Design questions, proposals, and open issues** → [Discussions](https://github.com/agentpolicyspecification/.github/discussions)
- **Spec errors, inconsistencies, or missing detail** → [Issues](https://github.com/agentpolicyspecification/spec/issues) in this repo
- **Pull requests** → welcome for clarifications, examples, and schema additions

## How to Propose a Change

1. Open a Discussion first for any non-trivial change — especially anything that affects the data model, enforcement contract, or policy authoring interfaces
2. Once there is rough consensus, open a PR with the specific spec change
3. PRs should reference the Discussion that motivated them

## Spec Document Conventions

- Use `MUST`, `SHOULD`, `MAY`, `MUST NOT` in the RFC 2119 sense
- Mark every document with a status line: `DRAFT`, `STABLE`, or `DEPRECATED`
- Keep examples minimal and concrete — one Rego example and one  example per concept is enough

## What We're Not Accepting Yet

While APS is in the concept and design phase, we are not yet accepting:

- Implementation code (that belongs in separate SDK repositories)
- Framework-specific integrations
- Changes to document structure without prior Discussion
