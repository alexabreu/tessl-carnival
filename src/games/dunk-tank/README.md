# Dunk Tank

Time your throws to hit the moving target and dunk the dunkee.

## How to play

- Move the mouse or pointer to aim.
- Click or tap to throw one baseball.
- You get 3 baseballs per round.
- A hit drops the plank, splashes the dunkee into the tank, and pauses throwing until the dunkee climbs back up.
- Click again on the game over screen to play another round.

## Scoring

- Each target hit scores 1 point.
- A miss scores 0 points.
- The best possible score is 3.
- Your final score is saved to the carnival's score board when the third baseball has resolved.

## Files

- `game.ts`: the game logic (`createState`, `throwBall`, `step`, `isHit`) and the `dunkTank` entry, the default export the midway finds.
- `game.test.ts`: tests for target movement, hits and misses, the 3-ball limit, scoring, round end, and the dunk animation.
