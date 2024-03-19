export const mk_typing_state = () => ({
    fwd: null,
    fwd_pos: 0,
    back: null,
    back_pos: 0,
    up: null,
    up_pos: 0,
    down: null,
    down_pos: 0,
});

const set_word = (state) => {
    const { level, cursor, typing } = state;
    const word = level.word_at_xy(cursor.x, cursor.y);
    typing.fwd = word;
    typing.fwd_pos = cursor.x - word.start;

    typing.back = level.word_at_xy(word.start - 1, cursor.y);
    typing.down = level.word_at_xy(cursor.x, cursor.y + 1);
    typing.up = level.word_at_xy(cursor.x, cursor.y - 1);
};

export const update_typing = (state) => {
    const { level, cursor, keys, tw, player, typing } = state;
    // Should only be null on level load. Move this to init
    if (!typing.fwd) {
        set_word(state);
    }
    const { fwd, back, up, down } = typing;

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
        "Enter",
    ];
    const downs = checks.map((ch) => ch && keys.isDown(ch));
    const [isFwd, isDel, isBack, isUp, isDown, isEnter] = downs;

    if (isFwd) {
        cursor.x += 1;
        // Testing: auto advance without space bar
        if (fwd_ch === " " || cursor.x === fwd.end) {
            // Word is "done" - advance player
            cursor.x += 1;
            player.tx = cursor.x;
        } else if (ch_num >= 3) {
            // Testing - auto advance after 4 characters
            cursor.x = fwd.end + 1;
            player.tx = cursor.x;
        }
    } else if (isBack) {
        cursor.x = back.start;
        player.tx = cursor.x;
    } else if (isDown) {
        cursor.y += 3;
        player.tx = cursor.x;
        player.ty = cursor.y - 1;
    } else if (isUp) {
        cursor.y -= 3;
        player.tx = cursor.x;
        player.ty = cursor.y - 1;
    } else if (isDel) {
        cursor.x -= 1;
        // See if we've gone back a word
        if (level.ch_at_xy(cursor.x, cursor.y) === " ") {
            cursor.x -= 1;
        }
        player.tx = cursor.x;
    } else if (isEnter && !player.jumping) {
        player.acy = -0.2;
        player.jumping = true;
        player.jumpStart = player.y;
    }

    set_word(state);

    // Clear any pressed keys
    downs.forEach((isDown, i) => isDown && keys.clear(checks[i]));
};
