import $ from 'jquery';
import support from 'core/utils/support';

import 'common.css!';
import 'ui/load_indicator';

QUnit.testStart(() => {
    $('#qunit-fixture').html('<div id="loadIndicator"></div>');
});

QUnit.module('indicator with browser animation', {
    beforeEach: function() {
        this._defaultAnimation = support.animation;
        support.animation = () => true;
    },
    afterEach: function() {
        support.animation = this._defaultAnimation;
    }
});

QUnit.test(`visibility of the LoadIndicator with initial value of the 'visible' option equal to 'true'`, assert => {
    const $element = $('#loadIndicator').dxLoadIndicator({ visible: true, viaImage: false });

    assert.ok($element.is(':visible'));
});

QUnit.test('visible changes visibility option', assert => {
    const $indicator = $('#loadIndicator').dxLoadIndicator({ visible: false });
    const loadIndicator = $indicator.dxLoadIndicator('instance');

    assert.ok($indicator.is(':hidden'));

    loadIndicator.option('visible', false);
    assert.ok($indicator.is(':hidden'));

    loadIndicator.option('visible', true);
    assert.ok($indicator.is(':visible'));

    loadIndicator.option('visible', false);
    assert.ok($indicator.is(':hidden'));
});

QUnit.module('Events');

QUnit.test('onContentReady fired after the widget is fully ready', assert => {
    const done = assert.async();

    $('#loadIndicator').dxLoadIndicator({
        visible: true,
        indicatorSrc: '../../testing/content/customLoadIndicator.png',
        onContentReady: ({ element }) => {
            assert.ok(element[0].querySelector('.dx-loadindicator-image').style.backgroundImage);
            assert.ok(element[0].className.indexOf('dx-loadindicator') !== -1);
            done();
        }
    });
});
