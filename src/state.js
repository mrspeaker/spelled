import { mk_level } from "./level.js";
import { mk_player } from "./player.js";
import { mk_camera } from "./camera.js";
import { mk_cursor } from "./cursor.js";
import { mk_typing_state } from "./typing.js";

export const mk_state = (w, h, keys) => ({
    t: 0,
    last_t: 0,
    ms: 1000 / 60,
    ms_acc: 0,
    dt: 0,
    keys,
    level: mk_level(),
    camera: mk_camera(),
    player: mk_player(55, 40),
    cursor: mk_cursor(55, 41),
    typing: mk_typing_state(),
    entities: [],
    tw: 9,
    th: 17,
    w,
    h,
    flash: 0,
});
