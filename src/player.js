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
    dead: false,
});

export const update_player = (state, keys) => {
    const { player: p, cursor, level, typing } = state;

    if (keys.isDown(" ") && !p.jumping) {
        p.acy = -0.2;
        p.jumping = true;
        //p.jumpStart = p.y;
    }
    // Set the player target to cursor
    p.tx = cursor.x;
    p.ty = cursor.y - 1;

    const onGround = level.ch_at_xy((p.x + 0.5) | 0, (p.y + 1) | 0);

    if (!p.jumping) {
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        if (Math.abs(dx) > 0.1) {
            p.acx = Math.sign(dx) * Math.max(0.002, Math.abs(dx) * 0.001);
            console.log(p.acx.toFixed(3));
        }

        if (Math.abs(dy) > 0.1) {
            p.vy = Math.sign(dy) * 0.1;
        } else {
            p.vy = 0;
        }
        if (!onGround) {
            p.jumping = true;
            p.jumpStart = p.y;
        }
    } else {
        if (onGround && p.vy > 0 && p.acy === 0) {
            //p.y = p.jumpStart;
            p.jumping = false;
            p.y = Math.floor(p.y);
            // TODO: need to figure out if still on "same" platform
            // (eg, should we move the cursor - don't want to move
            // to a new word if you're just jumping while running
            // over the same sentance)
            if (p.y !== cursor.y - 1) {
                cursor.x = Math.floor(p.x + 0.5);
                cursor.y = Math.floor(p.y + 1);
                typing.fwd = null;
            }
        }
    }
    if (p.y > state.level.h - 2) {
        p.dead = true;
    }
};
