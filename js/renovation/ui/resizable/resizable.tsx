import {
  Component,
  ComponentBindings,
  Event,
  JSXComponent,
  OneWay,
  TwoWay,
  ForwardRef,
  Slot,
  RefObject,
} from '@devextreme-generator/declarations';
import type {
  Area, AreaObject, MovingSides, AreaProp, ResizeActionArgs, Handle,
} from './common/types.d';
import { fitIntoRange } from '../../../core/utils/math';
import {
  getAreaFromObject,
  getAreaFromElement,
  getMovingSides,
  getOffsets,
  getDragOffsets,
} from './utils';
import { getOuterWidth, getOuterHeight } from '../../../core/utils/dom';
import { isFunction, isPlainObject } from '../../../core/utils/type';
import { locate, move } from '../../../animation/translator';
import { normalizeStyleProp, parsePixelValue } from '../../../core/utils/style';
import { extend } from '../../../core/utils/extend';
import { getBoundingRect } from '../../../core/utils/position';
import { ResizableContainer } from './container';

export const viewFunction = (viewModel: Resizable): JSX.Element => {
  const {
    styles, props, mainRef, restAttributes, size, onDragStart, onDragEnd, onDrag, handles,
  } = viewModel;

  // eslint-disable-next-line react/prop-types
  const { children } = props;

  return (

    <ResizableContainer
      handles={handles}
      mainRef={mainRef}
      style={styles}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
      width={size.width}
      height={size.height}
      onResizeStart={onDragStart}
      onResize={onDrag}
      onResizeEnd={onDragEnd}
    >
      { children }
    </ResizableContainer>
  );
};

@ComponentBindings()
export class ResizableProps {
  @OneWay() handles?: string = 'all';

  @Event() onResizeStart?: (e: ResizeActionArgs) => void;

  @Event() onResize?: (e: ResizeActionArgs) => void;

  @Event() onResizeEnd?: (e: ResizeActionArgs) => void;

  @OneWay() area?: AreaProp;

  @OneWay() maxWidth?: number = Infinity;

  @OneWay() maxHeight?: number = Infinity;

  @OneWay() minWidth?: number = 30;

  @OneWay() minHeight?: number = 30;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() rtlEnabled?: boolean;

  @OneWay() disabled?: boolean = false;

  @TwoWay() width?: string | number | (() => (string | number)) = undefined;

  @TwoWay() height?: string | number | (() => (string | number)) = undefined;
}

@Component({
  defaultOptionRules: [],
  jQuery: {
    // component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class Resizable extends JSXComponent(ResizableProps) {
  @ForwardRef() mainRef!: RefObject<HTMLDivElement>;

  private movingSides: MovingSides = {
    top: false, left: false, bottom: false, right: false,
  };

  private elementLocation: { left: number; top: number } = { top: 0, left: 0 };

  private elementSize: { width: number; height: number } = { width: 0, height: 0 };

  public onDragStart(event: Event): undefined {
    // TODO: Implement
    // if ($element.is('.dx-state-disabled, .dx-state-disabled *')) {
    //   e.cancel = true;
    //   return;
    // }
    const { onResizeStart } = this.props;
    const mainEl = this.mainRef.current;
    const { target } = event;
    const elementRect = getBoundingRect(mainEl);

    this.movingSides = getMovingSides(target as HTMLElement);
    this.elementLocation = locate(mainEl);
    this.elementSize = {
      width: elementRect.width,
      height: elementRect.height,
    };

    const area = this.getArea();

    if (area) {
      extend(event, getDragOffsets(
        area,
        /* handleEl */ target as HTMLElement,
        this.props.area,
      ));
    }

    onResizeStart?.({
      event,
      width: this.elementSize.width,
      height: this.elementSize.height,
      handles: this.movingSides,
    });

    return undefined;
  }

  public onDrag(event: Event): undefined {
    const sides = this.movingSides;
    const location = this.elementLocation;
    const size = this.elementSize;
    const { onResize } = this.props;
    const mainEl = this.mainRef.current;
    const { target } = event;
    const offset = getOffsets((event as any).offset, target as HTMLElement);
    const width = size.width + offset.x * (sides.left ? -1 : 1);
    const height = size.height + offset.y * (sides.top ? -1 : 1);

    if (offset.x) { this.props.width = width; }
    if (offset.y) { this.props.height = height; }

    const elementRect = getBoundingRect(mainEl);
    const offsetTop = offset.y - ((elementRect.height || height) - height);
    const offsetLeft = offset.x - ((elementRect.width || width) - width);

    move(mainEl, {
      top: location.top + (sides.top ? offsetTop : 0),
      left: location.left + (sides.left ? offsetLeft : 0),
    });

    onResize?.({
      event,
      width: this.props.width as number || width,
      height: this.props.height as number || height,
      handles: this.movingSides,
    });

    return undefined;
  }

  public onDragEnd(event: Event): undefined {
    const { onResizeEnd } = this.props;
    const mainEl = this.mainRef.current;

    onResizeEnd?.({
      event,
      width: getOuterWidth(mainEl),
      height: getOuterHeight(mainEl),
      handles: this.movingSides,
    });

    return undefined;
  }

  public getArea(): Area | undefined {
    let { area } = this.props;
    const mainEl = this.mainRef.current;

    if (isFunction(area)) {
      area = (area as (() => AreaProp)).bind(this)();
    }

    if (!area) {
      return undefined;
    }

    return isPlainObject(area)
      ? getAreaFromObject(area as AreaObject, mainEl as HTMLElement)
      : getAreaFromElement(area, mainEl as HTMLElement);
  }

  get styles(): { [key: string]: string | number } {
    const styles = { ...(this.restAttributes.style || {}) };
    delete styles.width;
    delete styles.height;
    return styles;
  }

  get size(): { [key: string]: string | number } {
    const {
      width, height, minWidth, maxWidth, minHeight, maxHeight,
    } = this.props;
    const style = this.restAttributes.style || {};
    let computedWidth = typeof width === 'function' ? width() : width;
    let computedHeight = typeof height === 'function' ? height() : height;
    const numberWidth = parsePixelValue(computedWidth);
    const numberHeight = parsePixelValue(computedHeight);

    if (!Number.isNaN(numberWidth)) {
      computedWidth = fitIntoRange(numberWidth, minWidth, maxWidth);
    }

    if (!Number.isNaN(numberHeight)) {
      computedHeight = fitIntoRange(numberHeight, minHeight, maxHeight);
    }

    computedWidth = normalizeStyleProp('width', computedWidth);
    computedHeight = normalizeStyleProp('height', computedHeight);

    return {
      height: computedHeight ?? normalizeStyleProp('height', style.height),
      width: computedWidth ?? normalizeStyleProp('width', style.width),
    };
  }

  get handles(): Handle[] {
    const { handles } = this.props;

    if (handles && handles !== 'none') {
      return handles === 'all'
        ? ['top', 'bottom', 'left', 'right']
        : handles.split(' ') as Handle[];
    }

    return [];
  }
}
