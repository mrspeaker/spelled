export const load_level = (name) => {
    return fetch("res/data/" + name).then((r) => r.text());
};

const mk_spawns = () => ({
    player: [0, 0],
    pickups: [],
    triggers: [],
});

export const mk_level = (txt) => {
    const raw = txt.split("\n");
    const h = raw.length;
    const w = raw.reduce((ac, el) => (el.length > ac ? el.length : ac), 0);

    const pre_lines = raw.map((l) => l.padEnd(w) + "▓");

    const spawns = mk_spawns();

    const chars = pre_lines.map((l, y) =>
        l.split("").map((ch, x) => {
            if (ch === "☺") {
                spawns.player[0] = x;
                spawns.player[1] = y;
                return " ";
            }
            if (ch === "♦") {
                spawns.pickups.push([x, y]);
                return " ";
            }
            if (ch === "╬") {
                spawns.triggers.push({ x, y, type: "door" });
                return " ";
            }
            if (ch === " " && l[x + 1] === " " && l[x - 1] === " ") {
                // return "@";
            }
            return ch;
        }),
    );
    const post_lines = chars.map((l) => l.join(""));

    const indexes = post_lines.map((l) => {
        return l.split("").reduce(
            (ac, el, i) => {
                let { words, cur, state } = ac;
                if (state === "none" && el !== " ") {
                    cur = {
                        word: el,
                        start: i,
                        end: -1,
                    };
                    state = "word";
                } else if (state === "word") {
                    cur.end = i;
                    if (el !== " ") {
                        cur.word += el;
                    } else {
                        words.push(cur);
                        state = "none";
                    }
                }
                return { words, cur, state };
            },
            {
                words: [],
                cur: null,
                state: "none",
            },
        ).words;
    });

    const get_by_index = (x, y) =>
        indexes[y].find(({ start, end }) => start <= x && end >= x);

    const word_at_xy = (x, y) => {
        const token = get_by_index(x, y);
        if (!token) {
            return null;
        }
        const word = token.word;
        const char_idx = x - token.start;
        const start = token.start;
        const end = token.end;
        return {
            word,
            char_idx,
            start,
            end,
            y,
        };
    };

    const ch_at_xy = (x, y) => {
        const token = get_by_index(x, y);
        if (!token) return null;
        const char_idx = x - token.start;
        if (!token.word[char_idx]) {
            console.warn("no ch", token.word, x, y);
        }
        return token.word[char_idx];
    };

    return {
        w,
        h,
        chars,
        word_at_xy,
        ch_at_xy,
        spawns,
    };
};

export const find_free_ground = (level) => {
    return {
        x: (Math.random() * level.w) | 0,
        y: ((Math.random() * (level.h / 3)) | 0) * 3 + 0,
    };
};
