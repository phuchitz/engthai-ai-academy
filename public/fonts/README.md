# EngThai typography

- **Headings and UI:** LINE Seed Thai (the official LINE Seed Sans TH web fonts, version 1.003), © LY Corporation. Regular 400, Bold 700, Extra Bold 800, and Heavy 900. Source: https://seed.line.me/index_th.html and https://seed.line.me/src/images/fonts/LINE_Seed_Sans_TH.zip
- **Body and learning content:** Noto Sans Thai variable, weights 100–900. Copyright 2022 The Noto Project Authors (https://github.com/notofonts/thai). Source: https://github.com/google/fonts/tree/main/ofl/notosansthai

Both families are bundled unmodified and served locally. Their SIL Open Font License 1.1 texts accompany the fonts in `LINESeedThai-OFL.txt` and `NotoSansThai-OFL.txt`. LINE's license text is from https://github.com/line/seed/blob/main/OFL.txt.

`src/app/fonts.css` declares the faces; `src/app/globals.css` assigns heading/UI and body roles. Question prompts, answer choices, vocabulary words, and lesson paragraphs use the body family even when presented in a heading or interactive choice. Browser fallbacks remain available for characters absent from either font.
