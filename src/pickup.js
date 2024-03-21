import { dist } from "./utils.js";

export const mk_pickup = (x, y) => ({ x, y });

export const pickup_collisions = (e, pickups) =>
    pickups.filter((p) => dist(p, e) < 10);
