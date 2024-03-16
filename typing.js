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
  console.log(up_word);
  const next_ch = (next_word.word + " ")[cursor.x - next_word.start];
  const prev_ch = (prev_word.word + " ")[0];
  const down_ch = (down_word.word + " ")[0];
  const up_ch = (up_word.word + " ")[0];

  const has_down = down_ch !== " ";
  const has_up = up_ch !== " ";

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
    } else if (has_down && keys.isDown(down_ch)) {
      cursor.y += 3;
      player.tx = cursor.x;
      player.ty = cursor.y - 1;
      set_cur_word(state);
      keys.clear(down_ch);
    } else if (has_up && keys.isDown(up_ch)) {
      cursor.y -= 3;
      player.tx = cursor.x;
      player.ty = cursor.y - 1;
      set_cur_word(state);
      keys.clear(up_ch);
    }
  }
};
