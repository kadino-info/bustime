# bustime

## Improvement proposals

- [ ] Describe how to run, edit the schedule and deploy (this README is only a title).
- [ ] Generate `shedule-2026*.js` from `data/schedule-2026.csv` instead of editing by hand; add a validator (sorted times, known stops).
- [ ] Keep one source of truth for `style.css` and fonts; remove duplicates in `assets/` and `public/assets/`.
- [ ] Upgrade Vite 4 to a current version.
- [ ] Restrict the OpenWeatherMap key by domain or proxy the call (`VITE_APP_OWM_API_KEY` is bundled into public JS).
- [ ] Add a "next departure" view and an offline cache (PWA).
- [ ] Replace the WordPress `.gitignore` with a relevant one; add `.env.example`.
- [ ] Add a CI build workflow (GitHub Pages).
