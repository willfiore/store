export type UpdateFunction<T> = (currentValue: T) => T;
export type SubscribeFunction<T> = (value: T) => void;
export type UnsubscribeFunction = () => void;

export class Store<T> {
    private initialValue: T;
    private value: T;

    private subscribers: SubscribeFunction<T>[] = [];

    constructor(initialValue: T) {
        this.initialValue = initialValue;
        this.value = initialValue;
    }

    /**
     * Subscribe to changes to the store value.
     */
    subscribe(func: SubscribeFunction<T>): UnsubscribeFunction {
        this.subscribers.push(func);
        func(this.value);

        return () => {
            const idx = this.subscribers.findIndex(f => f === func);
            if (idx === -1) return;

            this.subscribers.splice(idx, 1);
        };
    }

    /**
     * Set the value of the store.
     */
    set(newValue: T) {
        if (this.value !== newValue) {
            this.value = newValue;
            this.notifySubscribers();
        }
    }

    /**
     * Update the value of a store by modifying the existing value.
     */
    update(updateFunction: UpdateFunction<T>) {
        this.set(updateFunction(this.value));
    }

    /**
     * Reset the store back to its initial value.
     */
    reset() {
        this.set(this.initialValue);
    }

    /**
     * Get the store value directly.
     */
    get(): Readonly<T> {
        return this.value;
    }

    private notifySubscribers() {
        for (let i = 0; i < this.subscribers.length; ++i) {
            const subscriber = this.subscribers[i];
            subscriber(this.value);
        }
    }
}
