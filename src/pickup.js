import { find_free_ground } from "./level.js";

export const mk_pickup = (x, y) => {
    return { x, y };
};

export const init_pickups = (state) => {
    const { entities, level, tw, th } = state;

    for (let i = 0; i < 80; i++) {
        const { x, y } = find_free_ground(level);
        const p = mk_pickup(x * tw, y * th);
        entities.push(p);
    }
};

const dist = (e1, e2) => {
    const dx = e1.x - e2.x;
    const dy = e1.y - e2.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    return d;
};

export const pickup_collisions = (e, pickups) =>
    pickups.filter((p) => dist(p, e) < 10);
