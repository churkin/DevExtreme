export default class ActionButtonBase {
    constructor(name, editor, location = "after", options = {}) {
        this.editor = editor;
        this.instance = null;
        this.location = location;
        this.name = name;
        this.options = options;
    }

    _onRendered(/* instance */) {
        throw "Not implemented";
    }

    dispose() {
        this.instance.dispose ? this.instance.dispose() : this.instance.remove();
    }

    render(instance) {
        this.instance = instance;
        this._onRendered(instance);
        this.update();

        return instance;
    }

    update() {
        throw "Not implemented";
    }
}
