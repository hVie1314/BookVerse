# Contributing to BookVerse

Thank you for considering contributing to **BookVerse**! 🎉  
We appreciate your time and effort in making this project better.

## Table of Contents
- [Introduction](#introduction)
- [Branches](#branches)
- [Workflow](#workflow)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Code Reviews](#code-reviews)
- [Coding Standards](#coding-standards)
- [Contact](#contact)

## Introduction
We welcome contributions from everyone! Whether you want to report a bug, suggest a feature, or contribute code, this guide will help you get started.

## Branches
We follow a structured branching model to ensure smooth development and collaboration:

- **main**: The stable production branch.
- **develop**: The main development branch where all features are merged before moving to `main`.
- **feature/frontend**: The branch dedicated to frontend development.
- **feature/backend**: The branch dedicated to backend development.
- **feature/frontend-\<feature-name>**: Specific frontend features are developed in separate branches.
- **feature/backend-\<feature-name>**: Specific backend features are developed in separate branches.
- **bugfix/\<issue-name>**: Bug fixes are handled in these branches.
- **hotfix/\<fix-name>**: Critical production fixes.

All feature branches should be merged into `feature/frontend` or `feature/backend` before being merged into `develop`.  
Once `develop` is stable, it will be merged into `main` for release.

## Workflow
Follow these steps to contribute:

1. **Fork the repository** on GitHub.
2. **Create a new branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name develop
   ```
3. **Make your changes** and commit them (see [Commit Messages](#commit-messages)).
4. **Push your changes** to your fork:
  
  ```bash
  git push origin feature/your-feature-name
```
5. Submit a pull request (PR) to develop.

## Commit Messages

Use a clear and structured format for commit messages:

```plaintext
[Type]: Short description
```

 ### Examples
```bash
feat: Add user authentication system
fix: Resolve issue with checkout page crash
```

### Types of commits:
- feat: Add a new feature
- fix: Fix a bug
- chore: Maintenance tasks (e.g., update dependencies)
- refactor: Improve code without changing functionality
- docs: Update documentation (e.g., README, comments)
- style: Code formatting changes (e.g., indentation, spaces, semicolons)
- perf: Optimize performance (e.g., query optimization, caching)
- test: Add or modify test cases
- ci: Update CI/CD configurations
- build: Changes related to the build system
- revert: Undo a previous commit

## Pull Requests

To submit a pull request:

1. Ensure your branch is up to date with `develop`:

   ```bash
   git pull origin develop
2. Check your changes and ensure all tests pass.
3. Open a PR on GitHub with a descriptive title and summary.
4. Wait for a code review before merging.

## Code Reviews

- PRs must be reviewed by at least **one team member** before merging.  
- Ensure code follows the [Coding Standards](#coding-standards).  
- Review comments must be addressed before approval.  

## Coding Standards

To maintain code quality:
- Follow JavaScript best practices.
- Use Prettier & ESLint for formatting.
- Use meaningful variable and function names.
- Ensure code is modular and reusable.

## Contact

For any questions or discussions:
- Open an **issue** on GitHub.  
- Reach out to the team via **Email**: [1212hoangviet@gmail.com](mailto:1212hoangviet@gmail.com).
