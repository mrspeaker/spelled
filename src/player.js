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

export const update_player = (p, keys, cursor) => {
    if (keys.isDown(" ") && !p.jumping) {
        p.acy = -0.2;
        p.jumping = true;
        p.jumpStart = p.y;
    }
    // Set the player target to cursor
    p.tx = cursor.x;
    p.ty = cursor.y - 1;

    const dx = p.tx - p.x;
    const dy = p.ty - p.y;
    if (Math.abs(dx) > 0.1) {
        p.acx = dx * 0.0008;
    } else {
        // p.vx = 0;
    }
    if (!p.jumping) {
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
