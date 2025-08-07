export class Input {
    static init(canvas) {
        window.addEventListener('keydown', (e) => {
            if (!Input.keysDown.has(e.code))
                Input.keysDown.add(e.code);
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
    static isKeyDown(key) {
        return !Input.keysOvrd.has(key) && Input.keysDown.has(key);
    }
    static overrideKey(key) {
        Input.keysOvrd.add(key);
    }
    static manualKeyRelease(key) {
        Input.keysDown.delete(key);
        Input.keysOvrd.delete(key);
    }
    static isMouseDown(button) {
        return Input.mouseButtons[button - 1] || false;
    }
    static getMouseX() {
        return Input.mouseX;
    }
    static getMouseY() {
        return Input.mouseY;
    }
}
Input.keysDown = new Set();
Input.keysOvrd = new Set();
Input.mouseButtons = [false, false, false];
Input.mouseX = 0;
Input.mouseY = 0;
