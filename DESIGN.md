# Design system

This app is for two people. Every screen answers two questions: **how far apart are we**, and **how are we feeling**. The design should feel like a small, warm light you keep in your pocket, not a dashboard.

Token values live in [`design/tokens.json`](design/tokens.json). The web app mirrors them in [`app/globals.css`](app/globals.css). The iOS and Android widgets should read from `tokens.json` too, so all three feel like the same app. **When you change a value, change it in both files.**

## Principles

1. **Distance is the hero.** The distance number is the biggest thing on the main screen. Everything else supports it.
2. **Two people, two lights.** "You" and "partner" each have their own colour (`you`, `partner`). Use them consistently: your avatar, your marker and your side of anything are always the `you` colour.
3. **Moods are colour and shape, not words.** Each mood has its own colour and icon. The label is there for clarity, but you should be able to read a mood at a glance from across the room (or from a widget).
4. **Alive, but calm.** Things move when something real changes, such as a new mood or a new distance. Nothing loops for decoration except the gentle "partner is live" pulse.
5. **Night is a first-class mode.** People check on each other in bed. Dark mode is designed as carefully as light mode, not inverted.

## Colour

Use the semantic names in code (`bg-surface`, `text-ink`, `text-mood-calm` …). Never hard-code a hex value in a component. That's what keeps dark mode working automatically.

| Token | Light | Dark | Use for |
|---|---|---|---|
| `bg` | `#F7F2F6` | `#17121C` | Page background (soft lilac by day, deep plum at night) |
| `surface` | `#FFFFFF` | `#211A27` | Cards and sheets that sit on the background |
| `sunken` | `#EEE6EE` | `#110D15` | Wells, input backgrounds, tracks |
| `line` | `#E2D7E2` | `#33293A` | Borders and dividers |
| `ink` | `#2A1D2C` | `#F4ECF3` | Main text |
| `ink-muted` | `#6E5F70` | `#ADA0B2` | Secondary text, timestamps |
| `accent` | `#C2364F` | `#FF7C8F` | Primary buttons, links, focus ring |
| `on-accent` | `#FFFFFF` | `#17121C` | Text on top of `accent` |
| `you` | `#E14D63` | `#FF7C8F` | Everything that belongs to the signed-in person |
| `partner` | `#B8740F` | `#FFBE5C` | Everything that belongs to the partner |

All text colours pass WCAG AA (4.5:1) on `bg` and `surface`. `you`, `partner` and the mood colours pass 3:1, so they're fine for icons, markers and large text but **not for small body text**. Put small text in `ink` or `ink-muted` next to them instead.

Dark mode follows the device setting (`prefers-color-scheme`). There's no in-app toggle.

### Mood colours

The mood list is fixed by the database (`moods.mood` check constraint). If you add a mood, add it to the migration, `tokens.json`, `globals.css` and the icon set.

| Mood (db value) | Label | Light | Dark |
|---|---|---|---|
| `happy` | Happy | `#B07A0A` | `#FFC94D` |
| `loved` | Loved | `#D9465F` | `#FF8099` |
| `calm` | Calm | `#3F9483` | `#7FD1BD` |
| `excited` | Excited | `#E0632E` | `#FF9A63` |
| `tired` | Tired | `#7F6FB8` | `#B3A6E8` |
| `sad` | Sad | `#4A72B0` | `#8DB0EB` |
| `stressed` | Stressed | `#B8483A` | `#F08471` |
| `missing_you` | Missing you | `#A1508E` | `#E39AD3` |

For a soft tinted background behind a mood icon, mix the mood colour into the surface instead of adding a new token. For example: `bg-mood-calm/15` in Tailwind.

## Mood icons

Moods use a custom icon set, not emoji. Emoji look different on every phone and can't take the mood colour.

- 24×24 grid, drawn as simple faces or symbols inside a circle.
- 2px rounded strokes (`stroke-linecap: round`), coloured with `currentColor` so the mood colour can be applied from outside.
- One shape per mood that still reads at 16px (widget size).
- Stored as one React component per icon in `components/mood-icons.tsx`. The same SVG paths can be exported for the native widgets.

## Type

Two faces:

- **Display: Fredoka** (rounded). Used for the distance number, mood names and screen titles. Its rounded shapes match SF Pro Rounded, which the iOS widget can use natively.
- **Body: Figtree.** Used for everything else.

| Token | Size | Face | Use for |
|---|---|---|---|
| `text-hero` | 88px | display | The distance number on the main screen |
| `text-display` | 48px | display | Big numbers elsewhere, the empty-state headline |
| `text-heading` | 31px | display | Screen titles |
| `text-title` | 25px | display | Card titles, partner's name |
| `text-lead` | 20px | body | Intro sentences, the unit next to the distance |
| `text-body` | 16px | body | Default text |
| `text-small` | 14px | body | Secondary text, buttons |
| `text-caption` | 12px | body | Timestamps ("updated 2 min ago"), labels |

Rules:
- Numbers that update live use `tabular-nums` so digits don't jiggle while they count.
- Only one `text-hero` per screen.
- Labels in all caps get `tracking-wide`. Use sparingly.

## Spacing and size

We use Tailwind's built-in spacing scale (each step is 4px) but only these steps:

| Step | px | Typical use |
|---|---|---|
| `1` | 4 | Icon-to-label gap |
| `2` | 8 | Tight groups |
| `3` | 12 | Inside small controls |
| `4` | 16 | Default gap, card padding on phones, **page side gutter** |
| `6` | 24 | Card padding on larger screens, gap between cards |
| `8` | 32 | Between sections |
| `12` | 48 | Above and below the distance hero |
| `16` | 64 | Rarely: top of a screen |

Sizes:
- **Tap targets** are at least 44×44px (`size-11`).
- **Content width** is capped at 28rem (`max-w-md`). This is a phone-first app, and on a laptop it should look like a phone-sized card in the middle of the screen.
- **Corners**: `rounded-sm` (10px) for small controls, `rounded-md` (16px) for inputs and buttons, `rounded-lg` (28px) for cards, `rounded-full` for avatars, mood chips and pills.
- **Shadows**: none by default. Cards are separated by colour (`surface` on `bg`). Only floating things (a picker sheet) get a shadow.

## Motion

Motion tells you that something real just changed. Durations and curves are tokens. Use them rather than inventing new numbers.

| Token | Value | Use for |
|---|---|---|
| `--duration-quick` | 150ms | Hover and press feedback |
| `--duration-base` | 250ms | Colour changes, small state changes |
| `--duration-settle` | 450ms | Things arriving or leaving |
| `--duration-count` | 900ms | The distance number counting to its new value |
| `--duration-breathe` | 4s | The "partner is live" pulse (one cycle) |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Default for transitions |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Things arriving, numbers counting |
| `ease-pop` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | A small overshoot, only for a new mood |

What moves, and how:

- **Distance changes**: the number counts from the old value to the new one over `--duration-count` with `ease-out`. It never jumps. If the change is tiny (under 10 m), it just updates.
- **Partner's mood changes**: the old icon fades out, and the new one pops in (`animate-pop-in`), with its colour cross-fading over `--duration-base`.
- **Picking your own mood**: the chip you tapped presses down (scale 0.95, `--duration-quick`) and then becomes the selected mood with the same pop-in.
- **Partner is live** (location updated in the last few minutes): a soft ring breathes around their marker (`animate-breathe`). When the location goes stale, the ring stops, which is itself the signal.
- **First load**: cards fade up (`animate-fade-up`), staggered by about 60ms each. Content is never hidden waiting for an animation to start.
- **Reduced motion**: when the device asks for reduced motion, all movement is switched off globally in `globals.css`. Colour changes and the final values still happen instantly.

We use plain CSS animations plus one small count-up function for the distance. There's no animation library to learn.

## Widgets (iOS / Android)

The widgets are tiny views of the same two things: distance and moods.

- Use the same colour tokens, including the dark set.
- Small widget: the distance number (display face) plus both mood icons in their mood colours.
- Medium widget: add names and "updated X min ago" in `ink-muted`.
- Don't animate counting on widgets (the OS doesn't allow it smoothly). Just show the latest value.
- Data: one call, `select widget_summary()` (an RPC as the signed-in user), returns everything a
  widget shows: `me` and `partner` (name, mood, when the mood was set, whether each is `live`),
  `distance_m` (rounded to 10 m) and `distance_as_of`. It never includes coordinates or mood
  notes, because widget data sits on the lock screen and in the OS widget cache. `partner` is
  `null` until the link is mutual; `distance_m` also needs both of you sharing a location.
