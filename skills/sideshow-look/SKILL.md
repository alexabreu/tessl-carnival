---
name: sideshow-look
description: The carnival's look, an old Coney Island sideshow after dark that is odd, warm and a little creepy, and how to apply it to the theme, the midway map and every game. Use before any visual change: a new game or booth, new midway scenery or characters, colours, fonts, the theme or palette, or when asked to make the carnival look more like a sideshow or freak show, or less cute.
---

# The sideshow look

The carnival is a Coney Island sideshow at dusk, around 1910 to 1930: painted
banners, sawdust, string lights and a barker who's a bit too pleased to see you.
It's **odd and warm, with a little creep**. It isn't a cosy village game.

If a change makes the carnival look more like Animal Crossing (bright
primaries, lime grass, round bouncy people, clean new paint), it's going the
wrong way.

## The tone dial

The performers are the stars, and they're in on the joke. What's strange about
an act is a talent, a costume or a claim on a banner, never someone's body.

**A little creepy, yes:**

- Eyes that follow the player: a painted banner face, a barker turning his
  head, a fortune-teller automaton.
- Things that move only now and then: a curtain twitches, a mannequin blinks
  every ten seconds, one bulb in a row flickers.
- Low fog drifting over the sawdust, deep shadows past the lamps.
- Silly "specimens" in jars, such as a pickled sock labelled FEEJEE MERMAID'S
  COUSIN, and a ventriloquist's dummy that's clearly the one in charge.
- Smiles painted a little too wide, on banners and signs, not on people.

**Never:**

- Blood, injuries, gore, skulls, bodies, disease or medical horror.
- A real disability, body shape or ethnicity as the gag.
- Jump scares, screaming, crying or frightened faces. The crowd is delighted.
- Mean jokes about a performer. Banners boast about them, they don't mock them.

## Colour

Night, lamplight and old paint. Colours are aged and a little dirty, with one
warm glow as the only bright note. No pure white, no saturated primaries.

The target palette:

| Role                         | Colour    | Notes                                   |
| ---------------------------- | --------- | --------------------------------------- |
| Ink (outlines, deepest dark) | `#1a1418` | Soot, not black                         |
| Night (background, sky top)  | `#231a2b` |                                         |
| Dusk (surfaces, sky low)     | `#3b2540` | Plum                                    |
| Bruise                       | `#5a3a5e` | Shadows on cloth and canvas             |
| Oxblood                      | `#8c2f2f` | Dark stripes, curtains                  |
| Faded red                    | `#b5483d` | Main tent stripe                        |
| Mustard                      | `#d4a73a` | Accent, gold leaf on signs              |
| Brass                        | `#a8823a` | Metal, rails, instruments               |
| Tobacco cream                | `#e8d9b5` | Text, light stripes, banner ground      |
| Bone                         | `#cfc0a0` | Muted text, aged paper                  |
| Bottle green                 | `#2f4a3c` | Scrubby grass, painted wood trim        |
| Verdigris                    | `#4f8a80` | Water, tanks, old copper                |
| Sawdust                      | `#b89463` | Paths                                   |
| Mud                          | `#6b4f3a` | Trampled ground, path edges             |
| Boardwalk                    | `#7a5a40` | Planks, wood                            |
| Lamp glow                    | `#ffd27a` | The only bright colour: bulbs, lanterns |
| Limelight                    | `#b8c96a` | Sparingly: a stage light, a jar's glow  |

These values belong in `src/carnival/theme.ts` (for everything) and
`src/midway/palette.ts` (map-only shades). A game or drawing function never
holds a hex colour itself: see the house rules in `AGENTS.md`.

Shade with darker, cooler versions of a colour (towards bruise or ink), and
light with warmer ones (towards lamp glow). Flat shading in two or three tones,
no soft gradients on objects. The sky is the one gradient: night at the top to
dusk at the horizon, with a big pale moon and a few stars.

## Pixels and line

The carnival is fine pixel art: crisp, small pixels with lots of detail, not
chunky retro blocks and not smooth vector shapes.

- **One art pixel is two screen pixels.** Draw at half resolution into an
  offscreen canvas, then scale it up by two with `imageSmoothingEnabled = false`.
  This is also cheaper to draw, which keeps the midway fast on slow laptops.
- **Snap to whole pixels.** Round every position before drawing, so edges stay
  crisp and nothing shimmers as it moves.
- **Outline in ink, one art pixel wide,** around characters, props and banners.
  Inside the outline, shade in two or three flat tones.
- **Dither** (a checkerboard of two colours) for fog, shadows on canvas and old
  paint, instead of transparency.
- **Text stays sharp.** Draw text on the full-resolution canvas after scaling up
  the art, so it stays readable. Signs painted into the scene can be pixel text.

## Light

It's after dark, so light does most of the work.

- The scene is dark at the edges and warm in pools under lamps, string lights
  and stage lights. Add a vignette that darkens the edges of the view.
- String lights are rows of lamp-glow dots with a soft halo. In every row, one
  bulb is missing or flickers on its own slow rhythm.
- Light comes from the lamps, so faces and fronts lit by them are warm and the
  far sides are cool and dark.
- A stage has footlights: a row of glows along its front edge, lighting the
  performer from below.

## Characters

Taller, older and more detailed than the old round, bouncy people.

- **About 32 art pixels tall,** with a head about a sixth of their height.
  Vary the build: very tall and thin, short and round, stooped, broad.
- **Period clothes, around 1900 to 1930:** bowler hats, boaters, flat caps,
  waistcoats, braces, long skirts, striped bathing suits, a barker's cane and
  megaphone.
- **Faces are small and a little uncanny:** dark dot eyes with a single glint,
  a thin mouth, cheeks blushed with a pixel of faded red. They blink slowly and
  rarely.
- **Visitors** stroll and shuffle, never bounce. Some stop to stare at a banner.
  A few carry something: a candy apple, a balloon on a string, opera glasses.
- **Performers** each have one proud, exaggerated trait and a small idle loop
  that's charmingly off. The three-headed man's heads don't quite keep time,
  and the strongman's moustache twitches when he lifts.
- **The player** is marked by a lantern glow around their feet, not a bouncing
  arrow.

## Banners and signs

The banner line is the heart of a sideshow.

- Tall painted canvas banners on poles, slightly crooked, sagging between ties,
  with visible seams and a patch or two.
- Painted in bold outlines and flat colour, with big claims: ALIVE!, SEE IT TO
  BELIEVE IT!, THE WORLD'S ONLY. The picture always promises more than the act.
- Signs have mustard gold leaf on oxblood or ink boards, with drop-shadowed
  lettering. Some lettering is painted over or corrected.

## Age and wear

Nothing is new. Add a few details per object, not everywhere:

- Chipped paint and rust spots, patched canvas, water stains on banners.
- Crooked signs, a loose plank, a missing light bulb.
- Sawdust paths with mud at the edges, scrubby dark grass instead of a lawn.

## Type

Fonts are display faces from the period, using system fonts only: no web
fonts and no new dependencies.

- **Titles and signs:** a slab or wood type stack, such as
  `"Rockwell", "Clarendon", "American Typewriter", Georgia, serif`, in capitals, with
  letter spacing.
- **Body text:** a plain serif such as `Georgia, "Times New Roman", serif`.

Fonts live in `theme.font` and reach a canvas through `canvasFont`.

## Motion

Slow and slightly off-rhythm, like old machinery.

- Sway, creak and drift rather than hop and bounce. Loops of a few seconds,
  each one out of step with the others.
- Small surprises on long, irregular timers: a blink, a twitch, a flicker.
- Keep animation cheap: a few changing pixels, not redrawing the whole scene.

## Applying the look

Each area changes in its own pull request, following the house rules:

1. **The theme** (`src/carnival/theme.ts`): the palette's colours and the
   fonts. This is a change to `src/carnival/`, so it's its own pull request.
   Every game and the midway's text follow it.
2. **The midway** (`src/midway/`): the night sky, ground, lighting, pixel
   scaling, characters and scenery. Map-only shades go in `palette.ts`.
3. **Each game** (`src/games/<game-id>/`): restyled one game per pull request.
   See `skills/add-carnival-game/SKILL.md` for how a game's screen should look.

Until the theme has a colour you need, use the closest one the theme already
has, and say so in the pull request.

## Check before you finish

- [ ] At a glance, it reads as a sideshow at night, not a sunny village.
- [ ] It's odd and funny, with a little creep, and nothing on the Never list.
- [ ] Every colour comes from the theme or the palette, with no pure white and
      no saturated primaries.
- [ ] Characters and props have ink outlines and flat shading, and edges are
      crisp, not blurred.
- [ ] Text is readable.
- [ ] Animation is slow and out of step, and the midway is still smooth.
