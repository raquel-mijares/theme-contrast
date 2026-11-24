# theme-contrast

Check WCAG contrast for every theme in a [DTCG 2025.10](https://www.designtokens.org/tr/2025.10/) design-token file: brand × light/dark × high contrast.

Work in progress. Today it can read srgb colors from a token file, follow aliases, and check a text/background pair against WCAG AA and AAA.

## Roadmap

- [x] Read DTCG colors and compute WCAG contrast for one pair
- [x] Pass/fail against WCAG AA and AAA, normal and large text
- [ ] Expand theme modes with the DTCG resolver
- [ ] Contrast matrix output
- [ ] CI exit code
- [ ] Pull-request comment

## Development

```sh
npm install
npm test
```

## License

MIT
