import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { update_player } from "./player.js";
import { update_typing } from "./typing.js";
import { update_camera } from "./camera.js";
import { mk_pickup, init_pickups, pickup_collisions } from "./pickup.js";
import { update_physics } from "./physics.js";
import { load_level } from "./level.js";
import { mk_state } from "./state.js";
import { assets_load } from "./assets.js";

const update = (state) => {
    update_typing(state);
    update_player(state.player);
    update_physics(state);

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

const run = (state, renderer) => {
    const loop = (t) => {
        const dt = t - state.t;
        state.t = t;
        state.dt = dt;
        state.ms_acc += dt;
        while (state.ms_acc >= state.ms) {
            state.ms_acc -= state.ms;
            update(state);
        }
        render(renderer, state);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

const init = async (doc) => {
    const renderer = mk_renderer(doc, "#board", await assets_load());
    const { w, h } = renderer;
    const keys = mk_keys(doc);
    const lvl = await load_level("lvl01.txt");
    const state = mk_state(w, h, keys, lvl);

    const { player, cursor, level, tw, th } = state;
    player.x = level.spawns.player[0];
    player.y = level.spawns.player[1];
    player.tx = player.x;
    player.ty = player.y;
    cursor.x = player.x;
    cursor.y = player.y + 1;
    level.spawns.pickups.forEach((p) => {
        state.entities.push(mk_pickup(p[0] * tw, p[1] * th));
    });

    run(state, renderer);
};

// Let's go.
(() => {
    init(document);
})();
