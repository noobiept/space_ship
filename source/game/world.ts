import { b2Vec2 } from "../shared/constants.js";

export default class World {
    private world: Box2D.Dynamics.b2World;

    constructor() {
        this.world = new Box2D.Dynamics.b2World(
            new b2Vec2(0, 0), // zero-gravity
            true // allow sleep
        );
    }

    setDebugDraw(debugDraw: Box2D.Dynamics.b2DebugDraw) {
        this.world.SetDebugDraw(debugDraw);
    }

    setContactListener(listener: Box2D.Dynamics.b2ContactListener) {
        this.world.SetContactListener(listener);
    }

    drawDebugData() {
        this.world.DrawDebugData();
    }

    createBody(bodyDef: Box2D.Dynamics.b2BodyDef) {
        return this.world.CreateBody(bodyDef);
    }

    destroyBody(body: Box2D.Dynamics.b2Body) {
        this.world.DestroyBody(body);
    }

    tick() {
        this.world.Step(
            1 / 60, // frame-rate
            10, // velocity iterations
            10 // position iterations
        );
        this.world.DrawDebugData();
        this.world.ClearForces();
    }
}
