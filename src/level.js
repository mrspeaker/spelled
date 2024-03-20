export const load_level = (name) => {
    return fetch("res/data/" + name).then((r) => r.text());
};

export const mk_level = (txt) => {
    const raw = txt.split("\n");
    const h = raw.length;
    const w = raw.reduce((ac, el) => (el.length > ac ? el.length : ac), 0);

    const pre_lines = raw.map((l) => l.padEnd(w) + "▓");

    const spawns = {
        player: [0, 0],
        pickups: [],
        doors: [],
    };

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
                spawns.doors.push({ x, y });
                return " ";
            }
            return ch;
        })
    );
    const post_lines = chars.map((l) => l.join(""));

    const indexes = post_lines.map((l) => {
        const words = l.split(" ");
        return words.reduce(
            (ac, el) => {
                const { words, i } = ac;
                const start = i;
                const word = el;
                const len = word.length;
                words.push({
                    word,
                    start,
                    end: start + len,
                });
                return { words, i: start + len + 1 };
            },
            { words: [], i: 0 }
        );
    });

    const get_by_index = (x, y) => {
        const word = indexes[y].words.find(({ end }) => end >= x);
        return word;
    };

    const word_at_xy = (x, y) => {
        const token = get_by_index(x, y);
        if (!token) {
            console.log(x, y, indexes[y].words);
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
        const char_idx = x - token.start;
        return token.word[char_idx] || " ";
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
