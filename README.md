# Figma Document Audit

This project provides a comprehensive structure for tracking and analyzing statistics from a Figma document. The audit includes insights into layers, variables, styles, frames, and components — both local and remote — along with usage, bindings, and metadata completeness.

## AuditStats Schema Overview

The root object `AuditStats` includes the following categories:

- `layers`
- `variables`
- `colorStyles`
- `textStyles`
- `effectStyles`
- `gridStyles`
- `frames`
- `components`

Each category includes a breakdown of local vs remote usage, property tokenization, binding state, and missing descriptions.