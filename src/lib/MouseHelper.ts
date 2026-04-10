/**
 * Suivi souris adouci (ease) — aligné sur richardmille / Romain Avalle.
 * https://www.romainavalle.dev/
 */
class MouseHelperClass {
  isFirst = true;
  x = 0;
  y = 0;
  easeX = 0;
  easeY = 0;
  easeMouseX = 0;
  easeMouseY = 0;
  easeSlowX = 0;
  easeSlowY = 0;

  private readonly _mouseMoveHandler = (e: MouseEvent) => {
    this.x = e.clientX;
    this.y = e.clientY;
    this.isFirst = false;
  };

  constructor() {
    if (typeof window === "undefined") return;

    let isTouch = false;
    try {
      document.createEvent("TouchEvent");
      isTouch = true;
    } catch {
      isTouch = false;
    }

    if (!isTouch) {
      window.addEventListener("mousemove", this._mouseMoveHandler, {
        passive: true,
      });
    }

    this.x = window.innerWidth * 0.5;
    this.y = window.innerHeight * 0.5;
    this.easeX = this.x;
    this.easeY = this.y;
    this.easeMouseX = this.x;
    this.easeMouseY = this.y;
    this.easeSlowX = this.x;
    this.easeSlowY = this.y;
  }

  setMouse() {
    this.easeMouseX = this.easeSlowX = this.easeX = this.x;
    this.easeMouseY = this.easeSlowY = this.easeY = this.y;
  }

  tick() {
    const dX = this.x - this.easeX;
    const dY = this.y - this.easeY;
    const dMouseX = this.x - this.easeMouseX;
    const dMouseY = this.y - this.easeMouseY;
    const dSlowX = this.x - this.easeSlowX;
    const dSlowY = this.y - this.easeSlowY;
    this.easeX += dX / 10;
    this.easeY += dY / 10;
    this.easeMouseX += dMouseX / 6;
    this.easeMouseY += dMouseY / 6;
    this.easeSlowX += dSlowX / 15;
    this.easeSlowY += dSlowY / 15;
  }
}

const MouseHelper = new MouseHelperClass();

export default MouseHelper;
