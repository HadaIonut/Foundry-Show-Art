import MediaDisplayApp from "./MediaDisplayApp.js";

Hooks.once('init', async () => {
    CONFIG.debug.hooks = true;
});

Hooks.once('ready', async () => {
});

const createButton = () => {
    let button = document.createElement("div");

    button.classList.add("control-icon");
    button.classList.add("artwork-open");
    button.innerHTML = `<i class="fas fa-image fa-fw"></i>`
    button.title = "Show Art"

    return $(button);
}

Hooks.on('renderTokenHUD', (hud, html, title) => {
    const artButton = createButton();

    artButton.on('click', () => {
        new MediaDisplayApp(title.img, "text").render(true);
    });
    artButton.on('contextmenu', () => {
        new MediaDisplayApp(game.actors.get(title.actorId).data.img, "text2").render(true);
    })

    html.children('.left').append(artButton);
})
