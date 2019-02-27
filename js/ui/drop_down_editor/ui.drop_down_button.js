import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import ActionButtonBase from "../text_box/action_button_collection/button.base";
import Button from "../button";

const DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button";
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible";

export default class ClearButton extends ActionButtonBase {
    constructor(editor, options) {
        super("dropDown", editor, options);
    }

    _onRendered(instance) {
        const { editor } = this;

        if(editor.option("showDropDownButton") && !editor.option("openOnFieldClick")) {
            instance.option("onClick", (e) => editor._openHandler(e));
        }

        eventsEngine.on(instance.$element(), "mousedown", (e) => e.preventDefault());
    }

    _createInstance() {
        const { editor } = this;
        const $button = $("<div>")
            .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);

        const instance = editor._createComponent($button, Button, {
            focusStateEnabled: false,
            hoverStateEnabled: false,
            activeStateEnabled: false,
            visible: false,
            useInkRipple: false,
        });

        $button.removeClass("dx-button");

        return {
            $element: $button,
            instance
        };
    }

    _isVisible() {
        const { editor } = this;

        return editor.option("showDropDownButton");
    }

    update() {
        super.update();

        const { editor, instance } = this;
        const isRendered = !!instance;

        if(isRendered) {
            const $editor = editor.$element();
            const isVisible = this._isVisible();
            const isReadOnly = editor.option("readOnly");

            instance.option("visible", isVisible);
            instance.option("disabled", isReadOnly);
            instance.option("template", editor._getTemplateByOption("dropDownButtonTemplate"));

            // TODO: remove it
            $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);
        }
    }
}
