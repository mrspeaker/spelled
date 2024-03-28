export const mk_rock = (x, y) => ({
    x,
    y,
    w: 1,
    h: 1,
    type: "rock",
    sp: 1,
});

export const update_rock = (r, level) => {
    r.y += r.sp;
    if (r.y > 80) r.y -= 80;
    // hit ground?
};
