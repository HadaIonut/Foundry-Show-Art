const shareImage = async (imgPath, text, actorId, type) => {
    await game.socket.emit('module.ShowArt', {
        imgPath: imgPath,
        text: text,
        actorId: actorId,
        type: type
    })
}

export default class MediaDisplayApp extends FormApplication {
    constructor (imageLocation, text, actor, type, playerIsGM) {
        super();
        this.imageLocation = imageLocation;
        this.text = text || '';
        this.actor = actor;
        this.type = type;
        this.playerIsGm = playerIsGM;
        this.currentState = actor.getFlag('ShowArt', 'visibility');
    }

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "show-art-media-display-app",
            template: "modules/ShowArt/templates/mediaDisplayApp.hbs",
            resizable: true,
            minimizable: true,
            submitOnClose: true,
            width: "fit-content",
            height: "fit-content",
            title: "Media Display",
        }
    }

    getData(options) {
        return {
            imageLocation: this.imageLocation,
            text: this.text,
            isGM: this.playerIsGm && (this.currentState === 'hidden' || this.currentState === undefined)
        }
    }

    async _updateObject(event, formData) {
        if (this.playerIsGm) {
            await this.actor.setFlag('ShowArt', `Author-${this.type}`, formData.author);
            await this.actor.setFlag('ShowArt', 'visibility', this.currentState);
        }

    }

    createSaveButton(appendLocation, html) {
        if (!game.user.isGM) return;

        const hideInputButton = $(`<a> <i class="fas fa-save"> Lock</i></a>`);
        hideInputButton.on('click',(event) => {
            const input = html.find('.author-input');
            const selected = html.find('.author-selected');
            input.toggle();
            selected.toggle();
            selected.children('p')[0].innerText = `Author: ${html.find('.author-input').children('input').val()}`;
            this.currentState = this.currentState === 'visible' ? 'hidden' : 'visible';
        });
        appendLocation.before(hideInputButton);
    }

    activateListeners(html) {
        super.activateListeners(html);
        const appendLocation = html.parent().parent().find('.close');

        if (this.playerIsGm) {
            const shareButton = $(`<a> <i class="fas fa-share-square"></i> Share</a>`);
            shareButton.on('click', () => shareImage(this.imageLocation, this.text, this.actor.data._id, this.type));
            appendLocation.before(shareButton);
        }

        this.createSaveButton(appendLocation, html);
    }
}