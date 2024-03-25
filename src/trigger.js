export const mk_trigger = (p) => ({ x: 0, y: 0, triggered: 0, ...p });

export const trigger_collisions = (triggers, e, onLvl) => {
    triggers.forEach((t) => {
        if (t.x === Math.floor(e.x + 0.5) && t.y === Math.floor(e.y + 0.5)) {
            onLvl(t);
        }
    });
};
