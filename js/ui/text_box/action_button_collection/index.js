import $ from "../../../core/renderer";

const TEXTEDITOR_BUTTONS_CONTAINER_CLASS = "dx-texteditor-buttons-container";

export default class ActionButtonCollection {
    constructor(editor, defaultButtonsInfo) {
        this.buttons = [];
        this.defaultButtonsInfo = defaultButtonsInfo;
        this.editor = editor;
    }

    _createButton(buttonName) {
        const defaultButtonInfo = this.defaultButtonsInfo.find(({ name }) => name === buttonName);

        if(!defaultButtonInfo) {
            throw "Can't create custom action button";
        }

        const { Ctor } = defaultButtonInfo;
        const button = new Ctor(this.editor);

        this.buttons.push(button);

        return button;
    }

    _renderButtons(buttons, location) {
        if(!buttons) {
            buttons = this.defaultButtonsInfo.map(({ name }) => name);
        }

        let $container = buttons.length ? $("<div>").addClass(TEXTEDITOR_BUTTONS_CONTAINER_CLASS) : null;

        buttons.forEach(buttonName => {
            let button = this.buttons.find(({ name }) => name === buttonName);

            button = button || this._createButton(buttonName);

            if(button.location === location) {
                button.render($container);
            }
        });

        return $container;
    }

    renderAfterButtons(buttons) {
        return this._renderButtons(buttons, "after");
    }

    renderBeforeButtons(buttons) {
        return this._renderButtons(buttons, "before");
    }

    updateButtons(names) {
        this.buttons.forEach(button => {
            if(!names || names.indexOf(button.name) !== -1) {
                button.update();
            }
        });
    }

    getButton(buttonName) {
        const button = this.buttons.find(({ name }) => name === buttonName);

        if(!button) {
            throw "Cannot find button with this name";
        }

        return button.instance;
    }
}
