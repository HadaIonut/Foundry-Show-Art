const shareImage = async (imgPath, text, actorId, type) => {
    await game.socket.emit('module.ShowArt', {
        imgPath: imgPath,
        text: text,
        actorId: actorId,
        type: type
    })
}

export default class MediaDisplayApp extends FormApplication {
    constructor(imageLocation, text, actor, type, playerIsGM) {
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
            id: `show-art-media-display-app-${randomID()}`,
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
            isGM: this.playerIsGm && (this.currentState === 'hidden' || this.currentState === undefined),
            textIsEmpty: !!this.text
        }
    }

    async _updateObject(event, formData) {
        if (this.playerIsGm) {
            await this.actor.setFlag('ShowArt', `Author-${this.type}`, formData.author);
            await this.actor.setFlag('ShowArt', 'visibility', this.currentState);
        }

    }

    createSaveButton(appendLocation, html) {
        if (!game.user.isGM || html.parent().parent().find('.hideInput').length !== 0) return;

        const hideInputButton = $(`<a class = "hideInput"> <i class="fas fa-save"> Lock</i></a>`);
        hideInputButton.on('click', () => {
            const input = html.find('.author-input');
            const selected = html.find('.author-selected');
            input.toggle();
            selected.toggle();
            const displayVal = html.find('.author-input').children('input').val();
            selected.children('p')[0].innerText = displayVal ? `Author: ${displayVal}` : '';
            if (selected.children('p')[0].innerText) selected.children('p').show();
            if (!selected.children('p')[0].innerText) selected.children('p').hide();
            this.currentState = this.currentState === 'visible' ? 'hidden' : 'visible';
        });
        appendLocation.before(hideInputButton);
    }

    activateListeners(html) {
        super.activateListeners(html);
        const appendLocation = html.parent().parent().find('.close');

        if (this.playerIsGm && html.parent().parent().find('.shareButton').length === 0) {
            const shareButton = $(`<a class="shareButton"> <i class="fas fa-share-square"></i> Share</a>`);
            shareButton.on('click', () => shareImage(this.imageLocation, this.text, this.actor.data._id, this.type));
            appendLocation.before(shareButton);
        }

        html.parent().addClass('transparent-window');

        this.createSaveButton(appendLocation, html);
    }
}