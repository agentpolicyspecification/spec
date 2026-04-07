# Changelog

All notable changes to the Agent Policy Specification will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- Release notes are generated automatically from conventional commits. -->

## 1.0.0 (2026-04-07)


### Features

* Added GH Actions to generate changelog ([ae657fa](https://github.com/agentpolicyspecification/spec/commit/ae657fa467d8d0ca46125c3024230dc7b77f8a3e))
* Added linting + tests ([7e56827](https://github.com/agentpolicyspecification/spec/commit/7e568273142aec3059e81803e702bf2be71e6156))
* Added transports and types ([c63abe2](https://github.com/agentpolicyspecification/spec/commit/c63abe21b4e74ccdf8a8090bfe18354ea4c32875))


### Bug Fixes

* add issues:write permission to release-please workflow ([663b7dc](https://github.com/agentpolicyspecification/spec/commit/663b7dcbe8f153c6ff5237c3e3925f90baf68397))
* Added node_modules to gitignore ([2ab9653](https://github.com/agentpolicyspecification/spec/commit/2ab96531d0980d3e36b40cb853c9093e8a52f2a4))

## [0.1.0] - 2026-04-02

### Added

- Core specification: `InputPolicy`, `ToolCallPolicy`, `OutputPolicy` interception points
- Enforcement contract defining `allow`, `deny`, `redact`, `transform`, and `audit` decisions
- JSON schemas for `InputContext`, `ToolCallContext`, `OutputContext`, `PolicyDecision`, and `DslPolicy` (draft-2020-12)
- Schemas versioned under `v0.1.0/` with a shared `base.schema.json`
- Policy authoring guide covering DSL and Rego
