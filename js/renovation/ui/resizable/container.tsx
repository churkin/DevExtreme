import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
  Ref,
  Effect,
  ForwardRef,
  Slot,
  RefObject,
  InternalState,
} from '@devextreme-generator/declarations';
import type {
  Handle, Corner, DragStartEvent, DragEvent,
} from './common/types.d';
import { ResizableHandle } from './handle';
import { combineClasses } from '../../utils/combine_classes';
import { triggerResizeEvent } from '../../../events/visibility_change';
import { EffectReturn } from '../../utils/effect_return';

const getCssClasses = (
  disabled: boolean,
  rtlEnabled: boolean,
  isResizing: boolean,
): string => combineClasses({
  'dx-resizable': true,
  'dx-state-disabled': disabled,
  'dx-rtl': rtlEnabled,
  'dx-resizable-resizing': isResizing,
});

export const viewFunction = (viewModel: ResizableContainer): JSX.Element => {
  const {
    handles, styles, props, cssClasses, restAttributes, mainRef,
    onHandleResizeStart, onHandleResize, onHandleResizeEnd,
  } = viewModel;

  // eslint-disable-next-line react/prop-types
  const { children, disabled } = props;
  // TODO: generator's bug, remove after fix
  restAttributes && delete restAttributes.className;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className={cssClasses} ref={mainRef} style={styles} {...restAttributes}>
      { children }
      { handles.map((handleType) => (
        <ResizableHandle
          onResizeStart={onHandleResizeStart}
          onResize={onHandleResize}
          onResizeEnd={onHandleResizeEnd}
          disabled={disabled}
          direction={handleType}
        />
      ))}
    </div>
  );
};

@ComponentBindings()
export class ResizableContainerProps {
  @ForwardRef() mainRef!: RefObject<HTMLDivElement>;

  @OneWay() handles: Handle[] | Handle = [];

  @OneWay() onResizeStart?: (e: Event) => void;

  @OneWay() onResize?: (e: DragEvent) => void;

  @OneWay() onResizeEnd?: (e: Event) => void;

  @Slot() children?: JSX.Element | (JSX.Element | undefined | false | null)[];

  @OneWay() rtlEnabled?: boolean = false;

  @OneWay() disabled?: boolean = false;

  @OneWay() width?: string | number | (() => (string | number)) = undefined;

  @OneWay() height?: string | number | (() => (string | number)) = undefined;
}

@Component({
  defaultOptionRules: [],
  jQuery: {
    // component: BaseComponent,
    register: true,
  },
  view: viewFunction,
})

export class ResizableContainer extends JSXComponent(ResizableContainerProps) {
  @InternalState() isResizing = false;

  @Ref() mainRef!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' })
  forwardRefInitEffect(): EffectReturn {
    this.props.mainRef.current = this.mainRef.current;
  }

  public onHandleResizeStart(event: DragStartEvent): undefined {
    // TODO: Implement
    // if ($element.is('.dx-state-disabled, .dx-state-disabled *')) {
    //   e.cancel = true;
    //   return;
    // }
    this.isResizing = true;
    this.props.onResizeStart?.(event);
    // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-explicit-any
    event.targetElements = null;
    return undefined;
  }

  public onHandleResize(event: DragEvent): undefined {
    const { onResize } = this.props;
    onResize?.(event);
    triggerResizeEvent(this.mainRef.current);
    return undefined;
  }

  public onHandleResizeEnd(event: Event): undefined {
    this.isResizing = false;
    this.props.onResizeEnd?.(event);
    return undefined;
  }

  get cssClasses(): string {
    const { disabled, rtlEnabled } = this.props;
    return getCssClasses(!!disabled, !!rtlEnabled, this.isResizing);
  }

  get styles(): { [key: string]: string | number } {
    const { width, height } = this.props;
    const style = this.restAttributes.style || {};
    return { ...style, height, width };
  }

  get handles(): (Handle | Corner)[] {
    let { handles } = this.props;

    if (typeof handles === 'string') { handles = [handles]; }

    const result: (Handle | Corner)[] = handles.map((handle) => handle);

    if (result.includes('bottom')) {
      result.includes('right') && result.push('corner-bottom-right');
      result.includes('left') && result.push('corner-bottom-left');
    }

    if (result.includes('top')) {
      result.includes('right') && result.push('corner-top-right');
      result.includes('left') && result.push('corner-top-left');
    }

    return result;
  }
}
