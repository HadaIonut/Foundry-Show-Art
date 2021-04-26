import {createArtButton, createNewMediaDisplayApp, prepTokenKeybinding, receiveSharedImages} from "./lib.js"

Hooks.once('init', async () => {
    CONFIG.debug.hooks = true;
});


Hooks.on('renderTokenHUD', (hud, html, title) => {
    const artButton = createArtButton();
    const actor = game.actors.get(title.actorId)

    artButton.on('click', () => {
        createNewMediaDisplayApp(title.img, actor, 'token');
    });
    artButton.on('contextmenu', () => {
        createNewMediaDisplayApp(actor.data.img, actor, 'main');
    })

    html.children('.left').append(artButton);
})

Hooks.on("ready", () => {
    console.log('setting up socket connection');
    game.socket.on('module.ShowArt', receiveSharedImages);
})

Hooks.on("controlToken", (...args) => prepTokenKeybinding(...args));
Hooks.on("hoverToken", (...args) => prepTokenKeybinding(...args));