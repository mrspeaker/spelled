export const mk_trigger = (x, y, type) => ({ x, y, type });

export const trigger_collisions = (triggers, e, onLvl) => {
    triggers.forEach((t) => {
        if (t.x === Math.floor(e.x) && t.y === Math.floor(e.y)) {
            onLvl();
        }
    });
};
