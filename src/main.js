import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { update_player } from "./player.js";
import { update_typing } from "./typing.js";
import { update_camera } from "./camera.js";
import { mk_pickup, init_pickups, pickup_collisions } from "./pickup.js";
import { update_physics } from "./physics.js";
import { mk_state } from "./state.js";
import { assets_load } from "./assets.js";

const update = (state) => {
    update_typing(state);
    update_player(state.player);
    update_physics(state);

    const picked_up = pickup_collisions(
        { x: state.player.x * state.tw, y: state.player.y * state.th },
        state.entities,
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
    const state = mk_state(w, h, keys);

    init_pickups(state);
    run(state, renderer);
};

init(document);
