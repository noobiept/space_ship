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

export type LevelInfo = {
    damage: {
        [name in EnemyName]: number;
    };
    velocity: {
        [name in EnemyName]: number;
    };
    map: LevelInfoPhase[];
};

export type GeneratedLevelInfoPhase = {
    tick: number;
    enemyType: EnemyClass;
    howMany: number;
    x: number;
    y: number;
    damage: number;
    velocity: number;
};

export type GeneratedLevelInfo = {
    map: GeneratedLevelInfoPhase[];
};
