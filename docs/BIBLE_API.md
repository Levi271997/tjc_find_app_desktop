# NIV and NASB setup (API.Bible)

The KJV is public domain and ships with the site as JSON in `src/data/bible/kjv/`.
The NIV (Biblica) and NASB (The Lockman Foundation) are copyrighted, so they are
fetched at request time from [API.Bible](https://api.bible) and cached for a day
per chapter.

Until a version's ID is set, its pages (`/bible/niv/...`, `/bible/nasb/...`)
show a notice that links to the KJV chapter instead.

## Steps

1. Create an account at https://api.bible and create an app to get an API key.
2. Request access to the NIV and NASB for that key. The copyright holders must
   approve them, and the free Starter plan includes a limited number of
   copyrighted Bibles.
3. Find the `bibleId` of each version your key can use. For NASB, choose either
   the 1995 or the 2020 edition.

   ```sh
   curl -H "api-key: YOUR_KEY" https://rest.api.bible/v1/bibles | grep -i -B2 -A2 '"NIV"\|"NASB'
   ```

4. Add the values to `.env.local` and to your hosting provider's environment:

   ```sh
   API_BIBLE_KEY=your-key
   API_BIBLE_NIV_ID=the-niv-bible-id
   API_BIBLE_NASB_ID=the-nasb-bible-id
   ```

## License obligations

- **Copyright notice.** Each chapter page shows the notice API.Bible returns.
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
