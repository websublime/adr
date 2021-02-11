# ADR (Architecture Decision Records）

Create ADR markdown documents to register architecture decisions in your project. Current support languages EN and PT.

## Installation

```bash
yarn global add @websublime/adr

or

npm install -g @websublime/adr
```

## Usage

```bash
adr

Usage: adr [options]

Options:
  -V, --version       output the version number
  -init, init <lang>  Initiate project to support ADR, like: `adr init en`
  -c, create <title>  Create a new ADR markdown. Surround your tilte always with quotes, like adr create `Use a new tool`
  -l, log             Show logging of all files
  -s, status <index>  Set new state to ADR
  -h, --help          output usage information

adr init <language>
adr new <decision>
adr list
adr generate toc
adr update
adr export <type>
adr search <keyword>
```
