# Code Connect

One file per roster member, mapping the printed Figma set to the code that renders it. The
URL in each file is the set's node on the print page; fill it in after the print, then:

```
npx figma connect publish --token <a token for the file's organization>
```

Family is not a variant property: an instance picks it through the `role` collection's
mode, which Code Connect does not read, so the examples show `brand` and the description
on the set says how the mode maps to the `theme` prop.
