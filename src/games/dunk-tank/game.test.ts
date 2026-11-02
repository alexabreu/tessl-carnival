import { describe, expect, it } from 'vitest';
import {
  BALLS_PER_ROUND,
  BALL_RADIUS,
  TARGET_MAX_X,
  TARGET_MIN_X,
  TARGET_RADIUS,
  createState,
  isDunking,
  isHit,
  step,
  throwBall,
  type Ball,
  type Target,
} from './game';

const target: Target = {
  x: 500,
  y: 190,
  radius: TARGET_RADIUS,
  speed: 170,
  minX: TARGET_MIN_X,
  maxX: TARGET_MAX_X,
};

function resolveMisses(state = createState()) {
  for (let i = 0; i < BALLS_PER_ROUND; i++) {
    expect(throwBall(state, state.target.x, 0)).toBe(true);
    state.ball = { x: -BALL_RADIUS - 1, y: 100, vx: -1, vy: 0 };
    step(state, 0);
  }
  return state;
}

describe('dunk tank', () => {
  it('starts with three baseballs and no score', () => {
    const state = createState();
    expect(state.ballsLeft).toBe(BALLS_PER_ROUND);
    expect(state.score).toBe(0);
    expect(state.phase).toBe('playing');
    expect(state.dunkPhase).toBe('idle');
  });

  it('moves the target over time', () => {
    const state = createState();
    const startX = state.target.x;
    step(state, 0.25);
    expect(state.target.x).toBeGreaterThan(startX);
  });

  it('bounces the target at the edge of its range', () => {
    const state = createState();
    state.target.x = state.target.maxX - 2;
    state.target.speed = 170;
    step(state, 0.1);
    expect(state.target.x).toBeLessThanOrEqual(TARGET_MAX_X);
    expect(state.target.speed).toBeLessThan(0);
  });

  it('keeps the idle target inside its movement range after a large step', () => {
    const state = createState();
    state.target.x = 540;
    state.target.speed = -170;

    step(state, 2);

    expect(state.target.x).toBeGreaterThanOrEqual(TARGET_MIN_X);
    expect(state.target.x).toBeLessThanOrEqual(TARGET_MAX_X);
    expect(state.target.x).toBeCloseTo(600);
  });

  it('throws one baseball at a time and consumes one baseball', () => {
    const state = createState();
    expect(throwBall(state, 500, 100)).toBe(true);
    expect(state.ballsLeft).toBe(BALLS_PER_ROUND - 1);
    expect(state.ball).not.toBeNull();
    expect(throwBall(state, 500, 100)).toBe(false);
    expect(state.ballsLeft).toBe(BALLS_PER_ROUND - 1);
  });

  it('detects hits and misses against the moving target', () => {
    const hit: Ball = { x: target.x + target.radius, y: target.y, vx: 0, vy: 0 };
    const miss: Ball = { x: target.x + target.radius + BALL_RADIUS + 1, y: target.y, vx: 0, vy: 0 };
    expect(isHit(hit, target)).toBe(true);
    expect(isHit(miss, target)).toBe(false);
  });

  it('scores a hit and starts the dunk animation', () => {
    const state = createState();
    state.ball = { x: state.target.x, y: state.target.y, vx: 0, vy: 0 };
    state.ballsLeft = BALLS_PER_ROUND - 1;
    step(state, 0);
    expect(state.score).toBe(1);
    expect(state.ball).toBeNull();
    expect(state.dunkPhase).toBe('dropping');
    expect(isDunking(state)).toBe(true);
  });

  it('scores a swept hit when the ball crosses the target between frames', () => {
    const state = createState();
    state.target.x = 500;
    state.target.speed = -170;
    state.ball = { x: 450, y: state.target.y, vx: 2000, vy: 0 };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 0.05);

    expect(state.score).toBe(1);
    expect(state.ball).toBeNull();
    expect(state.dunkPhase).toBe('dropping');
  });

  it('scores a swept hit when the target bounces during the frame', () => {
    const state = createState();
    state.target.x = 534.25;
    state.target.speed = -170;
    state.ball = { x: 494.06, y: 205.93, vx: 237.72, vy: -637.09 };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 0.05);

    expect(state.score).toBe(1);
    expect(state.ball).toBeNull();
    expect(state.dunkPhase).toBe('dropping');
  });

  it('scores a hit that only exists at the target reversal', () => {
    const state = createState();
    state.target.x = TARGET_MIN_X + 170 / 480;
    state.target.speed = -170;
    state.ball = { x: 495.045, y: 182.5, vx: 2378.4, vy: 0 };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 1 / 240);

    expect(state.score).toBe(1);
    expect(state.ball).toBeNull();
    expect(state.dunkPhase).toBe('dropping');
  });

  it('turns inward at the right edge during an active throw', () => {
    const state = createState();
    state.target.x = TARGET_MAX_X;
    state.target.speed = 170;
    state.ball = { x: 400, y: 300, vx: 0, vy: -BALL_RADIUS };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 0.05);

    expect(state.target.x).toBeLessThan(TARGET_MAX_X);
    expect(state.target.speed).toBeLessThan(0);
    expect(state.ball).not.toBeNull();
  });

  it('turns inward near the left edge during an active throw', () => {
    const state = createState();
    state.target.x = TARGET_MIN_X + 8.5e-8;
    state.target.speed = -170;
    state.ball = { x: 400, y: 300, vx: 0, vy: -BALL_RADIUS };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 0.05);

    expect(state.target.x).toBeGreaterThan(TARGET_MIN_X);
    expect(state.target.speed).toBeGreaterThan(0);
    expect(state.ball).not.toBeNull();
  });

  it('scores nothing for a miss', () => {
    const state = createState();
    expect(throwBall(state, state.target.x, 0)).toBe(true);
    state.ball = { x: -BALL_RADIUS - 1, y: 100, vx: -1, vy: 0 };
    step(state, 0);
    expect(state.score).toBe(0);
    expect(state.ball).toBeNull();
    expect(state.phase).toBe('playing');
  });

  it('pauses throwing during the dunk and allows it after the reset', () => {
    const state = createState();
    state.ball = { x: state.target.x, y: state.target.y, vx: 0, vy: 0 };
    state.ballsLeft = BALLS_PER_ROUND - 1;
    step(state, 0);

    expect(throwBall(state, state.target.x, 0)).toBe(false);
    expect(state.dunkPhase).toBe('dropping');

    step(state, 0.36);
    expect(state.dunkPhase).toBe('splash');
    step(state, 0.31);
    expect(state.dunkPhase).toBe('resetting');
    step(state, 0.66);
    expect(state.dunkPhase).toBe('idle');
    expect(isDunking(state)).toBe(false);
    expect(throwBall(state, state.target.x, 0)).toBe(true);
  });

  it('does not advance a swept-hit dunk by time spent reaching the target', () => {
    const state = createState();
    state.target.x = 500;
    state.target.speed = -170;
    state.ball = { x: 450, y: state.target.y, vx: 2000, vy: 0 };
    state.ballsLeft = BALLS_PER_ROUND - 1;

    step(state, 0.35);

    expect(state.score).toBe(1);
    expect(state.dunkPhase).toBe('dropping');
  });

  it('ends the round after exactly the third resolved baseball', () => {
    const state = resolveMisses();
    expect(state.ballsLeft).toBe(0);
    expect(state.phase).toBe('over');
    expect(throwBall(state, state.target.x, 0)).toBe(false);
  });

  it('waits for a third-hit dunk to finish before ending the round', () => {
    const state = createState();
    state.ballsLeft = 0;
    state.ball = { x: state.target.x, y: state.target.y, vx: 0, vy: 0 };
    step(state, 0);
    expect(state.score).toBe(1);
    expect(state.phase).toBe('playing');
    expect(isDunking(state)).toBe(true);

    step(state, 2);
    expect(state.phase).toBe('over');
  });
});
