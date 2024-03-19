import { rndf } from "./utils.js";

const mk_particle = (x, y) => {
    return {
        x,
        y,
        vx: 0,
        vy: 0,
        size: 0,
        life: 0,
    };
};

const update_particle = (p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.03;
    p.life--;
};

export const mk_particles = (x, y) =>
    [...Array(6)].fill(0).map(() => {
        const p = mk_particle(x, y);
        p.vx = rndf(-0.4, 0.4);
        p.vy = rndf(-0.4, -1);
        p.size = rndf(1, 3);
        p.life = 50;
        return p;
    });

export const update_particles = (ps) => {
    for (let i = ps.length - 1; i > 0; i--) {
        const p = ps[i];
        update_particle(p);
        if (p.life <= 0) {
            ps.splice(i, 1);
        }
    }
};
