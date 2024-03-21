export const mk_typing_state = () => ({
    fwd: null,
    back: null,
    up: null,
    down: null,
});

const set_word = (state) => {
    const { level, cursor, typing } = state;
    let word = level.word_at_xy(cursor.x, cursor.y);
    if (!word) {
        console.log("no word", cursor.x, cursor.y);
        // TODO: lol, what. this is for when you land on
        // a space character, go to next word.
        // but obvs not correct (what if no next?)
        word = level.word_at_xy(++cursor.x, cursor.y);
    }
    typing.fwd = word;
    typing.back = level.word_at_xy(word.start - 1, cursor.y);
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

    const ch_num = cursor.x - fwd.start;
    const fwd_ch = (fwd.word + " ")[ch_num];
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
            // Word boundary - don't move fwd if no next word
            if (level.word_at_xy(cursor.x + 1, cursor.y)) {
                cursor.x += 1; // there is a next word
                // Boost?
            }
        } else {
            cursor.x += 1;
            res = "fwd";
        }
    } else if (isDown) {
        cursor.y += 1; // Only "works" as ground is y % 3
    } else if (isUp) {
        cursor.y -= 1; // Only "works" as ground is y % 3
    } else if (isDel) {
        cursor.x -= 1;
        // See if we've gone back a word
        if (cursor.x < fwd.start) {
            if (level.word_at_xy(cursor.x - 1, cursor.y)) {
                cursor.x -= 1; // go back over space
            } else {
                cursor.x += 1; // at platform edge, move fwd
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
