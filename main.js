import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { mk_level } from "./level.js";
import { mk_player, update_player } from "./player.js";
import { update_typing } from "./typing.js";
import { mk_cursor } from "./cursor.js";

const renderer = mk_renderer(document, "#board");
const state = {
  keys: mk_keys(document),
  level: mk_level(),
  player: mk_player(3, 4),
  cursor: mk_cursor(3, 5),
  cur_word: null,
  tw: 15,
  th: 20,
};

const update = (state) => {
  update_typing(state);
  update_player(state.player);
};

const run = () => {
  update(state);
  render(renderer, state);
  requestAnimationFrame(run);
};

run();
