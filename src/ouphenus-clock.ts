// -----------------------------------------------------------
// OuphenusClock
// Componente de reloj analógico usando canvas
// -----------------------------------------------------------

import {OuphenusRender} from "./ouphenus-render.js";

enum ClockAttibutes
{
    Width = "width",
    Height = "height",
    SkinPath = "skinPath",
    RadiusNumbers = "radiusNumbers"
}

class OuphenusClock extends HTMLElement
{
    /** Ancho del componente */
    width:number;
    /** Alto del componente */
    height:number;
    /** Ruta de la imágenes del reloj */
    skinPath:string;
    /** Distancia para regular la distancia de los número hacia el centro del reloj */
    radiusNumbers:number;

    private sprites:Array<OuphenusRender.Sprite>;
    private ratioX:number;
    private ratioY:number;
    private render:OuphenusRender.Render;
    private ticker:OuphenusRender.Ticker;
    private spriteSecondHand:OuphenusRender.Sprite | null = null;
    private spriteMinuteHand:OuphenusRender.Sprite | null = null;
    private spriteHoursHand:OuphenusRender.Sprite | null = null;
    private readonly BASE_SIZE:number = 256;

    constructor()
    {
        super();
        this.attachShadow({mode:"open"});
        this.width = this.getAttibuteInt(ClockAttibutes.Width, this.BASE_SIZE);
        this.height = this.getAttibuteInt(ClockAttibutes.Height, this.BASE_SIZE);
        this.skinPath = this.getAttibuteValue(ClockAttibutes.SkinPath, "");
        this.radiusNumbers = this.getAttibuteInt(ClockAttibutes.RadiusNumbers, 100);
        this.render = new OuphenusRender.Render(this.width, this.height);
        this.ticker = new OuphenusRender.Ticker(this, this.update);
        this.sprites = new Array<OuphenusRender.Sprite>();
        this.setSkin();

        // Calculando el ratio para rescalar el rendercanvas
        this.ratioX = this.width / this.BASE_SIZE;
        this.ratioY = this.height / this.BASE_SIZE;
    }

    /**
     * Crea el skin del reloj según las imágenes seteado en "skinPath"
     */
    setSkin()
    {
        // Agregando el fondo
        this.createSprite("bg", 128, 128);

        // Agregando los números
        const angleSeparation = this.toRadians(30);
        for (let i = 0; i < 12; i++)
        {
            let x = this.BASE_SIZE/2 + this.radiusNumbers * Math.cos(angleSeparation * i - this.toRadians(60));
            let y = this.BASE_SIZE/2 + this.radiusNumbers * Math.sin(angleSeparation * i - this.toRadians(60));
            this.createSprite(`${i+1}`, x, y);
        }

        // Creando las manecillas del reloj
        this.spriteHoursHand = this.createSprite("hour_hand", 128, 128);
        this.spriteMinuteHand = this.createSprite("minute_hand", 128, 128);
        this.spriteSecondHand = this.createSprite("second_hand", 128, 128);
    }

    createSprite(imageName:string, x:number = 0, y:number = 0):OuphenusRender.Sprite
    {
        let sprite = new OuphenusRender.Sprite(new OuphenusRender.Texture(`${this.skinPath}${imageName}.png`), x, y);
        this.sprites.push(sprite);
        return sprite;
    }

    update(dt:number)
    {
        // Cálculo del tiempo para las agujas del reloj
        let date = new Date();
        this.spriteSecondHand!.angle = this.toRadians(((date.getSeconds()/60) * 360) - 90);
        this.spriteMinuteHand!.angle = this.toRadians(((date.getMinutes()/60) * 360 + (date.getSeconds()/60)*6) - 90);
        this.spriteHoursHand!.angle = this.toRadians(((date.getHours()/12)*360 + (date.getMinutes() / 60)*30) - 90);

        // Proceso de renderizado de los sprites
        this.render.context?.clearRect(0,0,this.render.canvas.width,this.render.canvas.height);
        this.render.context?.save();
        this.render.context?.scale(this.ratioX, this.ratioY);
        for (let i = 0; i < this.sprites.length; i++)
        {
            if (this.render.context)
            {
                this.sprites[i].onDraw(this.render.context);
            }
        }
        this.render.context?.restore()
    }

    connectedCallback()
    {
        if (this.shadowRoot)
        {
            this.shadowRoot.appendChild(this.render.canvas)
        }
    }

    /**
     * Convertir grados a radianes
     * @param degrees
    */
    toRadians(degrees:number):number
    {
        return degrees* Math.PI/180;
    }

    /**
     * Obtener atributo
     * @param attibuteName Nombre del atributo
     * @param defaultValue Valor por defecto para devolver
     * */
    getAttibuteValue(attibuteName:string, defaultValue:string):string
    {
        let att = this.getAttribute(attibuteName);
        if (att != null) { return att; }
        return defaultValue;
    }

    /**
     * Obtener atributo entero
     * @param attibuteName Nombre del atributo
     * @param defaultValue Valor por defecto para devolver
     * */
    getAttibuteInt(attibuteName:string, defaultValue:number):number
    {
        return parseInt(this.getAttibuteValue(attibuteName, defaultValue.toString()), 0 );
    }
}
customElements.define('ouphenus-clock', OuphenusClock)
