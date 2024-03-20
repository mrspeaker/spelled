import { mk_level } from "./level.js";
import { mk_player } from "./player.js";
import { mk_camera } from "./camera.js";
import { mk_cursor } from "./cursor.js";
import { mk_typing_state } from "./typing.js";

export const mk_state = (w, h) => ({
    t: 0,
    last_t: 0,
    ms: 1000 / 60,
    ms_acc: 0,
    dt: 0,
    level: null,
    cur_level: 0,
    cur_level_txt: null,
    camera: mk_camera(),
    player: mk_player(10, 4),
    cursor: mk_cursor(10, 5),
    typing: mk_typing_state(),
    entities: [],
    triggers: [],
    particles: [],
    tw: 9,
    th: 17,
    w,
    h,
    flash: 0,
});
