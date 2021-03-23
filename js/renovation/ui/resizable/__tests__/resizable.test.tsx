/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { Resizable, viewFunction } from '../resizable';
import { getAreaFromObject, getAreaFromElement } from '../utils';

jest.mock('../utils', () => ({
  getAreaFromObject: jest.fn(() => 'getAreaFromObject util result'),
  getAreaFromElement: jest.fn(() => 'getAreaFromElement util result'),
}));

describe('Resizable', () => {
  describe('View', () => {
    it('should render children', () => {
      const resizable = shallow(viewFunction({
        handles: [],
        props: { children: <div id="child" /> },
      } as any) as any);
      expect(resizable.find('#child').exists()).toBe(true);
    });

    it('should spread restAttributes', () => {
      const resizable = shallow(viewFunction({
        props: {},
        handles: [],
        restAttributes: { 'custom-attribute': 'customAttribute' },
      } as any) as any);
      expect(resizable.prop('custom-attribute')).toBe('customAttribute');
    });

    it('should render handles', () => {
      const resizable = shallow(viewFunction({
        handles: ['handle1', 'handle2', 'handle3'],
        props: {},
      } as any) as any);
      const children = resizable.find('div').children();
      expect(children.length).toBe(3);
      expect(children.at(0).is('div.dx-resizable-handle.dx-resizable-handle-handle1')).toBe(true);
      expect(children.at(1).is('div.dx-resizable-handle.dx-resizable-handle-handle2')).toBe(true);
      expect(children.at(2).is('div.dx-resizable-handle.dx-resizable-handle-handle3')).toBe(true);
    });

    // NOTE: add mainRef test
    it('should render main element "style" and "className"', () => {
      const resizable = shallow(viewFunction({
        props: {},
        handles: [],
        styles: { width: 10, height: 10 },
        cssClasses: 'resizable-cusom-class1 resizable-cusom-class2',
        children: null,
      } as any) as any);
      const mainEl = resizable.find('div');

      expect(mainEl.is('.resizable-cusom-class1.resizable-cusom-class2')).toBe(true);
      expect(mainEl.prop('style')).toEqual({ width: 10, height: 10 });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('handleDragEventsEffect', () => {
      });
    });

    describe('Events', () => {
      describe('onResizeStart', () => {
      });

      describe('onResize', () => {
      });

      describe('onResizeEnd', () => {
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('area', () => {
        it('area-function should have component context', () => {
          const area = {
            left: 1, top: 2, right: 3, bottom: 4,
          };
          const resizable = new Resizable({
            area() {
              expect(this).toEqual(resizable);
              return area;
            },
          });

          resizable.mainRef = createRef<HTMLElement>();

          expect(resizable.area).toEqual('getAreaFromObject util result');
          expect(getAreaFromObject).toHaveBeenCalledTimes(1);
          expect(getAreaFromObject).lastCalledWith(area, null);
        });

        it('should calculate area by element', () => {
          const areaEl = Math; // NOTE: Hack for the test to emulate html element
          const resizable = new Resizable({
            area: areaEl,
          });

          resizable.mainRef = createRef<HTMLElement>();

          expect(resizable.area).toEqual('getAreaFromElement util result');
          expect(getAreaFromElement).toHaveBeenCalledTimes(1);
          expect(getAreaFromElement).lastCalledWith(Math, null);
        });
      });

      describe('cssClasses', () => {
        it('should add "disabled" and "rtlEnabled" classes', () => {
          let resizable = new Resizable({});
          expect(resizable.cssClasses).toEqual('dx-resizable');

          resizable = new Resizable({ rtlEnabled: true, disabled: true });
          expect(resizable.cssClasses).toEqual('dx-resizable dx-state-disabled dx-rtl');
        });
      });

      describe('size', () => {
        it('should eval and normolize width/height function properties', () => {
          let resizable = new Resizable({ width: () => 40, height: () => '50px' });
          expect(resizable.size).toEqual({ width: '40px', height: '50px' });

          resizable = new Resizable({ width: () => '10%', height: () => '10pt' });
          expect(resizable.size).toEqual({ width: '10%', height: '10pt' });
        });

        it('should use size value from restAttributes.style by default', () => {
          const resizable = new Resizable({});
          resizable.restAttributes = { style: { width: 10, height: 10, backColor: 'red' } };
          expect(resizable.size).toEqual({ width: '10px', height: '10px' });
        });

        it('should correct width/height to be in valid range', () => {
          let resizable = new Resizable({
            width: -10, height: 0, minWidth: 10, minHeight: 25,
          });
          expect(resizable.size).toEqual({ width: '10px', height: '25px' });

          resizable = new Resizable({
            width: 100, height: 200, maxWidth: 20, maxHeight: 35,
          });
          expect(resizable.size).toEqual({ width: '20px', height: '35px' });

          resizable = new Resizable({
            width: 30, height: 10, maxWidth: 30, maxHeight: 40, minWidth: 0, minHeight: 10,
          });
          expect(resizable.size).toEqual({ width: '30px', height: '10px' });
        });
      });

      describe('handles', () => {
        it('should return correct corners for user defined handles', () => {
          const getHandles = (handles) => new Resizable({ handles }).handles.sort();

          expect(getHandles('none')).toEqual([]);
          expect(getHandles('left')).toEqual(['left'].sort());
          expect(getHandles('left top')).toEqual(['top', 'left'].sort());
          expect(getHandles('all')).toEqual(['top', 'bottom', 'left', 'right'].sort());
        });
      });
    });
  });
});
