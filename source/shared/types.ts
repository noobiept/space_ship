import { CollisionID } from "../game/collision_detection";
import { OptionsData } from "./options";
import { EnemyMapping } from "./constants";

export type MapType = {
    CURRENT_MAP: number;
    loadMap?: (level: number) => void;
    tick: (event: createjs.TickerEvent) => void;
};

export type MapTypeClass = new () => MapType;

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

export type EnemyName = keyof typeof EnemyMapping;
export type EnemyClass = typeof EnemyMapping[EnemyName];

export type LevelInfoPhase = {
    tick: number;
    enemyType: EnemyName;
    howMany: number;
};

export type LevelInfoDamage = {
    [name in EnemyName]: number;
};

export type LevelInfoVelocity = {
    [name in EnemyName]: number;
};

export type LevelInfo = {
    damage: LevelInfoDamage;
    velocity: LevelInfoVelocity;
    map: LevelInfoPhase[];
};
