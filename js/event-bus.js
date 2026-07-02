/*
========================================================
AI Director Assistant
V10 Foundation-R1
Package-1
Release-001

File:
js/event-bus.js

Architecture:
Hybrid EventBus
(Sync + Async)

Author:
AI Director Foundation

Status:
Foundation Stable
========================================================
*/

(function (global) {

    "use strict";

    if (!global.AIDirector) {
        global.AIDirector = {};
    }

    const PRIORITY = {
        CRITICAL: 0,
        HIGH: 1,
        NORMAL: 2,
        LOW: 3,
        BACKGROUND: 4
    };

    const MODE = {
        SYNC: "sync",
        ASYNC: "async"
    };

    class EventBus {

        constructor() {

            this.subscribers = new Map();

            this.onceSubscribers = new Map();

            this.asyncQueue = [];

            this.history = [];

            this.middlewares = [];

            this.eventCounter = 0;

            this.processing = false;
        }

        //------------------------------------------------
        // Subscribe
        //------------------------------------------------

        on(namespace, callback) {

            if (!this.subscribers.has(namespace)) {
                this.subscribers.set(namespace, []);
            }

            this.subscribers
                .get(namespace)
                .push(callback);

            return callback;
        }

        off(namespace, callback) {

            if (!this.subscribers.has(namespace)) {
                return;
            }

            const list =
                this.subscribers.get(namespace);

            const index =
                list.indexOf(callback);

            if (index >= 0) {
                list.splice(index, 1);
            }
        }

        once(namespace, callback) {

            if (!this.onceSubscribers.has(namespace)) {
                this.onceSubscribers.set(namespace, []);
            }

            this.onceSubscribers
                .get(namespace)
                .push(callback);
        }

        //------------------------------------------------
        // Sync Event
        //------------------------------------------------

        emit(
            namespace,
            payload = {},
            source = "system",
            priority = PRIORITY.NORMAL
        ) {

            const event =
                this.createEvent(
                    namespace,
                    payload,
                    source,
                    priority,
                    MODE.SYNC
                );

            this.runMiddlewares(event);

            this.storeHistory(event);

            this.dispatch(event);

            return event;
        }

        //------------------------------------------------
        // Async Event
        //------------------------------------------------

        emitAsync(
            namespace,
            payload = {},
            source = "system",
            priority = PRIORITY.NORMAL
        ) {

            const event =
                this.createEvent(
                    namespace,
                    payload,
                    source,
                    priority,
                    MODE.ASYNC
                );

            this.runMiddlewares(event);

            this.storeHistory(event);

            this.enqueue(event);

            return event;
        }

        //------------------------------------------------
        // Queue
        //------------------------------------------------

        enqueue(event) {

            this.asyncQueue.push(event);

            this.asyncQueue.sort(
                (a, b) =>
                    a.priority - b.priority
            );

            this.processQueue();
        }

        async processQueue() {

            if (this.processing) {
                return;
            }

            this.processing = true;

            while (this.asyncQueue.length > 0) {

                const event =
                    this.asyncQueue.shift();

                await Promise.resolve();

                this.dispatch(event);
            }

            this.processing = false;
        }

        //------------------------------------------------
        // Dispatch
        //------------------------------------------------

        dispatch(event) {

            const start =
                performance.now();

            try {

                const callbacks =
                    this.subscribers.get(
                        event.namespace
                    ) || [];

                callbacks.forEach(
                    callback => callback(event)
                );

                const once =
                    this.onceSubscribers.get(
                        event.namespace
                    ) || [];

                once.forEach(
                    callback => callback(event)
                );

                this.onceSubscribers.delete(
                    event.namespace
                );

                event.success = true;
            }
            catch (error) {

                event.success = false;

                event.error = error;

                console.error(
                    "[EventBus]",
                    event.namespace,
                    error
                );
            }

            event.duration =
                performance.now() - start;
        }

        //------------------------------------------------
        // Middleware
        //------------------------------------------------

        use(callback) {

            this.middlewares.push(callback);
        }

        removeMiddleware(callback) {

            const index =
                this.middlewares.indexOf(
                    callback
                );

            if (index >= 0) {
                this.middlewares.splice(
                    index,
                    1
                );
            }
        }

        runMiddlewares(event) {

            this.middlewares.forEach(
                middleware =>
                    middleware(event)
            );
        }

        //------------------------------------------------
        // History
        //------------------------------------------------

        storeHistory(event) {

            this.history.push(event);

            if (this.history.length > 5000) {
                this.history.shift();
            }
        }

        getHistory() {

            return [...this.history];
        }

        clearHistory() {

            this.history = [];
        }

        //------------------------------------------------
        // Replay
        //------------------------------------------------

        replay(eventId) {

            const event =
                this.history.find(
                    e => e.eventId === eventId
                );

            if (!event) {
                return null;
            }

            return this.emit(
                event.namespace,
                structuredClone(
                    event.payload
                ),
                "replay",
                event.priority
            );
        }

        //------------------------------------------------
        // Snapshot
        //------------------------------------------------

        snapshot() {

            return {
                timestamp:
                    Date.now(),

                history:
                    structuredClone(
                        this.history
                    ),

                queue:
                    structuredClone(
                        this.asyncQueue
                    )
            };
        }

        //------------------------------------------------
        // Create Event
        //------------------------------------------------

        createEvent(
            namespace,
            payload,
            source,
            priority,
            mode
        ) {

            this.eventCounter++;

            return {

                eventId:
                    "EVT-" +
                    String(
                        this.eventCounter
                    ).padStart(
                        8,
                        "0"
                    ),

                namespace,

                timestamp:
                    Date.now(),

                source,

                payload,

                priority,

                mode,

                success: false,

                duration: 0
            };
        }
    }

    global.AIDirector.EventPriority =
        PRIORITY;

    global.AIDirector.EventMode =
        MODE;

    global.AIDirector.EventBus =
        new EventBus();

})(window);
