import EnemyMoveHorizontally from "../enemies/enemy_move_horizontally";
import EnemyKamikaze from "../enemies/enemy_kamikaze";
import EnemyRotateAround from "../enemies/enemy_rotate_around";
import EnemyRocks from "../enemies/enemy_rocks";
import { EnemyName, EnemyClass } from "./types";

export const EnemyMapping = {
    EnemyMoveHorizontally: EnemyMoveHorizontally,
    EnemyKamikaze: EnemyKamikaze,
    EnemyRotateAround: EnemyRotateAround,
    EnemyRocks: EnemyRocks,
};

export const EnemyNames = Object.keys(EnemyMapping) as EnemyName[];
export const EnemyClasses = Object.values(EnemyMapping) as EnemyClass[];

export const b2World = Box2D.Dynamics.b2World;
export const b2Vec2 = Box2D.Common.Math.b2Vec2;
export const b2BodyDef = Box2D.Dynamics.b2BodyDef;
export const b2Body = Box2D.Dynamics.b2Body;
export const b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
export const b2Fixture = Box2D.Dynamics.b2Fixture;

export const b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
export const b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
export const b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
export const b2ContactListener = Box2D.Dynamics.b2ContactListener;
