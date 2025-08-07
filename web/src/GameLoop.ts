import { Screen } from './Screen.js';
import { Level } from './Level.js';
import { Input } from './Input.js';
import { DebugInfo } from './DebugInfo.js';

export class GameLoop {
  constructor(private screen: Screen) {}

  play(level: Level, onStop?: () => void) {
    const STEP = 1 / 120;
    let last = performance.now();
    let accum = 0;
    let paused = false;
    let frames = 0;
    let second = 0;
    const step = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;

        if (Input.isKeyDown('Escape') || Input.isKeyDown('Enter')) {
          Input.overrideKey('Escape');
          Input.overrideKey('Enter');
          paused = !paused;
          this.screen.setPaused(paused);
        }
        if (Input.isKeyDown('Backquote')) {
          Input.manualKeyRelease('Backquote');
          DebugInfo.debug = !DebugInfo.debug;
          level.switchDebugMode();
        }

        accum += delta;
        while (accum >= STEP) {
          if (!paused) level.update(STEP);
          accum -= STEP;
        }
      this.screen.repaint();

      frames++;
      second += delta;
      if (second >= 1) {
        DebugInfo.fps = frames;
        frames = 0;
        second = 0;
      }

      if (level.isRunning()) {
        requestAnimationFrame(step);
      } else if (onStop) {
        onStop();
      }
    };
    requestAnimationFrame(step);
  }
}
