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

const shareImage = async (imgPath, text, actorId, type) => {
    await game.socket.emit('module.ShowArt', {
        imgPath: imgPath,
        text: text,
        actorId: actorId,
        type: type
    })
}

const keyEventHandler = async (event, image, tokenImage, actor) => {
    if (event.shiftKey && event.key == "Z" && game.user.isGM) {
        new MediaDisplayApp(tokenImage, actor.getFlag('ShowArt', 'Author-token'), actor, 'token', game.user.isGM).render(true);
        await shareImage(image, actor.getFlag('ShowArt', 'Author-token'), actor.data._id, 'token');
    }
    else if (event.shiftKey && event.key == "X" && game.user.isGM) {
        new MediaDisplayApp(tokenImage, actor.getFlag('ShowArt', 'Author-main'), actor, 'main', game.user.isGM).render(true);
        await shareImage(tokenImage, actor.getFlag('ShowArt', 'Author-main'), actor.data._id, 'main');
    }
    else if(event.shiftKey && event.key == "V") {
        new MediaDisplayApp(tokenImage, actor.getFlag('ShowArt', 'Author-main'), actor, 'token', game.user.isGM).render(true);
    }
    else if(event.shiftKey && event.key == "B") {
        new MediaDisplayApp(image, actor.getFlag('ShowArt', 'Author-main'), actor, 'main', game.user.isGM).render(true);
    }
}

const prepTokenKeybinding = (token, control) => {
    const doc = $(document);
    doc.off("keydown.showArt");
    if (!control) return;

    const actor = game.actors.get(token.data.actorId);
    const image = actor.data.img;
    const tokenImage = token.data.img;

    doc.on("keydown.showArt", (event) => keyEventHandler(event, image, tokenImage, actor));
}

Hooks.on("ready", () => {
    console.log('setting up socket connection');
    game.socket.on('module.ShowArt', receiveSharedImages);
})

Hooks.on("controlToken", (...args) => prepTokenKeybinding(...args));
Hooks.on("hoverToken", (...args) => prepTokenKeybinding(...args));