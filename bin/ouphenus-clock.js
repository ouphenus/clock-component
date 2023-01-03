// -----------------------------------------------------------
// OuphenusClock
// Componente de reloj analógico usando canvas
// -----------------------------------------------------------
import { OuphenusRender } from "./ouphenus-render.js";
var ClockAttibutes;
(function (ClockAttibutes) {
    ClockAttibutes["Width"] = "width";
    ClockAttibutes["Height"] = "height";
    ClockAttibutes["SkinPath"] = "skinPath";
    ClockAttibutes["RadiusNumbers"] = "radiusNumbers";
})(ClockAttibutes || (ClockAttibutes = {}));
class OuphenusClock extends HTMLElement {
    constructor() {
        super();
        this.spriteSecondHand = null;
        this.spriteMinuteHand = null;
        this.spriteHoursHand = null;
        this.BASE_SIZE = 256;
        this.attachShadow({ mode: "open" });
        this.width = this.getAttibuteInt(ClockAttibutes.Width, this.BASE_SIZE);
        this.height = this.getAttibuteInt(ClockAttibutes.Height, this.BASE_SIZE);
        this.skinPath = this.getAttibuteValue(ClockAttibutes.SkinPath, "");
        this.radiusNumbers = this.getAttibuteInt(ClockAttibutes.RadiusNumbers, 100);
        this.render = new OuphenusRender.Render(this.width, this.height);
        this.ticker = new OuphenusRender.Ticker(this, this.update);
        this.sprites = new Array();
        this.setSkin();
        // Calculando el ratio para rescalar el rendercanvas
        this.ratioX = this.width / this.BASE_SIZE;
        this.ratioY = this.height / this.BASE_SIZE;
    }
    /**
     * Crea el skin del reloj según las imágenes seteado en "skinPath"
     */
    setSkin() {
        // Agregando el fondo
        this.createSprite("bg", 128, 128);
        // Agregando los números
        const angleSeparation = this.toRadians(30);
        for (let i = 0; i < 12; i++) {
            let x = this.BASE_SIZE / 2 + this.radiusNumbers * Math.cos(angleSeparation * i - this.toRadians(60));
            let y = this.BASE_SIZE / 2 + this.radiusNumbers * Math.sin(angleSeparation * i - this.toRadians(60));
            this.createSprite(`${i + 1}`, x, y);
        }
        // Creando las manecillas del reloj
        this.spriteHoursHand = this.createSprite("hour_hand", 128, 128);
        this.spriteMinuteHand = this.createSprite("minute_hand", 128, 128);
        this.spriteSecondHand = this.createSprite("second_hand", 128, 128);
    }
    createSprite(imageName, x = 0, y = 0) {
        let sprite = new OuphenusRender.Sprite(new OuphenusRender.Texture(`${this.skinPath}${imageName}.png`), x, y);
        this.sprites.push(sprite);
        return sprite;
    }
    update(dt) {
        var _a, _b, _c, _d;
        // Cálculo del tiempo para las agujas del reloj
        let date = new Date();
        this.spriteSecondHand.angle = this.toRadians(((date.getSeconds() / 60) * 360) - 90);
        this.spriteMinuteHand.angle = this.toRadians(((date.getMinutes() / 60) * 360 + (date.getSeconds() / 60) * 6) - 90);
        this.spriteHoursHand.angle = this.toRadians(((date.getHours() / 12) * 360 + (date.getMinutes() / 60) * 30) - 90);
        // Proceso de renderizado de los sprites
        (_a = this.render.context) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, this.render.canvas.width, this.render.canvas.height);
        (_b = this.render.context) === null || _b === void 0 ? void 0 : _b.save();
        (_c = this.render.context) === null || _c === void 0 ? void 0 : _c.scale(this.ratioX, this.ratioY);
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.render.context) {
                this.sprites[i].onDraw(this.render.context);
            }
        }
        (_d = this.render.context) === null || _d === void 0 ? void 0 : _d.restore();
    }
    connectedCallback() {
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(this.render.canvas);
        }
    }
    /**
     * Convertir grados a radianes
     * @param degrees
    */
    toRadians(degrees) {
        return degrees * Math.PI / 180;
    }
    /**
     * Obtener atributo
     * @param attibuteName Nombre del atributo
     * @param defaultValue Valor por defecto para devolver
     * */
    getAttibuteValue(attibuteName, defaultValue) {
        let att = this.getAttribute(attibuteName);
        if (att != null) {
            return att;
        }
        return defaultValue;
    }
    /**
     * Obtener atributo entero
     * @param attibuteName Nombre del atributo
     * @param defaultValue Valor por defecto para devolver
     * */
    getAttibuteInt(attibuteName, defaultValue) {
        return parseInt(this.getAttibuteValue(attibuteName, defaultValue.toString()), 0);
    }
}
customElements.define('ouphenus-clock', OuphenusClock);
//# sourceMappingURL=ouphenus-clock.js.map