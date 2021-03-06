(function(root, factory) {
    /* global jQuery */
    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.pointerMock = module.exports = factory(
                require("jquery"),
                require("events/gesture/emitter.gesture"),
                require("events/click"));
        });
    } else {
        root.pointerMock = factory(jQuery, DevExpress.events.GestureEmitter, DevExpress.events.click);
    }
}(window, function($, GestureEmitter, clickEvent, undefined) {

    GestureEmitter.touchBoundary(0);

    return function($element) {

        $element = $($element);

        var _x,
            _y,
            _scrollTop,
            _scrollLeft,
            _clock,
            _shiftKey,
            _pointerType = "mouse",
            _lastEvent;

        var triggerEvent = function(type, args) {
            var event = $.Event(
                $.extend($.Event(type), { timeStamp: _clock }),
                $.extend({
                    timeStamp: _clock,
                    pageX: _x,
                    pageY: _y,
                    which: 1,
                    shiftKey: _shiftKey,
                    target: $element.get(0),
                    pointerType: _pointerType,
                    pointers: []
                },
                    args));

            $(event.delegatedTarget || event.target).trigger(event);

            _lastEvent = event;

            return event;
        };

        return {
            start: function(params) {
                if($.isPlainObject(params)) {
                    _x = params.x;
                    _y = params.y;
                    _scrollTop = params.scrollTop || 0;
                    _scrollLeft = params.scrollLeft || 0;
                    _clock = params.clock || $.now();
                    _shiftKey = params.shiftKey || false;
                    _pointerType = params.pointerType || _pointerType;
                } else {
                    _x = 0;
                    _y = 0;
                    _scrollTop = 0;
                    _scrollLeft = 0;
                    _clock = $.now();
                    _shiftKey = false;
                    _pointerType = params || _pointerType;
                }

                return this;
            },

            down: function(x, y) {
                _x = x || _x;
                _y = y || _y;

                triggerEvent("dxpointerdown", {
                    pointers: [{ pointerId: 1 }]
                });

                return this;
            },

            move: function(x, y) {
                if($.isArray(x)) {
                    this.move.apply(this, x);
                } else {
                    _x += x || 0;
                    _y += y || 0;

                    triggerEvent("dxpointermove", {
                        pointers: [{ pointerId: 1 }]
                    });
                }
                return this;
            },

            up: function() {
                var requestAnimationFrameCallback = function() {};
                if(clickEvent.misc) {
                    clickEvent.misc.requestAnimationFrame = function(callback) { requestAnimationFrameCallback = callback; };
                }

                triggerEvent("dxpointerup");
                requestAnimationFrameCallback();

                this.nativeClick();

                return this;
            },

            cancel: function() {
                triggerEvent("dxpointercancel");

                return this;
            },

            click: function(clickOnly) {
                if(!clickOnly) {
                    this.down();
                    this.up();
                } else {
                    triggerEvent("dxclick");
                }
                return this;
            },

            nativeClick: function() {
                triggerEvent("click");
            },

            wheel: function(d, shiftKey) {
                triggerEvent("dxmousewheel", {
                    delta: d,
                    shiftKey: shiftKey
                });
                triggerEvent("scroll");

                return this;
            },

            scroll: function(x, y) {
                _scrollLeft += x;
                _scrollTop += y;

                $element
                    .scrollLeft(_scrollLeft)
                    .scrollTop(_scrollTop);
                return this;
            },

            wait: function(ms) {
                _clock += ms;
                return this;
            },

            swipeStart: function() {
                triggerEvent("dxswipestart");
                return this;
            },

            swipe: function(offset) {
                triggerEvent("dxswipe", {
                    offset: offset
                });

                return this;
            },

            swipeEnd: function(targetOffset, offset) {
                triggerEvent("dxswipeend", {
                    offset: offset,
                    targetOffset: targetOffset
                });

                return this;
            },

            dragStart: function() {
                triggerEvent("dxdragstart");

                return this;
            },

            drag: function(x, y) {
                _x += x || 0;
                _y += y || 0;

                triggerEvent("dxdrag", {
                    offset: {
                        x: _x,
                        y: _y
                    }
                });

                return this;
            },

            dragEnd: function() {
                triggerEvent("dxdragend", {
                    offset: {
                        x: _x,
                        y: _y
                    }
                });

                return this;
            },

            lastEvent: function() {
                return _lastEvent;
            },

            active: function(target) {
                triggerEvent("dxactive", { delegatedTarget: $(target).get(0) });

                return this;
            },

            inactive: function(target) {
                triggerEvent("dxinactive", { delegatedTarget: $(target).get(0) });

                return this;
            }
        };
    };
}));
