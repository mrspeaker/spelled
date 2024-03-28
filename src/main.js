import { mk_renderer, render } from "./render.js";
import { mk_keys } from "./keys.js";
import { update_player } from "./player.js";
import { mk_typing_state, update_typing } from "./typing.js";
import { update_camera } from "./camera.js";
import { mk_pickup, pickup_collisions } from "./pickup.js";
import { mk_rock, update_rock } from "./rock.js";
import { mk_trigger, trigger_collisions } from "./trigger.js";
import { update_physics } from "./physics.js";
import { mk_particles, update_particles } from "./particles.js";
import { mk_level, load_level } from "./level.js";
import { mk_state } from "./state.js";
import { assets_load } from "./assets.js";

const update = (state, keys, dt) => {
    const { player: p, cursor, particles, tw, th, t } = state;

    if (state.level_state !== "done") {
        const oldx = cursor.x;
        const res = update_typing(state, keys);
        if (res === "fwd") {
            particles.push(...mk_particles(oldx * tw, cursor.y * th + 5));
            if (state.level_state === "init") {
                state.level_state = "typing";
            }
        }
        // Snap to ladder
        if (res === "vert") {
            p.x = cursor.x;
            p.vx = 0;
        }
    }

    if (state.level_state === "typing") {
        state.level_t += dt;
    }

    if (state.level_state === "done") {
        if (state.state_t > 5000) {
            next_level(state);
        }
    } else {
        state.entities.forEach((e) => {
            switch (e.type) {
                case "rock":
                    update_rock(e, state.level);
                    break;
            }
        });

        update_player(state, keys);
        update_physics(state);
    }
    update_particles(particles);

    // And pickups?
    const picked_up = pickup_collisions(
        { x: p.x * tw, y: p.y * th },
        state.entities
    );
    if (picked_up.length) {
        state.entities = state.entities.filter((s) => {
            switch (s.type) {
                case "pickup":
                    state.level_t -= 4 * 1000; // Seconds bonus!
                    state.flash = 4;
                    state.level_picked += 1;
                    break;
                case "rock":
                    state.player.dead = true;
                    break;
            }
        });
    }

    // Check triggers
    trigger_collisions(state.triggers, p, (tr) => {
        if (t - tr.triggered < 100) return;
        tr.triggered = t;

        if (tr.type === "door") {
            if (state.level_state !== "done") {
                state.level_state = "done";
                if (state.level_t < state.highs[state.cur_level]) {
                    state.highs[state.cur_level] = state.level_t;
                }
                state.state_t = 0;
            }
        }

        if (tr.type === "pusher") {
            const sp = 0.3;
            if (tr.dir === "up") {
                p.acy -= sp;
                p.vy = 0; // TODO: hmmm
            }
            if (tr.dir === "down") p.acy += sp;
            if (tr.dir === "left") p.acx -= sp;
            if (tr.dir === "right") p.acx += sp;
            p.jumping = true;
        }
    });
    if (keys.isDown("`")) {
        next_level(state);
        keys.clear("`");
    }

    if (p.dead) {
        next_level(state, true);
    }

    update_camera(state.camera, state);

    state.state_t += dt;
};

const run = (state, renderer, keys) => {
    const loop = (t) => {
        const dt = Math.min(30, t - state.t);
        state.t = t;
        state.dt = dt;
        state.ms_acc += dt;
        while (state.ms_acc >= state.ms) {
            state.ms_acc -= state.ms;
            update(state, keys, state.ms);
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
        : await load_level(
              `lvl0${(++state.cur_level % 3) + 1}.txt?t=` + Date.now()
          );
    state.cur_level = state.cur_level % 3;
    state.level = mk_level(txt);
    state.level_t = 0;
    state.level_state = "init";
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
    state.level_picks = spawns.pickups.length;
    spawns.pickups.forEach((p) => {
        const [x, y, type] = p;
        switch (type) {
            case "pickup":
                state.entities.push(mk_pickup(x * tw, y * th));
                break;
            case "rock":
                state.entities.push(mk_rock(x * tw, y * th));
                break;
        }
    });

    state.triggers = [];
    spawns.triggers.forEach((p) => {
        state.triggers.push(mk_trigger(p));
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
