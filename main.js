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
  player: mk_player(59, 55),
  cursor: mk_cursor(59, 56),
  cur_word: null,
  tw: 9,
  th: 17,
  w: renderer.w,
  h: renderer.h,
  imgs: null,
};

const load_img = () => {
  const to_load = [["ch", "ch-sheet.png"]];
  const imgs = {};
  return new Promise((res) => {
    const img = new Image();
    img.src = "res/img/" + to_load[0][1];
    img.addEventListener("load", () => {
      imgs[to_load[0][0]] = img;
      res(imgs);
    });
  });
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

const init = async () => {
  const imgs = await load_img();
  state.imgs = imgs;
  run();
};

init();
