import domAdapter from '../../core/dom_adapter';
import $ from '../../core/renderer';
import { isDefined, isRenderer, isWindow, isNumeric } from './type';
import { getSize, getElementBoxParams } from './size';
import { getWindow } from './window';

const window = getWindow();

export const getWidth = (el) => elementSize(el, 'width');
export const setWidth = (el, value) => elementSize(el, 'width', value);
export const getHeight = (el) => elementSize(el, 'height');
export const setHeight = (el, value) => elementSize(el, 'height', value);
export const getOuterWidth = (el) => elementSize(el, 'outerWidth');
export const setOuterWidth = (el, value) => elementSize(el, 'outerWidth', value);
export const getOuterHeight = (el) => elementSize(el, 'outerHeight');
export const setOuterHeight = (el, value) => elementSize(el, 'outerHeight', value);
export const getInnerWidth = (el) => elementSize(el, 'innerWidth');
export const setInnerWidth = (el, value) => elementSize(el, 'innerWidth', value);
export const getInnerHeight = (el) => elementSize(el, 'innerHeight');
export const setInnerHeight = (el, value) => elementSize(el, 'innerHeight', value);

export const elementSize = function(el, sizeProperty, value) {
    const partialName = sizeProperty.toLowerCase().indexOf('width') >= 0 ? 'Width' : 'Height';
    const propName = partialName.toLowerCase();
    const isOuter = sizeProperty.indexOf('outer') === 0;
    const isInner = sizeProperty.indexOf('inner') === 0;

    if(isWindow(el)) {
        return isOuter ? el['inner' + partialName] : domAdapter.getDocumentElement()['client' + partialName];
    }

    if(domAdapter.isDocument(el)) {
        const documentElement = domAdapter.getDocumentElement();
        const body = domAdapter.getBody();

        return Math.max(
            body['scroll' + partialName],
            body['offset' + partialName],
            documentElement['scroll' + partialName],
            documentElement['offset' + partialName],
            documentElement['client' + partialName]
        );
    }

    if(arguments.length === 2 || typeof value === 'boolean') {
        const include = {
            paddings: isInner || isOuter,
            borders: isOuter,
            margins: value
        };

        return getSize(el, propName, include);
    }

    if(value === undefined || value === null) {
        return null;
    }

    if(isNumeric(value)) {
        const elementStyles = window.getComputedStyle(el);
        const sizeAdjustment = getElementBoxParams(propName, elementStyles);
        const isBorderBox = elementStyles.boxSizing === 'border-box';
        value = Number(value);

        if(isOuter) {
            value -= isBorderBox ? 0 : (sizeAdjustment.border + sizeAdjustment.padding);
        } else if(isInner) {
            value += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding;
        } else if(isBorderBox) {
            value += sizeAdjustment.border + sizeAdjustment.padding;
        }
    }
    value += isNumeric(value) ? 'px' : '';

    domAdapter.setStyle(el, propName, value);

    return null;
};

export const getWindowByElement = (el) => {
    return isWindow(el) ? el : el.defaultView;
};

export const getOffset = (el) => {
    if(el.getClientRects().length) {
        return {
            top: 0,
            left: 0
        };
    }

    const rect = el.getBoundingClientRect();
    const win = getWindowByElement(el.ownerDocument);
    const docElem = el.ownerDocument.documentElement;

    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};

export const resetActiveElement = function() {
    const activeElement = domAdapter.getActiveElement();
    const body = domAdapter.getBody();

    // TODO: remove this hack after msie 11 support stopped
    if(activeElement && activeElement !== body && activeElement.blur) {
        try {
            activeElement.blur();
        } catch(e) {
            body.blur();
        }
    }
};

export const clearSelection = function() {
    const selection = window.getSelection();
    if(!selection) return;
    if(selection.type === 'Caret') return;

    if(selection.empty) {
        selection.empty();
    } else if(selection.removeAllRanges) {
        // T522811
        try {
            selection.removeAllRanges();
        } catch(e) {}
    }
};

export const closestCommonParent = function(startTarget, endTarget) {
    const $startTarget = $(startTarget);
    const $endTarget = $(endTarget);

    if($startTarget[0] === $endTarget[0]) {
        return $startTarget[0];
    }

    const $startParents = $startTarget.parents();
    const $endParents = $endTarget.parents();
    const startingParent = Math.min($startParents.length, $endParents.length);

    for(let i = -startingParent; i < 0; i++) {
        if($startParents.get(i) === $endParents.get(i)) {
            return $startParents.get(i);
        }
    }
};

export const extractTemplateMarkup = function(element) {
    element = $(element);

    const templateTag = element.length && element.filter(function isNotExecutableScript() {
        const $node = $(this);
        return $node.is('script[type]') && ($node.attr('type').indexOf('script') < 0);
    });

    if(templateTag.length) {
        return templateTag.eq(0).html();
    } else {
        element = $('<div>').append(element);
        return element.html();
    }
};

export const normalizeTemplateElement = function(element) {
    let $element = isDefined(element) && (element.nodeType || isRenderer(element))
        ? $(element)
        : $('<div>').html(element).contents();

    if($element.length === 1) {
        if($element.is('script')) {
            $element = normalizeTemplateElement($element.html().trim());
        } else if($element.is('table')) {
            $element = $element.children('tbody').contents();
        }
    }

    return $element;
};

export const clipboardText = function(event, text) {
    const clipboard = (event.originalEvent && event.originalEvent.clipboardData) || window.clipboardData;

    if(arguments.length === 1) {
        return clipboard && clipboard.getData('Text');
    }

    clipboard && clipboard.setData('Text', text);
};

export const contains = function(container, element) {
    if(!element) {
        return false;
    }

    if(domAdapter.isTextNode(element)) {
        element = element.parentNode;
    }

    if(domAdapter.isDocument(container)) {
        return container.documentElement.contains(element);
    }

    if(isWindow(container)) {
        return contains(container.document, element);
    }

    return container.contains
        ? container.contains(element)
        : !!(element.compareDocumentPosition(container) & element.DOCUMENT_POSITION_CONTAINS);
};

export const createTextElementHiddenCopy = function(element, text, options) {
    const elementStyles = window.getComputedStyle($(element).get(0));
    const includePaddings = options && options.includePaddings;

    return $('<div>').text(text).css({
        'fontStyle': elementStyles.fontStyle,
        'fontVariant': elementStyles.fontVariant,
        'fontWeight': elementStyles.fontWeight,
        'fontSize': elementStyles.fontSize,
        'fontFamily': elementStyles.fontFamily,
        'letterSpacing': elementStyles.letterSpacing,
        'border': elementStyles.border,
        'paddingTop': includePaddings ? elementStyles.paddingTop : '',
        'paddingRight': includePaddings ? elementStyles.paddingRight : '',
        'paddingBottom': includePaddings ? elementStyles.paddingBottom : '',
        'paddingLeft': includePaddings ? elementStyles.paddingLeft : '',
        'visibility': 'hidden',
        'whiteSpace': 'pre',
        'position': 'absolute',
        'float': 'left'
    });
};
