export type CollisionElement = {
    type: CollisionID;
    alreadyInCollision: boolean;
};

// objects identification (for the collision detection)
export const enum CollisionID {
    ship = 0,
    enemy = 1,
    bullet = 2,
}

// categories
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

/*
    Called on 'BeginContact' between box2d bodies

    Warning: You cannot create/destroy Box2D entities inside these callbacks.
 */
export function onContact(contact) {
    var objectA = contact
        .GetFixtureA()
        .GetBody()
        .GetUserData() as CollisionElement;
    var objectB = contact
        .GetFixtureB()
        .GetBody()
        .GetUserData() as CollisionElement;

    var typeA = objectA.type;
    var typeB = objectB.type;

    var shipObject;
    var enemyObject;
    var bulletObject;

    const shipType = CollisionID.ship;
    const enemyType = CollisionID.enemy;
    const bulletType = CollisionID.bullet;

    // collision between the main ship and an enemy
    if (
        (typeA === shipType && typeB === enemyType) ||
        (typeB === shipType && typeA === enemyType)
    ) {
        // determine which one is which
        if (typeA === shipType) {
            shipObject = objectA;
            enemyObject = objectB;
        } else {
            shipObject = objectB;
            enemyObject = objectA;
        }

        // already was added to the collision array (don't add the same collision twice)
        if (enemyObject.alreadyInCollision) {
            return;
        }

        enemyObject.alreadyInCollision = true;

        // make it not collidable anymore
        enemyObject.fixDef.mask_bits = MASK.dontCollide;
        enemyObject.body.CreateFixture(enemyObject.fixDef);

        COLLISION_F.push(function () {
            shipObject.tookDamage(enemyObject.damageGiven());
            enemyObject.tookDamage();
        });
    }

    // collision between the main ship and a bullet
    else if (
        (typeA === shipType && typeB === bulletType) ||
        (typeB === shipType && typeA === bulletType)
    ) {
        // determine which one is which
        if (typeA === shipType) {
            shipObject = objectA;
            bulletObject = objectB;
        } else {
            shipObject = objectB;
            bulletObject = objectA;
        }

        // already was added to the collision array (don't add the same collision twice)
        if (bulletObject.alreadyInCollision) {
            return;
        }

        bulletObject.alreadyInCollision = true;

        // make it not collidable anymore
        bulletObject.fixDef.mask_bits = MASK.dontCollide;
        bulletObject.body.CreateFixture(bulletObject.fixDef);

        COLLISION_F.push(function () {
            bulletObject.collisionResponse();

            // remove the EnemyShip
            shipObject.tookDamage(bulletObject.damageGiven());
        });
    }

    // collision between a bullet and an enemy
    else if (
        (typeA === bulletType && typeB === enemyType) ||
        (typeB === bulletType && typeA === enemyType)
    ) {
        // determine which one is which
        if (typeA === bulletType) {
            bulletObject = objectA;
            enemyObject = objectB;
        } else {
            bulletObject = objectB;
            enemyObject = objectA;
        }

        // already was added to the collision array (don't add the same collision twice)
        if (enemyObject.alreadyInCollision) {
            return;
        }

        enemyObject.alreadyInCollision = true;

        // make it not collidable anymore
        enemyObject.fixDef.mask_bits = MASK.dontCollide;
        enemyObject.body.CreateFixture(enemyObject.fixDef);

        COLLISION_F.push(function () {
            bulletObject.collisionResponse();

            // remove the EnemyShip
            enemyObject.tookDamage(bulletObject.damageGiven());
        });
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
