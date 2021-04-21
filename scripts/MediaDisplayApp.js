export default class MediaDisplayApp extends FormApplication {
    constructor (imageLocation, text, actor, type) {
        super();
        this.imageLocation = imageLocation;
        this.text = text || '';
        this.actor = actor;
        this.type = type;
    }

    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: "show-art-media-display-app",
            template: "modules/Show-Art/templates/mediaDisplayApp.hbs",
            resizable: true,
            minimizable: false,
            submitOnClose: true,
            width: "fit-content",
            height: "fit-content",
            title: "Media Display",
        }
    }

    getData(options) {
        return {
            imageLocation: this.imageLocation,
            text: this.text
        }
    }

    async _updateObject(event, formData) {
        await this.actor.setFlag('Show-Art', `Author-${this.type}`, formData.author);
        console.log(formData);
    }
}