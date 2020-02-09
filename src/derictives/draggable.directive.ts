import { Directive, ElementRef, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';

@Directive({ selector: '[dDraggable]' })
export class DraggableDirective implements OnDestroy {

    @Output() onPutBack = new EventEmitter<{ shift: number, element: HTMLElement }>();
    @Output() onMove = new EventEmitter<{ shift: number, element: HTMLElement }>();

    @Input() disableDrag: boolean = false;

    private element: HTMLElement;
    private originPos: IPosition;

    constructor(
        el: ElementRef<HTMLElement>,
        private renderer: Renderer2
    ) {
        this.element = el.nativeElement;
        this.element.addEventListener('touchstart', this.onTouchStart)
    }

    onTouchStart = (event: TouchEvent) => {
        // skip right click;
        if (event instanceof MouseEvent && event.button === 2)
            return;

        this.originPos = this.getPos(event);
        this.pickUp();
    }

    private pickUp() {
        this.subscribeEvents();
    }

    private putBack = (event: TouchEvent) => {
        if (!this.disableDrag)
            this.onPutBack.emit({
                shift: this.getPos(event).x - this.originPos.x,
                element: this.element
            });
        this.renderer.removeStyle(this.element, 'transform');
        this.renderer.removeStyle(this.element, '-webkit-transform');
        this.renderer.removeStyle(this.element, '-ms-transform');
        this.renderer.removeStyle(this.element, '-moz-transform');
        this.renderer.removeStyle(this.element, '-o-transform');
        this.unsubscribe();

    }

    private subscribeEvents() {
        this.element.addEventListener('touchmove', this.onPointerMove)
        this.element.addEventListener('touchend', this.putBack)
        this.element.addEventListener('touchcancel', this.putBack)
    }

    private onPointerMove = (event: TouchEvent) => {
        if (!this.disableDrag)
            this.moveTo(this.getPos(event));
    }

    private moveTo(pos: IPosition) {
        let shift = pos.x - this.originPos.x;
        if (shift < -4 || shift > 4) {
            this.onMove.emit({ shift, element: this.element });
            let value = `translateX(${shift}px)`;
            this.renderer.setStyle(this.element, 'transform', value);
            this.renderer.setStyle(this.element, '-webkit-transform', value);
            this.renderer.setStyle(this.element, '-ms-transform', value);
            this.renderer.setStyle(this.element, '-moz-transform', value);
            this.renderer.setStyle(this.element, '-o-transform', value);
        }
    }

    private getPos(e: TouchEvent): IPosition {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };

        // workaround for multitouch
        // if (e.changedTouches.length !== 1)
        //     for (let i = 0; i < e.changedTouches.length; i++)
        //         if (e.changedTouches[i].target === this.element)
        //             return { x: e.changedTouches[i].clientX, y: e.changedTouches[i].clientY };
    }

    private unsubscribe() {
        this.element.removeEventListener('touchmove', this.onPointerMove);
        this.element.removeEventListener('touchend', this.putBack);
        this.element.removeEventListener('touchcancel', this.putBack);
    }

    ngOnDestroy(): void {
        this.unsubscribe();
        this.element.removeEventListener('touchstart', this.onTouchStart);
    }

}

interface IPosition {
    x: number;
    y: number;
}