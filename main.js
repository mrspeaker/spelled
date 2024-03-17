import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { mk_level } from "./level.js";
import { mk_player, update_player } from "./player.js";
import { update_typing } from "./typing.js";
import { mk_cursor } from "./cursor.js";
import { mk_camera, update_camera } from "./camera.js";
import { mk_pickup, init_pickups, pickup_collisions } from "./pickup.js";

const renderer = mk_renderer(document, "#board");
const state = {
  keys: mk_keys(document),
  level: mk_level(),
  camera: mk_camera(),
  player: mk_player(59, 55),
  cursor: mk_cursor(59, 56),
  entities: [],
  cur_word: null,
  tw: 9,
  th: 17,
  w: renderer.w,
  h: renderer.h,
  imgs: null,
  flash: 0,
};

const load_img = () => {
  const imgs = {};
  const to_load = [
    ["ch", "ch-sheet.png"],
    ["jim", "ElectricBonsai_jimmijamjams.png"],
  ].map(
    (i) =>
      new Promise((res) => {
        const img = new Image();
        img.src = "res/img/" + i[1];
        img.addEventListener("load", () => {
          imgs[i[0]] = img;
          res();
        });
      })
  );

  return Promise.all(to_load).then((_) => imgs);
};

const update = (state) => {
  update_typing(state);
  update_player(state.player);

  const picked_up = pickup_collisions(
    { x: state.player.x * state.tw, y: state.player.y * state.th },
    state.entities
  );
  if (picked_up.length) {
    state.flash = 5;
    state.entities = state.entities.filter((e) => !picked_up.includes(e));
  }

  update_camera(state.camera, state);
};

const run = () => {
  update(state);
  render(renderer, state);
  requestAnimationFrame(run);
};

const init = async () => {
  const imgs = await load_img();
  init_pickups(state);
  state.imgs = imgs;
  run();
};

init();
