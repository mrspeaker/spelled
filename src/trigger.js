export const mk_trigger = (p) => ({ ...p });

export const trigger_collisions = (triggers, e, onLvl) => {
    triggers.forEach((t) => {
        if (t.x === Math.floor(e.x) && t.y === Math.floor(e.y)) {
            onLvl(t);
        }
    });
};
