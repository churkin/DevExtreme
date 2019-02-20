import $ from "../../core/renderer";
import clickEvent from "../../events/click";
import eventsEngine from "../../events/core/events_engine";
import pointerEvents from "../../events/pointer";
import ActionButtonBase from "./action_button_collection/button.base";
import { addNamespace } from "../../events/utils";

const STATE_INVISIBLE_CLASS = "dx-state-invisible";
const TEXTEDITOR_CLEAR_BUTTON_CLASS = "dx-clear-button-area";
const TEXTEDITOR_CLEAR_ICON_CLASS = "dx-icon-clear";
const TEXTEDITOR_ICON_CLASS = "dx-icon";
const TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = "dx-show-clear-button";

export default class ClearButton extends ActionButtonBase {
    constructor(editor) {
        super("clear", editor);
    }

    _onRendered($button) {
        const { editor } = this;
        const editorName = editor.NAME;

        eventsEngine.on($button, addNamespace(pointerEvents.down, editorName),
            (e) => e.pointerType === "mouse" && e.preventDefault()
        );

        eventsEngine.on($button, addNamespace(clickEvent.name, editorName),
            (e) => editor._clearValueHandler(e)
        );
    }

    render($container) {
        const $button = $("<span>")
            .addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS)
            .append($("<span>").addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS))
            .appendTo($container);

        return super.render($button);
    }

    update() {
        const editor = this.editor;
        const $editor = editor.$element();
        const isVisible = editor._isClearButtonVisible();

        this.instance && this.instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);

        // TODO: remove it
        $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
    }
}
