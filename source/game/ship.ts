import { EventDispatcher } from "@drk4/utilities";
import { GAME_WIDTH, GAME_HEIGHT, STAGE, CANVAS, WORLD } from "../main";
import { KEYS_HELD } from "../keyboard_events";
import Bullet1_laser from "../bullets/bullet1_laser";
import Bullet2_sniper from "../bullets/bullet2_sniper";
import Bullet3_rocket from "../bullets/bullet3_rocket";
import Bullet4_mines from "../bullets/bullet4_mines";
import * as GameStatistics from "../menus/game_statistics";
import * as ZIndex from "./z_index";
import * as GameMenu from "../menus/game_menu";
import { CollisionID, Category, Mask } from "./collision_detection";
import {
    b2FixtureDef,
    b2BodyDef,
    b2Body,
    b2CircleShape,
    b2Vec2,
    SCALE,
} from "../shared/constants";
import { GameElement } from "../shared/types";
import { playSound } from "../shared/utilities";
import { getAsset } from "../shared/assets";

type ShipEvent = "dead";

const VELOCITY = 5;

// ticks until we add + ammo to the weapons
// the weapon number corresponds to the position in the list (position 0 is the first weapon, etc)
const AMMO_UPDATE_TICK = [10, 28, 11, 21];

// maximum number of bullets per weapon
const MAX_AMMO = [50, 10, 25, 20];

export default class Ship extends EventDispatcher<ShipEvent>
    implements GameElement {
    type = CollisionID.ship;
    alreadyInCollision = false;

    readonly width = 10;
    readonly height = 10;

    private shape: createjs.DisplayObject;
    private color: string;
    private weaponSelected: number;
    private tick_count: [number, number, number, number];
    private bullets_left: [number, number, number, number];
    private category_bits!: Category;
    private mask_bits!: Mask;
    private body: Box2D.Dynamics.b2Body;
    private onClick: (e: MouseEvent) => void;
    private onMouseMove: (e: MouseEvent) => void;
    private disabled = false;

    static all: Ship[] = [];

    constructor() {
        super();

        this.color = "rgb(81, 139, 255)";
        this.weaponSelected = 0;
        this.shape = this.makeShape();
        this.body = this.setupPhysics();

        // counter, until it can add a new ammo to the weapon
        this.tick_count = [
            AMMO_UPDATE_TICK[0],
            AMMO_UPDATE_TICK[1],
            AMMO_UPDATE_TICK[2],
            AMMO_UPDATE_TICK[3],
        ];

        // current number of bullets left
        this.bullets_left = [
            Math.floor(MAX_AMMO[0] / 2),
            Math.floor(MAX_AMMO[1] / 2),
            Math.floor(MAX_AMMO[2] / 2),
            Math.floor(MAX_AMMO[3] / 2),
        ];

        Ship.all.push(this);

        this.moveTo(GAME_WIDTH / 2, GAME_HEIGHT / 2);

        STAGE.addChild(this.shape);
        ZIndex.add(this.shape);

        // add the event listeners
        this.onClick = (event) => {
            if (this.disabled) {
                return;
            }

            this.handleClick(event);
        };
        this.onMouseMove = (event) => {
            if (this.disabled) {
                return;
            }

            this.handleMouseMove(event);
        };

        window.addEventListener("click", this.onClick, false);
        window.addEventListener("mousemove", this.onMouseMove, false);
    }

    makeShape() {
        const spriteSheet = {
            animations: {
                main: {
                    frames: [0],
                    next: "main",
                },
            },
            frames: {
                width: 10,
                height: 10,
            },
            images: [getAsset("ship")],
        };
        const ss = new createjs.SpriteSheet(spriteSheet);
        const ship = new createjs.Sprite(ss);

        ship.gotoAndPlay("main");

        // change the origin point to the middle, so that it rotates around the center (following the mouse)
        ship.regX = this.width / 2;
        ship.regY = this.height / 2;

        return ship;
    }

    setupPhysics() {
        var width = this.width;

        // physics
        var fixDef = new b2FixtureDef();

        fixDef.density = 1;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        fixDef.filter.categoryBits = Category.ship;
        fixDef.filter.maskBits = Mask.ship;

        this.category_bits = Category.ship;
        this.mask_bits = Mask.ship;

        var bodyDef = new b2BodyDef();

        bodyDef.type = b2Body.b2_staticBody;

        bodyDef.position.x = 0;
        bodyDef.position.y = 0;

        fixDef.shape = new b2CircleShape(width / 2 / SCALE);

        const body = WORLD.createBody(bodyDef);

        body.CreateFixture(fixDef);
        body.SetUserData(this);

        return body;
    }

    /*
     * Clear the events of the Ship, call .setEvents() later to set them back
     */
    clearEvents() {
        window.removeEventListener("click", this.onClick);
        window.removeEventListener("mousemove", this.onMouseMove);
    }

    /*
    Updates the shape position to match the physic body
 */
    updateShape() {
        this.shape.rotation = this.body.GetAngle() * (180 / Math.PI);

        const bodyCenter = this.body.GetWorldCenter();

        this.shape.x = bodyCenter.x * SCALE;
        this.shape.y = bodyCenter.y * SCALE;
    }

    moveTo(x: number, y: number) {
        this.shape.x = x;
        this.shape.y = y;

        var position = new b2Vec2(x / SCALE, y / SCALE);

        this.body.SetPosition(position);
    }

    getX() {
        return this.shape.x;
    }

    getY() {
        return this.shape.y;
    }

    getRotation() {
        return this.shape.rotation;
    }

    static inTopLimit(y: number) {
        if (y < 0) {
            return true;
        }

        return false;
    }

    static inLeftLimit(x: number) {
        if (x < 0) {
            return true;
        }

        return false;
    }

    static inRightLimit(x: number) {
        if (x > GAME_WIDTH) {
            return true;
        }

        return false;
    }

    static inBottomLimit(y: number) {
        if (y > GAME_HEIGHT) {
            return true;
        }

        return false;
    }

    tookDamage(damage: number) {
        const energy = GameStatistics.getShipEnergy() - damage;

        GameStatistics.updateShipEnergy(energy);

        // you loose
        if (energy <= 0) {
            this.dispatchEvent("dead");
        }
    }

    selectWeapon(weaponNumber: number) {
        this.weaponSelected = weaponNumber;

        GameMenu.selectWeapon(weaponNumber);
    }

    /*
    Arguments:

        event : (MouseEvent -- easelJS)
        ship  : (Ship object)
 */
    handleMouseMove(event: MouseEvent) {
        const canvasPosition = CANVAS.getBoundingClientRect();

        // mouse position in the canvas (assume origin point in top/left of canvas element)
        const mouseX = event.pageX - canvasPosition.left;
        const mouseY = event.pageY - canvasPosition.top;

        // make a triangle from the position the ship is in, relative to the mouse position
        const triangleOppositeSide = this.shape.y - mouseY;
        const triangleAdjacentSide = mouseX - this.shape.x;

        // find the angle, given the two sides (of a right triangle)
        const angleRadians = Math.atan2(
            triangleOppositeSide,
            triangleAdjacentSide
        );

        // convert to degrees
        const angleDegrees = (angleRadians * 180) / Math.PI;

        // we multiply by -1 because the .rotation property seems to have the angles in the other direction
        this.rotate(-1 * angleDegrees);
    }

    rotate(degrees: number) {
        this.shape.rotation = degrees;
        this.body.SetAngle((degrees * Math.PI) / 180);
    }

    handleClick(event: MouseEvent) {
        var weapons = [
            Bullet1_laser,
            Bullet2_sniper,
            Bullet3_rocket,
            Bullet4_mines,
        ];

        var weaponSelected = this.weaponSelected;
        var bulletsLeft = this.bullets_left;

        if (bulletsLeft[weaponSelected] > 0) {
            new weapons[this.weaponSelected]({
                x: this.getX(),
                y: this.getY(),
                angleRotation: this.getRotation(),
                color: this.color,
                category: this.category_bits,
                mask: this.mask_bits,
            });

            bulletsLeft[weaponSelected]--;
            GameMenu.updateBulletsLeft(
                weaponSelected,
                this.getBulletsLeft(weaponSelected)
            );
        } else {
            playSound("Audio-dryFire");
        }
    }

    updateAmmo() {
        var tickCount = this.tick_count;
        var bulletsLeft = this.bullets_left;

        for (let i = 0; i < AMMO_UPDATE_TICK.length; i++) {
            tickCount[i]--;

            if (tickCount[i] <= 0) {
                // reset the counter
                tickCount[i] = AMMO_UPDATE_TICK[i];

                // if we still didn't reach the maximum value
                if (bulletsLeft[i] < MAX_AMMO[i]) {
                    // increase the number of bullets available
                    bulletsLeft[i]++;

                    GameMenu.updateBulletsLeft(i, this.getBulletsLeft(i));
                }
            }
        }
    }

    /*
    Returns the number of bullets left from a particular weapon (zero-based)
 */
    getBulletsLeft(weapon: number) {
        return this.bullets_left[weapon];
    }

    /*
    Adds the ammo of all the weapons back to half of the maximum ammo, or if the ammo is already at half or more, keep whatever value it has
 */
    refreshAmmo() {
        const bulletsLeft = this.bullets_left;

        for (let i = 0; i < bulletsLeft.length; i++) {
            const halfMaxAmmo = Math.floor(MAX_AMMO[i] / 2);

            if (bulletsLeft[i] < halfMaxAmmo) {
                bulletsLeft[i] = halfMaxAmmo;
            }
        }
    }

    /**
     * Disable/enable the ship.
     * When disabled the player's inputs don't have an effect (ie. can't fire a bullet).
     */
    setDisabled(state: boolean) {
        this.disabled = state;
    }

    /*
     *  Remove this ship
     */
    remove() {
        STAGE.removeChild(this.shape);
        WORLD.destroyBody(this.body);

        var position = Ship.all.indexOf(this);

        Ship.all.splice(position, 1);

        this.clearEvents();
    }

    /*
     * Remove all the ships
     */
    static removeAll() {
        Ship.all.forEach((ship) => {
            ship.remove();
        });
    }

    tick() {
        var nextX, nextY;

        // top left
        if (KEYS_HELD.left && KEYS_HELD.up) {
            nextX = this.shape.x - VELOCITY;
            nextY = this.shape.y - VELOCITY;

            if (Ship.inTopLimit(nextY)) {
                nextY = this.shape.y;
            }

            if (Ship.inLeftLimit(nextX)) {
                nextX = this.shape.x;
            }

            this.moveTo(nextX, nextY);
        }

        // bottom left
        else if (KEYS_HELD.left && KEYS_HELD.down) {
            nextX = this.shape.x - VELOCITY;
            nextY = this.shape.y + VELOCITY;

            if (Ship.inLeftLimit(nextX)) {
                nextX = this.shape.x;
            }

            if (Ship.inBottomLimit(nextY)) {
                nextY = this.shape.y;
            }

            this.moveTo(nextX, nextY);
        }

        // top right
        else if (KEYS_HELD.right && KEYS_HELD.up) {
            nextX = this.shape.x + VELOCITY;
            nextY = this.shape.y - VELOCITY;

            if (Ship.inRightLimit(nextX)) {
                nextX = this.shape.x;
            }

            if (Ship.inTopLimit(nextY)) {
                nextY = this.shape.y;
            }

            this.moveTo(nextX, nextY);
        }

        // bottom right
        else if (KEYS_HELD.right && KEYS_HELD.down) {
            nextX = this.shape.x + VELOCITY;
            nextY = this.shape.y + VELOCITY;

            if (Ship.inRightLimit(nextX)) {
                nextX = this.shape.x;
            }

            if (Ship.inBottomLimit(nextY)) {
                nextY = this.shape.y;
            }

            this.moveTo(nextX, nextY);
        }

        // left
        else if (KEYS_HELD.left) {
            nextX = this.shape.x - VELOCITY;

            if (Ship.inLeftLimit(nextX)) {
                nextX = this.shape.x;
            }

            this.moveTo(nextX, this.shape.y);
        }

        // right
        else if (KEYS_HELD.right) {
            nextX = this.shape.x + VELOCITY;

            if (Ship.inRightLimit(nextX)) {
                nextX = this.shape.x;
            }

            this.moveTo(nextX, this.shape.y);
        }

        // top
        else if (KEYS_HELD.up) {
            nextY = this.shape.y - VELOCITY;

            // check if is within the canvas (in bounds)
            if (Ship.inTopLimit(nextY)) {
                nextY = this.shape.y;
            }

            this.moveTo(this.shape.x, nextY);
        }

        // bottom
        else if (KEYS_HELD.down) {
            nextY = this.shape.y + VELOCITY;

            if (Ship.inBottomLimit(nextY)) {
                nextY = this.shape.y;
            }

            this.moveTo(this.shape.x, nextY);
        }

        this.updateShape();
        this.updateAmmo();
    }
}
