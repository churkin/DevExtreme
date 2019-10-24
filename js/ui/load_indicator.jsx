import $ from '../core/renderer';
import devices from '../core/devices';
import windowUtils from '../core/utils/window';
import support from '../core/utils/support';
import themes from './themes';
import registerComponent from '../core/component_registrator';
import Widget from './widget/ui.widget';
import { extend } from '../core/utils/extend';
import * as Preact from 'preact';

const userAgent = windowUtils.getNavigator().userAgent;

/**
* @name dxLoadIndicator
* @inherits Widget
* @module ui/load_indicator
* @export default
*/
export default class LoadIndicator extends Widget {
    _getViewData() {
        return {
            useAnimation: !this.option("viaImage") && !this.option("indicatorSrc"),
            animatingSegmentInner: this.option("_animatingSegmentInner"),
            animatingSegmentCount: this.option("_animatingSegmentCount"),
            indicatorSrc: this.option("indicatorSrc"),
            width: this.option("width") && this.$element().width(),
            height: this.option("height") && this.$element().height()
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxLoadIndicatorOptions.indicatorSrc
            * @type string
            * @default ""
            */
            indicatorSrc: "",

            /**
            * @name dxLoadIndicatorOptions.disabled
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.activeStateEnabled
            * @hidden
            */
            activeStateEnabled: false,

            /**
             * @name dxLoadIndicatorOptions.hoverStateEnabled
             * @default false
             * @hidden
            */
            hoverStateEnabled: false,

            /**
            * @name dxLoadIndicatorOptions.focusStateEnabled
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.accessKey
            * @hidden
            */

            /**
            * @name dxLoadIndicatorOptions.tabIndex
            * @hidden
            */

            _animatingSegmentCount: 1,
            _animatingSegmentInner: false
        });
    }

    _defaultOptionsRules() {
        const themeName = themes.current();

        return super._defaultOptionsRules().concat([
            {
                device: () => {
                    const realDevice = devices.real();
                    const obsoleteAndroid = realDevice.platform === "android" && !(/chrome/i.test(userAgent));

                    return obsoleteAndroid;
                },
                options: { viaImage: true }
            }, {
                device: () => themes.isIos7(themeName),
                options: { _animatingSegmentCount: 11 }
            }, {
                device: () => themes.isMaterial(themeName),
                options: {
                    _animatingSegmentCount: 2,
                    _animatingSegmentInner: true
                }
            }, {
                device: () => themes.isGeneric(themeName),
                options: { _animatingSegmentCount: 7 }
            }
        ]);
    }
    /**
    * @name dxLoadIndicatorMethods.registerKeyHandler
    * @publicName registerKeyHandler(key, handler)
    * @hidden
    */

    /**
    * @name dxLoadIndicatorMethods.focus
    * @publicName focus()
    * @hidden
    */
}

LoadIndicator._view = (container, { useAnimation, animatingSegmentInner, animatingSegmentCount, indicatorSrc, width, height }) => {
    $(container).addClass('dx-loadindicator');

    const wrapperStyle = {};

    useAnimation = useAnimation && support.animation();

    if(!useAnimation && indicatorSrc) {
        wrapperStyle.backgroundImage = `url(${indicatorSrc})`;
    }

    if(width || height) {
        const minDimension = Math.min(height, width);

        wrapperStyle.height = minDimension;
        wrapperStyle.width = minDimension;
        wrapperStyle.fontSize = minDimension;
    }

    return (
        <div className={`dx-loadindicator-wrapper ${useAnimation ? '' : 'dx-loadindicator-image'}`} style={wrapperStyle}>
            <div className={'dx-loadindicator-content'}>
                {useAnimation && (
                    <div className={'dx-loadindicator-icon'}>
                        { Array(animatingSegmentCount + 1).fill().map((value, index) => (
                            <div className={`dx-loadindicator-segment dx-loadindicator-segment${animatingSegmentCount - index}`}>
                                { animatingSegmentInner && <div className={'dx-loadindicator-segment-inner'}></div> }
                            </div>)
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

registerComponent("dxLoadIndicator", LoadIndicator);

