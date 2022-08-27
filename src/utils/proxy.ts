const IS_PROXY = Symbol("IS_PROXY");

export const toWatchable = (target: Record<any, any>, events?: {onRequest?: () => void, onUpdate?: () => void}) => {
    const handler = {
        get(target: any, key: any) {
            if (key === IS_PROXY) return true;

            const prop = target[key];
            if (typeof prop === "undefined") return;

            if (!prop[IS_PROXY] && typeof prop === "object") {
                target[key] = new Proxy(prop, handler);
            }
            if (events?.onRequest) events.onRequest();
            return target[key];
        },
        set(target: any, key: any, value: any) {
            target[key] = value;
            if (events?.onUpdate) events.onUpdate();
            return true;
        }
    };

    return new Proxy(target, handler);
}