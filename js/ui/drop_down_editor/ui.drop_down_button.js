import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import ActionButtonBase from "../text_box/action_button_collection/button.base";
import Button from "../button";

const DROP_DOWN_EDITOR_BUTTON_CLASS = "dx-dropdowneditor-button";
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = "dx-dropdowneditor-button-visible";

export default class ClearButton extends ActionButtonBase {
    constructor(editor) {
        super("dropDown", editor);
    }

    _onRendered(button) {
        const { editor } = this;

        if(editor.option("showDropDownButton") && !editor.option("openOnFieldClick")) {
            button.option("onClick", (e) => editor._openHandler(e));
        }

        eventsEngine.on(button.$element(), "mousedown", (e) => e.preventDefault());
    }

    render($container) {
        const { editor } = this;
        const $button = $("<div>")
            .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS)
            .prependTo($container);

        const instance = editor._createComponent($button, Button, {
            focusStateEnabled: false,
            hoverStateEnabled: false,
            activeStateEnabled: false,
            visible: false,
            useInkRipple: false,
        });

        $button.removeClass("dx-button");

        return super.render(instance);
    }

    update() {
        const { editor } = this;
        const $editor = editor.$element();
        const isVisible = editor.option("showDropDownButton");
        const isReadOnly = editor.option("readOnly");

        this.instance.option("visible", isVisible);
        this.instance.option("disabled", isReadOnly);
        this.instance.option("template", editor._getTemplateByOption("dropDownButtonTemplate"));

        // TODO: remove it
        $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);
    }
}
