import { dist } from "./utils.js";

export const mk_pickup = (x, y) => ({ x, y, type: "pickup" });

export const pickup_collisions = (e, pickups) =>
    pickups.filter((p) => dist(p, e) < 10);
