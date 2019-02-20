import $ from "../../core/renderer";
import eventsEngine from "../../events/core/events_engine";
import pointerEvents from "../../events/pointer";
import ActionButtonBase from "../text_box/action_button_collection/button.base";
import SpinButton from "./number_box.spin";
import { addNamespace } from "../../events/utils";

const SPIN_CLASS = "dx-numberbox-spin";
const SPIN_CONTAINER_CLASS = "dx-numberbox-spin-container";
const SPIN_TOUCH_FRIENDLY_CLASS = "dx-numberbox-spin-touch-friendly";

export default class SpinButtons extends ActionButtonBase {
    constructor(editor) {
        super("spins", editor);
    }

    _onRendered($spinContainer) {
        const { editor } = this;
        const eventName = addNamespace(pointerEvents.down, editor.NAME);
        const pointerDownAction = editor._createAction(
            (e) => editor._spinButtonsPointerDownHandler(e)
        );

        eventsEngine.off($spinContainer, eventName);
        eventsEngine.on($spinContainer, eventName,
            (e) => pointerDownAction({ event: e })
        );

        SpinButton.getInstance($spinContainer.children().eq(0)).option("onChange",
            (e) => editor._spinUpChangeHandler(e)
        );

        SpinButton.getInstance($spinContainer.children().eq(1)).option("onChange",
            (e) => editor._spinDownChangeHandler(e)
        );
    }

    render($container) {
        const $spinContainer = $("<div>").addClass(SPIN_CONTAINER_CLASS);
        const $spinUp = $("<div>").appendTo($spinContainer);
        const $spinDown = $("<div>").appendTo($spinContainer);

        this.editor._createComponent($spinUp, SpinButton, { direction: "up" });
        this.editor._createComponent($spinDown, SpinButton, { direction: "down" });
        $spinContainer.appendTo($container);

        return super.render($spinContainer);
    }

    update() {
        const { editor } = this;
        const $editor = editor.$element();
        const isVisible = editor.option("showSpinButtons");
        const isDisabled = editor.option("disabled");
        const isTouchFriendly = editor.option("showSpinButtons") && editor.option("useLargeSpinButtons");
        const $spinButtons = this.instance.children();
        const spinUp = SpinButton.getInstance($spinButtons.eq(0));
        const spinDown = SpinButton.getInstance($spinButtons.eq(1));

        spinUp.option("disabled", isDisabled);
        spinDown.option("disabled", isDisabled);
        spinUp.option("visible", isVisible);
        spinDown.option("visible", isVisible);
        $editor.toggleClass(SPIN_TOUCH_FRIENDLY_CLASS, isTouchFriendly);
        $editor.toggleClass(SPIN_CLASS, isVisible);
    }
}
