# APS Specification

This repository contains the official specification for the **Agent Policy Specification (APS)** — a vendor-neutral standard for enforcing policies on AI agent interactions.

## Status: Draft

APS is in active design. Sections marked `[DRAFT]` are open for discussion. Sections marked `[STABLE]` are considered settled but not yet versioned.

## Structure

```
spec/          Core specification documents
schemas/       JSON Schema definitions for APS data models
examples/      Example policies (Rego and programmatic)
```

## Specification Documents

| Document | Description | Status |
|---|---|---|
| [Core Concepts](spec/core.md) | Terminology, data model, lifecycle | Draft |
| [Input Policy](spec/input-policy.md) | Policy enforcement on agent input | Draft |
| [Tool Call Policy](spec/tool-call-policy.md) | Policy enforcement on tool invocations | Draft |
| [Output Policy](spec/output-policy.md) | Policy enforcement on model output | Draft |
| [Enforcement Contract](spec/enforcement-contract.md) | Decision actions and runtime obligations | Draft |
| [Policy Authoring](spec/policy-authoring.md) | Writing policies in Rego and programmatic rules | Draft |

## Schemas

JSON Schema (draft 2020-12) definitions for all APS data models:

| Schema | Description |
|---|---|
| [input-context.schema.json](schemas/input-context.schema.json) | `InputContext` — payload at the Input Interception point |
| [tool-call-context.schema.json](schemas/tool-call-context.schema.json) | `ToolCallContext` — payload at the Tool Call Interception point |
| [output-context.schema.json](schemas/output-context.schema.json) | `OutputContext` — payload at the Output Interception point |
| [policy-decision.schema.json](schemas/policy-decision.schema.json) | `PolicyDecision` — the result produced by any policy evaluation |

Schemas are published at `https://agentpolicyspecification.github.io/schemas/` once the GitHub Pages site is live.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to propose changes, raise issues, or discuss design decisions.

Substantive design questions belong in [Discussions](https://github.com/agentpolicyspecification/.github/discussions). Implementation-specific issues belong here.
