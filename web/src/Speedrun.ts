import { DebugInfo } from './DebugInfo.js';

function pad2(n: number): string {
  return n < 10 ? '0' + n : '' + n;
}

function formatTime(t: number): string {
  const tenths = Math.floor(t * 10);
  const minutes = Math.floor(tenths / 600);
  const seconds = Math.floor((tenths / 10) % 60);
  const tenth = tenths % 10;
  return `${pad2(minutes)}:${pad2(seconds)}.${tenth}`;
}

export class Speedrun {
  private static levelTimes = [0, 0, 0, 0, 0];
  private static levelActive = [false, false, false, false, false];
  private static levelInvalid = [false, false, false, false, false];
  private static totalTime = 0;
  private static totalActive = false;
  private static totalInvalid = false;
  private static current = -1;
  private static elements: HTMLElement[] = [];
  private static totalEl: HTMLElement;

  static init() {
    this.elements = [
      document.getElementById('sr-l1')!,
      document.getElementById('sr-l2')!,
      document.getElementById('sr-l3')!,
      document.getElementById('sr-l4')!,
      document.getElementById('sr-boss')!
    ];
    this.totalEl = document.getElementById('sr-total')!;
    this.repaint();
  }

  static reset() {
    this.levelTimes = [0, 0, 0, 0, 0];
    this.levelActive = [false, false, false, false, false];
    this.levelInvalid = [false, false, false, false, false];
    this.totalTime = 0;
    this.totalActive = false;
    this.totalInvalid = false;
    this.current = -1;
    this.repaint();
  }

  static startLevel(index: number) {
    this.current = index;
    this.levelTimes[index] = 0;
    this.levelActive[index] = true;
    this.levelInvalid[index] = false;
    if (!this.totalInvalid) this.totalActive = true;
    if (DebugInfo.debug) this.invalidateCurrent();
    this.repaint();
  }

  static finishLevel() {
    if (this.current >= 0) this.levelActive[this.current] = false;
    this.current = -1;
    this.repaint();
  }

  static finishGame() {
    this.totalActive = false;
    this.repaint();
  }

  static update(delta: number) {
    if (this.totalActive && !this.totalInvalid) {
      this.totalTime += delta;
    }
    if (
      this.current >= 0 &&
      this.levelActive[this.current] &&
      !this.levelInvalid[this.current]
    ) {
      this.levelTimes[this.current] += delta;
    }
    this.repaint();
  }

  static debugUsed() {
    this.invalidateCurrent();
  }

  private static invalidateCurrent() {
    if (this.current >= 0) {
      this.levelInvalid[this.current] = true;
      this.levelActive[this.current] = false;
    }
    this.totalInvalid = true;
    this.totalActive = false;
    this.repaint();
  }

  private static repaint() {
    for (let i = 0; i < this.elements.length; ++i) {
      this.elements[i].textContent = this.levelInvalid[i]
        ? '--:--'
        : this.levelTimes[i] === 0 && !this.levelActive[i]
        ? ''
        : formatTime(this.levelTimes[i]);
    }
    this.totalEl.textContent = this.totalInvalid
      ? '--:--'
      : this.totalTime === 0 && !this.totalActive
      ? ''
      : formatTime(this.totalTime);
  }
}
