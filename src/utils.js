export const rnd = (min = 0, max = 100) => Math.floor(rndf(min, max));

export const rndf = (min = 0, max = 1) => Math.random() * (max - min) + min;

export const dist = (e1, e2) => {
    const dx = e1.x - e2.x;
    const dy = e1.y - e2.y;
    return Math.sqrt(dx * dx + dy * dy);
};
