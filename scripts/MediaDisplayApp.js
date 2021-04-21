export default class MediaDisplayApp extends FormApplication {
    constructor (imageLocation, text) {
        super();
        this.imageLocation = imageLocation;
        this.text = text;
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

    }
}