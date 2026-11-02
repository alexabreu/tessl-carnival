---
name: add-carnival-game
description: Add a new game to the Tessl Carnival midway, following the water cannon pattern, the house rules and the sideshow look. Use when asked to build, add or create a carnival game or booth, such as ring toss, whack-a-mole or hook a duck.
---

# Add a carnival game

Every game is a booth in its own folder, built the same way as the water cannon.
Read `src/games/water-cannon/game.ts` first: it is the pattern to copy for the
code.

Every game is also an act in a sideshow. Read `skills/sideshow-look/SKILL.md`
before you draw anything: it sets the colours, pixels, light, characters and
tone. [Make it an act](#make-it-an-act) below says how a game's screen uses it.

## Steps

1. **Pick the id.** Kebab-case, short and plain, such as `ring-toss`. The folder,
   the `id` and the URL (`#/play/ring-toss`) all use it.
2. **Create the folder** `src/games/<game-id>/` with three files:
   - `game.ts`
   - `game.test.ts`
   - `README.md`
3. **Write the logic as plain functions** in `game.ts`: a `createState()` and
   functions like `step(state, dt)` and the player's actions. Export them, and
   keep them free of the canvas and the DOM so Vitest can run them.
4. **Export the game** from `game.ts`, as a named export and as the default
   export. The default export is how the midway finds it:

   ```ts
   export const ringToss: CarnivalGame = {
     id: 'ring-toss',
     name: 'Ring Toss',
     description: 'One sentence for the midway.',
     start(canvas) {
       // size the canvas from theme.canvas, add listeners, start the loop
       return () => {
         // cancel the animation frame and remove the listeners
       };
     },
   };

   export default ringToss;
   ```

5. **Report the score once per round** with `recordScore(ringToss.id, score)`
   from `src/carnival`, when the round ends. Never use local storage directly.
6. **Draw with the theme, in the sideshow look.** Every colour is
   `theme.colors.*` and every font is `canvasFont(...)`. If the game needs a
   colour the theme lacks, use the closest theme colour and say so in the pull
   request. Adding a colour to `src/carnival/theme.ts` is its own change, never
   part of a game's. Stage the screen as described in
   [Make it an act](#make-it-an-act).
7. **Don't touch `src/games/index.ts`.** It finds every folder whose `game.ts`
   has a default export, so the new game registers itself.
8. **Test the logic** in `game.test.ts`: the starting state, scoring, how a round
   ends, and any edge the README promises.
9. **Write the README:** how to play, how scoring works and the files in the folder.
   Open it with the act's banner line, such as
   `THE GREAT ZAMBINI, DUNKED NIGHTLY! THREE BALLS, ONE DIME!`.
10. **Run `npm run format`, then `npm run check`,** and fix anything it
    reports. If you can open a browser, also run `npm run dev`, walk to the new
    booth and play a round.

## Make it an act

A game is a sideshow act, played on a small stage after dark, not a bright
arcade screen. Follow `skills/sideshow-look/SKILL.md`, and build the screen
like this:

- **A performer or a curiosity.** Give the act a name and a billing, like
  Madame Ondine's Mermaid Ring Toss or The Great Zambini. The thing you aim at
  can have a face, and its eyes can follow the ball.
- **The stage:** a dark proscenium with an oxblood curtain at the sides, a
  painted backdrop, and a row of footlights along the front. Darken the edges
  with a vignette, so the light falls on the action.
- **The banner:** the game's name painted across the top, in capitals, in
  mustard on oxblood or ink, as if on canvas.
- **Pixel art:** draw the stage and everything on it at half resolution into an
  offscreen canvas made in `start`, then scale it up by two with smoothing off.
  Draw the score and other text on the full canvas afterwards, so it stays
  sharp.
- **Feedback with a wink:** a hit gets a small, odd reaction (a blink, a slow
  bow, a puff of sawdust, a bulb that flickers), not confetti. A miss gets a
  pause, not a buzzer.
- **The end of a round** reads like the barker talking: `STEP RIGHT UP AGAIN!`
  or `THE CROWD IS ASTONISHED: 3 DUNKS!`.
- **The tone stays kind:** check the act against the tone dial in the sideshow
  look. Odd and funny, a little creepy, never mean or grotesque.

Keep this drawing inside `start` and small drawing functions it calls. The
state the drawing reads (what's lit, whose eyes are where, how far an animation
has got) still comes from plain exported functions you can test.

## Done when

- The game shows on the midway and is playable at `#/play/<game-id>`.
- Its best score shows on the midway after a round.
- It looks like a sideshow act at night and passes the sideshow look's
  **Check before you finish**.
- `npm run check` passes, including the registry test that every game folder
  is registered.
