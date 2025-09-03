# ADR manager spec

## Stack

Clean architecture with separated application logic and cli/read-writes to files

Libraries:

- enquirer: for gathering cli input
- mri: for cli flags processing
- mustache & reverse-mustache: for templates parsing and data extraction

## Domain

Statuses:

- Proposed: ADR is drafted but not yet accepted
- Accepted: ADR has been approved and is active
- Rejected: ADR was considered but not approved
- Deprecated: ADR is no longer relevant but not replaced
- Superseded: ADR has been replaced by a newer decision

Those are general statuses but teams may want to add their own statuses according to their processes.

More details may be found [there](https://github.com/joelparkerhenderson/architecture-decision-record)

### Linking Terminology

When creating relations between ADRs, the following terms are used:

- **Target ADR**: The existing ADR that a new ADR is being linked to.
- **Forward Link**: The description of the link from the new ADR to the target ADR (e.g., "Supersedes," "Amends," "Clarifies").
- **Backward Link**: The reciprocal description of the link from the target ADR back to the new ADR (e.g., "Superseded by," "Amended by," "Clarified by").

## Iteration 1 ( Building foundation )

Support 1 pre-defined ARD template type.

- Provide cli to provide developer with:
  1. ability to create ADR documents.

API definition:

Create:

```bash
adr create 'Decision title'
```

Commands generates a document inside of ADRs folder with name 0001-decision-title.
There is a date being automatically added to this document.
Developer may now write the decision inside the document.

Create and accept immediately:

```bash
adr create --accept 'Decision title'
# or
adr create -a 'Decision title'
```

There may be cases while decision was already done and we would like to just document it. Then we need to create an ADR that was already accepted.

List:

```bash
adr list
```

Command lists all ADRs inside of ADRs folder in following format:

```bash
- [0001] decision-title (Accepted)
- [0002] decision-title (Proposed)
```

## Iteration 2 ( Add config foundation )

Add ability to define config in the `adr.config.json`

### `init` command

To simplify the initial setup, an `init` command will be provided. This command will guide the user through creating the `adr.config.json` file.

```bash
adr init
```

This will launch an interactive prompt that asks for:

1.  **ADR Directory**: The location to store ADR files (e.g., `ADRs`, `docs/adr`).
2.  **Default Links**: An option to pre-populate the configuration with a set of common link types, such as "Supersedes," "Amends," and "Clarifies." Users can also choose to start with an empty list.

The resulting `adr.config.json` would look something like this:

```json
{
  "directory": "ADRs",
  "links": [
    {
      "alias": "supersedes",
      "title": "Supersedes",
      "forward": {
        "label": "Supersedes",
        "changeStatusTo": "accepted"
      },
      "backward": {
        "label": "Superseded by",
        "changeStatusTo": "superseded"
      }
    }
  ]
}
```

## Iteration 3 ( Add new features to work with ADRs )

### Add ability to create relations between ADRs

When creating a new ADR, it should be possible to establish links to one or more existing ADRs. This mechanism is crucial for tracking the evolution of architectural decisions.

The core of this feature is the automatic creation of reciprocal links:

- A **Forward Link** is added to the new ADR, pointing to the **Target ADR**.
- A **Backward Link** is added to the **Target ADR**, pointing back to the new ADR.

This ensures that the relationship is visible from both documents, maintaining a clear and consistent history. The linking mechanism should be flexible enough to support various types of relationships by allowing the definition of custom link texts.

Example Use Case: Superseding an ADR

A primary use case for linking is superseding an older ADR with a new one.

> [!INFO]
> In ADR context, superseding means that an older architectural decision record has been replaced by a newer one.

When a new ADR supersedes a **Target ADR**:

- The **Target ADR's** status must be updated to "Superseded".
- A **Backward Link** must be added to the **Target ADR** (e.g., "Superseded by [New ADR]").
- A **Forward Link** must be added to the new ADR to indicate which record it replaces (e.g., "Supersedes [Old ADR]").
- The original ADR remains in the record for historical reference but is no longer considered an active decision.
- The new, superseding ADR receives a new number and should explain why the change was necessary.

To link ADRs

```bash
adr link <source-adr> <target-adr>
# shows dropdown of links to select

# or
adr link <source-adr> <target-adr> <link-alias>
# will apply link from the list by alias

# or
adr link <source-adr> <target-adr> -forward-label 'Supersedes' -backward-label 'Superseded by' -forward-status 'accepted' -backward-status 'superseded'

# Flags
# -forward-label - optional and defaults to 'Linked with'
# -backward-label - optional and defaults to 'Linked with'
# -forward-status and -backward-status - are optional and shows how we should change status of corresponding ADRs, may be left empty. If empty, no statuses will be changed.
```

### Linking on Creation

To streamline the process of creating ADRs that relate to existing ones, the `create` command can be extended with linking capabilities.

```bash
adr create 'New decision that replaces old one' --linked <target-adr>:<link-alias>
```

For example, to supersede ADR #1:

```bash
adr create 'New decision' --linked 1:supersedes
```

This command will:

1. Create a new ADR.
2. Find the link definition with the alias 'supersedes'.
3. Create a forward link in the new ADR to ADR #1.
4. Create a backward link in ADR #1 to the new ADR.
5. Update statuses for both ADRs if defined in the link type.

## Iteration 4 ( Gaining feedback, instead of building rusting spacecraft )
