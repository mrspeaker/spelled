export const mk_player = (x, y) => ({
    x,
    y,
    tx: x,
    ty: y,
    vx: 0,
    vy: 0,
    acx: 0,
    acy: 0,
    jumping: false,
    jumpStart: 0,
});

export const update_player = (p) => {
    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    if (!p.jumping) {
        if (Math.abs(dx) > 0.1) {
            p.vx = Math.sign(dx) * 0.1;
        } else {
            p.vx = 0;
        }

        if (Math.abs(dy) > 0.1) {
            p.vy = Math.sign(dy) * 0.1;
        } else {
            p.vy = 0;
        }
    } else {
        if (p.y > p.jumpStart && p.vy > 0) {
            p.y = p.jumpStart;
            p.jumping = false;
        }
    }
};
