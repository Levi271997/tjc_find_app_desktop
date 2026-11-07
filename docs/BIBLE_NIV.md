# NIV setup (API.Bible)

The KJV is public domain and ships with the site as JSON in `src/data/bible/kjv/`.
The NIV is copyrighted by Biblica, so it is fetched at request time from
[API.Bible](https://api.bible) and cached for a day per chapter.

Until the two variables below are set, `/bible/niv/...` pages show a notice that
links to the KJV chapter instead.

## Steps

1. Create an account at https://api.bible and create an app to get an API key.
2. Request access to the NIV for that key. Biblica must approve it, and the
   free Starter plan includes a limited number of copyrighted Bibles.
3. Find the NIV `bibleId` your key can use:

   ```sh
   curl -H "api-key: YOUR_KEY" https://rest.api.bible/v1/bibles | grep -i -B2 -A2 '"NIV"'
   ```

4. Add both values to `.env.local` and to your hosting provider's environment:

   ```sh
   API_BIBLE_KEY=your-key
   API_BIBLE_NIV_ID=the-niv-bible-id
   ```

## License obligations

- **Copyright notice.** Each NIV chapter page shows the notice API.Bible returns.
  Don't remove it.
- **Fair use tracking (FUMS).** API.Bible requires web apps to report each view of
  licensed text. `src/components/bible/fums-tracker.tsx` does this with the token
  from each response. After connecting a key, check one live response for
  `meta.fumsToken`, because the API.Bible docs disagree on the field name. The
  code falls back to `meta.fumsId`.
- **Caching.** Chapters are cached for a day (`cacheLife("days")` in
  `src/lib/bible/api-bible.ts`). Check the API.Bible terms at
  https://api.bible/terms-and-conditions and shorten this if your agreement
  requires it.
- **Keep the API key on the server.** It is read only in server code. Never
  expose it with a `NEXT_PUBLIC_` prefix.
