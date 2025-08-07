export class Input {
  private static keysDown = new Set<string>();
  private static keysOvrd = new Set<string>();
  private static mouseButtons = [false, false, false];
  private static mouseX = 0;
  private static mouseY = 0;

  static init(canvas: HTMLCanvasElement) {
    window.addEventListener('keydown', (e) => {
      if (!Input.keysDown.has(e.code)) Input.keysDown.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      Input.keysDown.delete(e.code);
      Input.keysOvrd.delete(e.code);
    });
    canvas.addEventListener('mousedown', (e) => {
      Input.mouseButtons[e.button] = true;
    });
    window.addEventListener('mouseup', (e) => {
      Input.mouseButtons[e.button] = false;
    });
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      Input.mouseX = e.clientX - rect.left;
      Input.mouseY = e.clientY - rect.top;
    });
  }

  static isKeyDown(key: string): boolean {
    return !Input.keysOvrd.has(key) && Input.keysDown.has(key);
  }

  static overrideKey(key: string) {
    Input.keysOvrd.add(key);
  }

  static manualKeyRelease(key: string) {
    Input.keysDown.delete(key);
    Input.keysOvrd.delete(key);
  }

  static isMouseDown(button: number): boolean {
    return Input.mouseButtons[button - 1] || false;
  }

  static getMouseX(): number {
    return Input.mouseX;
  }

  static getMouseY(): number {
    return Input.mouseY;
  }
}
