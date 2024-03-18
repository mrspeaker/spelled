const set_cur_word = (state) => {
    const { level, cursor } = state;
    state.cur_word = level.word_at_xy(cursor.x, cursor.y);
};

export const update_typing = (state) => {
    const { level, cursor, keys, tw, player } = state;

    if (!state.cur_word) {
        set_cur_word(state);
    }

    const next_word = level.word_at_xy(cursor.x, cursor.y);
    const prev_word = level.word_at_xy(next_word.start - 1, cursor.y);
    const down_word = level.word_at_xy(cursor.x, cursor.y + 1);
    const up_word = level.word_at_xy(cursor.x, cursor.y - 1);

    const next_ch = (next_word.word + " ")[cursor.x - next_word.start];
    const prev_ch = (prev_word.word + " ")[0];
    const down_ch = (down_word.word + " ")[0];
    const up_ch = (up_word.word + " ")[0];

    const checks = [
        next_ch,
        "Backspace",
        prev_ch,
        up_ch !== " " ? up_ch : null,
        down_ch !== " " ? down_ch : null,
        "Enter",
    ];
    const downs = checks.map((ch) => ch && keys.isDown(ch));
    const [isNext, isDel, isPrev, isUp, isDown, isEnter] = downs;

    if (isNext) {
        cursor.x += 1;
        if (next_ch === " ") {
            // Word is "done" - advance player
            player.tx = cursor.x;
        }
    } else if (isPrev) {
        cursor.x = prev_word.start;
        player.tx = cursor.x;
    } else if (isDel) {
        cursor.x -= 1;
        player.tx = cursor.x;
    } else if (isDown) {
        cursor.y += 3;
        player.tx = cursor.x;
        player.ty = cursor.y - 1;
    } else if (isUp) {
        cursor.y -= 3;
        player.tx = cursor.x;
        player.ty = cursor.y - 1;
    } else if (isEnter && !player.jumping) {
        player.acy = -0.2;
        player.jumping = true;
        player.jumpStart = player.y;
    }

    if (!isDel) {
        set_cur_word(state);
    } else {
        // Dodgy back word
        state.cur_word = null;
    }

    // Clear any pressed keys
    downs.forEach((isDown, i) => isDown && keys.clear(checks[i]));
};
