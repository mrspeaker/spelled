export const mk_rock = (x, y, sp = 1) => ({
    x,
    y,
    y0: y,
    w: 1,
    h: 1,
    type: "rock",
    sp,
});

export const update_rock = (r, level, tw, th) => {
    r.y += r.sp * 0.5;
    const ch = level.chars[(r.y / th) | 0][(r.x / tw) | 0];
    if (ch !== " ") {
        r.y = r.y0;
    }
};
