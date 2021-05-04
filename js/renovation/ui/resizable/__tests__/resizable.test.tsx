// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { createRef } from 'react';
import { shallow } from 'enzyme';
import { Resizable, viewFunction } from '../resizable';
// import { ResizableContainer } from '../container';

jest.mock('../utils', () => ({
  getAreaFromObject: jest.fn(() => 'getAreaFromObject util result'),
  getAreaFromElement: jest.fn(() => 'getAreaFromElement util result'),
}));

describe('Resizable', () => {
  describe('View', () => {
    it('should pass restAttributes to the resizable container', () => {
      const resizable = shallow(viewFunction({
        size: {},
        props: {},
        restAttributes: { 'custom-attribute': 'customAttribute' },
      } as any));
      const container = resizable.children().at(0);

      expect(container.props()).toMatchObject({ 'custom-attribute': 'customAttribute' });
    });

    it('should pass size to the resizable container', () => {
      const resizable = shallow(viewFunction({
        size: { width: 10, height: 20 },
        props: {},
      } as any));
      const container = resizable.children().at(0);

      expect(container.props()).toMatchObject({ width: 10, height: 20 });
    });

    it('should pass styles to the resizable container', () => {
      const resizable = shallow(viewFunction({
        size: {},
        styles: 'styles',
        props: {},
      } as any));
      const container = resizable.children().at(0);

      expect(container.props()).toMatchObject({ style: 'styles' });
    });

    it('should pass handles to the resizable container', () => {
      const resizable = shallow(viewFunction({
        size: {},
        handles: ['top', 'left'],
        props: {},
      } as any));
      const container = resizable.children().at(0);

      expect(container.props()).toMatchObject({ handles: ['top', 'left'] });
    });

    it('should pass mainRef to the resizable container', () => {
      const mainRef = {};
      const resizable = shallow(viewFunction({
        size: {},
        props: {},
        mainRef,
      } as any));
      const container = resizable.children().at(0);

      expect(container.props().mainRef).toBe(mainRef);
    });

    it('should pass all necessary properties to the resizable container', () => {
      const resizable = shallow(viewFunction({
        size: {},
        props: { disabled: true, rtlEnabled: true, children: 'children' },
      } as any));
      const container = resizable.children().at(0);

      expect(container.props()).toMatchObject({ disabled: true, rtlEnabled: true, children: 'children' });
    });
  });

  describe('Behavior', () => {
    describe('Effects', () => {
      describe('handleDragEventsEffect', () => {
      });
    });

    describe('Events', () => {
      describe('onResizeStart', () => {
        // it('should be raised by handle event', () => {
        //   const onResizeStart = jest.mock();
        //   const resizable = shallow(viewFunction({
        //     size: {},
        //     props: { onResizeStart },
        //   } as any));
        //   const container = resizable.children().at(0);
        //   const handler = container.props().onResizeStart;

        //   handler(defaultEvent);

        //   expect(onResizeStart).toBeCalledTimes(1);
        //   expect(onResizeStart).toBeCalledWith({
        //     event: defaultEvent,
        //     width: ,
        //     height: ,
        //     handles: ,
        //   });
        // });
        /* it('area-function should have component context', () => {
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
        }); */
      });

      describe('onResize', () => {
      });

      describe('onResizeEnd', () => {
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('styles', () => {
        // it('should exclude width/height from the style attribute', () => {
        //   const resizable = new Resizable({ style: { width: 40, height: 50,
        // backgroundColor: 'Red' } });
        //   expect(resizable.styles).toEqual({ backgroundColor: 'Red' });
        // });
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
