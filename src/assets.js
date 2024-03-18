export const assets_load = () => {
    const imgs = {};
    const to_load = [
        ["ch", "ch-sheet.png"],
        ["jim", "ElectricBonsai_jimmijamjams.png"],
    ].map(
        (i) =>
            new Promise((res) => {
                const img = new Image();
                img.src = "res/img/" + i[1];
                img.addEventListener("load", () => {
                    imgs[i[0]] = img;
                    res();
                });
            })
    );

    return Promise.all(to_load).then((_) => imgs);
};
