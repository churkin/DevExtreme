import $ from "../../../core/renderer";

export default class ActionButtonBase {
    constructor(name, editor, { location = "after" }) {
        this.instance = null;

        this.$container = null;
        this.$placeMarker = null;
        this.editor = editor;
        this.location = location;
        this.name = name;
    }

    _addPlaceMarker($container) {
        this.$placeMarker = $("<div>").appendTo($container);
    }

    _addToDOM($container, $element) {
        this.$placeMarker ? this.$placeMarker.replaceWith($element) : $element.appendTo($container);
    }

    _createInstance() {
        throw "Not implemented";
    }

    _isRendered() {
        return !!this.instance;
    }

    _isVisible() {
        throw "Not implemented";
    }

    _onRendered(/* instance, $element */) {
        throw "Not implemented";
    }

    _shouldRender() {
        return this._isVisible() && !this._isRendered();
    }

    dispose() {
        const { instance, $placeMarker } = this;

        if(instance) {
            instance.dispose ? instance.dispose() : instance.remove();
            this.instance = null;
        }

        $placeMarker && $placeMarker.remove();
    }

    render($container = this.$container) {
        this.$container = $container;

        if(this._isVisible()) {
            const { instance, $element } = this._createInstance();

            this.instance = instance;
            this._addToDOM($container, $element);
            this._onRendered(instance, $element);
            this.update();
        } else {
            this._addPlaceMarker($container);
        }
    }

    update() {
        if(this._shouldRender()) {
            this.render();
        }
    }
}
