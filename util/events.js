import { ScrollView } from './scroll-view';
/**
 * \@name Events
 * \@description
 * Events is a publish-subscribe style event system for sending and responding to application-level
 * events across your app.
 *
 * \@usage
 * ```ts
 * import { Events } from 'ionic-angular';
 *
 * // first page (publish an event when a user is created)
 * constructor(public events: Events) {}
 * createUser(user) {
 *   console.log('User created!')
 *   this.events.publish('user:created', user, Date.now());
 * }
 *
 *
 * // second page (listen for the user created event after function is called)
 * constructor(public events: Events) {
 *   events.subscribe('user:created', (user, time) => {
 *     // user and time are the same arguments passed in `events.publish(user, time)`
 *     console.log('Welcome', user, 'at', time);
 *   });
 * }
 *
 * ```
 * \@demo /docs/demos/src/events/
 */
var Events = (function () {
    function Events() {
        this._channels = [];
    }
    /**
     * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
     *
     * @param {?} topic
     * @param {...?} handlers
     * @return {?}
     */
    Events.prototype.subscribe = function (topic) {
        var _this = this;
        var handlers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            handlers[_i - 1] = arguments[_i];
        }
        if (!this._channels[topic]) {
            this._channels[topic] = [];
        }
        handlers.forEach(function (handler) {
            _this._channels[topic].push(handler);
        });
    };
    /**
     * Unsubscribe from the given topic. Your handler will no longer receive events published to this topic.
     *
     *
     * @param {?} topic
     * @param {?=} handler
     * @return {?} true if a handler was removed
     */
    Events.prototype.unsubscribe = function (topic, handler) {
        if (handler === void 0) { handler = null; }
        var /** @type {?} */ t = this._channels[topic];
        if (!t) {
            // Wasn't found, wasn't removed
            return false;
        }
        if (!handler) {
            // Remove all handlers for this topic
            delete this._channels[topic];
            return true;
        }
        // We need to find and remove a specific handler
        var /** @type {?} */ i = t.indexOf(handler);
        if (i < 0) {
            // Wasn't found, wasn't removed
            return false;
        }
        t.splice(i, 1);
        // If the channel is empty now, remove it from the channel map
        if (!t.length) {
            delete this._channels[topic];
        }
        return true;
    };
    /**
     * Publish an event to the given topic.
     *
     * @param {?} topic
     * @param {...?} args
     * @return {?}
     */
    Events.prototype.publish = function (topic) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var /** @type {?} */ t = this._channels[topic];
        if (!t) {
            return null;
        }
        var /** @type {?} */ responses = [];
        t.forEach(function (handler) {
            responses.push(handler.apply(void 0, args));
        });
        return responses;
    };
    return Events;
}());
export { Events };
function Events_tsickle_Closure_declarations() {
    /** @type {?} */
    Events.prototype._channels;
}
/**
 * @hidden
 * @param {?} plt
 * @param {?} dom
 * @return {?}
 */
export function setupEvents(plt, dom) {
    var /** @type {?} */ events = new Events();
    var /** @type {?} */ win = plt.win();
    var /** @type {?} */ doc = plt.doc();
    // start listening for resizes XXms after the app starts
    plt.timeout(function () {
        win.addEventListener('online', function (ev) {
            events.publish('app:online', ev);
        }, false);
        win.addEventListener('offline', function (ev) {
            events.publish('app:offline', ev);
        }, false);
        win.addEventListener('orientationchange', function (ev) {
            events.publish('app:rotated', ev);
        });
        // When that status taps, we respond
        win.addEventListener('statusTap', function () {
            // TODO: Make this more better
            var /** @type {?} */ el = (doc.elementFromPoint(plt.width() / 2, plt.height() / 2));
            if (!el) {
                return;
            }
            var /** @type {?} */ contentEle = (el.closest('.scroll-content'));
            if (contentEle) {
                var /** @type {?} */ style = contentEle.style;
                var /** @type {?} */ scroll = new ScrollView(null, plt, dom);
                scroll._el = contentEle;
                // We need to stop scrolling if it's happening and scroll up
                style['WebkitBackfaceVisibility'] = 'hidden';
                style['WebkitTransform'] = 'translate3d(0,0,0)';
                dom.write(function () {
                    style.overflow = 'hidden';
                    /**
                     * @return {?}
                     */
                    function finish() {
                        style.overflow = '';
                        style['WebkitBackfaceVisibility'] = '';
                        style['WebkitTransform'] = '';
                    }
                    var /** @type {?} */ didScrollTimeout = plt.timeout(function () {
                        finish();
                    }, 400);
                    scroll.scrollTo(0, 0, 300).then(function () {
                        plt.cancelTimeout(didScrollTimeout);
                        finish();
                    });
                });
            }
        });
    }, 2000);
    return events;
}
/**
 * @hidden
 * @param {?} plt
 * @param {?} dom
 * @return {?}
 */
export function setupProvideEvents(plt, dom) {
    return function () {
        return setupEvents(plt, dom);
    };
}
//# sourceMappingURL=events.js.map