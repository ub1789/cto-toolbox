# CTO Toolbox - Project Guide

This repository contains the distribution logic and assets for the UB Labs CTO Toolbox, an "Engineering OS" designed to bootstrap Claude Code with high-integrity agent and skill definitions.

## Project Structure
- `/assets/agents`: P0 and RepoLens agent definitions (.md).
- `/assets/skills`: Custom Claude Code skills.
- `/assets/templates`: P0 100/100 readiness standard templates.
- `/src`: TypeScript source for the `npx` installer.
- `/bin`: Executable entry point.

## Coding Standards
- **Simplicity First**: The installer should remain lightweight. Use standard Node.js APIs.
- **Idempotency**: All installation actions must be safe to run multiple times. Use SHA-256 checksums to avoid redundant writes.
- **Atomic Writes**: Always write to temporary files and rename to the final destination.
- **Cross-Platform**: Use `os.homedir()` and `path.join` to ensure compatibility across macOS and Linux.

## Maintenance
When adding new agents or skills to the distribution:
1. Add the file to the corresponding `/assets` directory.
2. Update the `README.md` if the usage pattern changes.
3. Bump the version in `package.json`.
