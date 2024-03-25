export const mk_typing_state = () => ({
    fwd: null,
    back: null,
    up: null,
    down: null,
});

const set_word = (state) => {
    const { level, cursor, typing } = state;
    typing.fwd = level.word_at_xy(cursor.x, cursor.y);
    const start = typing.fwd?.start ?? cursor.x;
    typing.back = level.word_at_xy(start - 1, cursor.y);
    typing.down = level.word_at_xy(cursor.x, cursor.y + 1);
    typing.up = level.word_at_xy(cursor.x, cursor.y - 1);
};

export const update_typing = (state, keys) => {
    const { level, cursor, typing } = state;
    // Should only be null on level load. Move this to init
    if (!typing.fwd) {
        set_word(state);
    }
    const { fwd, back, up, down } = typing;

    let res = "";

    const ch_num = cursor.x - fwd?.start ?? 0;
    const fwd_ch = fwd ? (fwd.word + " ")[ch_num] : "";
    const back_ch = back ? (back.word + " ")[0] : "";
    const down_ch = down?.word[0];
    const up_ch = up?.word[0];

    const checks = [fwd_ch, "Backspace", back_ch, up_ch, down_ch];
    const downs = checks.map((ch) => ch && keys.isDown(ch));
    if (!downs.some((d) => !!d)) {
        return res;
    }
    const [isFwd, isDel, isBack, isUp, isDown] = downs;

    if (isFwd) {
        if (cursor.x === fwd.end) {
            // Word boundary
        }
        cursor.x += 1;
        res = "fwd";
    } else if (isDown) {
        cursor.y += 1;
        res = "vert";
    } else if (isUp) {
        cursor.y -= 1;
        res = "vert";
    } else if (isDel) {
        if (fwd) {
            cursor.x -= 1;
            if (cursor.x < fwd.start) {
                // Word boundary
            }
        }
    }

    // Restrict cursor to level
    if (cursor.x < 0) cursor.x = 0;
    if (cursor.x > level.w - 2) cursor.x = level.w - 2;

    set_word(state);

    // Clear any pressed keys
    downs.forEach((isDown, i) => isDown && keys.clear(checks[i]));

    return res;
};
