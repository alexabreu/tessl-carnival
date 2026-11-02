import { canvasFont, recordScore, theme, type CarnivalGame } from '../../carnival';

const { width: WIDTH, height: HEIGHT } = theme.canvas;

export const BALLS_PER_ROUND = 3;
export const BALL_SPEED = 680;
export const BALL_RADIUS = 7;
export const THROWER = { x: WIDTH / 2, y: HEIGHT - 42 } as const;
export const TARGET_RADIUS = 24;
export const TARGET_Y = 190;
export const TARGET_MIN_X = WIDTH - 270;
export const TARGET_MAX_X = WIDTH - 70;
export const TARGET_SPEED = 170;

const DUNK_DURATIONS = {
  dropping: 0.35,
  splash: 0.3,
  resetting: 0.65,
} as const;

export type DunkPhase = 'idle' | 'dropping' | 'splash' | 'resetting';

export interface Target {
  x: number;
  y: number;
  radius: number;
  speed: number;
  minX: number;
  maxX: number;
}

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface DunkTankState {
  target: Target;
  ball: Ball | null;
  ballsLeft: number;
  score: number;
  phase: 'playing' | 'over';
  dunkPhase: DunkPhase;
  dunkTime: number;
}

export function createState(): DunkTankState {
  return {
    target: {
      x: (TARGET_MIN_X + TARGET_MAX_X) / 2,
      y: TARGET_Y,
      radius: TARGET_RADIUS,
      speed: TARGET_SPEED,
      minX: TARGET_MIN_X,
      maxX: TARGET_MAX_X,
    },
    ball: null,
    ballsLeft: BALLS_PER_ROUND,
    score: 0,
    phase: 'playing',
    dunkPhase: 'idle',
    dunkTime: 0,
  };
}

export function isDunking(state: DunkTankState): boolean {
  return state.dunkPhase !== 'idle';
}

export function canThrow(state: DunkTankState): boolean {
  return (
    state.phase === 'playing' && state.ballsLeft > 0 && state.ball === null && !isDunking(state)
  );
}

export function isHit(ball: Ball, target: Target): boolean {
  return Math.hypot(ball.x - target.x, ball.y - target.y) <= target.radius + BALL_RADIUS;
}

export function throwBall(state: DunkTankState, aimX: number, aimY: number): boolean {
  if (!canThrow(state)) return false;

  const dx = aimX - THROWER.x;
  const dy = Math.min(aimY - THROWER.y, -1);
  const length = Math.hypot(dx, dy);
  state.ball = {
    x: THROWER.x,
    y: THROWER.y,
    vx: (dx / length) * BALL_SPEED,
    vy: (dy / length) * BALL_SPEED,
  };
  state.ballsLeft -= 1;
  return true;
}

function moveTarget(target: Target, dt: number): void {
  target.x += target.speed * dt;

  if (target.x > target.maxX) {
    target.x = target.maxX - (target.x - target.maxX);
    target.speed = -Math.abs(target.speed);
  }
  if (target.x < target.minX) {
    target.x = target.minX + (target.minX - target.x);
    target.speed = Math.abs(target.speed);
  }
}

function startDunk(state: DunkTankState): void {
  state.dunkPhase = 'dropping';
  state.dunkTime = 0;
}

function advanceDunk(state: DunkTankState, dt: number): void {
  state.dunkTime += dt;

  while (state.dunkPhase !== 'idle') {
    const duration = DUNK_DURATIONS[state.dunkPhase];
    if (state.dunkTime < duration) return;

    state.dunkTime -= duration;
    if (state.dunkPhase === 'dropping') {
      state.dunkPhase = 'splash';
    } else if (state.dunkPhase === 'splash') {
      state.dunkPhase = 'resetting';
    } else {
      state.dunkPhase = 'idle';
      state.dunkTime = 0;
    }
  }
}

function ballIsGone(ball: Ball): boolean {
  return ball.y < -BALL_RADIUS || ball.x < -BALL_RADIUS || ball.x > WIDTH + BALL_RADIUS;
}

function finishRoundIfReady(state: DunkTankState): void {
  if (
    state.phase === 'playing' &&
    state.ballsLeft === 0 &&
    state.ball === null &&
    !isDunking(state)
  ) {
    state.phase = 'over';
  }
}

export function step(state: DunkTankState, dt: number): void {
  if (state.phase === 'over') return;

  moveTarget(state.target, dt);

  if (state.ball) {
    state.ball.x += state.ball.vx * dt;
    state.ball.y += state.ball.vy * dt;

    if (isHit(state.ball, state.target)) {
      state.score += 1;
      state.ball = null;
      startDunk(state);
    } else if (ballIsGone(state.ball)) {
      state.ball = null;
    }
  }

  if (isDunking(state)) advanceDunk(state, dt);
  finishRoundIfReady(state);
}

function dunkProgress(state: DunkTankState): number {
  if (state.dunkPhase === 'idle') return 0;
  return Math.min(state.dunkTime / DUNK_DURATIONS[state.dunkPhase], 1);
}

function drawAwning(ctx: CanvasRenderingContext2D) {
  const { colors } = theme;
  const stripe = WIDTH / 16;
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i % 2 === 0 ? colors.stripeA : colors.stripeB;
    ctx.fillRect(i * stripe, 0, stripe, 40);
  }
}

function drawDunkTank(ctx: CanvasRenderingContext2D, state: DunkTankState) {
  const { colors } = theme;
  const tankX = 120;
  const tankY = 235;
  const tankWidth = 300;
  const tankHeight = 145;
  const plankY = 185;
  const progress = dunkProgress(state);
  const seatDrop =
    state.dunkPhase === 'dropping'
      ? progress * 80
      : state.dunkPhase === 'splash'
        ? 80
        : state.dunkPhase === 'resetting'
          ? (1 - progress) * 80
          : 0;

  ctx.fillStyle = colors.wood;
  ctx.fillRect(tankX - 12, plankY - 6 + seatDrop * 0.25, tankWidth + 24, 12);

  ctx.fillStyle = colors.surface;
  ctx.fillRect(tankX, tankY, tankWidth, tankHeight);
  ctx.fillStyle = colors.water;
  ctx.fillRect(tankX + 12, tankY + 35, tankWidth - 24, tankHeight - 47);
  ctx.strokeStyle = colors.text;
  ctx.lineWidth = 3;
  ctx.strokeRect(tankX, tankY, tankWidth, tankHeight);

  if (state.dunkPhase === 'splash') {
    ctx.strokeStyle = colors.water;
    ctx.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(tankX + 110 + i * 20, tankY + 65, 18 + progress * 34, 0, Math.PI);
      ctx.stroke();
    }
  }

  const personX = tankX + 150;
  const personY = plankY - 30 + seatDrop;
  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(personX, personY, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.stripeA;
  ctx.fillRect(personX - 16, personY + 16, 32, 38);
}

function drawTarget(ctx: CanvasRenderingContext2D, target: Target) {
  const { colors } = theme;

  ctx.fillStyle = colors.wood;
  ctx.fillRect(target.x - 5, target.y + target.radius, 10, 150);

  ctx.fillStyle = colors.stripeA;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.stripeB;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.danger;
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function drawThrower(ctx: CanvasRenderingContext2D, aim: { x: number; y: number }) {
  const { colors } = theme;
  const angle = Math.atan2(Math.min(aim.y - THROWER.y, -1), aim.x - THROWER.x);

  ctx.strokeStyle = colors.muted;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(THROWER.x, THROWER.y);
  ctx.lineTo(THROWER.x + Math.cos(angle) * 52, THROWER.y + Math.sin(angle) * 52);
  ctx.stroke();

  ctx.fillStyle = colors.accent;
  ctx.beginPath();
  ctx.arc(THROWER.x, THROWER.y, 18, 0, Math.PI * 2);
  ctx.fill();
}

function draw(ctx: CanvasRenderingContext2D, state: DunkTankState, aim: { x: number; y: number }) {
  const { colors } = theme;

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawAwning(ctx);
  drawDunkTank(ctx, state);
  drawTarget(ctx, state.target);
  drawThrower(ctx, aim);

  if (state.ball) {
    ctx.fillStyle = colors.stripeB;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.danger;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.fillStyle = colors.text;
  ctx.font = canvasFont('body', 'bold');
  ctx.textAlign = 'left';
  ctx.fillText(`Score ${state.score}`, 16, HEIGHT - 20);
  ctx.textAlign = 'right';
  ctx.fillText(`Baseballs ${state.ballsLeft}/${BALLS_PER_ROUND}`, WIDTH - 16, HEIGHT - 20);

  if (isDunking(state)) {
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.accent;
    ctx.font = canvasFont('body', 'bold');
    ctx.fillText('Splash! Wait for the reset...', WIDTH / 2, 72);
  }

  if (state.phase === 'over') {
    ctx.fillStyle = colors.background;
    ctx.globalAlpha = 0.82;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.fillStyle = colors.accent;
    ctx.font = canvasFont('title', 'bold');
    ctx.fillText(`Round over! You scored ${state.score}`, WIDTH / 2, HEIGHT / 2);
    ctx.fillStyle = colors.text;
    ctx.font = canvasFont('body');
    ctx.fillText('Click to play again', WIDTH / 2, HEIGHT / 2 + 40);
  }
}

export const dunkTank: CarnivalGame = {
  id: 'dunk-tank',
  name: 'Dunk Tank',
  description: 'Time three baseball throws to dunk the target and soak the dunkee.',

  start(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D is not available');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    let state = createState();
    let scoreRecorded = false;
    const aim = { x: WIDTH / 2, y: TARGET_Y };

    const toCanvas = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((event.clientX - rect.left) / rect.width) * WIDTH,
        y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
      };
    };
    const onMove = (event: PointerEvent) => Object.assign(aim, toCanvas(event));
    const onDown = (event: PointerEvent) => {
      Object.assign(aim, toCanvas(event));
      if (state.phase === 'over') {
        state = createState();
        scoreRecorded = false;
      } else {
        throwBall(state, aim.x, aim.y);
      }
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerdown', onDown);

    let frame = 0;
    let last = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;
      step(state, dt);
      if (state.phase === 'over' && !scoreRecorded) {
        recordScore(dunkTank.id, state.score);
        scoreRecorded = true;
      }
      draw(ctx, state, aim);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerdown', onDown);
    };
  },
};

export default dunkTank;
