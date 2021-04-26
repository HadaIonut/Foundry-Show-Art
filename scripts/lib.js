import MediaDisplayApp from "./MediaDisplayApp.js";

const createArtButton = () => {
    let button = document.createElement("div");

    button.classList.add("control-icon");
    button.classList.add("artwork-open");
    button.innerHTML = `<i class="fas fa-image fa-fw"></i>`
    button.title = "Show Art"

    return $(button);
}

const createReceivedMediaDisplayApp = (receivedObject) => {
    new MediaDisplayApp(receivedObject.imgPath, receivedObject.text, game.actors.get(receivedObject.actorId), receivedObject.type, game.user.isGM).render(true);
}

const createNewMediaDisplayApp = (imagePath, actor, type) => {
    new MediaDisplayApp(imagePath, actor.getFlag('ShowArt', `Author-${type}`), actor, type, game.user.isGM).render(true);
}

const receiveSharedImages = (receivedObject) => {
    createReceivedMediaDisplayApp(receivedObject);
}

const shareImage = async (imgPath, text, actorId, type) => {
    await game.socket.emit('module.ShowArt', {
        imgPath: imgPath,
        text: text,
        actorId: actorId,
        type: type
    })
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

const keyEventHandler = async (event, image, tokenImage, actor) => {
    if (event.shiftKey && event.key == "Z" && game.user.isGM) {
        createNewMediaDisplayApp(tokenImage, actor, 'token');
        await shareImage(tokenImage, actor.getFlag('ShowArt', 'Author-token'), actor.data._id, 'token');
    } else if (event.shiftKey && event.key == "X" && game.user.isGM) {
        createNewMediaDisplayApp(image, actor, 'main');
        await shareImage(image, actor.getFlag('ShowArt', 'Author-main'), actor.data._id, 'main');
    } else if (event.shiftKey && event.key == "V") {
        createNewMediaDisplayApp(tokenImage, actor, 'token');
    } else if (event.shiftKey && event.key == "B") {
        createNewMediaDisplayApp(image, actor, 'main');
    }
}

export {prepTokenKeybinding, receiveSharedImages, createArtButton, createNewMediaDisplayApp}