import LoadIndicator from 'ui/load_indicator';
import renderView from 'ui/widget/render_view';
import support from 'core/utils/support';

const view = LoadIndicator._view;
let el = null;

const render = (data = {}) => {
    const defaultData = {
        useAnimation: true,
        animatingSegmentInner: false,
        animatingSegmentCount: 1,
        indicatorSrc: '',
        width: undefined,
        height: undefined
    };

    renderView(view, el, Object.assign(defaultData, data));
};

QUnit.testStart(() => {
    document.getElementById('qunit-fixture').innerHTML = '<div id="loadIndicator"></div>';
    el = document.getElementById('loadIndicator');
});

QUnit.module('LoadIndicator markup');

QUnit.test('basic markup initialization', assert => {
    render();

    const indicatorWrapper = el.querySelector('.dx-loadindicator-wrapper');
    const indicatorContent = el.querySelector('.dx-loadindicator-content');

    assert.ok(el.className.indexOf('dx-loadindicator') !== -1);
    assert.ok(indicatorWrapper);
    assert.ok(indicatorContent);
});

QUnit.test('LoadIndicator width custom dimensions', assert => {
    render({ width: 75, height: 75 });

    const indicatorWrapper = el.querySelector('.dx-loadindicator-wrapper');

    assert.strictEqual(indicatorWrapper.style.width, '75px');
    assert.strictEqual(indicatorWrapper.style.height, '75px');
    assert.strictEqual(indicatorWrapper.style.fontSize, '75px');
});

QUnit.test('render animated indicator markup', function(assert) {
    render({ animatingSegmentCount: 10 });
    assert.ok(el.querySelector('.dx-loadindicator-icon'));
    assert.ok(el.querySelector('.dx-loadindicator-segment1'));
    assert.ok(el.querySelector('.dx-loadindicator-content'));
    assert.strictEqual(el.querySelectorAll('.dx-loadindicator-segment').length, 11);
});

QUnit.module('Static load indicator', {
    beforeEach: function() {
        this._defaultAnimation = support.animation;
        support.animation = () => false;
    },
    afterEach: function() {
        support.animation = this._defaultAnimation;
    }
});

QUnit.test('basic render', assert => {
    render();

    const indicatorWrapper = el.querySelector('.dx-loadindicator-wrapper');

    assert.ok(indicatorWrapper.className.indexOf('dx-loadindicator-image') !== -1);
    assert.notOk(el.querySelector('.dx-loadindicator-icon'));
    assert.notOk(el.querySelector('.dx-loadindicator-segment'));
    assert.notOk(el.querySelector('.dx-loadindicator-segment1'));
    assert.strictEqual(indicatorWrapper.style.backgroundImage, '');
});

QUnit.test('custom indicator', assert => {
    const getBackgroundImage = () => el.querySelector('.dx-loadindicator-wrapper').style.backgroundImage;
    const isIdenticalUrl = (firstUrl, secondUrl) => {
        let firstName = firstUrl.split('/');
        let secondName = secondUrl.split('/');

        firstName = firstName[firstName.length - 1].replace(')', '').replace('"', '');
        secondName = secondName[secondName.length - 1];

        return firstName === secondName;
    };

    render({ indicatorSrc: '../../testing/content/customLoadIndicator.png' });
    assert.ok(isIdenticalUrl(getBackgroundImage(), '../../testing/content/customLoadIndicator.png'));
});
