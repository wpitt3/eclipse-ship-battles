
interface TypedStorage<S> {
    get: (a: string) => S;
    set: (a: string, item: S) => void;
    remove: (a: string) => void;
}

interface TypedNamedStorage<S> {
    get: () => S;
    set: (item: S) => void;
    remove: () => void;
}

export class TypedLocalStorage<S> implements TypedStorage<S> {
    private readonly initialState: S;

    constructor(initialState: S) {
        this.initialState = initialState;
    }

    get(name: string): S {
        let state;
        const item = localStorage.getItem(name);
        if (item === null) {
            state = this.initialState;
        } else {
            try {
                state = JSON.parse(item)
            } catch (e) {
                state = this.initialState
            }
        }
        return state;
    }

    set(name: string, item: S) {
        localStorage.setItem(name, JSON.stringify(item))
    }

    remove(name: string) {
        localStorage.removeItem(name)
    }
}

export class TypedNamedLocalStorage<S> implements TypedNamedStorage<S> {
    private readonly store: TypedLocalStorage<S>;

    private readonly name: string;

    constructor(initialState: S, name: string) {
        this.store = new TypedLocalStorage<S>(initialState)
        this.name = name;
    }

    get(): S {
        return this.store.get(this.name);
    }

    set(item: S) {
        this.store.set(this.name, item);
    }

    remove() {
        this.store.remove(this.name)
    }
}