# ADR manager CLI

Installation:

```bash
npm i -g @adr-manager/cli
# or
pnpm add -g @adr-manager/cli
# or
yarn global add @adr-manager/cli
# or
bun add -g @adr-manager/cli
```

Tool for convenient ADR management through CLI.

API definition:

Create:

```bash
adr create 'Decision title'
```

Commands generates a document inside of adr folder with name 0001-decision-title.
There is a date being automatically added to this document.
Developer may now write the decision inside the document.

Create and accept immediately:

```bash
adr create --accept 'Decision title'
# or
adr create -a 'Decision title'
```

List:

```bash
adr list
```

Linking, config and customization will be added in next releases.
