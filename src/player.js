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
    dead: false,
});

export const update_player = (state, keys) => {
    const { player: p, cursor, level, typing } = state;

    if (keys.isDown("Enter") && !p.jumping) {
        p.acy = -0.2;
        p.jumping = true;
    }
    // Set the player target to cursor
    p.tx = cursor.x;
    p.ty = cursor.y - 1;

    const ch = level.ch_at_xy((p.x + 0.5) | 0, (p.y + 1) | 0);
    const onGround = ch && !["↑", "→", "→", "↑"].includes(ch);

    if (!p.jumping) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        if (Math.abs(dx) > 0.1) {
            p.acx = Math.sign(dx) * Math.max(0.01); //, Math.abs(dx) * 0.0005);
        }

        if (Math.abs(dy) > 0.1) {
            p.vy = Math.sign(dy) * 0.1;
        } else {
            p.vy = 0;
        }
        if (!onGround) {
            p.jumping = true;
        }
    } else {
        if (onGround && p.vy > 0 && p.acy === 0) {
            p.jumping = false;
            p.y = Math.floor(p.y);
            cursor.x = Math.floor(p.x + 0.5);
            cursor.y = Math.floor(p.y + 1);
            // "jump" to new word
            typing.fwd = null;
        }
    }
    if (p.y > state.level.h - 2) {
        p.dead = true;
    }
};
