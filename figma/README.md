# Code Connect

One snippet per roster member, for Code Connect's own UI in Dev Mode: select the printed
set, choose "Connect to code", point it at the file named at the top of the snippet, and
paste the snippet as the example. No command runs and no package is installed; the CLI is
not used, because its current major dropped the framework parsers these examples would
need, and a CLI run is a package run on the machine with the file.

Family is not a variant property on the printed sets: an instance picks it through the
`color family` collection's mode, which Code Connect cannot read, so the snippets show
`brand` and the set's description says the mode is the first half of the `theme` prop.
