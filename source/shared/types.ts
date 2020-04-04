import { CollisionID } from "../game/collision_detection";
import { OptionsData } from "./options";

export type MapType = {};

export type GameElement = {
    type: CollisionID;
    alreadyInCollision: boolean;
    getX: () => number;
    getY: () => number;
};

export type PhysicsObjects = {
    body: Box2D.Dynamics.b2Body;
    fixDef: Box2D.Dynamics.b2FixtureDef;
};

export type AppData = {
    space_ship_options?: OptionsData;
};
