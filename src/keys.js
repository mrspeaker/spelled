export const mk_keys = (dom) => {
    const keys = {};
    dom.addEventListener("keydown", ({ key }) => {
        keys[key] = true;
    });
    dom.addEventListener("keyup", ({ key }) => {
        keys[key] = false;
    });

    const isDown = (key) => !!keys[key];
    const clear = (key) => (keys[key] = false);
    return {
        keys,
        isDown,
        clear,
    };
};
