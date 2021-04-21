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
    const actor = game.actors.get(title.actorId)

    artButton.on('click', () => {
        new MediaDisplayApp(title.img, actor.getFlag('Show-Art', 'Author-token'), actor, 'token').render(true);
    });
    artButton.on('contextmenu', () => {
        new MediaDisplayApp(actor.data.img, actor.getFlag('Show-Art', 'Author-main'), actor, 'main').render(true);
    })

    html.children('.left').append(artButton);
})
