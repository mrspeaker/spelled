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

  const next_ch = (next_word.word + " ")[cursor.x - next_word.start];
  const prev_ch = (prev_word.word + " ")[0];

  // type correct letter?
  if (keys.isDown(next_ch)) {
    cursor.x += 1;
    if (next_ch === " ") {
      player.tx = cursor.x;
    }
    keys.clear(next_ch);
    set_cur_word(state);
  } else {
    // typo, or switching target words
    if (keys.isDown(prev_ch)) {
      cursor.x = prev_word.start;
      player.tx = cursor.x;
      keys.clear(prev_ch);
      set_cur_word(state);
    } else if (keys.isDown("Backspace")) {
      cursor.x -= 1;
      keys.clear("Backspace");
      player.tx = cursor.x;
      state.cur_word = null;
    }
  }
};
