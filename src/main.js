import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { update_player } from "./player.js";
import { mk_typing_state, update_typing } from "./typing.js";
import { update_camera } from "./camera.js";
import { mk_pickup, init_pickups, pickup_collisions } from "./pickup.js";
import { mk_trigger, trigger_collisions } from "./trigger.js";
import { update_physics } from "./physics.js";
import { mk_particles, update_particles } from "./particles.js";
import { mk_level, load_level } from "./level.js";
import { mk_state } from "./state.js";
import { assets_load } from "./assets.js";

const update = (state, keys) => {
    const { player: p, cursor, particles, tw, th } = state;

    const oldx = cursor.x;
    const res = update_typing(state, keys);
    if (res === "fwd") {
        particles.push(...mk_particles(oldx * tw, cursor.y * th + 5));
    }
    update_player(state, keys);
    update_physics(state);
    update_particles(particles);

    // And pickups?
    const picked_up = pickup_collisions(
        { x: p.x * tw, y: p.y * th },
        state.entities,
    );
    if (picked_up.length) {
        state.flash = 4;
        state.entities = state.entities.filter((e) => !picked_up.includes(e));
    }

    // Check triggers
    trigger_collisions(state.triggers, p, async () => {
        next_level(state);
    });

    if (p.dead) {
        state.cur_level--;
        next_level(state, true);
    }

    update_camera(state.camera, state);
};

const run = (state, renderer, keys) => {
    const loop = (t) => {
        const dt = t - state.t;
        state.t = t;
        state.dt = dt;
        state.ms_acc += dt;
        while (state.ms_acc >= state.ms) {
            state.ms_acc -= state.ms;
            update(state, keys);
        }
        render(renderer, state);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

const next_level = async (state, reset = false) => {
    const { player, cursor, camera, tw, th } = state;

    const txt = reset
        ? state.cur_level_txt
        : await load_level(`lvl0${++state.cur_level}.txt?t=` + Date.now());

    state.level = mk_level(txt);
    state.cur_level_txt = txt;

    const { spawns } = state.level;
    player.x = spawns.player[0];
    player.y = spawns.player[1];
    player.tx = player.x;
    player.ty = player.y;
    player.jumping = false;
    player.dead = false;
    cursor.x = player.x;
    cursor.y = player.y + 1;
    update_camera(camera, state, true);

    state.entities = [];
    spawns.pickups.forEach((p) => {
        state.entities.push(mk_pickup(p[0] * tw, p[1] * th));
    });

    state.triggers = [];
    spawns.triggers.forEach((p) => {
        state.triggers.push(mk_trigger(p.x, p.y, p.type));
    });

    state.typing = mk_typing_state();
};

const init = async (doc) => {
    const renderer = mk_renderer(doc, "#board", await assets_load());
    const { w, h } = renderer;
    const keys = mk_keys(doc);
    const state = mk_state(w, h, keys);

    await next_level(state);

    run(state, renderer, keys);
};

// Let's go.
(() => {
    init(document);
})();
