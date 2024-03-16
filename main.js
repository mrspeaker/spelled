import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { mk_level } from "./level.js";
import { mk_player, update_player } from "./player.js";
import { update_typing } from "./typing.js";
import { mk_cursor } from "./cursor.js";
import { mk_camera, update_camera } from "./camera.js";

const renderer = mk_renderer(document, "#board");
const state = {
  keys: mk_keys(document),
  level: mk_level(),
  camera: mk_camera(),
  player: mk_player(103, 55),
  cursor: mk_cursor(103, 56),
  cur_word: null,
  tw: 10,
  th: 12,
  w: renderer.w,
  h: renderer.h,
};

const update = (state) => {
  update_typing(state);
  update_player(state.player);
  update_camera(state.camera, state);
};

const run = () => {
  update(state);
  render(renderer, state);
  requestAnimationFrame(run);
};

run();
