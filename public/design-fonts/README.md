# Fonts

This brand uses Google-hosted webfonts. They are imported at the top of
`colors_and_type.css`.

| Family       | Source     | Weights used                |
| ------------ | ---------- | --------------------------- |
| Crimson Text | Google Fonts | 400, 600, 700 + 400 italic |
| Inter        | Google Fonts | 300, 400, 500, 600, 700     |

If the host environment is offline or needs self-hosted fonts, download the
matching weights from Google Fonts and place them here:

```
fonts/
  CrimsonText-Regular.woff2
  CrimsonText-SemiBold.woff2
  CrimsonText-Bold.woff2
  CrimsonText-Italic.woff2
  Inter-Light.woff2
  Inter-Regular.woff2
  Inter-Medium.woff2
  Inter-SemiBold.woff2
  Inter-Bold.woff2
```

> **No font files are committed today** — Google Fonts is the canonical
> delivery method in the source repo (`src/app/globals.css`).
