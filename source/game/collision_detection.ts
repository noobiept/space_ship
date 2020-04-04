import { GameElement } from "../shared/types";
import EnemyShip from "../enemies/enemy_ship";
import Bullet from "../bullets/bullet";
import Ship from "./ship";

// objects identification (for the collision detection)
export const enum CollisionID {
    ship = 0,
    enemy = 1,
    bullet = 2,
}

type DetermineType = {
    ship?: Ship;
    bullet?: Bullet<any>;
    enemy?: EnemyShip<any>;
};

export const CATEGORY = {
    ship: 1, // 0001
    enemy: 2, // 0010
    enemy_spawning: 4, // 0100
};

export const MASK = {
    ship: CATEGORY.enemy, // ship can collide with enemies
    enemy: CATEGORY.ship, // enemies can collide with the ship
    enemy_spawning: 0, // doesn't collide with anything, during the spawn phase
    dontCollide: 0,
};

// has functions to be called later (related to a collision). Have to remove the elements after executing the function
const COLLISION_F: (() => void)[] = [];

/**
 * Called on 'BeginContact' between box2d bodies
 * Warning: You cannot create/destroy Box2D entities inside these callbacks.
 */
export function onContact(contact: Box2D.Dynamics.Contacts.b2Contact) {
    const objectA = contact
        .GetFixtureA()
        .GetBody()
        .GetUserData() as GameElement;
    const objectB = contact
        .GetFixtureB()
        .GetBody()
        .GetUserData() as GameElement;

    const { ship, bullet, enemy } = determineElementsType([objectA, objectB]);

    if (ship && enemy) {
        shipOnEnemyCollision(ship, enemy);
    } else if (ship && bullet) {
        shipOnBulletCollision(ship, bullet);
    } else if (bullet && enemy) {
        bulletOnEnemyCollision(bullet, enemy);
    }
}

export function reset() {
    COLLISION_F.length = 0;
}

export function tick() {
    // check if there's collisions to deal with
    for (let a = COLLISION_F.length - 1; a >= 0; a--) {
        COLLISION_F[a]();
    }

    COLLISION_F.length = 0;
}

function determineElementsType(elements: GameElement[]) {
    return elements.reduce<DetermineType>((acc, element) => {
        const type = element.type;

        if (type === CollisionID.ship) {
            return {
                ...acc,
                ship: element as Ship,
            };
        }
        if (type === CollisionID.bullet) {
            return {
                ...acc,
                bullet: element as Bullet<any>,
            };
        }
        if (type === CollisionID.enemy) {
            return {
                ...acc,
                enemy: element as EnemyShip<any>,
            };
        }

        return acc;
    }, {});
}

/**
 * Collision between the main ship and an enemy.
 */
function shipOnEnemyCollision(ship: Ship, enemy: EnemyShip<any>) {
    // already was added to the collision array (don't add the same collision twice)
    if (enemy.alreadyInCollision) {
        return;
    }

    enemy.alreadyInCollision = true;

    // make it not collidable anymore
    enemy.fixDef.filter.maskBits = MASK.dontCollide;
    enemy.body.CreateFixture(enemy.fixDef);

    COLLISION_F.push(function () {
        ship.tookDamage(enemy.damageGiven());
        enemy.tookDamage();
    });
}

/**
 * Collision between the main ship and a bullet.
 */
function shipOnBulletCollision(ship: Ship, bullet: Bullet<any>) {
    // already was added to the collision array (don't add the same collision twice)
    if (bullet.alreadyInCollision) {
        return;
    }

    bullet.alreadyInCollision = true;

    // make it not collidable anymore
    bullet.fixDef.filter.maskBits = MASK.dontCollide;
    bullet.body.CreateFixture(bullet.fixDef);

    COLLISION_F.push(function () {
        bullet.collisionResponse();
        ship.tookDamage(bullet.damageGiven());
    });
}

function bulletOnEnemyCollision(bullet: Bullet<any>, enemy: EnemyShip<any>) {
    // already was added to the collision array (don't add the same collision twice)
    if (enemy.alreadyInCollision) {
        return;
    }

    enemy.alreadyInCollision = true;

    // make it not collidable anymore
    enemy.fixDef.filter.maskBits = MASK.dontCollide;
    enemy.body.CreateFixture(enemy.fixDef);

    COLLISION_F.push(function () {
        bullet.collisionResponse();
        enemy.tookDamage();
    });
}
