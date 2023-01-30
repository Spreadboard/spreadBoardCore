import EventEmitter from "events";
import { fromEvent, Observable } from "rxjs";

class ObservableVariable<T> extends Observable<T>{

    private state: T | unknown;
    private emitter = new EventEmitter();

    constructor(initialState: T) {
        super(
            (subscriber) => {
                let eventListener = fromEvent(this.emitter, 'change').subscribe(
                    (state: unknown) => {
                        if (subscriber.closed)
                            eventListener.unsubscribe();
                        subscriber.next(state as T);
                    }
                );
            })
        this.state = initialState;
    }

    set(newState: T) { if (this.state != newState) this.emitter.emit('change', this.state = newState) }

    get() { return this.state }

}

export {
    ObservableVariable
}