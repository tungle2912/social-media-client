Follow this guide: [Commit convention](https://gist.github.com/Zekfad/f51cb06ac76e2457f11c80ed705c95a3)

## Common actions

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `chore`: Changes which doesn't change source code or tests e.g. changes to the build process, auxiliary tools, libraries
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `revert`: Revert something
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests

## Base Branches

- main
- develop

## Develop Branches

Syntax:

```bash
[Action_name]/[Ticket_ID]_[Short_Summary]
```

Example:

- feat/TICKET_ID_1
- fix/TICKET_ID_1
- chore/change-env-variables
- refactor/componentA-file-indent

## Merge Flow

`Depends`

## Commit Rules

Syntax:

```bash
[Action_name]([Ticket_ID]): [Short_Message]
```

Example:

- feat(TICKET_ID_1): Apply function A
- fix(TICKET_ID_2): Fix validation function A
- chore: Change env variables
- refactor: Update componentA file indent
