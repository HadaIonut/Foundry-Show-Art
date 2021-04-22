import MediaDisplayApp from "./MediaDisplayApp.js";

Hooks.once('init', async () => {
    CONFIG.debug.hooks = true;
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
        new MediaDisplayApp(title.img, actor.getFlag('ShowArt', 'Author-token'), actor, 'token', game.user.isGM).render(true);
    });
    artButton.on('contextmenu', () => {
        new MediaDisplayApp(actor.data.img, actor.getFlag('ShowArt', 'Author-main'), actor, 'main', game.user.isGM).render(true);
    })

    html.children('.left').append(artButton);
})

const receiveSharedImages = (receivedObject) => {
    console.log('received image');
    new MediaDisplayApp(receivedObject.imgPath, receivedObject.text, game.actors.get(receivedObject.actorId), receivedObject.type, game.user.isGM).render(true);
}

Hooks.on("ready", () => {
    console.log('setting up socket connection');
    game.socket.on('module.ShowArt', receiveSharedImages);
})