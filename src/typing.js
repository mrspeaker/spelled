export const mk_typing_state = () => ({
    fwd: null,
    back: null,
    up: null,
    down: null,
});

const set_word = (state) => {
    const { level, cursor, typing, player } = state;
    const word = level.word_at_xy(cursor.x, cursor.y);
    typing.fwd = word;
    typing.back = level.word_at_xy(word.start - 1, cursor.y);
    typing.down = level.word_at_xy(player.x, cursor.y + 1);
    typing.up = level.word_at_xy(player.x, cursor.y - 1);
};

export const update_typing = (state) => {
    const { level, cursor, keys, player, typing } = state;
    // Should only be null on level load. Move this to init
    if (!typing.fwd) {
        set_word(state);
    }
    const { fwd, back, up, down } = typing;

    let res = "";

    const ch_num = cursor.x - fwd.start;
    const fwd_ch = (fwd.word + " ")[ch_num];
    const back_ch = (back.word + " ")[0];
    const down_ch = (down.word + " ")[0];
    const up_ch = (up.word + " ")[0];

    const checks = [
        fwd_ch,
        "Backspace",
        back_ch,
        up_ch !== " " ? up_ch : null,
        down_ch !== " " ? down_ch : null,
        " ",
    ];
    const downs = checks.map((ch) => ch && keys.isDown(ch));
    const [isFwd, isDel, isBack, isUp, isDown, isEnter] = downs;

    if (isFwd) {
        cursor.x += 1;
        res = "fwd";
        // Testing: auto advance without space bar
        if (fwd_ch === " " || cursor.x === fwd.end) {
            // Word is "done" - advance over space character
            cursor.x += 1;
        }
    } else if (isBack) {
        cursor.x = back.start;
    } else if (isDown) {
        cursor.y += 3; // Only "works" as ground is y % 3
    } else if (isUp) {
        cursor.y -= 3; // Only "works" as ground is y % 3
    } else if (isDel) {
        cursor.x -= 1;
        // See if we've gone back a word
        if (level.ch_at_xy(cursor.x, cursor.y) === " ") {
            cursor.x -= 1;
        }
    } else if (isEnter && !player.jumping) {
        player.acy = -0.2;
        player.jumping = true;
        player.jumpStart = player.y;
    }

    // Restrict cursor to level
    if (cursor.x < 0) cursor.x = 0;
    if (cursor.x > level.w - 2) cursor.x = level.w - 2;

    set_word(state);

    // Clear any pressed keys
    downs.forEach((isDown, i) => isDown && keys.clear(checks[i]));

    // Set the player target to cursor
    // (todo: move any player stuff from typing.js to
    // ...somewhere else)
    player.tx = cursor.x;
    player.ty = cursor.y - 1;

    return res;
};
