// -----------------------------------------------------------
// OuphenusRender
// Clases para renderizar elementos en un componente "Canvas"
// -----------------------------------------------------------

export namespace OuphenusRender
{
    // -------------------------------------------------------
    // Clase Ticker
    // -------------------------------------------------------
    export class Ticker
    {
        lastTime:number;
        onTickCaller:Object;
        onTickCallback:(dt:number)=>void;

        constructor(onTickCaller:Object, onTickCallback:(dt:number)=>void)
        {
            this.lastTime = Date.now();
            this.onTickCaller = onTickCaller;
            this.onTickCallback = onTickCallback;
            requestAnimationFrame(()=>this.onTick());
        }

        public onTick():void
        {
            let currentTime:number = Date.now();
            let deltaTime = currentTime - this.lastTime;
            this.onTickCallback.call(this.onTickCaller, deltaTime);
            this.lastTime = Date.now();
            requestAnimationFrame(()=>this.onTick());
        }
    }

    // -------------------------------------------------------
    // Clase Image
    // -------------------------------------------------------
    export class Texture
    {
        source:HTMLImageElement;
        baseWidth:number = 0;
        baseHeight:number = 0;

        constructor(url:string)
        {
            this.source = document.createElement('img');
            this.source.src = url;
            this.source.onload = ()=> this.onLoad();
        }

        onLoad():void
        {
            this.baseWidth = this.source.width;
            this.baseHeight = this.source.height;
            if (this.baseWidth == 0 && this.baseHeight)
            {
                console.log("Error al cargar imagen");
            }
        }
    }

    // -------------------------------------------------------
    // Clase Sprite
    // -------------------------------------------------------
    export class Sprite
    {
        texture:Texture;
        x:number;
        y:number;
        sx:number;
        sy:number;
        alpha:number;
        pivotX:number;
        pivotY:number;
        angle:number;

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
        constructor(image:Texture, x:number, y:number,
            sx:number = 1,sy:number =1,
            pivotX:number = 0.5, pivotY:number = 0.5, angle = 0)
        {
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

        public onDraw(context:CanvasRenderingContext2D):void
        {
            if (this.texture.baseWidth != 0 || this.texture.baseHeight != 0)
            {   context.save();
                context.imageSmoothingEnabled = true;
                context.imageSmoothingQuality = "high";
                context.translate(this.x, this.y)
                context.scale(this.sx, this.sy)
                context.rotate(this.angle);
                context.translate(
                    - this.texture.baseWidth * this.pivotX,
                    - this.texture.baseHeight * this.pivotY)
                context.drawImage(this.texture.source, 0, 0, this.texture.baseWidth, this.texture.baseHeight);
                context.restore();
            }
        }
    }

    // -------------------------------------------------------
    // Clase Sprite
    // -------------------------------------------------------
    export class Render
    {
        canvas:HTMLCanvasElement;
        context:CanvasRenderingContext2D | null;

        constructor(width:number, height:number)
        {
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.context = this.canvas.getContext('2d');
        }

        setSize(width:number, height:number)
        {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
}