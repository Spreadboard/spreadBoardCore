import EventEmitter from "events";
import { combineLatest, fromEvent, map, Observable, ObservedValueOf, ObservedValueTupleFromArray, UnaryFunction } from "rxjs";
import { ReactiveIO } from "../nodes/ReactiveNode";


export function fromObservable<R>(obs: Observable<R>, initialState: R): ObservableVariable<R> {
    let newObs = new ObservableVariable<R>(initialState);

    obs.subscribe(
        (val: R) => {
            newObs.set(val)
        }
    )

    return newObs;
}

export function seperate<R extends { [key: string]: any }>(outs: ObservableVariable<R>): ReactiveIO<R> {
    let rxOut: ReactiveIO<R> = {};

    let staticOuts = outs.get()!;

    Object.keys(staticOuts).forEach(
        (key) => {
            rxOut[key] = fromObservable(outs.pipe(map((out: R) => out[key])), staticOuts[key]);

            console.log(`Seperate ${key} ->`, rxOut[key])
        }
    )

    return rxOut;
}


export class ObservableVariable<T> extends Observable<T>{

    private state: T;
    private emitter = new EventEmitter();

    constructor(initialState: T, readOnly: boolean = false) {
        super(
            (subscriber) => {
                subscriber.next((this.state ?? initialState) as T);
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

    removeListeners() {
        this.emitter.removeAllListeners();
    }

}
