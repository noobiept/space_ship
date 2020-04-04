import { CollisionID } from "../game/collision_detection";

export type MapType = {};

export type GameElement = {
    type: CollisionID;
    alreadyInCollision: boolean;
    getX: () => number;
    getY: () => number;
};
