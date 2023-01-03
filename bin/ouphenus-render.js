// -----------------------------------------------------------
// OuphenusRender
// Clases para renderizar elementos en un componente "Canvas"
// -----------------------------------------------------------
export var OuphenusRender;
(function (OuphenusRender) {
    // -------------------------------------------------------
    // Clase Ticker
    // -------------------------------------------------------
    class Ticker {
        constructor(onTickCaller, onTickCallback) {
            this.lastTime = Date.now();
            this.onTickCaller = onTickCaller;
            this.onTickCallback = onTickCallback;
            requestAnimationFrame(() => this.onTick());
        }
        onTick() {
            let currentTime = Date.now();
            let deltaTime = currentTime - this.lastTime;
            this.onTickCallback.call(this.onTickCaller, deltaTime);
            this.lastTime = Date.now();
            requestAnimationFrame(() => this.onTick());
        }
    }
    OuphenusRender.Ticker = Ticker;
    // -------------------------------------------------------
    // Clase Image
    // -------------------------------------------------------
    class Texture {
        constructor(url) {
            this.baseWidth = 0;
            this.baseHeight = 0;
            this.source = document.createElement('img');
            this.source.src = url;
            this.source.onload = () => this.onLoad();
        }
        onLoad() {
            this.baseWidth = this.source.width;
            this.baseHeight = this.source.height;
            if (this.baseWidth == 0 && this.baseHeight) {
                console.log("Error al cargar imagen");
            }
        }
    }
    OuphenusRender.Texture = Texture;
    // -------------------------------------------------------
    // Clase Sprite
    // -------------------------------------------------------
    class Sprite {
        /**
         * @param image
         * @param x Posición X
         * @param y Posición Y
         * @param sx Escala en eje X número entre 0..1
         * @param sy Escala en eje Y número entre 0..1
         * @param pivotX Número entre 0..1, por defecto esta centrado con valor 0.5
         * @param pivotY Número entre 0..1, por defecto esta centrado con valor 0.5
         * @param angle En radianes
         */
        constructor(image, x, y, sx = 1, sy = 1, pivotX = 0.5, pivotY = 0.5, angle = 0) {
            this.texture = image;
            this.x = x;
            this.y = y;
            this.sx = sx;
            this.sy = sy;
            this.pivotX = pivotX;
            this.pivotY = pivotY;
            this.alpha = 1;
            this.angle = angle;
        }
        onDraw(context) {
            if (this.texture.baseWidth != 0 || this.texture.baseHeight != 0) {
                context.save();
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
                context.translate(this.x, this.y);
                context.scale(this.sx, this.sy);
                context.rotate(this.angle);
                context.translate(-this.texture.baseWidth * this.pivotX, -this.texture.baseHeight * this.pivotY);
                context.drawImage(this.texture.source, 0, 0, this.texture.baseWidth, this.texture.baseHeight);
                context.restore();
            }
        }
    }
    OuphenusRender.Sprite = Sprite;
    // -------------------------------------------------------
    // Clase Sprite
    // -------------------------------------------------------
    class Render {
        constructor(width, height) {
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');
        }
        setSize(width, height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
    OuphenusRender.Render = Render;
})(OuphenusRender || (OuphenusRender = {}));
//# sourceMappingURL=ouphenus-render.js.map