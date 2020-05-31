webpackJsonp([3,5],{

/***/ 187:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    var checkDuplicate = global[('__zone_symbol__forceDuplicateZoneCheck')] === true;
    if (global['Zone']) {
        // if global['Zone'] already exists (maybe zone.js was already loaded or
        // some other lib also registered a global object named Zone), we may need
        // to throw an error, but sometimes user may not want this error.
        // For example,
        // we have two web pages, page1 includes zone.js, page2 doesn't.
        // and the 1st time user load page1 and page2, everything work fine,
        // but when user load page2 again, error occurs because global['Zone'] already exists.
        // so we add a flag to let user choose whether to throw this error or not.
        // By default, if existing Zone is from zone.js, we will not throw the error.
        if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
            throw new Error('Zone already loaded.');
        }
        else {
            return global['Zone'];
        }
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                if (checkDuplicate) {
                    throw Error('Already loaded patch: ' + name);
                }
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== 'function') {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = undefined;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) { return delegate.hasTask(target, hasTaskState); },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) {
            return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function (delegate, _, target, task) { return delegate.cancelTask(target, task); }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt = zoneSpec &&
                (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId.toString();
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                var nativeThen = nativeMicroTaskQueuePromise[symbolThen];
                if (!nativeThen) {
                    // native Promise is not patchable, we need to use `then` directly
                    // issue 1078
                    nativeThen = nativeMicroTaskQueuePromise['then'];
                }
                nativeThen.call(nativeMicroTaskQueuePromise, drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return []; },
        patchThen: function () { return noop; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === 'function') {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                    [] :
                    [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var e_1, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise = null || resolve(value));
            }
            function onReject(error) {
                promise && (promise = null || reject(error));
            }
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var value = values_1_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var e_2, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            var unresolvedCount = 2;
            var valueIndex = 0;
            var resolvedValues = [];
            var _loop_2 = function (value) {
                if (!isThenable(value)) {
                    value = this_1.resolve(value);
                }
                var curValueIndex = valueIndex;
                value.then(function (value) {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            };
            var this_1 = this;
            try {
                for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                    var value = values_2_1.value;
                    _loop_2(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (values_2_1 && !values_2_1.done && (_a = values_2.return)) _a.call(values_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    if (NativePromise) {
        patchThen(NativePromise);
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', function (global, Zone, api) {
    var fetch = global['fetch'];
    var ZoneAwarePromise = global.Promise;
    var symbolThenPatched = api.symbol('thenPatched');
    var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    var fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
    var OriginalAbortController = global['AbortController'];
    var supportAbort = typeof OriginalAbortController === 'function';
    var abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            var abortController = new OriginalAbortController();
            var signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', function (delegate) { return function (self, args) {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        }; });
    }
    var placeholder = function () { };
    global['fetch'] = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var options = args.length > 1 ? args[1] : null;
        var signal = options && options.signal;
        return new Promise(function (res, rej) {
            var task = Zone.current.scheduleMacroTask('fetch', placeholder, args, function () {
                var fetchPromise;
                var zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(_this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    var ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then(function (resource) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, function (error) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, function () {
                if (!supportAbort) {
                    rej('No AbortController supported, can not cancel fetch');
                    return;
                }
                if (signal && signal.abortController && !signal.aborted &&
                    typeof signal.abortController.abort === 'function' && abortNative) {
                    try {
                        Zone.current[fetchTaskAborting] = true;
                        abortNative.call(signal.abortController);
                    }
                    finally {
                        Zone.current[fetchTaskAborting] = false;
                    }
                }
                else {
                    rej('cancel fetch need a AbortController.signal');
                }
            });
            if (signal && signal.abortController) {
                signal.abortController.task = task;
            }
        });
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result;
    if (isBrowser && target === internalWindow && event.type === 'error') {
        // window.onerror have different signiture
        // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
        // and onerror callback will prevent default when callback return true
        var errorEvent = event;
        result = listener &&
            listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
        if (result === true) {
            event.preventDefault();
        }
    }
    else {
        result = listener && listener.apply(this, arguments);
        if (result != undefined && !result) {
            event.preventDefault();
        }
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    var onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== 'function') {
        return;
    }
    var symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach(function (symbol) {
        var desc = Object.getOwnPropertyDescriptor(src, symbol);
        Object.defineProperty(dest, symbol, {
            get: function () {
                return src[symbol];
            },
            set: function (value) {
                if (desc && (!desc.writable || typeof desc.set !== 'function')) {
                    // if src[symbol] is not writable or not have a setter, just return
                    return;
                }
                src[symbol] = value;
            },
            enumerable: desc ? desc.enumerable : true,
            configurable: desc ? desc.configurable : true
        });
    });
}
var shouldCopySymbolProperties = false;

function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate = null;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
            if (shouldCopySymbolProperties) {
                copySymbolProperties(delegate, proto[name]);
            }
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
            return true;
        }
    }
    catch (error) {
    }
    return false;
}
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        var eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        function checkIsPassive(task) {
            if (!passiveSupported && typeof taskData.options !== 'boolean' &&
                typeof taskData.options !== 'undefined' && taskData.options !== null) {
                // options is a non-null non-undefined object
                // passive is not supported
                // don't pass options as object
                // just pass capture as a boolean
                task.options = !!taskData.options.capture;
                taskData.options = task.options;
            }
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var eventName = arguments[0];
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
                    var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource +
                        (eventNameToString ? eventNameToString(eventName) : eventName);
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                if (!(!passiveSupported && typeof task.options === 'boolean')) {
                    // if not support passive, and we pass an option object
                    // to addEventListener, we should save the options to task
                    task.options = options;
                }
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            var ignoreErrorProperties = isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget_1 = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget_1) {
            patchFilteredProperties(XMLHttpRequestEventTarget_1 && XMLHttpRequestEventTarget_1.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
function patchCustomElements(_global) {
    if ((!isBrowser && !isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
});
Zone.__load_patch('customElements', function (global, Zone, api) {
    registerElementPatch(global);
    patchCustomElements(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    var XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol('xhrErrorBeforeScheduled');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget_1 = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget_1) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget_1.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            var data = task.data;
            var target = data.target;
            target[XHR_SCHEDULED] = false;
            target[XHR_ERROR_BEFORE_SCHEDULED] = false;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        // check whether the xhr has registered onload listener
                        // if that is the case, the task should invoke after all
                        // onload listeners finish.
                        var loadTasks = target['__zone_symbol__loadfalse'];
                        if (loadTasks && loadTasks.length > 0) {
                            var oriInvoke_1 = task.invoke;
                            task.invoke = function () {
                                // need to load the tasks again, because in other
                                // load listener, they may remove themselves
                                var loadTasks = target['__zone_symbol__loadfalse'];
                                for (var i = 0; i < loadTasks.length; i++) {
                                    if (loadTasks[i] === task) {
                                        loadTasks.splice(i, 1);
                                    }
                                }
                                if (!data.aborted && task.state === SCHEDULED) {
                                    oriInvoke_1.call(task);
                                }
                            };
                            loadTasks.push(task);
                        }
                        else {
                            task.invoke();
                        }
                    }
                    else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                        // error occurs when xhr.send()
                        target[XHR_ERROR_BEFORE_SCHEDULED] = true;
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            target[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var fetchTaskAborting = zoneSymbol('fetchTaskAborting');
        var fetchTaskScheduling = zoneSymbol('fetchTaskScheduling');
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (Zone.current[fetchTaskScheduling] === true) {
                // a fetch is scheduling, so we are using xhr to polyfill fetch
                // and because we already schedule macroTask for fetch, we should
                // not schedule a macroTask for xhr again
                return sendNative.apply(self, args);
            }
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = { target: self, url: self[XHR_URL], isPeriodic: false, args: args, aborted: false };
                var task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
                if (self && self[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted &&
                    task.state === SCHEDULED) {
                    // xhr request throw error when send
                    // we should invoke task instead of leaving a scheduled
                    // pending macroTask
                    task.invoke();
                }
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self, args) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            else if (Zone.current[fetchTaskAborting] === true) {
                // the abort is called from fetch polyfill, we need to call native abort of XHR.
                return abortNative.apply(self, args);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),

/***/ 194:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(62);


/***/ }),

/***/ 3:
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular_polyfills_dist_all_js__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angular_polyfills_dist_all_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angular_polyfills_dist_all_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js_dist_zone__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_zone_js_dist_zone___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_zone_js_dist_zone__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following to support `@angular/animation`. */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

//import 'angular-polyfills/dist/classlist.js';
//import 'angular-polyfills/dist/webanimations.js';
//import 'angular-polyfills/dist/shim.js';
//import 'angular-polyfills/dist/intl.js';
/** Evergreen browsers require these. **/
//import 'core-js/es6/reflect';
//import 'core-js/es7/reflect';
/** ALL Firefox browsers require the following to support `@angular/animation`. **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/***************************************************************************************************
 * Zone JS is required by Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// import 'intl';  // Run `npm install --save intl`.
//# sourceMappingURL=polyfills.js.map

/***/ }),

/***/ 80:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_RESULT__;!function(v,z,p){!function(b){function d(c){if(a[c])return a[c].exports;var e=a[c]={exports:{},id:c,loaded:!1};return b[c].call(e.exports,e,e.exports,d),e.loaded=!0,e.exports}var a={};return d.m=b,d.c=a,d.p='',d(0)}([function(b,d,a){a(1);a(50);a(51);a(52);a(54);a(55);a(58);a(59);a(60);a(61);a(62);a(63);a(64);a(65);a(66);a(68);a(70);a(72);a(74);a(77);a(78);a(79);a(83);a(86);a(87);a(88);a(89);a(91);a(92);a(93);a(94);a(95);a(97);a(99);a(100);a(101);a(103);a(104);a(105);a(107);a(108);a(109);a(111);a(112);
a(113);a(114);a(115);a(116);a(117);a(118);a(119);a(120);a(121);a(122);a(123);a(124);a(126);a(130);a(131);a(132);a(133);a(137);a(139);a(140);a(141);a(142);a(143);a(144);a(145);a(146);a(147);a(148);a(149);a(150);a(151);a(152);a(158);a(159);a(161);a(162);a(163);a(167);a(168);a(169);a(170);a(171);a(173);a(174);a(175);a(176);a(179);a(181);a(182);a(183);a(185);a(187);a(189);a(190);a(191);a(193);a(194);a(195);a(196);a(203);a(206);a(207);a(209);a(210);a(211);a(212);a(213);a(214);a(215);a(216);a(217);a(218);
a(219);a(220);a(222);a(223);a(224);a(225);a(226);a(227);a(228);a(229);a(231);a(234);a(235);a(237);a(238);a(239);a(240);a(241);a(242);a(243);a(244);a(245);a(246);a(247);a(249);a(250);a(251);a(252);a(253);a(254);a(255);a(256);a(258);a(259);a(261);a(262);a(263);a(264);a(267);a(268);a(269);a(270);a(271);a(272);a(273);a(274);a(276);a(277);a(278);a(279);a(280);a(281);a(282);a(283);a(284);a(285);a(286);a(287);b.exports=a(288)},function(b,d,a){b=a(2);var c=a(3),e=a(4);d=a(6);var k=a(16),l=a(20).KEY,h=a(5),
g=a(21),m=a(22),f=a(17),n=a(23),q=a(24),r=a(25),u=a(27),t=a(40),x=a(43),y=a(10),w=a(30),C=a(14),D=a(15),U=a(44),E=a(47),ba=a(49),T=a(9),R=a(28),N=ba.f,B=T.f,J=E.f,A=b.Symbol,v=b.JSON,Z=v&&v.stringify,G=n('_hidden'),la=n('toPrimitive'),ia={}.propertyIsEnumerable,ea=g('symbol-registry'),V=g('symbols'),W=g('op-symbols'),P=Object.prototype,g='function'===typeof A,X=b.QObject,S=!X||!X.prototype||!X.prototype.findChild,z=e&&h(function(){return 7!=U(B({},'a',{get:function(){return B(this,'a',{value:7}).a}})).a})?
function(a,b,c){var e=N(P,b);e&&delete P[b];B(a,b,c);e&&a!==P&&B(P,b,e)}:B,H=function(a){var b=V[a]=U(A.prototype);return b._k=a,b},I=g&&'symbol'===typeof A.iterator?function(a){return'symbol'===typeof a}:function(a){return a instanceof A},Q=function(a,b,e){return a===P&&Q(W,b,e),y(a),b=C(b,!0),y(e),c(V,b)?(e.enumerable?(c(a,G)&&a[G][b]&&(a[G][b]=!1),e=U(e,{enumerable:D(0,!1)})):(c(a,G)||B(a,G,D(1,{})),a[G][b]=!0),z(a,b,e)):B(a,b,e)},aa=function(a,b){y(a);for(var c,e=t(b=w(b)),f=0,k=e.length;k>f;)Q(a,
c=e[f++],b[c]);return a},ma=function(a){var b=ia.call(this,a=C(a,!0));return!(this===P&&c(V,a)&&!c(W,a))&&(!(b||!c(this,a)||!c(V,a)||c(this,G)&&this[G][a])||b)},X=function(a,b){if(a=w(a),b=C(b,!0),a!==P||!c(V,b)||c(W,b)){var e=N(a,b);return!e||!c(V,b)||c(a,G)&&a[G][b]||(e.enumerable=!0),e}},ra=function(a){var b;a=J(w(a));for(var e=[],f=0;a.length>f;)c(V,b=a[f++])||b==G||b==l||e.push(b);return e},L=function(a){var b,e=a===P;a=J(e?W:w(a));for(var f=[],k=0;a.length>k;)!c(V,b=a[k++])||e&&!c(P,b)||f.push(V[b]);
return f};g||(A=function(){if(this instanceof A)throw TypeError('Symbol is not a constructor!');var a=f(0<arguments.length?arguments[0]:p),b=function(e){this===P&&b.call(W,e);c(this,G)&&c(this[G],a)&&(this[G][a]=!1);z(this,a,D(1,e))};return e&&S&&z(P,a,{configurable:!0,set:b}),H(a)},k(A.prototype,'toString',function(){return this._k}),ba.f=X,T.f=Q,a(48).f=E.f=ra,a(42).f=ma,a(41).f=L,e&&!a(26)&&k(P,'propertyIsEnumerable',ma,!0),q.f=function(a){return H(n(a))});d(d.G+d.W+d.F*!g,{Symbol:A});k='hasInstance isConcatSpreadable iterator match replace search species split toPrimitive toStringTag unscopables'.split(' ');
for(q=0;k.length>q;)n(k[q++]);k=R(n.store);for(q=0;k.length>q;)r(k[q++]);d(d.S+d.F*!g,'Symbol',{'for':function(a){return c(ea,a+='')?ea[a]:ea[a]=A(a)},keyFor:function(a){if(I(a))return u(ea,a);throw TypeError(a+' is not a symbol!');},useSetter:function(){S=!0},useSimple:function(){S=!1}});d(d.S+d.F*!g,'Object',{create:function(a,b){return b===p?U(a):aa(U(a),b)},defineProperty:Q,defineProperties:aa,getOwnPropertyDescriptor:X,getOwnPropertyNames:ra,getOwnPropertySymbols:L});v&&d(d.S+d.F*(!g||h(function(){var a=
A();return'[null]'!=Z([a])||'{}'!=Z({a:a})||'{}'!=Z(Object(a))})),'JSON',{stringify:function(a){if(a!==p&&!I(a)){for(var b,c,e=[a],f=1;arguments.length>f;)e.push(arguments[f++]);return b=e[1],'function'===typeof b&&(c=b),!c&&x(b)||(b=function(a,b){if(c&&(b=c.call(this,a,b)),!I(b))return b}),e[1]=b,Z.apply(v,e)}}});A.prototype[la]||a(8)(A.prototype,la,A.prototype.valueOf);m(A,'Symbol');m(Math,'Math',!0);m(b.JSON,'JSON',!0)},function(b,d){var a=b.exports='undefined'!==typeof window&&Math==Math?window:
'undefined'!==typeof self&&self.Math==Math?self:Function('return this')();'number'===typeof z&&(z=a)},function(b,d){var a={}.hasOwnProperty;b.exports=function(b,e){return a.call(b,e)}},function(b,d,a){b.exports=!a(5)(function(){return 7!=Object.defineProperty({},'a',{get:function(){return 7}}).a})},function(b,d){b.exports=function(a){try{return!!a()}catch(c){return!0}}},function(b,d,a){var c=a(2),e=a(7),k=a(8),l=a(16),h=a(18),g=function(a,b,n){var f,m,d=a&g.F;m=a&g.G;var t=a&g.S,x=a&g.P,y=a&g.B,t=
m?c:t?c[b]||(c[b]={}):(c[b]||{}).prototype,w=m?e:e[b]||(e[b]={}),C=w.prototype||(w.prototype={});m&&(n=b);for(f in n)m=!d&&t&&t[f]!==p,b=(m?t:n)[f],m=y&&m?h(b,c):x&&'function'===typeof b?h(Function.call,b):b,t&&l(t,f,b,a&g.U),w[f]!=b&&k(w,f,m),x&&C[f]!=b&&(C[f]=b)};c.core=e;g.F=1;g.G=2;g.S=4;g.P=8;g.B=16;g.W=32;g.U=64;g.R=128;b.exports=g},function(b,d){var a=b.exports={version:'2.4.0'};'number'===typeof v&&(v=a)},function(b,d,a){var c=a(9),e=a(15);b.exports=a(4)?function(a,b,h){return c.f(a,b,e(1,
h))}:function(a,b,c){return a[b]=c,a}},function(b,d,a){var c=a(10),e=a(12),k=a(14),l=Object.defineProperty;d.f=a(4)?Object.defineProperty:function(a,b,m){if(c(a),b=k(b,!0),c(m),e)try{return l(a,b,m)}catch(f){}if('get'in m||'set'in m)throw TypeError('Accessors not supported!');return'value'in m&&(a[b]=m.value),a}},function(b,d,a){var c=a(11);b.exports=function(a){if(!c(a))throw TypeError(a+' is not an object!');return a}},function(b,d){b.exports=function(a){return'object'===typeof a?null!==a:'function'===
typeof a}},function(b,d,a){b.exports=!a(4)&&!a(5)(function(){return 7!=Object.defineProperty(a(13)('div'),'a',{get:function(){return 7}}).a})},function(b,d,a){d=a(11);var c=a(2).document,e=d(c)&&d(c.createElement);b.exports=function(a){return e?c.createElement(a):{}}},function(b,d,a){var c=a(11);b.exports=function(a,b){if(!c(a))return a;var e,k;if(b&&'function'===typeof(e=a.toString)&&!c(k=e.call(a))||'function'===typeof(e=a.valueOf)&&!c(k=e.call(a))||!b&&'function'===typeof(e=a.toString)&&!c(k=e.call(a)))return k;
throw TypeError("Can't convert object to primitive value");}},function(b,d){b.exports=function(a,b){return{enumerable:!(1&a),configurable:!(2&a),writable:!(4&a),value:b}}},function(b,d,a){var c=a(2),e=a(8),k=a(3),l=a(17)('src'),h=Function.toString,g=(''+h).split('toString');a(7).inspectSource=function(a){return h.call(a)};(b.exports=function(a,b,h,d){var f='function'===typeof h;f&&(k(h,'name')||e(h,'name',b));a[b]!==h&&(f&&(k(h,l)||e(h,l,a[b]?''+a[b]:g.join(String(b)))),a===c?a[b]=h:d?a[b]?a[b]=h:
e(a,b,h):(delete a[b],e(a,b,h)))})(Function.prototype,'toString',function(){return'function'===typeof this&&this[l]||h.call(this)})},function(b,d){var a=0,c=Math.random();b.exports=function(b){return'Symbol('.concat(b===p?'':b,')_',(++a+c).toString(36))}},function(b,d,a){var c=a(19);b.exports=function(a,b,l){if(c(a),b===p)return a;switch(l){case 1:return function(c){return a.call(b,c)};case 2:return function(c,e){return a.call(b,c,e)};case 3:return function(c,e,k){return a.call(b,c,e,k)}}return function(){return a.apply(b,
arguments)}}},function(b,d){b.exports=function(a){if('function'!==typeof a)throw TypeError(a+' is not a function!');return a}},function(b,d,a){var c=a(17)('meta'),e=a(11),k=a(3),l=a(9).f,h=0,g=Object.isExtensible||function(){return!0},m=!a(5)(function(){return g(Object.preventExtensions({}))}),f=function(a){l(a,c,{value:{i:'O'+ ++h,w:{}}})},n=b.exports={KEY:c,NEED:!1,fastKey:function(a,b){if(!e(a))return'symbol'===typeof a?a:('string'===typeof a?'S':'P')+a;if(!k(a,c)){if(!g(a))return'F';if(!b)return'E';
f(a)}return a[c].i},getWeak:function(a,b){if(!k(a,c)){if(!g(a))return!0;if(!b)return!1;f(a)}return a[c].w},onFreeze:function(a){return m&&n.NEED&&g(a)&&!k(a,c)&&f(a),a}}},function(b,d,a){d=a(2);var c=d['__core-js_shared__']||(d['__core-js_shared__']={});b.exports=function(a){return c[a]||(c[a]={})}},function(b,d,a){var c=a(9).f,e=a(3),k=a(23)('toStringTag');b.exports=function(a,b,g){a&&!e(a=g?a:a.prototype,k)&&c(a,k,{configurable:!0,value:b})}},function(b,d,a){var c=a(21)('wks'),e=a(17),k=a(2).Symbol,
l='function'===typeof k;(b.exports=function(a){return c[a]||(c[a]=l&&k[a]||(l?k:e)('Symbol.'+a))}).store=c},function(b,d,a){d.f=a(23)},function(b,d,a){var c=a(2),e=a(7),k=a(26),l=a(24),h=a(9).f;b.exports=function(a){var b=e.Symbol||(e.Symbol=k?{}:c.Symbol||{});'_'==a.charAt(0)||a in b||h(b,a,{value:l.f(a)})}},function(b,d){b.exports=!1},function(b,d,a){var c=a(28),e=a(30);b.exports=function(a,b){for(var k,l=e(a),m=c(l),f=m.length,n=0;f>n;)if(l[k=m[n++]]===b)return k}},function(b,d,a){var c=a(29),
e=a(39);b.exports=Object.keys||function(a){return c(a,e)}},function(b,d,a){var c=a(3),e=a(30),k=a(34)(!1),l=a(38)('IE_PROTO');b.exports=function(a,b){var h,f=e(a),g=0,d=[];for(h in f)h!=l&&c(f,h)&&d.push(h);for(;b.length>g;)c(f,h=b[g++])&&(~k(d,h)||d.push(h));return d}},function(b,d,a){var c=a(31),e=a(33);b.exports=function(a){return c(e(a))}},function(b,d,a){var c=a(32);b.exports=Object('z').propertyIsEnumerable(0)?Object:function(a){return'String'==c(a)?a.split(''):Object(a)}},function(b,d){var a=
{}.toString;b.exports=function(b){return a.call(b).slice(8,-1)}},function(b,d){b.exports=function(a){if(a==p)throw TypeError("Can't call method on  "+a);return a}},function(b,d,a){var c=a(30),e=a(35),k=a(37);b.exports=function(a){return function(b,l,m){var f;b=c(b);var h=e(b.length);m=k(m,h);if(a&&l!=l)for(;h>m;){if(f=b[m++],f!=f)return!0}else for(;h>m;m++)if((a||m in b)&&b[m]===l)return a||m||0;return!a&&-1}}},function(b,d,a){var c=a(36),e=Math.min;b.exports=function(a){return 0<a?e(c(a),9007199254740991):
0}},function(b,d){var a=Math.ceil,c=Math.floor;b.exports=function(b){return isNaN(b=+b)?0:(0<b?c:a)(b)}},function(b,d,a){var c=a(36),e=Math.max,k=Math.min;b.exports=function(a,b){return a=c(a),0>a?e(a+b,0):k(a,b)}},function(b,d,a){var c=a(21)('keys'),e=a(17);b.exports=function(a){return c[a]||(c[a]=e(a))}},function(b,d){b.exports='constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(' ')},function(b,d,a){var c=a(28),e=a(41),k=a(42);b.exports=function(a){var b=
c(a),l=e.f;if(l)for(var m,l=l(a),f=k.f,n=0;l.length>n;)f.call(a,m=l[n++])&&b.push(m);return b}},function(b,d){d.f=Object.getOwnPropertySymbols},function(b,d){d.f={}.propertyIsEnumerable},function(b,d,a){var c=a(32);b.exports=Array.isArray||function(a){return'Array'==c(a)}},function(b,d,a){var c=a(10),e=a(45),k=a(39),l=a(38)('IE_PROTO'),h=function(){},g=function(){var b;b=a(13)('iframe');var c=k.length;b.style.display='none';a(46).appendChild(b);b.src='javascript:';b=b.contentWindow.document;b.open();
b.write('<script>document.F=Object\x3c/script>');b.close();for(g=b.F;c--;)delete g.prototype[k[c]];return g()};b.exports=Object.create||function(a,b){var f;return null!==a?(h.prototype=c(a),f=new h,h.prototype=null,f[l]=a):f=g(),b===p?f:e(f,b)}},function(b,d,a){var c=a(9),e=a(10),k=a(28);b.exports=a(4)?Object.defineProperties:function(a,b){e(a);for(var h,l=k(b),f=l.length,n=0;f>n;)c.f(a,h=l[n++],b[h]);return a}},function(b,d,a){b.exports=a(2).document&&document.documentElement},function(b,d,a){var c=
a(30),e=a(48).f,k={}.toString,l='object'===typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];b.exports.f=function(a){var b;if(l&&'[object Window]'==k.call(a))try{b=e(a)}catch(m){b=l.slice()}else b=e(c(a));return b}},function(b,d,a){var c=a(29),e=a(39).concat('length','prototype');d.f=Object.getOwnPropertyNames||function(a){return c(a,e)}},function(b,d,a){var c=a(42),e=a(15),k=a(30),l=a(14),h=a(3),g=a(12),m=Object.getOwnPropertyDescriptor;d.f=a(4)?m:function(a,
b){if(a=k(a),b=l(b,!0),g)try{return m(a,b)}catch(q){}if(h(a,b))return e(!c.f.call(a,b),a[b])}},function(b,d,a){b=a(6);b(b.S+b.F*!a(4),'Object',{defineProperty:a(9).f})},function(b,d,a){b=a(6);b(b.S+b.F*!a(4),'Object',{defineProperties:a(45)})},function(b,d,a){var c=a(30),e=a(49).f;a(53)('getOwnPropertyDescriptor',function(){return function(a,b){return e(c(a),b)}})},function(b,d,a){var c=a(6),e=a(7),k=a(5);b.exports=function(a,b){var h=(e.Object||{})[a]||Object[a],l={};l[a]=b(h);c(c.S+c.F*k(function(){h(1)}),
'Object',l)}},function(b,d,a){b=a(6);b(b.S,'Object',{create:a(44)})},function(b,d,a){var c=a(56),e=a(57);a(53)('getPrototypeOf',function(){return function(a){return e(c(a))}})},function(b,d,a){var c=a(33);b.exports=function(a){return Object(c(a))}},function(b,d,a){var c=a(3),e=a(56),k=a(38)('IE_PROTO'),l=Object.prototype;b.exports=Object.getPrototypeOf||function(a){return a=e(a),c(a,k)?a[k]:'function'===typeof a.constructor&&a instanceof a.constructor?a.constructor.prototype:a instanceof Object?l:
null}},function(b,d,a){var c=a(56),e=a(28);a(53)('keys',function(){return function(a){return e(c(a))}})},function(b,d,a){a(53)('getOwnPropertyNames',function(){return a(47).f})},function(b,d,a){var c=a(11),e=a(20).onFreeze;a(53)('freeze',function(a){return function(b){return a&&c(b)?a(e(b)):b}})},function(b,d,a){var c=a(11),e=a(20).onFreeze;a(53)('seal',function(a){return function(b){return a&&c(b)?a(e(b)):b}})},function(b,d,a){var c=a(11),e=a(20).onFreeze;a(53)('preventExtensions',function(a){return function(b){return a&&
c(b)?a(e(b)):b}})},function(b,d,a){var c=a(11);a(53)('isFrozen',function(a){return function(b){return!c(b)||!!a&&a(b)}})},function(b,d,a){var c=a(11);a(53)('isSealed',function(a){return function(b){return!c(b)||!!a&&a(b)}})},function(b,d,a){var c=a(11);a(53)('isExtensible',function(a){return function(b){return!!c(b)&&(!a||a(b))}})},function(b,d,a){b=a(6);b(b.S+b.F,'Object',{assign:a(67)})},function(b,d,a){var c=a(28),e=a(41),k=a(42),l=a(56),h=a(31),g=Object.assign;b.exports=!g||a(5)(function(){var a=
{},b={},c=Symbol();return a[c]=7,'abcdefghijklmnopqrst'.split('').forEach(function(a){b[a]=a}),7!=g({},a)[c]||'abcdefghijklmnopqrst'!=Object.keys(g({},b)).join('')})?function(a,b){for(var f=l(a),g=arguments.length,m=1,d=e.f,t=k.f;g>m;)for(var x,y=h(arguments[m++]),w=d?c(y).concat(d(y)):c(y),C=w.length,D=0;C>D;)t.call(y,x=w[D++])&&(f[x]=y[x]);return f}:g},function(b,d,a){b=a(6);b(b.S,'Object',{is:a(69)})},function(b,d){b.exports=Object.is||function(a,b){return a===b?0!==a||1/a===1/b:a!=a&&b!=b}},function(b,
d,a){b=a(6);b(b.S,'Object',{setPrototypeOf:a(71).set})},function(b,d,a){var c=a(11),e=a(10),k=function(a,b){if(e(a),!c(b)&&null!==b)throw TypeError(b+": can't set as prototype!");};b.exports={set:Object.setPrototypeOf||('__proto__'in{}?function(b,c,e){try{e=a(18)(Function.call,a(49).f(Object.prototype,'__proto__').set,2),e(b,[]),c=!(b instanceof Array)}catch(m){c=!0}return function(a,b){return k(a,b),c?a.__proto__=b:e(a,b),a}}({},!1):p),check:k}},function(b,d,a){var c=a(73);b={};b[a(23)('toStringTag')]=
'z';'[object z]'!=b+''&&a(16)(Object.prototype,'toString',function(){return'[object '+c(this)+']'},!0)},function(b,d,a){var c=a(32),e=a(23)('toStringTag'),k='Arguments'==c(function(){return arguments}());b.exports=function(a){var b,l;if(a===p)b='Undefined';else{var m;if(null===a)m='Null';else{a:{var f=a=Object(a);try{m=f[e];break a}catch(n){}m=void 0}m='string'===typeof(b=m)?b:k?c(a):'Object'==(l=c(a))&&'function'===typeof a.callee?'Arguments':l}b=m}return b}},function(b,d,a){b=a(6);b(b.P,'Function',
{bind:a(75)})},function(b,d,a){var c=a(19),e=a(11),k=a(76),l=[].slice,h={};b.exports=Function.bind||function(a){var b=c(this),f=l.call(arguments,1),g=function(){var c=f.concat(l.call(arguments)),e;if(this instanceof g){e=b;var n=c.length;if(!(n in h)){for(var m=[],d=0;d<n;d++)m[d]='a['+d+']';h[n]=Function('F,a','return new F('+m.join(',')+')')}e=h[n](e,c)}else e=k(b,c,a);return e};return e(b.prototype)&&(g.prototype=b.prototype),g}},function(b,d){b.exports=function(a,b,e){var c=e===p;switch(b.length){case 0:return c?
a():a.call(e);case 1:return c?a(b[0]):a.call(e,b[0]);case 2:return c?a(b[0],b[1]):a.call(e,b[0],b[1]);case 3:return c?a(b[0],b[1],b[2]):a.call(e,b[0],b[1],b[2]);case 4:return c?a(b[0],b[1],b[2],b[3]):a.call(e,b[0],b[1],b[2],b[3])}return a.apply(e,b)}},function(b,d,a){var c=a(9).f,e=a(15),k=a(3);b=Function.prototype;var l=/^\s*function ([^ (]*)/,h=Object.isExtensible||function(){return!0};'name'in b||a(4)&&c(b,'name',{configurable:!0,get:function(){try{var a=(''+this).match(l)[1];return k(this,'name')||
!h(this)||c(this,'name',e(5,a)),a}catch(m){return''}}})},function(b,d,a){var c=a(11),e=a(57);b=a(23)('hasInstance');d=Function.prototype;b in d||a(9).f(d,b,{value:function(a){if('function'!==typeof this||!c(a))return!1;if(!c(this.prototype))return a instanceof this;for(;a=e(a);)if(this.prototype===a)return!0;return!1}})},function(b,d,a){b=a(2);d=a(3);var c=a(32),e=a(80),k=a(14),l=a(5),h=a(48).f,g=a(49).f,m=a(9).f,f=a(81).trim,n=b.Number,q=n,r=n.prototype,u='Number'==c(a(44)(r)),t='trim'in String.prototype,
x=function(a){var b=k(a,!1);if('string'===typeof b&&2<b.length){var b=t?b.trim():f(b,3),c;a=b.charCodeAt(0);if(43===a||45===a){if(c=b.charCodeAt(2),88===c||120===c)return NaN}else if(48===a){switch(b.charCodeAt(1)){case 66:case 98:c=2;a=49;break;case 79:case 111:c=8;a=55;break;default:return+b}for(var e,b=b.slice(2),h=0,l=b.length;h<l;h++)if(e=b.charCodeAt(h),48>e||e>a)return NaN;return parseInt(b,c)}}return+b};if(!n(' 0o1')||!n('0b1')||n('+0x1')){for(var n=function(a){var b=1>arguments.length?0:
a,f=this;return f instanceof n&&(u?l(function(){r.valueOf.call(f)}):'Number'!=c(f))?e(new q(x(b)),f,n):x(b)},y,h=a(4)?h(q):'MAX_VALUE MIN_VALUE NaN NEGATIVE_INFINITY POSITIVE_INFINITY EPSILON isFinite isInteger isNaN isSafeInteger MAX_SAFE_INTEGER MIN_SAFE_INTEGER parseFloat parseInt isInteger'.split(' '),w=0;h.length>w;w++)d(q,y=h[w])&&!d(n,y)&&m(n,y,g(q,y));n.prototype=r;r.constructor=n;a(16)(b,'Number',n)}},function(b,d,a){var c=a(11),e=a(71).set;b.exports=function(a,b,h){var k;b=b.constructor;
return b!==h&&'function'===typeof b&&(k=b.prototype)!==h.prototype&&c(k)&&e&&e(a,k),a}},function(b,d,a){var c=a(6),e=a(33),k=a(5),l=a(82);d='['+l+']';var h=RegExp('^'+d+d+'*'),g=RegExp(d+d+'*$');d=function(a,b,e){var f={},h=k(function(){return!!l[a]()||'​'!='​'[a]()});b=f[a]=h?b(m):l[a];e&&(f[e]=b);c(c.P+c.F*h,'String',f)};var m=d.trim=function(a,b){return a=String(e(a)),1&b&&(a=a.replace(h,'')),2&b&&(a=a.replace(g,'')),a};b.exports=d},function(b,d){b.exports='\t\n\x0B\f\r   ᠎             　\u2028\u2029﻿'},
function(b,d,a){b=a(6);var c=a(36),e=a(84),k=a(85),l=(1).toFixed,h=Math.floor,g=[0,0,0,0,0,0],m=function(a,b){for(var c=-1,e=b;6>++c;)e+=a*g[c],g[c]=e%1E7,e=h(e/1E7)},f=function(a){for(var b=6,c=0;0<=--b;)c+=g[b],g[b]=h(c/a),c=c%a*1E7},n=function(){for(var a=6,b='';0<=--a;)if(''!==b||0===a||0!==g[a])var c=String(g[a]),b=''===b?c:b+k.call('0',7-c.length)+c;return b},q=function(a,b,c){return 0===b?c:1===b%2?q(a,b-1,c*a):q(a*a,b/2,c)};b(b.P+b.F*(!!l&&('0.000'!==(8E-5).toFixed(3)||'1'!==(.9).toFixed(0)||
'1.25'!==(1.255).toFixed(2)||'1000000000000000128'!==(0xde0b6b3a7640080).toFixed(0))||!a(5)(function(){l.call({})})),'Number',{toFixed:function(a){var b,h,l,g=e(this,'Number.toFixed: incorrect invocation!');a=c(a);var d='',r='0';if(0>a||20<a)throw RangeError('Number.toFixed: incorrect invocation!');if(g!=g)return'NaN';if(-1E21>=g||1E21<=g)return String(g);if(0>g&&(d='-',g=-g),1E-21<g){for(var r=0,p=g*q(2,69,1);4096<=p;)r+=12,p/=4096;for(;2<=p;)r+=1,p/=2;if(b=r-69,h=0>b?g*q(2,-b,1):g/q(2,b,1),h*=4503599627370496,
b=52-b,0<b){m(0,h);for(h=a;7<=h;)m(1E7,0),h-=7;m(q(10,h,1),0);for(h=b-1;23<=h;)f(8388608),h-=23;f(1<<h);m(1,1);f(2);r=n()}else m(0,h),m(1<<-b,0),r=n()+k.call('0',a)}return 0<a?(l=r.length,r=d+(l<=a?'0.'+k.call('0',a-l)+r:r.slice(0,l-a)+'.'+r.slice(l-a))):r=d+r,r}})},function(b,d,a){var c=a(32);b.exports=function(a,b){if('number'!==typeof a&&'Number'!=c(a))throw TypeError(b);return+a}},function(b,d,a){var c=a(36),e=a(33);b.exports=function(a){var b=String(e(this)),h='';a=c(a);if(0>a||a==1/0)throw RangeError("Count can't be negative");
for(;0<a;(a>>>=1)&&(b+=b))1&a&&(h+=b);return h}},function(b,d,a){b=a(6);d=a(5);var c=a(84),e=(1).toPrecision;b(b.P+b.F*(d(function(){return'1'!==e.call(1,p)})||!d(function(){e.call({})})),'Number',{toPrecision:function(a){var b=c(this,'Number#toPrecision: incorrect invocation!');return a===p?e.call(b):e.call(b,a)}})},function(b,d,a){b=a(6);b(b.S,'Number',{EPSILON:Math.pow(2,-52)})},function(b,d,a){b=a(6);var c=a(2).isFinite;b(b.S,'Number',{isFinite:function(a){return'number'===typeof a&&c(a)}})},
function(b,d,a){b=a(6);b(b.S,'Number',{isInteger:a(90)})},function(b,d,a){var c=a(11),e=Math.floor;b.exports=function(a){return!c(a)&&isFinite(a)&&e(a)===a}},function(b,d,a){b=a(6);b(b.S,'Number',{isNaN:function(a){return a!=a}})},function(b,d,a){b=a(6);var c=a(90),e=Math.abs;b(b.S,'Number',{isSafeInteger:function(a){return c(a)&&9007199254740991>=e(a)}})},function(b,d,a){b=a(6);b(b.S,'Number',{MAX_SAFE_INTEGER:9007199254740991})},function(b,d,a){b=a(6);b(b.S,'Number',{MIN_SAFE_INTEGER:-9007199254740991})},
function(b,d,a){b=a(6);a=a(96);b(b.S+b.F*(Number.parseFloat!=a),'Number',{parseFloat:a})},function(b,d,a){var c=a(2).parseFloat,e=a(81).trim;b.exports=1/c(a(82)+'-0')!==-(1/0)?function(a){a=e(String(a),3);var b=c(a);return 0===b&&'-'==a.charAt(0)?-0:b}:c},function(b,d,a){b=a(6);a=a(98);b(b.S+b.F*(Number.parseInt!=a),'Number',{parseInt:a})},function(b,d,a){var c=a(2).parseInt,e=a(81).trim;d=a(82);var k=/^[\-+]?0[xX]/;b.exports=8!==c(d+'08')||22!==c(d+'0x16')?function(a,b){var h=e(String(a),3);return c(h,
b>>>0||(k.test(h)?16:10))}:c},function(b,d,a){b=a(6);a=a(98);b(b.G+b.F*(parseInt!=a),{parseInt:a})},function(b,d,a){b=a(6);a=a(96);b(b.G+b.F*(parseFloat!=a),{parseFloat:a})},function(b,d,a){b=a(6);var c=a(102),e=Math.sqrt;a=Math.acosh;b(b.S+b.F*!(a&&710==Math.floor(a(Number.MAX_VALUE))&&a(1/0)==1/0),'Math',{acosh:function(a){return 1>(a=+a)?NaN:9.490626562425156E7<a?Math.log(a)+Math.LN2:c(a-1+e(a-1)*e(a+1))}})},function(b,d){b.exports=Math.log1p||function(a){return-1E-8<(a=+a)&&1E-8>a?a-a*a/2:Math.log(1+
a)}},function(b,d,a){function c(a){return isFinite(a=+a)&&0!=a?0>a?-c(-a):Math.log(a+Math.sqrt(a*a+1)):a}b=a(6);d=Math.asinh;b(b.S+b.F*!(d&&0<1/d(0)),'Math',{asinh:c})},function(b,d,a){b=a(6);d=Math.atanh;b(b.S+b.F*!(d&&0>1/d(-0)),'Math',{atanh:function(a){return 0==(a=+a)?a:Math.log((1+a)/(1-a))/2}})},function(b,d,a){b=a(6);var c=a(106);b(b.S,'Math',{cbrt:function(a){return c(a=+a)*Math.pow(Math.abs(a),1/3)}})},function(b,d){b.exports=Math.sign||function(a){return 0==(a=+a)||a!=a?a:0>a?-1:1}},function(b,
d,a){b=a(6);b(b.S,'Math',{clz32:function(a){return(a>>>=0)?31-Math.floor(Math.log(a+.5)*Math.LOG2E):32}})},function(b,d,a){b=a(6);var c=Math.exp;b(b.S,'Math',{cosh:function(a){return(c(a=+a)+c(-a))/2}})},function(b,d,a){b=a(6);a=a(110);b(b.S+b.F*(a!=Math.expm1),'Math',{expm1:a})},function(b,d){var a=Math.expm1;b.exports=!a||22025.465794806718<a(10)||22025.465794806718>a(10)||-2E-17!=a(-2E-17)?function(a){return 0==(a=+a)?a:-1E-6<a&&1E-6>a?a+a*a/2:Math.exp(a)-1}:a},function(b,d,a){b=a(6);var c=a(106);
a=Math.pow;var e=a(2,-52),k=a(2,-23),l=a(2,127)*(2-k),h=a(2,-126);b(b.S,'Math',{fround:function(a){var b,f,g=Math.abs(a);a=c(a);return g<h?a*(g/h/k+1/e-1/e)*h*k:(b=(1+k/e)*g,f=b-(b-g),f>l||f!=f?1/0*a:a*f)}})},function(b,d,a){b=a(6);var c=Math.abs;b(b.S,'Math',{hypot:function(a,b){for(var e,h,g=0,k=0,f=arguments.length,n=0;k<f;)e=c(arguments[k++]),n<e?(h=n/e,g=g*h*h+1,n=e):0<e?(h=e/n,g+=h*h):g+=e;return n===1/0?1/0:n*Math.sqrt(g)}})},function(b,d,a){b=a(6);var c=Math.imul;b(b.S+b.F*a(5)(function(){return-5!=
c(4294967295,5)||2!=c.length}),'Math',{imul:function(a,b){var c=+a,e=+b,g=65535&c,k=65535&e;return 0|g*k+((65535&c>>>16)*k+g*(65535&e>>>16)<<16>>>0)}})},function(b,d,a){b=a(6);b(b.S,'Math',{log10:function(a){return Math.log(a)/Math.LN10}})},function(b,d,a){b=a(6);b(b.S,'Math',{log1p:a(102)})},function(b,d,a){b=a(6);b(b.S,'Math',{log2:function(a){return Math.log(a)/Math.LN2}})},function(b,d,a){b=a(6);b(b.S,'Math',{sign:a(106)})},function(b,d,a){b=a(6);var c=a(110),e=Math.exp;b(b.S+b.F*a(5)(function(){return-2E-17!=
!Math.sinh(-2E-17)}),'Math',{sinh:function(a){return 1>Math.abs(a=+a)?(c(a)-c(-a))/2:(e(a-1)-e(-a-1))*(Math.E/2)}})},function(b,d,a){b=a(6);var c=a(110),e=Math.exp;b(b.S,'Math',{tanh:function(a){var b=c(a=+a),h=c(-a);return b==1/0?1:h==1/0?-1:(b-h)/(e(a)+e(-a))}})},function(b,d,a){b=a(6);b(b.S,'Math',{trunc:function(a){return(0<a?Math.floor:Math.ceil)(a)}})},function(b,d,a){b=a(6);var c=a(37),e=String.fromCharCode;a=String.fromCodePoint;b(b.S+b.F*(!!a&&1!=a.length),'String',{fromCodePoint:function(a){for(var b,
h=[],g=arguments.length,k=0;g>k;){if(b=+arguments[k++],c(b,1114111)!==b)throw RangeError(b+' is not a valid code point');h.push(65536>b?e(b):e(((b-=65536)>>10)+55296,b%1024+56320))}return h.join('')}})},function(b,d,a){b=a(6);var c=a(30),e=a(35);b(b.S,'String',{raw:function(a){for(var b=c(a.raw),h=e(b.length),g=arguments.length,k=[],f=0;h>f;)k.push(String(b[f++])),f<g&&k.push(String(arguments[f]));return k.join('')}})},function(b,d,a){a(81)('trim',function(a){return function(){return a(this,3)}})},
function(b,d,a){b=a(6);var c=a(125)(!1);b(b.P,'String',{codePointAt:function(a){return c(this,a)}})},function(b,d,a){var c=a(36),e=a(33);b.exports=function(a){return function(b,h){var g,l,f=String(e(b)),k=c(h),d=f.length;return 0>k||k>=d?a?'':p:(g=f.charCodeAt(k),55296>g||56319<g||k+1===d||56320>(l=f.charCodeAt(k+1))||57343<l?a?f.charAt(k):g:a?f.slice(k,k+2):(g-55296<<10)+(l-56320)+65536)}}},function(b,d,a){b=a(6);var c=a(35),e=a(127),k=''.endsWith;b(b.P+b.F*a(129)('endsWith'),'String',{endsWith:function(a){var b=
e(this,a,'endsWith'),g=1<arguments.length?arguments[1]:p,l=c(b.length),g=g===p?l:Math.min(c(g),l),l=String(a);return k?k.call(b,l,g):b.slice(g-l.length,g)===l}})},function(b,d,a){var c=a(128),e=a(33);b.exports=function(a,b,h){if(c(b))throw TypeError('String#'+h+" doesn't accept regex!");return String(e(a))}},function(b,d,a){var c=a(11),e=a(32),k=a(23)('match');b.exports=function(a){var b;return c(a)&&((b=a[k])!==p?!!b:'RegExp'==e(a))}},function(b,d,a){var c=a(23)('match');b.exports=function(a){var b=
/./;try{'/./'[a](b)}catch(l){try{return b[c]=!1,!'/./'[a](b)}catch(h){}}return!0}},function(b,d,a){b=a(6);var c=a(127);b(b.P+b.F*a(129)('includes'),'String',{includes:function(a){return!!~c(this,a,'includes').indexOf(a,1<arguments.length?arguments[1]:p)}})},function(b,d,a){b=a(6);b(b.P,'String',{repeat:a(85)})},function(b,d,a){b=a(6);var c=a(35),e=a(127),k=''.startsWith;b(b.P+b.F*a(129)('startsWith'),'String',{startsWith:function(a){var b=e(this,a,'startsWith'),g=c(Math.min(1<arguments.length?arguments[1]:
p,b.length)),l=String(a);return k?k.call(b,l,g):b.slice(g,g+l.length)===l}})},function(b,d,a){var c=a(125)(!0);a(134)(String,'String',function(a){this._t=String(a);this._i=0},function(){var a,b=this._t,l=this._i;return l>=b.length?{value:p,done:!0}:(a=c(b,l),this._i+=a.length,{value:a,done:!1})})},function(b,d,a){var c=a(26),e=a(6),k=a(16),l=a(8),h=a(3),g=a(135),m=a(136),f=a(22),n=a(57),q=a(23)('iterator'),r=!([].keys&&'next'in[].keys()),u=function(){return this};b.exports=function(a,b,d,w,C,D,U){m(d,
b,w);var t,x,y;w=function(a){return!r&&a in v?v[a]:function(){return new d(this,a)}};var R=b+' Iterator',N='values'==C,B=!1,v=a.prototype,A=v[q]||v['@@iterator']||C&&v[C],F=A||w(C),Z=C?N?w('entries'):F:p,G='Array'==b?v.entries||A:A;if(G&&(y=n(G.call(new a)),y!==Object.prototype&&(f(y,R,!0),c||h(y,q)||l(y,q,u))),N&&A&&'values'!==A.name&&(B=!0,F=function(){return A.call(this)}),c&&!U||!r&&!B&&v[q]||l(v,q,F),g[b]=F,g[R]=u,C)if(t={values:N?F:w('values'),keys:D?F:w('keys'),entries:Z},U)for(x in t)x in
v||k(v,x,t[x]);else e(e.P+e.F*(r||B),b,t);return t}},function(b,d){b.exports={}},function(b,d,a){var c=a(44),e=a(15),k=a(22),l={};a(8)(l,a(23)('iterator'),function(){return this});b.exports=function(a,b,d){a.prototype=c(l,{next:e(1,d)});k(a,b+' Iterator')}},function(b,d,a){a(138)('anchor',function(a){return function(b){return a(this,'a','name',b)}})},function(b,d,a){var c=a(6),e=a(5),k=a(33),l=/"/g,h=function(a,b,c,e){a=String(k(a));var f='<'+b;return''!==c&&(f+=' '+c+'="'+String(e).replace(l,'&quot;')+
'"'),f+'>'+a+'</'+b+'>'};b.exports=function(a,b){var f={};f[a]=b(h);c(c.P+c.F*e(function(){var b=''[a]('"');return b!==b.toLowerCase()||3<b.split('"').length}),'String',f)}},function(b,d,a){a(138)('big',function(a){return function(){return a(this,'big','','')}})},function(b,d,a){a(138)('blink',function(a){return function(){return a(this,'blink','','')}})},function(b,d,a){a(138)('bold',function(a){return function(){return a(this,'b','','')}})},function(b,d,a){a(138)('fixed',function(a){return function(){return a(this,
'tt','','')}})},function(b,d,a){a(138)('fontcolor',function(a){return function(b){return a(this,'font','color',b)}})},function(b,d,a){a(138)('fontsize',function(a){return function(b){return a(this,'font','size',b)}})},function(b,d,a){a(138)('italics',function(a){return function(){return a(this,'i','','')}})},function(b,d,a){a(138)('link',function(a){return function(b){return a(this,'a','href',b)}})},function(b,d,a){a(138)('small',function(a){return function(){return a(this,'small','','')}})},function(b,
d,a){a(138)('strike',function(a){return function(){return a(this,'strike','','')}})},function(b,d,a){a(138)('sub',function(a){return function(){return a(this,'sub','','')}})},function(b,d,a){a(138)('sup',function(a){return function(){return a(this,'sup','','')}})},function(b,d,a){b=a(6);b(b.S,'Array',{isArray:a(43)})},function(b,d,a){var c=a(18);b=a(6);var e=a(56),k=a(153),l=a(154),h=a(35),g=a(155),m=a(156);b(b.S+b.F*!a(157)(function(a){Array.from(a)}),'Array',{from:function(a){var b,f,d;d=e(a);f=
'function'===typeof this?this:Array;b=arguments.length;var u=1<b?arguments[1]:p,t=u!==p,x=0,y=m(d);if(t&&(u=c(u,2<b?arguments[2]:p,2)),y==p||f==Array&&l(y))for(b=h(d.length),f=new f(b);b>x;x++)g(f,x,t?u(d[x],x):d[x]);else for(d=y.call(d),f=new f;!(b=d.next()).done;x++)g(f,x,t?k(d,u,[b.value,x],!0):b.value);return f.length=x,f}})},function(b,d,a){var c=a(10);b.exports=function(a,b,l,h){try{return h?b(c(l)[0],l[1]):b(l)}catch(g){throw b=a['return'],b!==p&&c(b.call(a)),g;}}},function(b,d,a){var c=a(135),
e=a(23)('iterator'),k=Array.prototype;b.exports=function(a){return a!==p&&(c.Array===a||k[e]===a)}},function(b,d,a){var c=a(9),e=a(15);b.exports=function(a,b,h){b in a?c.f(a,b,e(0,h)):a[b]=h}},function(b,d,a){var c=a(73),e=a(23)('iterator'),k=a(135);b.exports=a(7).getIteratorMethod=function(a){if(a!=p)return a[e]||a['@@iterator']||k[c(a)]}},function(b,d,a){var c=a(23)('iterator'),e=!1;try{var k=[7][c]();k['return']=function(){e=!0};Array.from(k,function(){throw 2;})}catch(l){}b.exports=function(a,
b){if(!b&&!e)return!1;var h=!1;try{var k=[7],f=k[c]();f.next=function(){return{done:h=!0}};k[c]=function(){return f};a(k)}catch(n){}return h}},function(b,d,a){b=a(6);var c=a(155);b(b.S+b.F*a(5)(function(){function a(){}return!(Array.of.call(a)instanceof a)}),'Array',{of:function(){for(var a=0,b=arguments.length,l=new ('function'===typeof this?this:Array)(b);b>a;)c(l,a,arguments[a++]);return l.length=b,l}})},function(b,d,a){b=a(6);var c=a(30),e=[].join;b(b.P+b.F*(a(31)!=Object||!a(160)(e)),'Array',
{join:function(a){return e.call(c(this),a===p?',':a)}})},function(b,d,a){var c=a(5);b.exports=function(a,b){return!!a&&c(function(){b?a.call(null,function(){},1):a.call(null)})}},function(b,d,a){b=a(6);var c=a(46),e=a(32),k=a(37),l=a(35),h=[].slice;b(b.P+b.F*a(5)(function(){c&&h.call(c)}),'Array',{slice:function(a,b){var c=l(this.length),g=e(this);if(b=b===p?c:b,'Array'==g)return h.call(this,a,b);for(var d=k(a,c),c=k(b,c),c=l(c-d),m=Array(c),u=0;u<c;u++)m[u]='String'==g?this.charAt(d+u):this[d+u];
return m}})},function(b,d,a){b=a(6);var c=a(19),e=a(56);d=a(5);var k=[].sort,l=[1,2,3];b(b.P+b.F*(d(function(){l.sort(p)})||!d(function(){l.sort(null)})||!a(160)(k)),'Array',{sort:function(a){return a===p?k.call(e(this)):k.call(e(this),c(a))}})},function(b,d,a){b=a(6);var c=a(164)(0);a=a(160)([].forEach,!0);b(b.P+b.F*!a,'Array',{forEach:function(a,b){return c(this,a,b)}})},function(b,d,a){var c=a(18),e=a(31),k=a(56),l=a(35),h=a(165);b.exports=function(a,b){var f=1==a,g=2==a,d=3==a,m=4==a,u=6==a,t=
5==a||u,x=b||h;return function(b,h,n){var w,q,r=k(b),C=e(r);h=c(h,n,3);n=l(C.length);var y=0;for(b=f?x(b,n):g?x(b,0):p;n>y;y++)if((t||y in C)&&(w=C[y],q=h(w,y,r),a))if(f)b[y]=q;else if(q)switch(a){case 3:return!0;case 5:return w;case 6:return y;case 2:b.push(w)}else if(m)return!1;return u?-1:d||m?m:b}}},function(b,d,a){var c=a(166);b.exports=function(a,b){return new (c(a))(b)}},function(b,d,a){var c=a(11),e=a(43),k=a(23)('species');b.exports=function(a){var b;return e(a)&&(b=a.constructor,'function'!==
typeof b||b!==Array&&!e(b.prototype)||(b=p),c(b)&&(b=b[k],null===b&&(b=p))),b===p?Array:b}},function(b,d,a){b=a(6);var c=a(164)(1);b(b.P+b.F*!a(160)([].map,!0),'Array',{map:function(a,b){return c(this,a,b)}})},function(b,d,a){b=a(6);var c=a(164)(2);b(b.P+b.F*!a(160)([].filter,!0),'Array',{filter:function(a,b){return c(this,a,b)}})},function(b,d,a){b=a(6);var c=a(164)(3);b(b.P+b.F*!a(160)([].some,!0),'Array',{some:function(a,b){return c(this,a,b)}})},function(b,d,a){b=a(6);var c=a(164)(4);b(b.P+b.F*
!a(160)([].every,!0),'Array',{every:function(a,b){return c(this,a,b)}})},function(b,d,a){b=a(6);var c=a(172);b(b.P+b.F*!a(160)([].reduce,!0),'Array',{reduce:function(a){return c(this,a,arguments.length,arguments[1],!1)}})},function(b,d,a){var c=a(19),e=a(56),k=a(31),l=a(35);b.exports=function(a,b,d,f,n){c(b);a=e(a);var h=k(a),g=l(a.length),m=n?g-1:0,t=n?-1:1;if(2>d)for(;;){if(m in h){f=h[m];m+=t;break}if(m+=t,n?0>m:g<=m)throw TypeError('Reduce of empty array with no initial value');}for(;n?0<=m:g>
m;m+=t)m in h&&(f=b(f,h[m],m,a));return f}},function(b,d,a){b=a(6);var c=a(172);b(b.P+b.F*!a(160)([].reduceRight,!0),'Array',{reduceRight:function(a){return c(this,a,arguments.length,arguments[1],!0)}})},function(b,d,a){b=a(6);var c=a(34)(!1),e=[].indexOf,k=!!e&&0>1/[1].indexOf(1,-0);b(b.P+b.F*(k||!a(160)(e)),'Array',{indexOf:function(a){return k?e.apply(this,arguments)||0:c(this,a,arguments[1])}})},function(b,d,a){b=a(6);var c=a(30),e=a(36),k=a(35),l=[].lastIndexOf,h=!!l&&0>1/[1].lastIndexOf(1,-0);
b(b.P+b.F*(h||!a(160)(l)),'Array',{lastIndexOf:function(a){if(h)return l.apply(this,arguments)||0;var b=c(this),f=k(b.length),g=f-1;1<arguments.length&&(g=Math.min(g,e(arguments[1])));for(0>g&&(g=f+g);0<=g;g--)if(g in b&&b[g]===a)return g||0;return-1}})},function(b,d,a){b=a(6);b(b.P,'Array',{copyWithin:a(177)});a(178)('copyWithin')},function(b,d,a){var c=a(56),e=a(37),k=a(35);b.exports=[].copyWithin||function(a,b){var h=c(this),l=k(h.length),f=e(a,l),d=e(b,l),q=2<arguments.length?arguments[2]:p,l=
Math.min((q===p?l:e(q,l))-d,l-f),q=1;for(d<f&&f<d+l&&(q=-1,d+=l-1,f+=l-1);0<l--;)d in h?h[f]=h[d]:delete h[f],f+=q,d+=q;return h}},function(b,d,a){var c=a(23)('unscopables'),e=Array.prototype;e[c]==p&&a(8)(e,c,{});b.exports=function(a){e[c][a]=!0}},function(b,d,a){b=a(6);b(b.P,'Array',{fill:a(180)});a(178)('fill')},function(b,d,a){var c=a(56),e=a(37),k=a(35);b.exports=function(a){for(var b=c(this),g=k(b.length),l=arguments.length,f=e(1<l?arguments[1]:p,g),l=2<l?arguments[2]:p,g=l===p?g:e(l,g);g>f;)b[f++]=
a;return b}},function(b,d,a){b=a(6);var c=a(164)(5),e=!0;'find'in[]&&Array(1).find(function(){e=!1});b(b.P+b.F*e,'Array',{find:function(a){return c(this,a,1<arguments.length?arguments[1]:p)}});a(178)('find')},function(b,d,a){b=a(6);var c=a(164)(6),e=!0;'findIndex'in[]&&Array(1).findIndex(function(){e=!1});b(b.P+b.F*e,'Array',{findIndex:function(a){return c(this,a,1<arguments.length?arguments[1]:p)}});a(178)('findIndex')},function(b,d,a){d=a(178);var c=a(184),e=a(135),k=a(30);b.exports=a(134)(Array,
'Array',function(a,b){this._t=k(a);this._i=0;this._k=b},function(){var a=this._t,b=this._k,e=this._i++;return!a||e>=a.length?(this._t=p,c(1)):'keys'==b?c(0,e):'values'==b?c(0,a[e]):c(0,[e,a[e]])},'values');e.Arguments=e.Array;d('keys');d('values');d('entries')},function(b,d){b.exports=function(a,b){return{value:b,done:!!a}}},function(b,d,a){a(186)('Array')},function(b,d,a){var c=a(2),e=a(9),k=a(4),l=a(23)('species');b.exports=function(a){a=c[a];k&&a&&!a[l]&&e.f(a,l,{configurable:!0,get:function(){return this}})}},
function(b,d,a){b=a(2);var c=a(80),e=a(9).f,k=a(48).f,l=a(128),h=a(188),g=b.RegExp,m=g,f=g.prototype,n=/a/g,q=/a/g,r=new g(n)!==n;if(a(4)&&(!r||a(5)(function(){return q[a(23)('match')]=!1,g(n)!=n||g(q)==q||'/a/i'!=g(n,'i')}))){g=function(a,b){var e=this instanceof g,d=l(a),k=b===p;return!e&&d&&a.constructor===g&&k?a:c(r?new m(d&&!k?a.source:a,b):m((d=a instanceof g)?a.source:a,d&&k?h.call(a):b),e?this:f,g)};d=function(a){a in g||e(g,a,{configurable:!0,get:function(){return m[a]},set:function(b){m[a]=
b}})};for(var k=k(m),u=0;k.length>u;)d(k[u++]);f.constructor=g;g.prototype=f;a(16)(b,'RegExp',g)}a(186)('RegExp')},function(b,d,a){var c=a(10);b.exports=function(){var a=c(this),b='';return a.global&&(b+='g'),a.ignoreCase&&(b+='i'),a.multiline&&(b+='m'),a.unicode&&(b+='u'),a.sticky&&(b+='y'),b}},function(b,d,a){a(190);var c=a(10),e=a(188),k=a(4),l=/./.toString;a(5)(function(){return'/a/b'!=l.call({source:'a',flags:'b'})})?a(16)(RegExp.prototype,'toString',function(){var a=c(this);return'/'.concat(a.source,
'/','flags'in a?a.flags:!k&&a instanceof RegExp?e.call(a):p)},!0):'toString'!=l.name&&a(16)(RegExp.prototype,'toString',function(){return l.call(this)},!0)},function(b,d,a){a(4)&&'g'!=/./g.flags&&a(9).f(RegExp.prototype,'flags',{configurable:!0,get:a(188)})},function(b,d,a){a(192)('match',1,function(a,b,d){return[function(c){var e=a(this),g=c==p?p:c[b];return g!==p?g.call(c,e):(new RegExp(c))[b](String(e))},d]})},function(b,d,a){var c=a(8),e=a(16),k=a(5),l=a(33),h=a(23);b.exports=function(a,b,f){var g=
h(a);f=f(l,g,''[a]);var d=f[0],m=f[1];k(function(){var b={};return b[g]=function(){return 7},7!=''[a](b)})&&(e(String.prototype,a,d),c(RegExp.prototype,g,2==b?function(a,b){return m.call(a,this,b)}:function(a){return m.call(a,this)}))}},function(b,d,a){a(192)('replace',2,function(a,b,d){return[function(c,e){var h=a(this),l=c==p?p:c[b];return l!==p?l.call(c,h,e):d.call(String(h),c,e)},d]})},function(b,d,a){a(192)('search',1,function(a,b,d){return[function(c){var e=a(this),g=c==p?p:c[b];return g!==
p?g.call(c,e):(new RegExp(c))[b](String(e))},d]})},function(b,d,a){a(192)('split',2,function(b,e,d){var c=a(128),h=d,g=[].push;if('c'=='abbc'.split(/(b)*/)[1]||4!='test'.split(/(?:)/,-1).length||2!='ab'.split(/(?:ab)*/).length||4!='.'.split(/(.?)(.?)/).length||1<'.'.split(/()()/).length||''.split(/.?/).length){var k=/()??/.exec('')[1]===p;d=function(a,b){var f=String(this);if(a===p&&0===b)return[];if(!c(a))return h.call(f,a,b);var e,d,l,n,m,w=[],C=(a.ignoreCase?'i':'')+(a.multiline?'m':'')+(a.unicode?
'u':'')+(a.sticky?'y':''),D=0,U=b===p?4294967295:b>>>0,E=new RegExp(a.source,C+'g');for(k||(e=new RegExp('^'+E.source+'$(?!\\s)',C));(d=E.exec(f))&&(l=d.index+d[0].length,!(l>D&&(w.push(f.slice(D,d.index)),!k&&1<d.length&&d[0].replace(e,function(){for(m=1;m<arguments.length-2;m++)arguments[m]===p&&(d[m]=p)}),1<d.length&&d.index<f.length&&g.apply(w,d.slice(1)),n=d[0].length,D=l,w.length>=U)));)E.lastIndex===d.index&&E.lastIndex++;return D===f.length?!n&&E.test('')||w.push(''):w.push(f.slice(D)),w.length>
U?w.slice(0,U):w}}else'0'.split(p,0).length&&(d=function(a,b){return a===p&&0===b?[]:h.call(this,a,b)});return[function(a,c){var f=b(this),h=a==p?p:a[e];return h!==p?h.call(a,f,c):d.call(String(f),a,c)},d]})},function(b,d,a){var c,e,k;b=a(26);var l=a(2),h=a(18),g=a(73);d=a(6);var m=a(11),f=a(19),n=a(197),q=a(198),r=a(199),u=a(200).set,t=a(201)(),x=l.TypeError,y=l.process,w=l.Promise,y=l.process,C='process'==g(y),D=function(){},g=!!function(){try{var b=w.resolve(1),c=(b.constructor={})[a(23)('species')]=
function(a){a(D,D)};return(C||'function'===typeof PromiseRejectionEvent)&&b.then(D)instanceof c}catch(la){}}(),U=function(a){var b;return!(!m(a)||'function'!==typeof(b=a.then))&&b},E=function(a){return w===a||w===w&&a===k?new v(a):new e(a)},v=e=function(a){var b,c;this.promise=new a(function(a,f){if(b!==p||c!==p)throw x('Bad Promise constructor');b=a;c=f});this.resolve=f(b);this.reject=f(c)},T=function(a){try{a()}catch(G){return{error:G}}},R=function(a,b){if(!a._n){a._n=!0;var c=a._c;t(function(){for(var f=
a._v,e=1==a._s,d=0;c.length>d;){var h=void 0,g=void 0,l=c[d++],k=e?l.ok:l.fail,n=l.resolve,m=l.reject,w=l.domain;try{k?(e||(2==a._h&&J(a),a._h=1),!0===k?g=f:(w&&w.enter(),g=k(f),w&&w.exit()),g===l.promise?m(x('Promise-chain cycle')):(h=U(g))?h.call(g,n,m):n(g)):m(f)}catch(Q){m(Q)}}a._c=[];a._n=!1;b&&!a._h&&N(a)})}},N=function(a){u.call(l,function(){var b,c,f,e=a._v;if(B(a)&&(b=T(function(){C?y.emit('unhandledRejection',e,a):(c=l.onunhandledrejection)?c({promise:a,reason:e}):(f=l.console)&&f.error&&
f.error('Unhandled promise rejection',e)}),a._h=C||B(a)?2:1),a._a=p,b)throw b.error;})},B=function(a){if(1==a._h)return!1;var b;a=a._a||a._c;for(var c=0;a.length>c;)if(b=a[c++],b.fail||!B(b.promise))return!1;return!0},J=function(a){u.call(l,function(){var b;C?y.emit('rejectionHandled',a):(b=l.onrejectionhandled)&&b({promise:a,reason:a._v})})},A=function(a){var b=this;b._d||(b._d=!0,b=b._w||b,b._v=a,b._s=2,b._a||(b._a=b._c.slice()),R(b,!0))},F=function(a){var b,c=this;if(!c._d){c._d=!0;c=c._w||c;try{if(c===
a)throw x("Promise can't be resolved itself");(b=U(a))?t(function(){var f={_w:c,_d:!1};try{b.call(a,h(F,f,1),h(A,f,1))}catch(ea){A.call(f,ea)}}):(c._v=a,c._s=1,R(c,!1))}catch(ia){A.call({_w:c,_d:!1},ia)}}};g||(w=function(a){n(this,w,'Promise','_h');f(a);c.call(this);try{a(h(F,this,1),h(A,this,1))}catch(G){A.call(this,G)}},c=function(a){this._c=[];this._a=p;this._s=0;this._d=!1;this._v=p;this._h=0;this._n=!1},c.prototype=a(202)(w.prototype,{then:function(a,b){var c=E(r(this,w));return c.ok='function'!==
typeof a||a,c.fail='function'===typeof b&&b,c.domain=C?y.domain:p,this._c.push(c),this._a&&this._a.push(c),this._s&&R(this,!1),c.promise},'catch':function(a){return this.then(p,a)}}),v=function(){var a=new c;this.promise=a;this.resolve=h(F,a,1);this.reject=h(A,a,1)});d(d.G+d.W+d.F*!g,{Promise:w});a(22)(w,'Promise');a(186)('Promise');k=a(7).Promise;d(d.S+d.F*!g,'Promise',{reject:function(a){var b=E(this),c=b.reject;return c(a),b.promise}});d(d.S+d.F*(b||!g),'Promise',{resolve:function(a){var b;if(b=
a instanceof w)b=a.constructor,b=b===this||b===w&&this===k;if(b)return a;b=E(this);var c=b.resolve;return c(a),b.promise}});d(d.S+d.F*!(g&&a(157)(function(a){w.all(a)['catch'](D)})),'Promise',{all:function(a){var b=this,c=E(b),f=c.resolve,e=c.reject,d=T(function(){var c=[],d=0,h=1;q(a,!1,function(a){var g=d++,l=!1;c.push(p);h++;b.resolve(a).then(function(a){l||(l=!0,c[g]=a,--h||f(c))},e)});--h||f(c)});return d&&e(d.error),c.promise},race:function(a){var b=this,c=E(b),f=c.reject,e=T(function(){q(a,
!1,function(a){b.resolve(a).then(c.resolve,f)})});return e&&f(e.error),c.promise}})},function(b,d){b.exports=function(a,b,e,d){if(!(a instanceof b)||d!==p&&d in a)throw TypeError(e+': incorrect invocation!');return a}},function(b,d,a){var c=a(18),e=a(153),k=a(154),l=a(10),h=a(35),g=a(156),m={},f={};d=b.exports=function(a,b,d,u,t){var n,q;t=t?function(){return a}:g(a);d=c(d,u,b?2:1);u=0;if('function'!==typeof t)throw TypeError(a+' is not iterable!');if(k(t))for(t=h(a.length);t>u;u++){if(q=b?d(l(n=
a[u])[0],n[1]):d(a[u]),q===m||q===f)return q}else for(t=t.call(a);!(n=t.next()).done;)if(q=e(t,d,n.value,b),q===m||q===f)return q};d.BREAK=m;d.RETURN=f},function(b,d,a){var c=a(10),e=a(19),k=a(23)('species');b.exports=function(a,b){var d,h=c(a).constructor;return h===p||(d=c(h)[k])==p?b:e(d)}},function(b,d,a){var c,e,k,l=a(18),h=a(76),g=a(46),m=a(13),f=a(2),n=f.process;d=f.setImmediate;var q=f.clearImmediate,r=f.MessageChannel,u=0,t={},x=function(){var a=+this;if(t.hasOwnProperty(a)){var b=t[a];delete t[a];
b()}},p=function(a){x.call(a.data)};d&&q||(d=function(a){for(var b=[],f=1;arguments.length>f;)b.push(arguments[f++]);return t[++u]=function(){h('function'===typeof a?a:Function(a),b)},c(u),u},q=function(a){delete t[a]},'process'==a(32)(n)?c=function(a){n.nextTick(l(x,a,1))}:r?(e=new r,k=e.port2,e.port1.onmessage=p,c=l(k.postMessage,k,1)):f.addEventListener&&'function'===typeof postMessage&&!f.importScripts?(c=function(a){f.postMessage(a+'','*')},f.addEventListener('message',p,!1)):c='onreadystatechange'in
m('script')?function(a){g.appendChild(m('script')).onreadystatechange=function(){g.removeChild(this);x.call(a)}}:function(a){setTimeout(l(x,a,1),0)});b.exports={set:d,clear:q}},function(b,d,a){var c=a(2),e=a(200).set,k=c.MutationObserver||c.WebKitMutationObserver,l=c.process,h=c.Promise,g='process'==a(32)(l);b.exports=function(){var a,b,d,q=function(){var c,f;for(g&&(c=l.domain)&&c.exit();a;){f=a.fn;a=a.next;try{f()}catch(w){throw a?d():b=p,w;}}b=p;c&&c.enter()};if(g)d=function(){l.nextTick(q)};else if(k){var r=
!0,u=document.createTextNode('');(new k(q)).observe(u,{characterData:!0});d=function(){u.data=r=!r}}else if(h&&h.resolve){var t=h.resolve();d=function(){t.then(q)}}else d=function(){e.call(c,q)};return function(c){c={fn:c,next:p};b&&(b.next=c);a||(a=c,d());b=c}}},function(b,d,a){var c=a(16);b.exports=function(a,b,d){for(var e in b)c(a,e,b[e],d);return a}},function(b,d,a){var c=a(204);b.exports=a(205)('Map',function(a){return function(){return a(this,0<arguments.length?arguments[0]:p)}},{get:function(a){return(a=
c.getEntry(this,a))&&a.v},set:function(a,b){return c.def(this,0===a?0:a,b)}},c,!0)},function(b,d,a){var c=a(9).f,e=a(44),k=a(202),l=a(18),h=a(197),g=a(33),m=a(198),f=a(134),n=a(184),q=a(186),r=a(4),u=a(20).fastKey,t=r?'_s':'size',x=function(a,b){var c;c=u(b);if('F'!==c)return a._i[c];for(c=a._f;c;c=c.n)if(c.k==b)return c};b.exports={getConstructor:function(a,b,f,d){var n=a(function(a,c){h(a,n,b,'_i');a._i=e(null);a._f=p;a._l=p;a[t]=0;c!=p&&m(c,f,a[d],a)});return k(n.prototype,{clear:function(){for(var a=
this._i,b=this._f;b;b=b.n)b.r=!0,b.p&&(b.p=b.p.n=p),delete a[b.i];this._f=this._l=p;this[t]=0},'delete':function(a){if(a=x(this,a)){var b=a.n,c=a.p;delete this._i[a.i];a.r=!0;c&&(c.n=b);b&&(b.p=c);this._f==a&&(this._f=b);this._l==a&&(this._l=c);this[t]--}return!!a},forEach:function(a){h(this,n,'forEach');for(var b,c=l(a,1<arguments.length?arguments[1]:p,3);b=b?b.n:this._f;)for(c(b.v,b.k,this);b&&b.r;)b=b.p},has:function(a){return!!x(this,a)}}),r&&c(n.prototype,'size',{get:function(){return g(this[t])}}),
n},def:function(a,b,c){var f,e,d=x(a,b);return d?d.v=c:(a._l=d={i:e=u(b,!0),k:b,v:c,p:f=a._l,n:p,r:!1},a._f||(a._f=d),f&&(f.n=d),a[t]++,'F'!==e&&(a._i[e]=d)),a},getEntry:x,setStrong:function(a,b,c){f(a,b,function(a,b){this._t=a;this._k=b;this._l=p},function(){for(var a=this._k,b=this._l;b&&b.r;)b=b.p;return this._t&&(this._l=b=b?b.n:this._t._f)?'keys'==a?n(0,b.k):'values'==a?n(0,b.v):n(0,[b.k,b.v]):(this._t=p,n(1))},c?'entries':'values',!c,!0);q(b)}}},function(b,d,a){var c=a(2),e=a(6),k=a(16),l=a(202),
h=a(20),g=a(198),m=a(197),f=a(11),n=a(5),q=a(157),r=a(22),u=a(80);b.exports=function(a,b,d,w,C,D){var t=c[a],x=t,y=C?'set':'add',v=x&&x.prototype,R={},N=function(a){var b=v[a];k(v,a,'delete'==a?function(a){return!(D&&!f(a))&&b.call(this,0===a?0:a)}:'has'==a?function(a){return!(D&&!f(a))&&b.call(this,0===a?0:a)}:'get'==a?function(a){return D&&!f(a)?p:b.call(this,0===a?0:a)}:'add'==a?function(a){return b.call(this,0===a?0:a),this}:function(a,c){return b.call(this,0===a?0:a,c),this})};if('function'===
typeof x&&(D||v.forEach&&!n(function(){(new x).entries().next()}))){var B=new x;d=B[y](D?{}:-0,1)!=B;var J=n(function(){B.has(1)}),A=q(function(a){new x(a)}),F=!D&&n(function(){for(var a=new x,b=5;b--;)a[y](b,b);return!a.has(-0)});A||(x=b(function(b,c){m(b,x,a);var f=u(new t,b,x);return c!=p&&g(c,C,f[y],f),f}),x.prototype=v,v.constructor=x);(J||F)&&(N('delete'),N('has'),C&&N('get'));(F||d)&&N(y);D&&v.clear&&delete v.clear}else x=w.getConstructor(b,a,C,y),l(x.prototype,d),h.NEED=!0;return r(x,a),R[a]=
x,e(e.G+e.W+e.F*(x!=t),R),D||w.setStrong(x,a,C),x}},function(b,d,a){var c=a(204);b.exports=a(205)('Set',function(a){return function(){return a(this,0<arguments.length?arguments[0]:p)}},{add:function(a){return c.def(this,a=0===a?0:a,a)}},c)},function(b,d,a){var c;d=a(164)(0);var e=a(16),k=a(20),l=a(67),h=a(208),g=a(11),m=k.getWeak,f=Object.isExtensible,n=h.ufstore,q={},r=function(a){return function(){return a(this,0<arguments.length?arguments[0]:p)}},u={get:function(a){if(g(a)){var b=m(a);return!0===
b?n(this).get(a):b?b[this._i]:p}},set:function(a,b){return h.def(this,a,b)}},t=b.exports=a(205)('WeakMap',r,u,h,!0,!0);7!=(new t).set((Object.freeze||Object)(q),7).get(q)&&(c=h.getConstructor(r),l(c.prototype,u),k.NEED=!0,d(['delete','has','get','set'],function(a){var b=t.prototype,d=b[a];e(b,a,function(b,e){if(g(b)&&!f(b)){this._f||(this._f=new c);var h=this._f[a](b,e);return'set'==a?this:h}return d.call(this,b,e)})}))},function(b,d,a){var c=a(202),e=a(20).getWeak,k=a(10),l=a(11),h=a(197),g=a(198);
d=a(164);var m=a(3),f=d(5),n=d(6),q=0,r=function(a){return a._l||(a._l=new u)},u=function(){this.a=[]},t=function(a,b){return f(a.a,function(a){return a[0]===b})};u.prototype={get:function(a){if(a=t(this,a))return a[1]},has:function(a){return!!t(this,a)},set:function(a,b){var c=t(this,a);c?c[1]=b:this.a.push([a,b])},'delete':function(a){var b=n(this.a,function(b){return b[0]===a});return~b&&this.a.splice(b,1),!!~b}};b.exports={getConstructor:function(a,b,f,d){var k=a(function(a,c){h(a,k,b,'_i');a._i=
q++;a._l=p;c!=p&&g(c,f,a[d],a)});return c(k.prototype,{'delete':function(a){if(!l(a))return!1;var b=e(a);return!0===b?r(this)['delete'](a):b&&m(b,this._i)&&delete b[this._i]},has:function(a){if(!l(a))return!1;var b=e(a);return!0===b?r(this).has(a):b&&m(b,this._i)}}),k},def:function(a,b,c){var f=e(k(b),!0);return!0===f?r(a).set(b,c):f[a._i]=c,a},ufstore:r}},function(b,d,a){var c=a(208);a(205)('WeakSet',function(a){return function(){return a(this,0<arguments.length?arguments[0]:p)}},{add:function(a){return c.def(this,
a,!0)}},c,!1,!0)},function(b,d,a){b=a(6);var c=a(19),e=a(10),k=(a(2).Reflect||{}).apply,l=Function.apply;b(b.S+b.F*!a(5)(function(){k(function(){})}),'Reflect',{apply:function(a,b,d){a=c(a);d=e(d);return k?k(a,b,d):l.call(a,b,d)}})},function(b,d,a){b=a(6);var c=a(44),e=a(19),k=a(10),l=a(11);d=a(5);var h=a(75),g=(a(2).Reflect||{}).construct,m=d(function(){function a(){}return!(g(function(){},[],a)instanceof a)}),f=!d(function(){g(function(){})});b(b.S+b.F*(m||f),'Reflect',{construct:function(a,b){e(a);
k(b);var d=3>arguments.length?a:e(arguments[2]);if(f&&!m)return g(a,b,d);if(a==d){switch(b.length){case 0:return new a;case 1:return new a(b[0]);case 2:return new a(b[0],b[1]);case 3:return new a(b[0],b[1],b[2]);case 4:return new a(b[0],b[1],b[2],b[3])}d=[null];return d.push.apply(d,b),new (h.apply(a,d))}var d=d.prototype,d=c(l(d)?d:Object.prototype),n=Function.apply.call(a,d,b);return l(n)?n:d}})},function(b,d,a){var c=a(9);b=a(6);var e=a(10),k=a(14);b(b.S+b.F*a(5)(function(){Reflect.defineProperty(c.f({},
1,{value:1}),1,{value:2})}),'Reflect',{defineProperty:function(a,b,d){e(a);b=k(b,!0);e(d);try{return c.f(a,b,d),!0}catch(m){return!1}}})},function(b,d,a){b=a(6);var c=a(49).f,e=a(10);b(b.S,'Reflect',{deleteProperty:function(a,b){var d=c(e(a),b);return!(d&&!d.configurable)&&delete a[b]}})},function(b,d,a){b=a(6);var c=a(10),e=function(a){this._t=c(a);this._i=0;var b,d=this._k=[];for(b in a)d.push(b)};a(136)(e,'Object',function(){var a,b=this._k;do if(this._i>=b.length)return{value:p,done:!0};while(!((a=
b[this._i++])in this._t));return{value:a,done:!1}});b(b.S,'Reflect',{enumerate:function(a){return new e(a)}})},function(b,d,a){function c(a,b){var f,d,m=3>arguments.length?a:arguments[2];return g(a)===m?a[b]:(f=e.f(a,b))?l(f,'value')?f.value:f.get!==p?f.get.call(m):p:h(d=k(a))?c(d,b,m):void 0}var e=a(49),k=a(57),l=a(3);b=a(6);var h=a(11),g=a(10);b(b.S,'Reflect',{get:c})},function(b,d,a){var c=a(49);b=a(6);var e=a(10);b(b.S,'Reflect',{getOwnPropertyDescriptor:function(a,b){return c.f(e(a),b)}})},function(b,
d,a){b=a(6);var c=a(57),e=a(10);b(b.S,'Reflect',{getPrototypeOf:function(a){return c(e(a))}})},function(b,d,a){b=a(6);b(b.S,'Reflect',{has:function(a,b){return b in a}})},function(b,d,a){b=a(6);var c=a(10),e=Object.isExtensible;b(b.S,'Reflect',{isExtensible:function(a){return c(a),!e||e(a)}})},function(b,d,a){b=a(6);b(b.S,'Reflect',{ownKeys:a(221)})},function(b,d,a){var c=a(48),e=a(41),k=a(10);d=a(2).Reflect;b.exports=d&&d.ownKeys||function(a){var b=c.f(k(a)),d=e.f;return d?b.concat(d(a)):b}},function(b,
d,a){b=a(6);var c=a(10),e=Object.preventExtensions;b(b.S,'Reflect',{preventExtensions:function(a){c(a);try{return e&&e(a),!0}catch(l){return!1}}})},function(b,d,a){function c(a,b,d){var n,q,r=4>arguments.length?a:arguments[3];q=k.f(m(a),b);if(!q){if(f(q=l(a)))return c(q,b,d,r);q=g(0)}return h(q,'value')?!(!1===q.writable||!f(r))&&(n=k.f(r,b)||g(0),n.value=d,e.f(r,b,n),!0):q.set!==p&&(q.set.call(r,d),!0)}var e=a(9),k=a(49),l=a(57),h=a(3);b=a(6);var g=a(15),m=a(10),f=a(11);b(b.S,'Reflect',{set:c})},
function(b,d,a){b=a(6);var c=a(71);c&&b(b.S,'Reflect',{setPrototypeOf:function(a,b){c.check(a,b);try{return c.set(a,b),!0}catch(l){return!1}}})},function(b,d,a){b=a(6);b(b.S,'Date',{now:function(){return(new Date).getTime()}})},function(b,d,a){b=a(6);var c=a(56),e=a(14);b(b.P+b.F*a(5)(function(){return null!==(new Date(NaN)).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})}),'Date',{toJSON:function(a){a=c(this);var b=e(a);return'number'!==typeof b||isFinite(b)?a.toISOString():
null}})},function(b,d,a){b=a(6);a=a(5);var c=Date.prototype.getTime,e=function(a){return 9<a?a:'0'+a};b(b.P+b.F*(a(function(){return'0385-07-25T07:06:39.999Z'!=(new Date(-5E13-1)).toISOString()})||!a(function(){(new Date(NaN)).toISOString()})),'Date',{toISOString:function(){if(!isFinite(c.call(this)))throw RangeError('Invalid time value');var a=this.getUTCFullYear(),b=this.getUTCMilliseconds(),d=0>a?'-':9999<a?'+':'';return d+('00000'+Math.abs(a)).slice(d?-6:-4)+'-'+e(this.getUTCMonth()+1)+'-'+e(this.getUTCDate())+
'T'+e(this.getUTCHours())+':'+e(this.getUTCMinutes())+':'+e(this.getUTCSeconds())+'.'+(99<b?b:'0'+e(b))+'Z'}})},function(b,d,a){b=Date.prototype;var c=b.toString,e=b.getTime;'Invalid Date'!=new Date(NaN)+''&&a(16)(b,'toString',function(){var a=e.call(this);return a===a?c.call(this):'Invalid Date'})},function(b,d,a){b=a(23)('toPrimitive');d=Date.prototype;b in d||a(8)(d,b,a(230))},function(b,d,a){var c=a(10),e=a(14);b.exports=function(a){if('string'!==a&&'number'!==a&&'default'!==a)throw TypeError('Incorrect hint');
return e(c(this),'number'!=a)}},function(b,d,a){b=a(6);d=a(232);var c=a(233),e=a(10),k=a(37),l=a(35),h=a(11),g=a(2).ArrayBuffer,m=a(199),f=c.ArrayBuffer,n=c.DataView,q=d.ABV&&g.isView,r=f.prototype.slice,u=d.VIEW;b(b.G+b.W+b.F*(g!==f),{ArrayBuffer:f});b(b.S+b.F*!d.CONSTR,'ArrayBuffer',{isView:function(a){return q&&q(a)||h(a)&&u in a}});b(b.P+b.U+b.F*a(5)(function(){return!(new f(2)).slice(1,p).byteLength}),'ArrayBuffer',{slice:function(a,b){if(r!==p&&b===p)return r.call(e(this),a);for(var c=e(this).byteLength,
d=k(a,c),c=k(b===p?c:b,c),g=new (m(this,f))(l(c-d)),h=new n(this),q=new n(g),u=0;d<c;)q.setUint8(u++,h.getUint8(d++));return g}});a(186)('ArrayBuffer')},function(b,d,a){var c;d=a(2);var e=a(8),k=a(17);a=k('typed_array');for(var k=k('view'),l=!(!d.ArrayBuffer||!d.DataView),h=l,g=0,m='Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array'.split(' ');9>g;)(c=d[m[g++]])?(e(c.prototype,a,!0),e(c.prototype,k,!0)):h=!1;b.exports={ABV:l,CONSTR:h,TYPED:a,
VIEW:k}},function(b,d,a){var c=a(2),e=a(4),k=a(26);b=a(232);var l=a(8),h=a(202),g=a(5),m=a(197),f=a(36),n=a(35),q=a(48).f,r=a(9).f,u=a(180);a=a(22);var t=c.ArrayBuffer,x=c.DataView,y=c.Math,w=c.RangeError,C=c.Infinity,D=t,v=y.abs,E=y.pow,ba=y.floor,T=y.log,R=y.LN2,N=e?'_b':'buffer',B=e?'_l':'byteLength',J=e?'_o':'byteOffset',A=function(a,b,c){var f,d,e,g=Array(c);c=8*c-b-1;var h=(1<<c)-1,l=h>>1,k=23===b?E(2,-24)-E(2,-77):0,m=0,n=0>a||0===a&&0>1/a?1:0;a=v(a);for(a!=a||a===C?(d=a!=a?1:0,f=h):(f=ba(T(a)/
R),1>a*(e=E(2,-f))&&(f--,e*=2),a+=1<=f+l?k/e:k*E(2,1-l),2<=a*e&&(f++,e/=2),f+l>=h?(d=0,f=h):1<=f+l?(d=(a*e-1)*E(2,b),f+=l):(d=a*E(2,l-1)*E(2,b),f=0));8<=b;g[m++]=255&d,d/=256,b-=8);f=f<<b|d;for(c+=b;0<c;g[m++]=255&f,f/=256,c-=8);return g[--m]|=128*n,g},F=function(a,b,c){for(var f=8*c-b-1,d=(1<<f)-1,e=d>>1,f=f-7,g=c-1,h=a[g--],l=127&h,h=h>>7;0<f;l=256*l+a[g],g--,f-=8);c=l&(1<<-f)-1;l>>=-f;for(f+=b;0<f;c=256*c+a[g],g--,f-=8);if(0===l)l=1-e;else{if(l===d)return c?NaN:h?-C:C;c+=E(2,b);l-=e}return(h?-1:
1)*c*E(2,l-b)},z=function(a){return a[3]<<24|a[2]<<16|a[1]<<8|a[0]},G=function(a){return[255&a]},la=function(a){return[255&a,a>>8&255]},ia=function(a){return[255&a,a>>8&255,a>>16&255,a>>24&255]},ea=function(a){return A(a,52,8)},V=function(a){return A(a,23,4)},c=function(a,b,c){r(a.prototype,b,{get:function(){return this[c]}})},W=function(a,b,c,d){c=+c;var e=f(c);if(c!=e||0>e||e+b>a[B])throw w('Wrong index!');c=e+a[J];a=a[N]._b.slice(c,c+b);return d?a:a.reverse()},P=function(a,b,c,d,e,g){c=+c;var h=
f(c);if(c!=h||0>h||h+b>a[B])throw w('Wrong index!');c=a[N]._b;a=h+a[J];d=d(+e);for(e=0;e<b;e++)c[a+e]=d[g?e:b-e-1]},X=function(a,b){m(a,t,'ArrayBuffer');var c=+b,f=n(c);if(c!=f)throw w('Wrong length!');return f};if(b.ABV){if(!g(function(){new t})||!g(function(){new t(.5)})){for(var t=function(a){return new D(X(this,a))},S,e=t.prototype=D.prototype,q=q(D),g=0;q.length>g;)(S=q[g++])in t||l(t,S,D[S]);k||(e.constructor=t)}S=new x(new t(2));var fa=x.prototype.setInt8;S.setInt8(0,2147483648);S.setInt8(1,
2147483649);!S.getInt8(0)&&S.getInt8(1)||h(x.prototype,{setInt8:function(a,b){fa.call(this,a,b<<24>>24)},setUint8:function(a,b){fa.call(this,a,b<<24>>24)}},!0)}else t=function(a){a=X(this,a);this._b=u.call(Array(a),0);this[B]=a},x=function(a,b,c){m(this,x,'DataView');m(a,t,'DataView');var d=a[B];b=f(b);if(0>b||b>d)throw w('Wrong offset!');if(c=c===p?d-b:n(c),b+c>d)throw w('Wrong length!');this[N]=a;this[J]=b;this[B]=c},e&&(c(t,'byteLength','_l'),c(x,'buffer','_b'),c(x,'byteLength','_l'),c(x,'byteOffset',
'_o')),h(x.prototype,{getInt8:function(a){return W(this,1,a)[0]<<24>>24},getUint8:function(a){return W(this,1,a)[0]},getInt16:function(a,b){var c=W(this,2,a,b);return(c[1]<<8|c[0])<<16>>16},getUint16:function(a,b){var c=W(this,2,a,b);return c[1]<<8|c[0]},getInt32:function(a,b){return z(W(this,4,a,b))},getUint32:function(a,b){return z(W(this,4,a,b))>>>0},getFloat32:function(a,b){return F(W(this,4,a,b),23,4)},getFloat64:function(a,b){return F(W(this,8,a,b),52,8)},setInt8:function(a,b){P(this,1,a,G,
b)},setUint8:function(a,b){P(this,1,a,G,b)},setInt16:function(a,b,c){P(this,2,a,la,b,c)},setUint16:function(a,b,c){P(this,2,a,la,b,c)},setInt32:function(a,b,c){P(this,4,a,ia,b,c)},setUint32:function(a,b,c){P(this,4,a,ia,b,c)},setFloat32:function(a,b,c){P(this,4,a,V,b,c)},setFloat64:function(a,b,c){P(this,8,a,ea,b,c)}});a(t,'ArrayBuffer');a(x,'DataView');l(x.prototype,b.VIEW,!0);d.ArrayBuffer=t;d.DataView=x},function(b,d,a){b=a(6);b(b.G+b.W+b.F*!a(232).ABV,{DataView:a(233).DataView})},function(b,d,
a){a(236)('Int8',1,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){if(a(4)){var c=a(26),e=a(2),k=a(5),l=a(6),h=a(232),g=a(233),m=a(18),f=a(197),n=a(15),q=a(8);d=a(202);var r=a(36),u=a(35),t=a(37),x=a(14),y=a(3),w=a(69),C=a(73),D=a(11),v=a(56),E=a(154),ba=a(44),T=a(57),R=a(48).f,N=a(156),B=a(17),J=a(23),A=a(164),F=a(34),z=a(199),G=a(183),la=a(135),ia=a(157),ea=a(186),V=a(180),W=a(177),P=a(9);a=a(49);var X=P.f,S=a.f,fa=e.RangeError,H=e.TypeError,I=e.Uint8Array,Q=Array.prototype,
aa=g.ArrayBuffer,ma=g.DataView,ra=A(0),L=A(2),ja=A(3),Ba=A(4),sa=A(5),Y=A(6),ta=F(!0),Ga=F(!1),Ha=G.values,Ia=G.keys,Ca=G.entries,ya=Q.lastIndexOf,oa=Q.reduce,Ja=Q.reduceRight,ua=Q.join,O=Q.sort,za=Q.slice,qa=Q.toString,va=Q.toLocaleString,Aa=J('iterator'),wa=J('toStringTag'),ga=B('typed_constructor'),ca=B('def_constructor'),g=h.CONSTR,na=h.TYPED,Ka=h.VIEW,da=A(1,function(a,b){return xa(z(a,a[ca]),b)}),ha=k(function(){return 1===(new I((new Uint16Array([1])).buffer))[0]}),Ta=!!I&&!!I.prototype.set&&
k(function(){(new I(1)).set({})}),Da=function(a,b){if(a===p)throw H('Wrong length!');var c=+a,f=u(a);if(b&&!w(c,f))throw fa('Wrong length!');return f},K=function(a,b){var c=r(a);if(0>c||c%b)throw fa('Wrong offset!');return c},M=function(a){if(D(a)&&na in a)return a;throw H(a+' is not a typed array!');},xa=function(a,b){if(!(D(a)&&ga in a))throw H('It is not a typed array constructor!');return new a(b)},pa=function(a,b){return La(z(a,a[ca]),b)},La=function(a,b){for(var c=0,f=b.length,d=xa(a,f);f>c;)d[c]=
b[c++];return d},A=function(a,b,c){X(a,b,{get:function(){return this._d[c]}})},Ma=function(a){var b,c,f,d,e;f=v(a);c=arguments.length;var g=1<c?arguments[1]:p,h=g!==p;b=N(f);if(b!=p&&!E(b))for(e=b.call(f),f=[],b=0;!(d=e.next()).done;b++)f.push(d.value);h&&2<c&&(g=m(g,arguments[2],2));b=0;c=u(f.length);for(d=xa(this,c);c>b;b++)d[b]=h?g(f[b],b):f[b];return d},Na=function(){for(var a=0,b=arguments.length,c=xa(this,b);b>a;)c[a]=arguments[a++];return c},Oa=!!I&&k(function(){va.call(new I(1))}),Pa=function(){return va.apply(Oa?
za.call(M(this)):M(this),arguments)},Ea={copyWithin:function(a,b){return W.call(M(this),a,b,2<arguments.length?arguments[2]:p)},every:function(a){return Ba(M(this),a,1<arguments.length?arguments[1]:p)},fill:function(a){return V.apply(M(this),arguments)},filter:function(a){return pa(this,L(M(this),a,1<arguments.length?arguments[1]:p))},find:function(a){return sa(M(this),a,1<arguments.length?arguments[1]:p)},findIndex:function(a){return Y(M(this),a,1<arguments.length?arguments[1]:p)},forEach:function(a){ra(M(this),
a,1<arguments.length?arguments[1]:p)},indexOf:function(a){return Ga(M(this),a,1<arguments.length?arguments[1]:p)},includes:function(a){return ta(M(this),a,1<arguments.length?arguments[1]:p)},join:function(a){return ua.apply(M(this),arguments)},lastIndexOf:function(a){return ya.apply(M(this),arguments)},map:function(a){return da(M(this),a,1<arguments.length?arguments[1]:p)},reduce:function(a){return oa.apply(M(this),arguments)},reduceRight:function(a){return Ja.apply(M(this),arguments)},reverse:function(){for(var a,
b=M(this).length,c=Math.floor(b/2),f=0;f<c;)a=this[f],this[f++]=this[--b],this[b]=a;return this},some:function(a){return ja(M(this),a,1<arguments.length?arguments[1]:p)},sort:function(a){return O.call(M(this),a)},subarray:function(a,b){var c=M(this),f=c.length,d=t(a,f);return new (z(c,c[ca]))(c.buffer,c.byteOffset+d*c.BYTES_PER_ELEMENT,u((b===p?f:t(b,f))-d))}},Qa=function(a,b){return pa(this,za.call(M(this),a,b))},Ra=function(a,b){M(this);var c=K(b,1),f=this.length,d=v(a),e=u(d.length),g=0;if(e+c>
f)throw fa('Wrong length!');for(;g<e;)this[c+g]=d[g++]},Fa={entries:function(){return Ca.call(M(this))},keys:function(){return Ia.call(M(this))},values:function(){return Ha.call(M(this))}},Sa=function(a,b){return D(a)&&a[na]&&'symbol'!==typeof b&&b in a&&String(+b)==String(b)},B=function(a,b){return Sa(a,b=x(b,!0))?n(2,a[b]):S(a,b)},J=function(a,b,c){return!(Sa(a,b=x(b,!0))&&D(c)&&y(c,'value'))||y(c,'get')||y(c,'set')||c.configurable||y(c,'writable')&&!c.writable||y(c,'enumerable')&&!c.enumerable?
X(a,b,c):(a[b]=c.value,a)};g||(a.f=B,P.f=J);l(l.S+l.F*!g,'Object',{getOwnPropertyDescriptor:B,defineProperty:J});k(function(){qa.call({})})&&(qa=va=function(){return ua.call(this)});var ka=d({},Ea);d(ka,Fa);q(ka,Aa,Fa.values);d(ka,{slice:Qa,set:Ra,constructor:function(){},toString:qa,toLocaleString:Pa});A(ka,'buffer','b');A(ka,'byteOffset','o');A(ka,'byteLength','l');A(ka,'length','e');X(ka,wa,{get:function(){return this[na]}});b.exports=function(a,b,d,g){g=!!g;var m=a+(g?'Clamped':'')+'Array',n=
'Uint8Array'!=m,w='get'+a,M='set'+a,r=e[m],t=r||{},pa=r&&T(r);a={};var x=r&&r.prototype,xa=function(a,c){X(a,c,{get:function(){var a=this._d;return a.v[w](c*b+a.o,ha)},set:function(a){var f=this._d;g&&(a=0>(a=Math.round(a))?0:255<a?255:255&a);f.v[M](c*b+f.o,a,ha)},enumerable:!0})};r&&h.ABV?ia(function(a){new r(null);new r(a)},!0)||(r=d(function(a,c,d,e){f(a,r,m);var g;return D(c)?c instanceof aa||'ArrayBuffer'==(g=C(c))||'SharedArrayBuffer'==g?e!==p?new t(c,K(d,b),e):d!==p?new t(c,K(d,b)):new t(c):
na in c?La(r,c):Ma.call(r,c):new t(Da(c,n))}),ra(pa!==Function.prototype?R(t).concat(R(pa)):R(t),function(a){a in r||q(r,a,t[a])}),r.prototype=x,c||(x.constructor=r)):(r=d(function(a,c,d,e){f(a,r,m,'_d');var g,h,l=0,k=0;if(D(c)){if(!(c instanceof aa||'ArrayBuffer'==(g=C(c))||'SharedArrayBuffer'==g))return na in c?La(r,c):Ma.call(r,c);g=c;k=K(d,b);c=c.byteLength;if(e===p){if(c%b)throw fa('Wrong length!');if(h=c-k,0>h)throw fa('Wrong length!');}else if(h=u(e)*b,h+k>c)throw fa('Wrong length!');e=h/b}else e=
Da(c,!0),h=e*b,g=new aa(h);for(q(a,'_d',{b:g,o:k,l:h,e:e,v:new ma(g)});l<e;)xa(a,l++)}),x=r.prototype=ba(ka),q(x,'constructor',r));d=x[Aa];var pa=!!d&&('values'==d.name||d.name==p),G=Fa.values;q(r,ga,!0);q(x,na,m);q(x,Ka,!0);q(x,ca,r);(g?(new r(1))[wa]==m:wa in x)||X(x,wa,{get:function(){return m}});a[m]=r;l(l.G+l.W+l.F*(r!=t),a);l(l.S,m,{BYTES_PER_ELEMENT:b,from:Ma,of:Na});'BYTES_PER_ELEMENT'in x||q(x,'BYTES_PER_ELEMENT',b);l(l.P,m,Ea);ea(m);l(l.P+l.F*Ta,m,{set:Ra});l(l.P+l.F*!pa,m,Fa);l(l.P+l.F*
(x.toString!=qa),m,{toString:qa});l(l.P+l.F*k(function(){(new r(1)).slice()}),m,{slice:Qa});l(l.P+l.F*(k(function(){return[1,2].toLocaleString()!=(new r([1,2])).toLocaleString()})||!k(function(){x.toLocaleString.call([1,2])})),m,{toLocaleString:Pa});la[m]=pa?d:G;c||pa||q(x,Aa,G)}}else b.exports=function(){}},function(b,d,a){a(236)('Uint8',1,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Uint8',1,function(a){return function(b,c,d){return a(this,b,c,d)}},!0)},function(b,
d,a){a(236)('Int16',2,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Uint16',2,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Int32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Uint32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Float32',4,function(a){return function(b,c,d){return a(this,b,c,d)}})},function(b,d,a){a(236)('Float64',8,function(a){return function(b,
c,d){return a(this,b,c,d)}})},function(b,d,a){b=a(6);var c=a(34)(!0);b(b.P,'Array',{includes:function(a){return c(this,a,1<arguments.length?arguments[1]:p)}});a(178)('includes')},function(b,d,a){b=a(6);var c=a(125)(!0);b(b.P,'String',{at:function(a){return c(this,a)}})},function(b,d,a){b=a(6);var c=a(248);b(b.P,'String',{padStart:function(a){return c(this,a,1<arguments.length?arguments[1]:p,!0)}})},function(b,d,a){var c=a(35),e=a(85),k=a(33);b.exports=function(a,b,d,m){a=String(k(a));var f=a.length;
d=d===p?' ':String(d);b=c(b);if(b<=f||''==d)return a;b-=f;f=e.call(d,Math.ceil(b/d.length));return f.length>b&&(f=f.slice(0,b)),m?f+a:a+f}},function(b,d,a){b=a(6);var c=a(248);b(b.P,'String',{padEnd:function(a){return c(this,a,1<arguments.length?arguments[1]:p,!1)}})},function(b,d,a){a(81)('trimLeft',function(a){return function(){return a(this,1)}},'trimStart')},function(b,d,a){a(81)('trimRight',function(a){return function(){return a(this,2)}},'trimEnd')},function(b,d,a){b=a(6);var c=a(33),e=a(35),
k=a(128),l=a(188),h=RegExp.prototype,g=function(a,b){this._r=a;this._s=b};a(136)(g,'RegExp String',function(){var a=this._r.exec(this._s);return{value:a,done:null===a}});b(b.P,'String',{matchAll:function(a){if(c(this),!k(a))throw TypeError(a+' is not a regexp!');var b=String(this),d='flags'in h?String(a.flags):l.call(a),d=new RegExp(a.source,~d.indexOf('g')?d:'g'+d);return d.lastIndex=e(a.lastIndex),new g(d,b)}})},function(b,d,a){a(25)('asyncIterator')},function(b,d,a){a(25)('observable')},function(b,
d,a){b=a(6);var c=a(221),e=a(30),k=a(49),l=a(155);b(b.S,'Object',{getOwnPropertyDescriptors:function(a){var b;a=e(a);for(var d=k.f,f=c(a),h={},q=0;f.length>q;)l(h,b=f[q++],d(a,b));return h}})},function(b,d,a){b=a(6);var c=a(257)(!1);b(b.S,'Object',{values:function(a){return c(a)}})},function(b,d,a){var c=a(28),e=a(30),k=a(42).f;b.exports=function(a){return function(b){var d;b=e(b);for(var h=c(b),f=h.length,l=0,q=[];f>l;)k.call(b,d=h[l++])&&q.push(a?[d,b[d]]:b[d]);return q}}},function(b,d,a){b=a(6);
var c=a(257)(!0);b(b.S,'Object',{entries:function(a){return c(a)}})},function(b,d,a){b=a(6);var c=a(56),e=a(19),k=a(9);a(4)&&b(b.P+a(260),'Object',{__defineGetter__:function(a,b){k.f(c(this),a,{get:e(b),enumerable:!0,configurable:!0})}})},function(b,d,a){b.exports=a(26)||!a(5)(function(){var b=Math.random();__defineSetter__.call(null,b,function(){});delete a(2)[b]})},function(b,d,a){b=a(6);var c=a(56),e=a(19),k=a(9);a(4)&&b(b.P+a(260),'Object',{__defineSetter__:function(a,b){k.f(c(this),a,{set:e(b),
enumerable:!0,configurable:!0})}})},function(b,d,a){b=a(6);var c=a(56),e=a(14),k=a(57),l=a(49).f;a(4)&&b(b.P+a(260),'Object',{__lookupGetter__:function(a){var b=c(this),d=e(a,!0);do if(a=l(b,d))return a.get;while(b=k(b))}})},function(b,d,a){b=a(6);var c=a(56),e=a(14),k=a(57),l=a(49).f;a(4)&&b(b.P+a(260),'Object',{__lookupSetter__:function(a){var b=c(this),d=e(a,!0);do if(a=l(b,d))return a.set;while(b=k(b))}})},function(b,d,a){b=a(6);b(b.P+b.R,'Map',{toJSON:a(265)('Map')})},function(b,d,a){var c=a(73),
e=a(266);b.exports=function(a){return function(){if(c(this)!=a)throw TypeError(a+"#toJSON isn't generic");return e(this)}}},function(b,d,a){var c=a(198);b.exports=function(a,b){var d=[];return c(a,!1,d.push,d,b),d}},function(b,d,a){b=a(6);b(b.P+b.R,'Set',{toJSON:a(265)('Set')})},function(b,d,a){b=a(6);b(b.S,'System',{global:a(2)})},function(b,d,a){b=a(6);var c=a(32);b(b.S,'Error',{isError:function(a){return'Error'===c(a)}})},function(b,d,a){b=a(6);b(b.S,'Math',{iaddh:function(a,b,d,l){a>>>=0;d>>>=
0;return(b>>>0)+(l>>>0)+((a&d|(a|d)&~(a+d>>>0))>>>31)|0}})},function(b,d,a){b=a(6);b(b.S,'Math',{isubh:function(a,b,d,l){a>>>=0;d>>>=0;return(b>>>0)-(l>>>0)-((~a&d|~(a^d)&a-d>>>0)>>>31)|0}})},function(b,d,a){b=a(6);b(b.S,'Math',{imulh:function(a,b){var c=+a,d=+b,e=c&65535,g=d&65535,c=c>>16,d=d>>16,g=(c*g>>>0)+(e*g>>>16);return c*d+(g>>16)+((e*d>>>0)+(g&65535)>>16)}})},function(b,d,a){b=a(6);b(b.S,'Math',{umulh:function(a,b){var c=+a,d=+b,e=c&65535,g=d&65535,c=c>>>16,d=d>>>16,g=(c*g>>>0)+(e*g>>>16);
return c*d+(g>>>16)+((e*d>>>0)+(g&65535)>>>16)}})},function(b,d,a){b=a(275);var c=a(10),e=b.key,k=b.set;b.exp({defineMetadata:function(a,b,d,m){k(a,b,c(d),e(m))}})},function(b,d,a){var c=a(203),e=a(6);d=a(21)('metadata');var k=d.store||(d.store=new (a(207))),l=function(a,b,d){var f=k.get(a);if(!f){if(!d)return p;k.set(a,f=new c)}a=f.get(b);if(!a){if(!d)return p;f.set(b,a=new c)}return a};b.exports={store:k,map:l,has:function(a,b,c){b=l(b,c,!1);return b!==p&&b.has(a)},get:function(a,b,c){b=l(b,c,!1);
return b===p?p:b.get(a)},set:function(a,b,c,d){l(c,d,!0).set(a,b)},keys:function(a,b){var c=l(a,b,!1),d=[];return c&&c.forEach(function(a,b){d.push(b)}),d},key:function(a){return a===p||'symbol'===typeof a?a:String(a)},exp:function(a){e(e.S,'Reflect',a)}}},function(b,d,a){b=a(275);var c=a(10),e=b.key,k=b.map,l=b.store;b.exp({deleteMetadata:function(a,b){var d=3>arguments.length?p:e(arguments[2]),f=k(c(b),d,!1);if(f===p||!f['delete'](a))return!1;if(f.size)return!0;f=l.get(b);return f['delete'](d),
!!f.size||l['delete'](b)}})},function(b,d,a){b=a(275);var c=a(10),e=a(57),k=b.has,l=b.get,h=b.key,g=function(a,b,c){if(k(a,b,c))return l(a,b,c);b=e(b);return null!==b?g(a,b,c):p};b.exp({getMetadata:function(a,b){return g(a,c(b),3>arguments.length?p:h(arguments[2]))}})},function(b,d,a){var c=a(206),e=a(266);b=a(275);var k=a(10),l=a(57),h=b.keys,g=b.key,m=function(a,b){var d=h(a,b),f=l(a);if(null===f)return d;f=m(f,b);return f.length?d.length?e(new c(d.concat(f))):f:d};b.exp({getMetadataKeys:function(a){return m(k(a),
2>arguments.length?p:g(arguments[1]))}})},function(b,d,a){b=a(275);var c=a(10),e=b.get,k=b.key;b.exp({getOwnMetadata:function(a,b){return e(a,c(b),3>arguments.length?p:k(arguments[2]))}})},function(b,d,a){b=a(275);var c=a(10),e=b.keys,k=b.key;b.exp({getOwnMetadataKeys:function(a){return e(c(a),2>arguments.length?p:k(arguments[1]))}})},function(b,d,a){b=a(275);var c=a(10),e=a(57),k=b.has,l=b.key,h=function(a,b,c){if(k(a,b,c))return!0;b=e(b);return null!==b&&h(a,b,c)};b.exp({hasMetadata:function(a,
b){return h(a,c(b),3>arguments.length?p:l(arguments[2]))}})},function(b,d,a){b=a(275);var c=a(10),e=b.has,k=b.key;b.exp({hasOwnMetadata:function(a,b){return e(a,c(b),3>arguments.length?p:k(arguments[2]))}})},function(b,d,a){b=a(275);var c=a(10),e=a(19),k=b.key,l=b.set;b.exp({metadata:function(a,b){return function(d,f){l(a,b,(f!==p?c:e)(d),k(f))}}})},function(b,d,a){b=a(6);var c=a(201)(),e=a(2).process,k='process'==a(32)(e);b(b.G,{asap:function(a){var b=k&&e.domain;c(b?b.bind(a):a)}})},function(b,
d,a){b=a(6);var c=a(2),e=a(7),k=a(201)(),l=a(23)('observable'),h=a(19),g=a(10),m=a(197);d=a(202);var f=a(8),n=a(198),q=n.RETURN,r=function(a){return null==a?p:h(a)},u=function(a){var b=a._c;b&&(a._c=p,b())},t=function(a,b){g(a);this._c=p;this._o=a;a=new x(this);try{var c=b(a),d=c;null!=c&&('function'===typeof c.unsubscribe?c=function(){d.unsubscribe()}:h(c),this._c=c)}catch(E){return void a.error(E)}this._o===p&&u(this)};t.prototype=d({},{unsubscribe:function(){this._o===p||(this._o=p,u(this))}});
var x=function(a){this._s=a};x.prototype=d({},{next:function(a){var b=this._s;if(b._o!==p){var c=b._o;try{var d=r(c.next);if(d)return d.call(c,a)}catch(E){try{b._o===p||(b._o=p,u(b))}finally{throw E;}}}},error:function(a){var b=this._s;if(b._o===p)throw a;var c=b._o;b._o=p;try{var d=r(c.error);if(!d)throw a;a=d.call(c,a)}catch(E){try{u(b)}finally{throw E;}}return u(b),a},complete:function(a){var b=this._s;if(b._o!==p){var c=b._o;b._o=p;try{var d=r(c.complete);a=d?d.call(c,a):p}catch(E){try{u(b)}finally{throw E;
}}return u(b),a}}});var y=function(a){m(this,y,'Observable','_f')._f=h(a)};d(y.prototype,{subscribe:function(a){return new t(a,this._f)},forEach:function(a){var b=this;return new (e.Promise||c.Promise)(function(c,d){h(a);var f=b.subscribe({next:function(b){try{return a(b)}catch(T){d(T),f.unsubscribe()}},error:d,complete:c})})}});d(y,{from:function(a){var b='function'===typeof this?this:y,c=r(g(a)[l]);if(c){var d=g(c.call(a));return d.constructor===b?d:new b(function(a){return d.subscribe(a)})}return new b(function(b){var c=
!1;return k(function(){if(!c){try{if(n(a,!1,function(a){if(b.next(a),c)return q})===q)return}catch(T){if(c)throw T;return void b.error(T)}b.complete()}}),function(){c=!0}})},of:function(){for(var a=0,b=arguments.length,c=Array(b);a<b;)c[a]=arguments[a++];return new ('function'===typeof this?this:y)(function(a){var b=!1;return k(function(){if(!b){for(var d=0;d<c.length;++d)if(a.next(c[d]),b)return;a.complete()}}),function(){b=!0}})}});f(y.prototype,l,function(){return this});b(b.G,{Observable:y});
a(186)('Observable')},function(b,d,a){b=a(6);a=a(200);b(b.G+b.B,{setImmediate:a.set,clearImmediate:a.clear})},function(b,d,a){b=a(183);d=a(16);var c=a(2),e=a(8),k=a(135),l=a(23);a=l('iterator');for(var l=l('toStringTag'),h=k.Array,g=['NodeList','DOMTokenList','MediaList','StyleSheetList','CSSRuleList'],m=0;5>m;m++){var f,n=g[m],q=c[n];if(q=q&&q.prototype)for(f in q[a]||e(q,a,h),q[l]||e(q,l,n),k[n]=h,b)q[f]||d(q,f,b[f],!0)}},function(b,d,a){b=a(2);d=a(6);var c=a(76),e=a(289);a=b.navigator;var k=!!a&&
/MSIE .\./.test(a.userAgent);a=function(a){return k?function(b,d){return a(c(e,[].slice.call(arguments,2),'function'===typeof b?b:Function(b)),d)}:a};d(d.G+d.B+d.F*k,{setTimeout:a(b.setTimeout),setInterval:a(b.setInterval)})},function(b,d,a){var c=a(290),e=a(76),k=a(19);b.exports=function(){for(var a=k(this),b=arguments.length,d=Array(b),m=0,f=c._,n=!1;b>m;)(d[m]=arguments[m++])===f&&(n=!0);return function(){var c,g=arguments.length,h=0,l=0;if(!n&&!g)return e(a,d,this);if(c=d.slice(),n)for(;b>h;h++)c[h]===
f&&(c[h]=arguments[l++]);for(;g>l;)c.push(arguments[l++]);return e(a,c,this)}}},function(b,d,a){b.exports=a(2)}]);'undefined'!==typeof module&&module.exports?module.exports=v: true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return v}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):z.core=v}(1,1);
(function(v){v.URL=v.URL||v.webkitURL;if(v.Blob&&v.URL)try{new Blob;return}catch(p){}var z=v.BlobBuilder||v.WebKitBlobBuilder||v.MozBlobBuilder||function(p){var b=function(a){return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]},d=function(){this.data=[]},a=function(a,b,c){this.data=a;this.size=a.length;this.type=b;this.encoding=c},c=d.prototype,e=a.prototype,k=p.FileReaderSync,l=function(a){this.code=this[this.name=a]},h='NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR'.split(' '),
g=h.length,m=p.URL||p.webkitURL||p,f=m.createObjectURL,n=m.revokeObjectURL,q=m,r=p.btoa,u=p.atob,t=p.ArrayBuffer,x=p.Uint8Array,y=/^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;for(a.fake=e.fake=!0;g--;)l.prototype[h[g]]=g+1;m.createObjectURL||(q=p.URL=function(a){var b=document.createElementNS('http://www.w3.org/1999/xhtml','a');b.href=a;'origin'in b||('data:'===b.protocol.toLowerCase()?b.origin=null:(a=a.match(y),b.origin=a&&a[1]));return b});q.createObjectURL=function(b){var c=b.type;null===c&&(c='application/octet-stream');
if(b instanceof a)return c='data:'+c,'base64'===b.encoding?c+';base64,'+b.data:'URI'===b.encoding?c+','+decodeURIComponent(b.data):r?c+';base64,'+r(b.data):c+','+encodeURIComponent(b.data);if(f)return f.call(m,b)};q.revokeObjectURL=function(a){'data:'!==a.substring(0,5)&&n&&n.call(m,a)};c.append=function(c){var d=this.data;if(x&&(c instanceof t||c instanceof x)){var f='';c=new x(c);for(var e=0,g=c.length;e<g;e++)f+=String.fromCharCode(c[e]);d.push(f)}else if('Blob'===b(c)||'File'===b(c))if(k)f=new k,
d.push(f.readAsBinaryString(c));else throw new l('NOT_READABLE_ERR');else c instanceof a?'base64'===c.encoding&&u?d.push(u(c.data)):'URI'===c.encoding?d.push(decodeURIComponent(c.data)):'raw'===c.encoding&&d.push(c.data):('string'!==typeof c&&(c+=''),d.push(unescape(encodeURIComponent(c))))};c.getBlob=function(b){arguments.length||(b=null);return new a(this.data.join(''),b,'raw')};c.toString=function(){return'[object BlobBuilder]'};e.slice=function(b,c,d){var f=arguments.length;3>f&&(d=null);return new a(this.data.slice(b,
1<f?c:this.data.length),d,this.encoding)};e.toString=function(){return'[object Blob]'};e.close=function(){this.size=0;delete this.data};return d}(v);v.Blob=function(p,b){var d=b?b.type||'':'',a=new z;if(p)for(var c=0,e=p.length;c<e;c++)Uint8Array&&p[c]instanceof Uint8Array?a.append(p[c].buffer):a.append(p[c]);d=a.getBlob(d);!d.slice&&d.webkitSlice&&(d.slice=d.webkitSlice);return d};v.Blob.prototype=(Object.getPrototypeOf||function(p){return p.__proto__})(new v.Blob)})('undefined'!==typeof self&&self||
'undefined'!==typeof window&&window||this.content||this);
'document'in self&&('classList'in document.createElement('_')&&(!document.createElementNS||'classList'in document.createElementNS('http://www.w3.org/2000/svg','g'))?function(){var v=document.createElement('_');v.classList.add('c1','c2');if(!v.classList.contains('c2')){var z=function(b){var d=DOMTokenList.prototype[b];DOMTokenList.prototype[b]=function(a){var b,e=arguments.length;for(b=0;b<e;b++)a=arguments[b],d.call(this,a)}};z('add');z('remove')}v.classList.toggle('c3',!1);if(v.classList.contains('c3')){var p=
DOMTokenList.prototype.toggle;DOMTokenList.prototype.toggle=function(b,d){return 1 in arguments&&!this.contains(b)===!d?d:p.call(this,b)}}v=null}():function(v){if('Element'in v){v=v.Element.prototype;var z=Object,p=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,'')},b=Array.prototype.indexOf||function(a){for(var b=0,c=this.length;b<c;b++)if(b in this&&this[b]===a)return b;return-1},d=function(a,b){this.name=a;this.code=DOMException[a];this.message=b},a=function(a,c){if(''===c)throw new d('SYNTAX_ERR',
'An invalid or illegal string was specified');if(/\s/.test(c))throw new d('INVALID_CHARACTER_ERR','String contains an invalid character');return b.call(a,c)},c=function(a){for(var b=p.call(a.getAttribute('class')||''),b=b?b.split(/\s+/):[],c=0,d=b.length;c<d;c++)this.push(b[c]);this._updateClassName=function(){a.setAttribute('class',this.toString())}},e=c.prototype=[],k=function(){return new c(this)};d.prototype=Error.prototype;e.item=function(a){return this[a]||null};e.contains=function(b){return-1!==
a(this,b+'')};e.add=function(){var b=arguments,c=0,d=b.length,e,f=!1;do e=b[c]+'',-1===a(this,e)&&(this.push(e),f=!0);while(++c<d);f&&this._updateClassName()};e.remove=function(){var b=arguments,c=0,d=b.length,e,f=!1,n;do for(e=b[c]+'',n=a(this,e);-1!==n;)this.splice(n,1),f=!0,n=a(this,e);while(++c<d);f&&this._updateClassName()};e.toggle=function(a,b){a+='';var c=this.contains(a),d=c?!0!==b&&'remove':!1!==b&&'add';if(d)this[d](a);return!0===b||!1===b?b:!c};e.toString=function(){return this.join(' ')};
if(z.defineProperty){e={get:k,enumerable:!0,configurable:!0};try{z.defineProperty(v,'classList',e)}catch(l){if(void 0===l.number||-2146823252===l.number)e.enumerable=!1,z.defineProperty(v,'classList',e)}}else z.prototype.__defineGetter__&&v.__defineGetter__('classList',k)}}(self));
(function(v){function z(){this.fake=!0;this.boundary='--------FormData'+Math.random();this._fields=[]}v.FormData||(z.prototype.append=function(p,b){this._fields.push([p,b])},z.prototype.toString=function(){var p=this.boundary,b='';this._fields.forEach(function(d){b+='--'+p+'\r\n';if(d[1].name){var a=d[1];b+='Content-Disposition: form-data; name="'+d[0]+'"; filename="'+a.name+'"\r\n';b+='Content-Type: '+a.type+'\r\n\r\n';b+=a.getAsBinary()+'\r\n'}else b+='Content-Disposition: form-data; name="'+d[0]+
'";\r\n\r\n',b+=d[1]+'\r\n'});return b+='--'+p+'--'},v.FormData=z)})(window);
!function(v,z){ true?module.exports=z():'function'===typeof define&&define.amd?define(z):v.IntlPolyfill=z()}(this,function(){function v(a){for(var b in a)(a instanceof v||H.call(a,b))&&I(this,b,{value:a[b],enumerable:!0,writable:!0,configurable:!0})}function z(){I(this,'length',{writable:!0,value:0});arguments.length&&L.apply(this,ma.call(arguments))}function p(){if(Y.disableRegExpRestore)return function(){};for(var a={lastMatch:RegExp.lastMatch||'',
leftContext:RegExp.leftContext,multiline:RegExp.multiline,input:RegExp.input},b=!1,c=1;9>=c;c++)b=(a['$'+c]=RegExp['$'+c])||b;return function(){var c=/[.?*+^$[\]\\(){}|-]/g,d=a.lastMatch.replace(c,'\\$&'),f='';if(b)for(var e=1;9>=e;e++){var g=a['$'+e];g?(g=g.replace(c,'\\$&'),f+=d.substring(0,d.indexOf(g))+'(',d=g+')'+d.substring(d.indexOf(g)+g.length)):(f+='(',d=')'+d)}f=(f+d).replace(/((^|[^\\])((\\\\)*\\[()])+|[^()])+/g,function(a){return'[\\s\\S]{'+a.replace(/\\(.)/g,'$1').length+'}'});c=new RegExp(f,
a.multiline?'gm':'g');c.lastIndex=a.leftContext.length;c.exec(a.input)}}function b(a){if(null===a)throw new TypeError('Cannot convert null or undefined to object');return'object'===('undefined'===typeof a?'undefined':S['typeof'](a))?a:Object(a)}function d(a){return'number'===typeof a?a:Number(a)}function a(a){return H.call(a,'__getInternalProperties')?a.__getInternalProperties(ta):aa(null)}function c(a){for(var b=a.length;b--;){var c=a.charAt(b);'a'<=c&&'z'>=c&&(a=a.slice(0,b)+c.toUpperCase()+a.slice(b+
1))}return a}function e(a){return!!Ga.test(a)&&!Ha.test(a)&&!Ia.test(a)}function k(a){var b=void 0;a=a.toLowerCase();a=a.split('-');for(var c=1,d=a.length;c<d;c++)if(2===a[c].length)a[c]=a[c].toUpperCase();else if(4===a[c].length)a[c]=a[c].charAt(0).toUpperCase()+a[c].slice(1);else if(1===a[c].length&&'x'!==a[c])break;a=ja.call(a,'-');(b=a.match(Ca))&&1<b.length&&(b.sort(),a=a.replace(RegExp('(?:'+Ca.source+')+','i'),ja.call(b,'')));H.call(oa.tags,a)&&(a=oa.tags[a]);a=a.split('-');b=1;for(c=a.length;b<
c;b++)H.call(oa.subtags,a[b])?a[b]=oa.subtags[a[b]]:H.call(oa.extLang,a[b])&&(a[b]=oa.extLang[a[b]][0],1===b&&oa.extLang[a[1]][1]===a[0]&&(a=ma.call(a,b++),--c));return ja.call(a,'-')}function l(a){a=c(String(a));return!1!==Ja.test(a)}function h(a){if(void 0===a)return new z;var c=new z;a='string'===typeof a?[a]:a;a=b(a);var f;f=d(a.length);f=isNaN(f)?0:0===f||-0===f||f===+(1/0)||f===-(1/0)?f:0>f?-1*Math.floor(Math.abs(f)):Math.floor(Math.abs(f));f=0>=f?0:f===1/0?Math.pow(2,53)-1:Math.min(f,Math.pow(2,
53)-1);for(var g=0;g<f;){var h=String(g);if(h in a){h=a[h];if(null===h||'string'!==typeof h&&'object'!==('undefined'===typeof h?'undefined':S['typeof'](h)))throw new TypeError('String or Object type expected');h=String(h);if(!e(h))throw new RangeError("'"+h+"' is not a structurally valid language tag");h=k(h);-1===Q.call(c,h)&&L.call(c,h)}g++}return c}function g(a,b){for(var c=b;c;){if(-1<Q.call(a,c))return c;var d=c.lastIndexOf('-');if(0>d)break;2<=d&&'-'===c.charAt(d-2)&&(d-=2);c=c.substring(0,
d)}}function m(a,b,c,d,f){if(0===a.length)throw new ReferenceError('No locale data has been provided for this object yet.');for(var e=0,h=b.length,l=void 0,n=void 0,m=void 0;e<h&&!l;)n=b[e],m=String(n).replace(ua,''),l=g(a,m),e++;a=new v;if(void 0!==l){if(a['[[locale]]']=l,String(n)!==String(m))l=n.match(ua)[0],n=n.indexOf('-u-'),a['[[extension]]']=l,a['[[extensionIndex]]']=n}else a['[[locale]]']=ya;n=a['[[locale]]'];b=m=void 0;if(H.call(a,'[[extension]]')){l=a['[[extension]]'];m=l.length;if(0===
m)a=[];else{a=[];for(var h=!0,K=e=b=3;b<m;)45===l.codePointAt(b)&&(2===b-e?(1<e-K&&(h=l.substring(K,e-1),a.push(h)),e=l.substring(e,b),a.push(e),K=b+1,h=!1):!0===h&&(e=l.substring(e,b),a.push(e),K=b+1),e=b+1),b+=1;2===m-e&&(1<e-K&&(b=l.substring(K,e-1),a.push(b)),K=e);l=l.substring(K,m);a=(a.push(l),a)}m=a;b=m.length}a=new v;a['[[dataLocale]]']=n;l='-u';e=0;for(h=d.length;e<h;){var K=d[e],q=f[n][K],r=q[0],u='',M=Q;if(void 0!==m){var t=M.call(m,K);-1!==t&&(t+1<b&&2<m[t+1].length?(t=m[t+1],-1!==M.call(q,
t)&&(r=t,u='-'+K+'-'+r)):-1!==M(q,'true')&&(r='true'))}H.call(c,'[['+K+']]')&&(t=c['[['+K+']]'],-1!==M.call(q,t)&&t!==r&&(r=t,u=''));a['[['+K+']]']=r;l+=u;e++}2<l.length&&(d=n.indexOf('-x-'),-1===d?n+=l:(c=n.substring(0,d),d=n.substring(d),n=c+l+d),n=k(n));return a['[[locale]]']=n,a}function f(a,c,d){var f=void 0;if(void 0!==d&&(d=new v(b(d)),f=d.localeMatcher,void 0!==f&&(f=String(f),'lookup'!==f&&'best fit'!==f)))throw new RangeError('matcher should be "lookup" or "best fit"');d=c.length;for(var f=
new z,e=0;e<d;){var h=c[e],l=String(h).replace(ua,'');void 0!==g(a,l)&&L.call(f,h);e++}a=ma.call(f);for(var n in a)H.call(a,n)&&I(a,n,{writable:!1,configurable:!1,value:a[n]});return I(a,'length',{writable:!1}),a}function n(a,b,c,d,f){a=a[b];if(void 0!==a){if(a='boolean'===c?!!a:'string'===c?String(a):a,void 0!==d&&-1===Q.call(d,a))throw new RangeError("'"+a+"' is not an allowed value for `"+b+'`');return a}return f}function q(a,b,c,d,f){a=a[b];if(void 0!==a){if(a=Number(a),isNaN(a)||a<c||a>d)throw new RangeError('Value is not a number or outside accepted range');
return Math.floor(a)}return f}function r(a,c){return this&&this!==O?u(b(this),a,c):new O.NumberFormat(a,c)}function u(c,d,f){var e=a(c),g=p();if(!0===e['[[initializedIntlObject]]'])throw new TypeError('`this` object has already been initialized as an Intl object');I(c,'__getInternalProperties',{value:function(a){if(a===ta)return e}});e['[[initializedIntlObject]]']=!0;var k=h(d);f=void 0===f?{}:b(f);var K=new v;d=n(f,'localeMatcher','string',new z('lookup','best fit'),'best fit');K['[[localeMatcher]]']=
d;d=Y.NumberFormat['[[localeData]]'];k=m(Y.NumberFormat['[[availableLocales]]'],k,K,Y.NumberFormat['[[relevantExtensionKeys]]'],d);e['[[locale]]']=k['[[locale]]'];e['[[numberingSystem]]']=k['[[nu]]'];e['[[dataLocale]]']=k['[[dataLocale]]'];k=k['[[dataLocale]]'];K=n(f,'style','string',new z('decimal','percent','currency'),'decimal');e['[[style]]']=K;var r=n(f,'currency','string');if(void 0!==r&&!l(r))throw new RangeError("'"+r+"' is not a valid currency code");if('currency'===K&&void 0===r)throw new TypeError('Currency code is required when style is currency');
var u=void 0;'currency'===K&&(r=r.toUpperCase(),e['[[currency]]']=r,u=void 0!==za[r]?za[r]:2);r=n(f,'currencyDisplay','string',new z('code','symbol','name'),'symbol');'currency'===K&&(e['[[currencyDisplay]]']=r);r=q(f,'minimumIntegerDigits',1,21,1);e['[[minimumIntegerDigits]]']=r;r=q(f,'minimumFractionDigits',0,20,'currency'===K?u:0);e['[[minimumFractionDigits]]']=r;u=q(f,'maximumFractionDigits',r,20,'currency'===K?Math.max(r,u):'percent'===K?Math.max(r,0):Math.max(r,3));e['[[maximumFractionDigits]]']=
u;u=f.minimumSignificantDigits;r=f.maximumSignificantDigits;void 0===u&&void 0===r||(u=q(f,'minimumSignificantDigits',1,21,1),r=q(f,'maximumSignificantDigits',u,21,21),e['[[minimumSignificantDigits]]']=u,e['[[maximumSignificantDigits]]']=r);f=n(f,'useGrouping','boolean',void 0,!0);e['[[useGrouping]]']=f;f=d[k].patterns[K];return e['[[positivePattern]]']=f.positivePattern,e['[[negativePattern]]']=f.negativePattern,e['[[boundFormat]]']=void 0,e['[[initializedNumberFormat]]']=!0,fa&&(c.format=t.call(c)),
g(),c}function t(){var b=null!==this&&'object'===S['typeof'](this)&&a(this);if(!b||!b['[[initializedNumberFormat]]'])throw new TypeError('`this` value for format() is not an initialized Intl.NumberFormat object.');if(void 0===b['[[boundFormat]]']){var c=sa.call(function(a){return w(this,Number(a))},this);b['[[boundFormat]]']=c}return b['[[boundFormat]]']}function x(b,c){var d=a(b),f;if(H.call(d,'[[minimumSignificantDigits]]')&&H.call(d,'[[maximumSignificantDigits]]')){f=d['[[minimumSignificantDigits]]'];
var e=d['[[maximumSignificantDigits]]'],g;0===c?(d=ja.call(Array(e+1),'0'),g=0):(d=Math.abs(c),'function'===typeof Math.log10?g=Math.floor(Math.log10(d)):(g=Math.round(Math.log(d)*Math.LOG10E),g-=Number('1e'+g)>d),d=Math.round(Math.exp(Math.abs(g-e+1)*Math.LN10)),d=String(Math.round(0>g-e+1?c*d:c/d)));if(g>=e)f=d+ja.call(Array(g-e+2),'0');else{if(g!==e-1&&(0<=g?d=d.slice(0,g+1)+'.'+d.slice(g+1):0>g&&(d='0.'+ja.call(Array(-(g+1)+1),'0')+d),0<=d.indexOf('.')&&e>f)){for(f=e-f;0<f&&'0'===d.charAt(d.length-
1);)d=d.slice(0,-1),f--;'.'===d.charAt(d.length-1)&&(d=d.slice(0,-1))}f=d}}else{f=d['[[minimumIntegerDigits]]'];e=d['[[minimumFractionDigits]]'];d=d['[[maximumFractionDigits]]'];g=Math.pow(10,d)*c;g=0===g?'0':g.toFixed(0);var h=void 0,l=-1<(h=g.indexOf('e'))?g.slice(h+1):0;l&&(g=g.slice(0,h).replace('.',''),g+=ja.call(Array(l-(g.length-1)+1),'0'));0!==d?(l=g.length,l<=d&&(g=ja.call(Array(d+1-l+1),'0')+g,l=d+1),h=g.substring(0,l-d),g=g.substring(l-d,g.length),g=h+'.'+g,h=h.length):h=g.length;for(e=
d-e;0<e&&'0'===g.slice(-1);)g=g.slice(0,-1),e--;if('.'===g.slice(-1)&&(g=g.slice(0,-1)),h<f)g=ja.call(Array(f-h+1),'0')+g;f=g}return f}function y(b,c){var d=a(b),f=d['[[numberingSystem]]'],e=Y.NumberFormat['[[localeData]]'][d['[[dataLocale]]']],g=e.symbols[f]||e.symbols.latn,h=void 0;!isNaN(c)&&0>c?(c=-c,h=d['[[negativePattern]]']):h=d['[[positivePattern]]'];for(var l=new z,n=h.indexOf('{',0),k=0,m=0,q=h.length;-1<n&&n<q;){if(k=h.indexOf('}',n),-1===k)throw Error();n>m&&(m=h.substring(m,n),L.call(l,
{'[[type]]':'literal','[[value]]':m}));m=h.substring(n+1,k);if('number'===m)if(isNaN(c))L.call(l,{'[[type]]':'nan','[[value]]':g.nan});else if(isFinite(c)){'percent'===d['[[style]]']&&(c*=100);var r=x(b,c);qa[f]?!function(){var a=qa[f];r=String(r).replace(/\d/g,function(b){return a[b]})}():r=String(r);var n=m=void 0,u=r.indexOf('.',0);if(0<u?(m=r.substring(0,u),n=r.substring(u+1,u.length)):(m=r,n=void 0),!0===d['[[useGrouping]]']){var u=g.group,t=[],w=e.patterns.primaryGroupSize||3,p=e.patterns.secondaryGroupSize||
w;if(m.length>w){var w=m.length-w,G=w%p,C=m.slice(0,G);for(C.length&&L.call(t,C);G<w;)L.call(t,m.slice(G,G+p)),G+=p;L.call(t,m.slice(w))}else L.call(t,m);if(0===t.length)throw Error();for(;t.length;)m=Ba.call(t),L.call(l,{'[[type]]':'integer','[[value]]':m}),t.length&&L.call(l,{'[[type]]':'group','[[value]]':u})}else L.call(l,{'[[type]]':'integer','[[value]]':m});void 0!==n&&(L.call(l,{'[[type]]':'decimal','[[value]]':g.decimal}),L.call(l,{'[[type]]':'fraction','[[value]]':n}))}else L.call(l,{'[[type]]':'infinity',
'[[value]]':g.infinity});else'plusSign'===m?L.call(l,{'[[type]]':'plusSign','[[value]]':g.plusSign}):'minusSign'===m?L.call(l,{'[[type]]':'minusSign','[[value]]':g.minusSign}):'percentSign'===m&&'percent'===d['[[style]]']?L.call(l,{'[[type]]':'literal','[[value]]':g.percentSign}):'currency'===m&&'currency'===d['[[style]]']?(n=d['[[currency]]'],m=void 0,'code'===d['[[currencyDisplay]]']?m=n:'symbol'===d['[[currencyDisplay]]']?m=e.currencies[n]||n:'name'===d['[[currencyDisplay]]']&&(m=n),L.call(l,{'[[type]]':'currency',
'[[value]]':m})):(n=h.substring(n,k),L.call(l,{'[[type]]':'literal','[[value]]':n}));m=k+1;n=h.indexOf('{',m)}m<q&&(d=h.substring(m,q),L.call(l,{'[[type]]':'literal','[[value]]':d}));return l}function w(a,b){for(var c=y(a,b),d='',f=0;c.length>f;f++)d+=c[f]['[[value]]'];return d}function C(a){return a.pattern12=a.extendedPattern.replace(/'([^']*)'/g,function(a,b){return b||"'"}),a.pattern=a.pattern12.replace('{ampm}','').replace(Aa,''),a}function D(a,b){switch(a.charAt(0)){case 'G':return b.era=['short',
'short','short','long','narrow'][a.length-1],'{era}';case 'y':case 'Y':case 'u':case 'U':case 'r':return b.year=2===a.length?'2-digit':'numeric','{year}';case 'Q':case 'q':return b.quarter=['numeric','2-digit','short','long','narrow'][a.length-1],'{quarter}';case 'M':case 'L':return b.month=['numeric','2-digit','short','long','narrow'][a.length-1],'{month}';case 'w':return b.week=2===a.length?'2-digit':'numeric','{weekday}';case 'W':return b.week='numeric','{weekday}';case 'd':return b.day=2===a.length?
'2-digit':'numeric','{day}';case 'D':case 'F':case 'g':return b.day='numeric','{day}';case 'E':return b.weekday='short short short long narrow short'.split(' ')[a.length-1],'{weekday}';case 'e':return b.weekday='numeric 2-digit short long narrow short'.split(' ')[a.length-1],'{weekday}';case 'c':return b.weekday=['numeric',void 0,'short','long','narrow','short'][a.length-1],'{weekday}';case 'a':case 'b':case 'B':return b.hour12=!0,'{ampm}';case 'h':case 'H':return b.hour=2===a.length?'2-digit':'numeric',
'{hour}';case 'k':case 'K':return b.hour12=!0,b.hour=2===a.length?'2-digit':'numeric','{hour}';case 'm':return b.minute=2===a.length?'2-digit':'numeric','{minute}';case 's':return b.second=2===a.length?'2-digit':'numeric','{second}';case 'S':case 'A':return b.second='numeric','{second}';case 'z':case 'Z':case 'O':case 'v':case 'V':case 'X':case 'x':return b.timeZoneName=4>a.length?'short':'long','{timeZoneName}'}}function U(a,b){if(!wa.test(b)){var c={originalPattern:b,_:{}};return c.extendedPattern=
b.replace(va,function(a){return D(a,c._)}),a.replace(va,function(a){return D(a,c)}),C(c)}}function E(a,b,c,d,f){a=a[b]&&a[b][c]?a[b][c]:a.gregory[c];b={narrow:['short','long'],'short':['long','narrow'],'long':['short','narrow']};d=H.call(a,d)?a[d]:H.call(a,b[d][0])?a[b[d][0]]:a[b[d][1]];return null!==f?d[f]:d}function ba(a,c){return this&&this!==O?T(b(this),a,c):new O.DateTimeFormat(a,c)}function T(b,d,f){var e=a(b),g=p();if(!0===e['[[initializedIntlObject]]'])throw new TypeError('`this` object has already been initialized as an Intl object');
I(b,'__getInternalProperties',{value:function(a){if(a===ta)return e}});e['[[initializedIntlObject]]']=!0;var l=h(d);f=N(f,'any','date');var k=new v;d=n(f,'localeMatcher','string',new z('lookup','best fit'),'best fit');k['[[localeMatcher]]']=d;var q=Y.DateTimeFormat,r=q['[[localeData]]'],k=m(q['[[availableLocales]]'],l,k,q['[[relevantExtensionKeys]]'],r);e['[[locale]]']=k['[[locale]]'];e['[[calendar]]']=k['[[ca]]'];e['[[numberingSystem]]']=k['[[nu]]'];e['[[dataLocale]]']=k['[[dataLocale]]'];l=k['[[dataLocale]]'];
k=f.timeZone;if(void 0!==k&&(k=c(k),'UTC'!==k))throw new RangeError('timeZone is not supported.');e['[[timeZone]]']=k;var k=new v,u;for(u in da)H.call(da,u)&&(q=n(f,u,'string',da[u]),k['[['+u+']]']=q);u=void 0;r=r[l];u=R(r.formats);(d=n(f,'formatMatcher','string',new z('basic','best fit'),'best fit'),r.formats=u,'basic'===d)?u=B(k,u):(d=n(f,'hour12','boolean'),k.hour12=void 0===d?r.hour12:d,u=J(k,u));for(var t in da)H.call(da,t)&&H.call(u,t)&&(d=u[t],d=u._&&H.call(u._,t)?u._[t]:d,e['[['+t+']]']=d);
t=void 0;f=n(f,'hour12','boolean');e['[[hour]]']?(f=void 0===f?r.hour12:f,e['[[hour12]]']=f,!0===f)?(e['[[hourNo0]]']=r.hourNo0,t=u.pattern12):t=u.pattern:t=u.pattern;return e['[[pattern]]']=t,e['[[boundFormat]]']=void 0,e['[[initializedDateTimeFormat]]']=!0,fa&&(b.format=A.call(b)),g(),b}function R(a){if('[object Array]'!==Object.prototype.toString.call(a)){var b=a.availableFormats,c=a.timeFormats,d=a.dateFormats,f=[],e=void 0,g=void 0,h=void 0,l=[],n=[];for(e in b)if(b.hasOwnProperty(e)&&(g=b[e],
h=U(e,g))){f.push(h);var k;a:{k=h;for(var m=0;m<ca.length;m+=1)if(k.hasOwnProperty(ca[m])){k=!1;break a}k=!0}if(k)n.push(h);else{a:{k=h;for(m=0;m<ga.length;m+=1)if(k.hasOwnProperty(ga[m])){k=!1;break a}k=!0}k&&l.push(h)}}for(e in c)c.hasOwnProperty(e)&&(g=c[e],h=U(e,g),h&&(f.push(h),l.push(h)));for(e in d)d.hasOwnProperty(e)&&(g=d[e],h=U(e,g),h&&(f.push(h),n.push(h)));for(b=0;b<l.length;b+=1)for(c=0;c<n.length;c+=1){g='long'===n[c].month?n[c].weekday?a.full:a['long']:'short'===n[c].month?a.medium:
a['short'];e=n[c];h=l[b];d={_:{}};for(k=0;k<ga.length;k+=1)e[ga[k]]&&(d[ga[k]]=e[ga[k]]),e._[ga[k]]&&(d._[ga[k]]=e._[ga[k]]);for(e=0;e<ca.length;e+=1)h[ca[e]]&&(d[ca[e]]=h[ca[e]]),h._[ca[e]]&&(d._[ca[e]]=h._[ca[e]]);h=d;h.originalPattern=g;h.extendedPattern=g.replace('{0}',l[b].extendedPattern).replace('{1}',n[c].extendedPattern).replace(/^[,\s]+|[,\s]+$/gi,'');f.push(C(h))}a=f}return a}function N(a,c,d){if(void 0===a)a=null;else{var f=b(a);a=new v;for(var e in f)a[e]=f[e]}a=aa(a);f=!0;return'date'!==
c&&'any'!==c||void 0===a.weekday&&void 0===a.year&&void 0===a.month&&void 0===a.day||(f=!1),'time'!==c&&'any'!==c||void 0===a.hour&&void 0===a.minute&&void 0===a.second||(f=!1),!f||'date'!==d&&'all'!==d||(a.year=a.month=a.day='numeric'),!f||'time'!==d&&'all'!==d||(a.hour=a.minute=a.second='numeric'),a}function B(a,b){for(var c=-(1/0),d=void 0,f=0,e=b.length;f<e;){var g=b[f],h=0,l;for(l in da)if(H.call(da,l)){var n=a['[['+l+']]'],k=H.call(g,l)?g[l]:void 0;if(void 0===n&&void 0!==k)h-=20;else if(void 0!==
n&&void 0===k)h-=120;else{var m=['2-digit','numeric','narrow','short','long'],n=Q.call(m,n),k=Q.call(m,k),k=Math.max(Math.min(k-n,2),-2);2===k?h-=6:1===k?h-=3:-1===k?h-=6:-2===k&&(h-=8)}}h>c&&(c=h,d=g);f++}return d}function J(a,b){var c=[],d;for(d in da)H.call(da,d)&&void 0!==a['[['+d+']]']&&c.push(d);if(1===c.length){d=c[0];c=a['[['+c[0]+']]'];if(na[d]&&na[d][c])var f,c=(f={originalPattern:na[d][c],_:V({},d,c),extendedPattern:'{'+d+'}'},V(f,d,c),V(f,'pattern12','{'+d+'}'),V(f,'pattern','{'+d+'}'),
f);else c=void 0;if(c)return c}f=-(1/0);c=void 0;d=0;for(var e=b.length;d<e;){var g=b[d],h=0,l;for(l in da)if(H.call(da,l)){var k=a['[['+l+']]'],n=H.call(g,l)?g[l]:void 0,m=H.call(g._,l)?g._[l]:void 0;(k!==m&&(h-=2),void 0===k&&void 0!==n)?h-=20:void 0!==k&&void 0===n?h-=120:(m=['2-digit','numeric','narrow','short','long'],k=Q.call(m,k),n=Q.call(m,n),m=Math.max(Math.min(n-k,2),-2),1>=n&&2<=k||2<=n&&1>=k?0<m?h-=6:0>m&&(h-=8):1<m?h-=3:-1>m&&(h-=6))}g._.hour12!==a.hour12&&--h;h>f&&(f=h,c=g);d++}return c}
function A(){var b=null!==this&&'object'===S['typeof'](this)&&a(this);if(!b||!b['[[initializedDateTimeFormat]]'])throw new TypeError('`this` value for format() is not an initialized Intl.DateTimeFormat object.');if(void 0===b['[[boundFormat]]']){var c=sa.call(function(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:void 0,a=void 0===a?Date.now():d(a);return Z(this,a)},this);b['[[boundFormat]]']=c}return b['[[boundFormat]]']}function F(a,b){if(!isFinite(b))throw new RangeError('Invalid valid date passed to format');
var c=a.__getInternalProperties(ta);p();var d=c['[[locale]]'],f=new O.NumberFormat([d],{useGrouping:!1}),e=new O.NumberFormat([d],{minimumIntegerDigits:2,useGrouping:!1}),g;g=new Date(b);var h='get'+(c['[[timeZone]]']||'');g=new v({'[[weekday]]':g[h+'Day'](),'[[era]]':+(0<=g[h+'FullYear']()),'[[year]]':g[h+'FullYear'](),'[[month]]':g[h+'Month'](),'[[day]]':g[h+'Date'](),'[[hour]]':g[h+'Hours'](),'[[minute]]':g[h+'Minutes'](),'[[second]]':g[h+'Seconds'](),'[[inDST]]':!1});for(var h=c['[[pattern]]'],
l=new z,k=0,n=h.indexOf('{'),m=0,q=Y.DateTimeFormat['[[localeData]]'][c['[[dataLocale]]']].calendars,r=c['[[calendar]]'];-1!==n;){var u=void 0;if(m=h.indexOf('}',n),-1===m)throw Error('Unclosed pattern');n>k&&L.call(l,{type:'literal',value:h.substring(k,n)});k=h.substring(n+1,m);if(da.hasOwnProperty(k)){var n=c['[['+k+']]'],t=g['[['+k+']]'];if('year'===k&&0>=t?t=1-t:'month'===k?t++:'hour'===k&&!0===c['[[hour12]]']&&(t%=12,0===t&&!0===c['[[hourNo0]]']&&(t=12)),'numeric'===n)u=w(f,t);else if('2-digit'===
n)u=w(e,t),2<u.length&&(u=u.slice(-2));else if(n in Ka)switch(k){case 'month':u=E(q,r,'months',n,g['[['+k+']]']);break;case 'weekday':try{u=E(q,r,'days',n,g['[['+k+']]'])}catch(ka){throw Error('Could not find weekday data for locale '+d);}break;case 'timeZoneName':u='';break;case 'era':try{u=E(q,r,'eras',n,g['[['+k+']]'])}catch(ka){throw Error('Could not find era data for locale '+d);}break;default:u=g['[['+k+']]']}L.call(l,{type:k,value:u})}else'ampm'===k?(u=E(q,r,'dayPeriods',11<g['[[hour]]']?'pm':
'am',null),L.call(l,{type:'dayPeriod',value:u})):L.call(l,{type:'literal',value:h.substring(n,m+1)});k=m+1;n=h.indexOf('{',k)}return m<h.length-1&&L.call(l,{type:'literal',value:h.substr(m+1)}),l}function Z(a,b){for(var c=F(a,b),d='',f=0;c.length>f;f++)d+=c[f].value;return d}var G='function'===typeof Symbol&&'symbol'===typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&'function'===typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a},la=function(){var a=
'function'===typeof Symbol&&Symbol['for']&&Symbol['for']('react.element')||60103;return function(b,c,d,f){var e=b&&b.defaultProps,g=arguments.length-3;if(c||0===g||(c={}),c&&e)for(var h in e)void 0===c[h]&&(c[h]=e[h]);else c||(c=e||{});if(1===g)c.children=f;else if(1<g){e=Array(g);for(h=0;h<g;h++)e[h]=arguments[h+3];c.children=e}return{$$typeof:a,type:b,key:void 0===d?null:''+d,ref:null,props:c,_owner:null}}}(),ia=function(){function a(a){this.value=a}function b(b){function c(f,e){try{var g=b[f](e),
h=g.value;h instanceof a?Promise.resolve(h.value).then(function(a){c('next',a)},function(a){c('throw',a)}):d(g.done?'return':'normal',g.value)}catch(Ea){d('throw',Ea)}}function d(a,b){switch(a){case 'return':f.resolve({value:b,done:!0});break;case 'throw':f.reject(b);break;default:f.resolve({value:b,done:!1})}(f=f.next)?c(f.key,f.arg):e=null}var f,e;this._invoke=function(a,b){return new Promise(function(d,g){var h={key:a,arg:b,resolve:d,reject:g,next:null};e?e=e.next=h:(f=e=h,c(a,b))})};'function'!==
typeof b['return']&&(this['return']=void 0)}return'function'===typeof Symbol&&Symbol.asyncIterator&&(b.prototype[Symbol.asyncIterator]=function(){return this}),b.prototype.next=function(a){return this._invoke('next',a)},b.prototype['throw']=function(a){return this._invoke('throw',a)},b.prototype['return']=function(a){return this._invoke('return',a)},{wrap:function(a){return function(){return new b(a.apply(this,arguments))}},await:function(b){return new a(b)}}}(),ea=function(){function a(a,b){for(var c=
0;c<b.length;c++){var d=b[c];d.enumerable=d.enumerable||!1;d.configurable=!0;'value'in d&&(d.writable=!0);Object.defineProperty(a,d.key,d)}}return function(b,c,d){return c&&a(b.prototype,c),d&&a(b,d),b}}(),V=function(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a},W=Object.assign||function(a){for(var b=1;b<arguments.length;b++){var c=arguments[b],d;for(d in c)Object.prototype.hasOwnProperty.call(c,d)&&(a[d]=c[d])}return a},P='undefined'===
typeof global?self:global,X=function(){return function(a,b){if(Array.isArray(a))return a;if(Symbol.iterator in Object(a)){var c=[],d=!0,f=!1,e=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!b||c.length!==b);d=!0);}catch(Na){f=!0,e=Na}finally{try{!d&&h['return']&&h['return']()}finally{if(f)throw e;}}return c}throw new TypeError('Invalid attempt to destructure non-iterable instance');}}(),S=Object.freeze({jsx:la,asyncIterator:function(a){if('function'===typeof Symbol){if(Symbol.asyncIterator){var b=
a[Symbol.asyncIterator];if(null!=b)return b.call(a)}if(Symbol.iterator)return a[Symbol.iterator]()}throw new TypeError('Object is not async iterable');},asyncGenerator:ia,asyncGeneratorDelegate:function(a,b){function c(c,d){return f=!0,d=new Promise(function(b){b(a[c](d))}),{done:!1,value:b(d)}}var d={},f=!1;return'function'===typeof Symbol&&Symbol.iterator&&(d[Symbol.iterator]=function(){return this}),d.next=function(a){return f?(f=!1,a):c('next',a)},'function'===typeof a['throw']&&(d['throw']=function(a){if(f)throw f=
!1,a;return c('throw',a)}),'function'===typeof a['return']&&(d['return']=function(a){return c('return',a)}),d},asyncToGenerator:function(a){return function(){var b=a.apply(this,arguments);return new Promise(function(a,c){function d(f,e){try{var g=b[f](e),h=g.value}catch(Oa){return void c(Oa)}return g.done?void a(h):Promise.resolve(h).then(function(a){d('next',a)},function(a){d('throw',a)})}return d('next')})}},classCallCheck:function(a,b){if(!(a instanceof b))throw new TypeError('Cannot call a class as a function');
},createClass:ea,defineEnumerableProperties:function(a,b){for(var c in b){var d=b[c];d.configurable=d.enumerable=!0;'value'in d&&(d.writable=!0);Object.defineProperty(a,c,d)}return a},defaults:function(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var f=c[d],e=Object.getOwnPropertyDescriptor(b,f);e&&e.configurable&&void 0===a[f]&&Object.defineProperty(a,f,e)}return a},defineProperty:V,get:function Da(a,b,c){null===a&&(a=Function.prototype);var d=Object.getOwnPropertyDescriptor(a,
b);if(void 0===d)return a=Object.getPrototypeOf(a),null===a?void 0:Da(a,b,c);if('value'in d)return d.value;b=d.get;if(void 0!==b)return b.call(c)},inherits:function(a,b){if('function'!==typeof b&&null!==b)throw new TypeError('Super expression must either be null or a function, not '+typeof b);a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}});b&&(Object.setPrototypeOf?Object.setPrototypeOf(a,b):a.__proto__=b)},interopRequireDefault:function(a){return a&&
a.__esModule?a:{'default':a}},interopRequireWildcard:function(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b['default']=a,b},newArrowCheck:function(a,b){if(a!==b)throw new TypeError('Cannot instantiate an arrow function');},objectDestructuringEmpty:function(a){if(null==a)throw new TypeError('Cannot destructure undefined');},objectWithoutProperties:function(a,b){var c={},d;for(d in a)0<=b.indexOf(d)||Object.prototype.hasOwnProperty.call(a,
d)&&(c[d]=a[d]);return c},possibleConstructorReturn:function(a,b){if(!a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!b||'object'!==typeof b&&'function'!==typeof b?a:b},selfGlobal:P,set:function K(a,b,c,d){var f=Object.getOwnPropertyDescriptor(a,b);void 0===f?(a=Object.getPrototypeOf(a),null!==a&&K(a,b,c,d)):'value'in f&&f.writable?f.value=c:(b=f.set,void 0!==b&&b.call(d,c));return c},slicedToArray:X,slicedToArrayLoose:function(a,b){if(Array.isArray(a))return a;
if(Symbol.iterator in Object(a)){for(var c,d=[],f=a[Symbol.iterator]();!(c=f.next()).done&&(d.push(c.value),!b||d.length!==b););return d}throw new TypeError('Invalid attempt to destructure non-iterable instance');},taggedTemplateLiteral:function(a,b){return Object.freeze(Object.defineProperties(a,{raw:{value:Object.freeze(b)}}))},taggedTemplateLiteralLoose:function(a,b){return a.raw=b,a},temporalRef:function(a,b,c){if(a===c)throw new ReferenceError(b+' is not defined - temporal dead zone');return a},
temporalUndefined:{},toArray:function(a){return Array.isArray(a)?a:Array.from(a)},toConsumableArray:function(a){if(Array.isArray(a)){for(var b=0,c=Array(a.length);b<a.length;b++)c[b]=a[b];return c}return Array.from(a)},'typeof':G,'extends':W,'instanceof':function(a,b){return null!=b&&'undefined'!==typeof Symbol&&b[Symbol.hasInstance]?b[Symbol.hasInstance](a):a instanceof b}}),G=function(){var a=function(){};try{return Object.defineProperty(a,'a',{get:function(){return 1}}),Object.defineProperty(a,
'prototype',{writable:!1}),1===a.a&&a.prototype instanceof Object}catch(M){return!1}}(),fa=!G&&!Object.prototype.__defineGetter__,H=Object.prototype.hasOwnProperty,I=G?Object.defineProperty:function(a,b,c){'get'in c&&a.__defineGetter__?a.__defineGetter__(b,c.get):(!H.call(a,b)||'value'in c)&&(a[b]=c.value)},Q=Array.prototype.indexOf||function(a,b){if(!this.length)return-1;for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},aa=Object.create||function(a,b){function c(){}var d=void 0;
c.prototype=a;var d=new c,f;for(f in b)H.call(b,f)&&I(d,f,b[f]);return d},ma=Array.prototype.slice,ra=Array.prototype.concat,L=Array.prototype.push,ja=Array.prototype.join,Ba=Array.prototype.shift,sa=Function.prototype.bind||function(a){var b=this,c=ma.call(arguments,1);return function(){return b.apply(a,ra.call(c,ma.call(arguments)))}},Y=aa(null),ta=Math.random();v.prototype=aa(null);z.prototype=aa(null);var Ga=/^(?:(?:[a-z]{2,3}(?:-[a-z]{3}(?:-[a-z]{3}){0,2})?|[a-z]{4}|[a-z]{5,8})(?:-[a-z]{4})?(?:-(?:[a-z]{2}|\d{3}))?(?:-(?:[a-z0-9]{5,8}|\d[a-z0-9]{3}))*(?:-[0-9a-wy-z](?:-[a-z0-9]{2,8})+)*(?:-x(?:-[a-z0-9]{1,8})+)?|x(?:-[a-z0-9]{1,8})+|(?:(?:en-GB-oed|i-(?:ami|bnn|default|enochian|hak|klingon|lux|mingo|navajo|pwn|tao|tay|tsu)|sgn-(?:BE-FR|BE-NL|CH-DE))|(?:art-lojban|cel-gaulish|no-bok|no-nyn|zh-(?:guoyu|hakka|min|min-nan|xiang))))$/i,
Ha=/^(?!x).*?-((?:[a-z0-9]{5,8}|\d[a-z0-9]{3}))-(?:\w{4,8}-(?!x-))*\1\b/i,Ia=/^(?!x).*?-([0-9a-wy-z])-(?:\w+-(?!x-))*\1\b/i,Ca=RegExp('-[0-9a-wy-z](?:-[a-z0-9]{2,8})+','ig'),ya=void 0,oa={tags:{'art-lojban':'jbo','i-ami':'ami','i-bnn':'bnn','i-hak':'hak','i-klingon':'tlh','i-lux':'lb','i-navajo':'nv','i-pwn':'pwn','i-tao':'tao','i-tay':'tay','i-tsu':'tsu','no-bok':'nb','no-nyn':'nn','sgn-BE-FR':'sfb','sgn-BE-NL':'vgt','sgn-CH-DE':'sgg','zh-guoyu':'cmn','zh-hakka':'hak','zh-min-nan':'nan','zh-xiang':'hsn',
'sgn-BR':'bzs','sgn-CO':'csn','sgn-DE':'gsg','sgn-DK':'dsl','sgn-ES':'ssp','sgn-FR':'fsl','sgn-GB':'bfi','sgn-GR':'gss','sgn-IE':'isg','sgn-IT':'ise','sgn-JP':'jsl','sgn-MX':'mfs','sgn-NI':'ncs','sgn-NL':'dse','sgn-NO':'nsl','sgn-PT':'psr','sgn-SE':'swl','sgn-US':'ase','sgn-ZA':'sfs','zh-cmn':'cmn','zh-cmn-Hans':'cmn-Hans','zh-cmn-Hant':'cmn-Hant','zh-gan':'gan','zh-wuu':'wuu','zh-yue':'yue'},subtags:{BU:'MM',DD:'DE',FX:'FR',TP:'TL',YD:'YE',ZR:'CD',heploc:'alalc97','in':'id',iw:'he',ji:'yi',jw:'jv',
mo:'ro',ayx:'nun',bjd:'drl',ccq:'rki',cjr:'mom',cka:'cmr',cmk:'xch',drh:'khk',drw:'prs',gav:'dev',hrr:'jal',ibi:'opa',kgh:'kml',lcq:'ppr',mst:'mry',myt:'mry',sca:'hle',tie:'ras',tkk:'twm',tlw:'weo',tnf:'prs',ybd:'rki',yma:'lrr'},extLang:{aao:['aao','ar'],abh:['abh','ar'],abv:['abv','ar'],acm:['acm','ar'],acq:['acq','ar'],acw:['acw','ar'],acx:['acx','ar'],acy:['acy','ar'],adf:['adf','ar'],ads:['ads','sgn'],aeb:['aeb','ar'],aec:['aec','ar'],aed:['aed','sgn'],aen:['aen','sgn'],afb:['afb','ar'],afg:['afg',
'sgn'],ajp:['ajp','ar'],apc:['apc','ar'],apd:['apd','ar'],arb:['arb','ar'],arq:['arq','ar'],ars:['ars','ar'],ary:['ary','ar'],arz:['arz','ar'],ase:['ase','sgn'],asf:['asf','sgn'],asp:['asp','sgn'],asq:['asq','sgn'],asw:['asw','sgn'],auz:['auz','ar'],avl:['avl','ar'],ayh:['ayh','ar'],ayl:['ayl','ar'],ayn:['ayn','ar'],ayp:['ayp','ar'],bbz:['bbz','ar'],bfi:['bfi','sgn'],bfk:['bfk','sgn'],bjn:['bjn','ms'],bog:['bog','sgn'],bqn:['bqn','sgn'],bqy:['bqy','sgn'],btj:['btj','ms'],bve:['bve','ms'],bvl:['bvl',
'sgn'],bvu:['bvu','ms'],bzs:['bzs','sgn'],cdo:['cdo','zh'],cds:['cds','sgn'],cjy:['cjy','zh'],cmn:['cmn','zh'],coa:['coa','ms'],cpx:['cpx','zh'],csc:['csc','sgn'],csd:['csd','sgn'],cse:['cse','sgn'],csf:['csf','sgn'],csg:['csg','sgn'],csl:['csl','sgn'],csn:['csn','sgn'],csq:['csq','sgn'],csr:['csr','sgn'],czh:['czh','zh'],czo:['czo','zh'],doq:['doq','sgn'],dse:['dse','sgn'],dsl:['dsl','sgn'],dup:['dup','ms'],ecs:['ecs','sgn'],esl:['esl','sgn'],esn:['esn','sgn'],eso:['eso','sgn'],eth:['eth','sgn'],
fcs:['fcs','sgn'],fse:['fse','sgn'],fsl:['fsl','sgn'],fss:['fss','sgn'],gan:['gan','zh'],gds:['gds','sgn'],gom:['gom','kok'],gse:['gse','sgn'],gsg:['gsg','sgn'],gsm:['gsm','sgn'],gss:['gss','sgn'],gus:['gus','sgn'],hab:['hab','sgn'],haf:['haf','sgn'],hak:['hak','zh'],hds:['hds','sgn'],hji:['hji','ms'],hks:['hks','sgn'],hos:['hos','sgn'],hps:['hps','sgn'],hsh:['hsh','sgn'],hsl:['hsl','sgn'],hsn:['hsn','zh'],icl:['icl','sgn'],ils:['ils','sgn'],inl:['inl','sgn'],ins:['ins','sgn'],ise:['ise','sgn'],isg:['isg',
'sgn'],isr:['isr','sgn'],jak:['jak','ms'],jax:['jax','ms'],jcs:['jcs','sgn'],jhs:['jhs','sgn'],jls:['jls','sgn'],jos:['jos','sgn'],jsl:['jsl','sgn'],jus:['jus','sgn'],kgi:['kgi','sgn'],knn:['knn','kok'],kvb:['kvb','ms'],kvk:['kvk','sgn'],kvr:['kvr','ms'],kxd:['kxd','ms'],lbs:['lbs','sgn'],lce:['lce','ms'],lcf:['lcf','ms'],liw:['liw','ms'],lls:['lls','sgn'],lsg:['lsg','sgn'],lsl:['lsl','sgn'],lso:['lso','sgn'],lsp:['lsp','sgn'],lst:['lst','sgn'],lsy:['lsy','sgn'],ltg:['ltg','lv'],lvs:['lvs','lv'],
lzh:['lzh','zh'],max:['max','ms'],mdl:['mdl','sgn'],meo:['meo','ms'],mfa:['mfa','ms'],mfb:['mfb','ms'],mfs:['mfs','sgn'],min:['min','ms'],mnp:['mnp','zh'],mqg:['mqg','ms'],mre:['mre','sgn'],msd:['msd','sgn'],msi:['msi','ms'],msr:['msr','sgn'],mui:['mui','ms'],mzc:['mzc','sgn'],mzg:['mzg','sgn'],mzy:['mzy','sgn'],nan:['nan','zh'],nbs:['nbs','sgn'],ncs:['ncs','sgn'],nsi:['nsi','sgn'],nsl:['nsl','sgn'],nsp:['nsp','sgn'],nsr:['nsr','sgn'],nzs:['nzs','sgn'],okl:['okl','sgn'],orn:['orn','ms'],ors:['ors',
'ms'],pel:['pel','ms'],pga:['pga','ar'],pks:['pks','sgn'],prl:['prl','sgn'],prz:['prz','sgn'],psc:['psc','sgn'],psd:['psd','sgn'],pse:['pse','ms'],psg:['psg','sgn'],psl:['psl','sgn'],pso:['pso','sgn'],psp:['psp','sgn'],psr:['psr','sgn'],pys:['pys','sgn'],rms:['rms','sgn'],rsi:['rsi','sgn'],rsl:['rsl','sgn'],sdl:['sdl','sgn'],sfb:['sfb','sgn'],sfs:['sfs','sgn'],sgg:['sgg','sgn'],sgx:['sgx','sgn'],shu:['shu','ar'],slf:['slf','sgn'],sls:['sls','sgn'],sqk:['sqk','sgn'],sqs:['sqs','sgn'],ssh:['ssh','ar'],
ssp:['ssp','sgn'],ssr:['ssr','sgn'],svk:['svk','sgn'],swc:['swc','sw'],swh:['swh','sw'],swl:['swl','sgn'],syy:['syy','sgn'],tmw:['tmw','ms'],tse:['tse','sgn'],tsm:['tsm','sgn'],tsq:['tsq','sgn'],tss:['tss','sgn'],tsy:['tsy','sgn'],tza:['tza','sgn'],ugn:['ugn','sgn'],ugy:['ugy','sgn'],ukl:['ukl','sgn'],uks:['uks','sgn'],urk:['urk','ms'],uzn:['uzn','uz'],uzs:['uzs','uz'],vgt:['vgt','sgn'],vkk:['vkk','ms'],vkt:['vkt','ms'],vsi:['vsi','sgn'],vsl:['vsl','sgn'],vsv:['vsv','sgn'],wuu:['wuu','zh'],xki:['xki',
'sgn'],xml:['xml','sgn'],xmm:['xmm','ms'],xms:['xms','sgn'],yds:['yds','sgn'],ysl:['ysl','sgn'],yue:['yue','zh'],zib:['zib','sgn'],zlm:['zlm','ms'],zmi:['zmi','ms'],zsl:['zsl','sgn'],zsm:['zsm','ms']}},Ja=/^[A-Z]{3}$/,ua=/-u(?:-[0-9a-z]{2,8})+/gi,O={};Object.defineProperty(O,'getCanonicalLocales',{enumerable:!1,configurable:!0,writable:!0,value:function(a){a=h(a);for(var b=[],c=a.length,d=0;d<c;)b[d]=a[d],d++;return b}});var za={BHD:3,BYR:0,XOF:0,BIF:0,XAF:0,CLF:4,CLP:0,KMF:0,DJF:0,XPF:0,GNF:0,ISK:0,
IQD:3,JPY:0,JOD:3,KRW:0,KWD:3,LYD:3,OMR:3,PYG:0,RWF:0,TND:3,UGX:0,UYI:0,VUV:0,VND:0};I(O,'NumberFormat',{configurable:!0,writable:!0,value:r});I(O.NumberFormat,'prototype',{writable:!1});Y.NumberFormat={'[[availableLocales]]':[],'[[relevantExtensionKeys]]':['nu'],'[[localeData]]':{}};I(O.NumberFormat,'supportedLocalesOf',{configurable:!0,writable:!0,value:sa.call(function(a,b){if(!H.call(this,'[[availableLocales]]'))throw new TypeError('supportedLocalesOf() is not a constructor');var c=p(),d=this['[[availableLocales]]'],
e=h(a);return c(),f(d,e,b)},Y.NumberFormat)});I(O.NumberFormat.prototype,'format',{configurable:!0,get:t});Object.defineProperty(O.NumberFormat.prototype,'formatToParts',{configurable:!0,enumerable:!1,writable:!0,value:function(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:void 0,c=null!==this&&'object'===S['typeof'](this)&&a(this);if(!c||!c['[[initializedNumberFormat]]'])throw new TypeError('`this` value for formatToParts() is not an initialized Intl.NumberFormat object.');for(var b=
y(this,Number(b)),c=[],d=0,f=0;b.length>f;f++){var e=b[f],g={};g.type=e['[[type]]'];g.value=e['[[value]]'];c[d]=g;d+=1}return c}});var qa={arab:'٠١٢٣٤٥٦٧٨٩'.split(''),arabext:'۰۱۲۳۴۵۶۷۸۹'.split(''),bali:'᭐᭑᭒᭓᭔᭕᭖᭗᭘᭙'.split(''),beng:'০১২৩৪৫৬৭৮৯'.split(''),deva:'०१२३४५६७८९'.split(''),fullwide:'０１２３４５６７８９'.split(''),gujr:'૦૧૨૩૪૫૬૭૮૯'.split(''),guru:'੦੧੨੩੪੫੬੭੮੯'.split(''),hanidec:'〇一二三四五六七八九'.split(''),khmr:'០១២៣៤៥៦៧៨៩'.split(''),knda:'೦೧೨೩೪೫೬೭೮೯'.split(''),laoo:'໐໑໒໓໔໕໖໗໘໙'.split(''),latn:'0123456789'.split(''),
limb:'᥆᥇᥈᥉᥊᥋᥌᥍᥎᥏'.split(''),mlym:'൦൧൨൩൪൫൬൭൮൯'.split(''),mong:'᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙'.split(''),mymr:'၀၁၂၃၄၅၆၇၈၉'.split(''),orya:'୦୧୨୩୪୫୬୭୮୯'.split(''),tamldec:'௦௧௨௩௪௫௬௭௮௯'.split(''),telu:'౦౧౨౩౪౫౬౭౮౯'.split(''),thai:'๐๑๒๓๔๕๖๗๘๙'.split(''),tibt:'༠༡༢༣༤༥༦༧༨༩'.split('')};I(O.NumberFormat.prototype,'resolvedOptions',{configurable:!0,writable:!0,value:function(){var b=void 0,c=new v,d='locale numberingSystem style currency currencyDisplay minimumIntegerDigits minimumFractionDigits maximumFractionDigits minimumSignificantDigits maximumSignificantDigits useGrouping'.split(' '),
f=null!==this&&'object'===S['typeof'](this)&&a(this);if(!f||!f['[[initializedNumberFormat]]'])throw new TypeError('`this` value for resolvedOptions() is not an initialized Intl.NumberFormat object.');for(var e=0,g=d.length;e<g;e++)H.call(f,b='[['+d[e]+']]')&&(c[d[e]]={value:f[b],writable:!0,configurable:!0,enumerable:!0});return aa({},c)}});var va=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g,
Aa=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,wa=/[rqQASjJgwWIQq]/,ga='era year month day weekday quarter'.split(' '),ca=['hour','minute','second','hour12','timeZoneName'],na={second:{numeric:'s','2-digit':'ss'},minute:{numeric:'m','2-digit':'mm'},year:{numeric:'y','2-digit':'yy'},day:{numeric:'d','2-digit':'dd'},month:{numeric:'L','2-digit':'LL',narrow:'LLLLL','short':'LLL','long':'LLLL'},weekday:{narrow:'ccccc','short':'ccc','long':'cccc'}},Ka=aa(null,{narrow:{},'short':{},'long':{}});I(O,'DateTimeFormat',
{configurable:!0,writable:!0,value:ba});I(ba,'prototype',{writable:!1});var da={weekday:['narrow','short','long'],era:['narrow','short','long'],year:['2-digit','numeric'],month:['2-digit','numeric','narrow','short','long'],day:['2-digit','numeric'],hour:['2-digit','numeric'],minute:['2-digit','numeric'],second:['2-digit','numeric'],timeZoneName:['short','long']};Y.DateTimeFormat={'[[availableLocales]]':[],'[[relevantExtensionKeys]]':['ca','nu'],'[[localeData]]':{}};I(O.DateTimeFormat,'supportedLocalesOf',
{configurable:!0,writable:!0,value:sa.call(function(a,b){if(!H.call(this,'[[availableLocales]]'))throw new TypeError('supportedLocalesOf() is not a constructor');var c=p(),d=this['[[availableLocales]]'],e=h(a);return c(),f(d,e,b)},Y.NumberFormat)});I(O.DateTimeFormat.prototype,'format',{configurable:!0,get:A});Object.defineProperty(O.DateTimeFormat.prototype,'formatToParts',{enumerable:!1,writable:!0,configurable:!0,value:function(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:void 0,
c=null!==this&&'object'===S['typeof'](this)&&a(this);if(!c||!c['[[initializedDateTimeFormat]]'])throw new TypeError('`this` value for formatToParts() is not an initialized Intl.DateTimeFormat object.');for(var b=void 0===b?Date.now():d(b),b=F(this,b),c=[],f=0;b.length>f;f++){var e=b[f];c.push({type:e.type,value:e.value})}return c}});I(O.DateTimeFormat.prototype,'resolvedOptions',{writable:!0,configurable:!0,value:function(){var b=void 0,c=new v,d='locale calendar numberingSystem timeZone hour12 weekday era year month day hour minute second timeZoneName'.split(' '),
f=null!==this&&'object'===S['typeof'](this)&&a(this);if(!f||!f['[[initializedDateTimeFormat]]'])throw new TypeError('`this` value for resolvedOptions() is not an initialized Intl.DateTimeFormat object.');for(var e=0,g=d.length;e<g;e++)H.call(f,b='[['+d[e]+']]')&&(c[d[e]]={value:f[b],writable:!0,configurable:!0,enumerable:!0});return aa({},c)}});var ha=O.__localeSensitiveProtos={Number:{},Date:{}};if(ha.Number.toLocaleString=function(a,b){if('[object Number]'!==Object.prototype.toString.call(this))throw new TypeError('`this` value must be a number for Number.prototype.toLocaleString()');
return w(new r(a,b),this)},ha.Date.toLocaleString=function(a,b){if('[object Date]'!==Object.prototype.toString.call(this))throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleString()');var c=+this;if(isNaN(c))return'Invalid Date';var d;d=N(b,'any','all');d=new ba(a,d);return Z(d,c)},ha.Date.toLocaleDateString=function(a,b){if('[object Date]'!==Object.prototype.toString.call(this))throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleDateString()');
var c=+this;if(isNaN(c))return'Invalid Date';var d;d=N(b,'date','date');d=new ba(a,d);return Z(d,c)},ha.Date.toLocaleTimeString=function(a,b){if('[object Date]'!==Object.prototype.toString.call(this))throw new TypeError('`this` value must be a Date instance for Date.prototype.toLocaleTimeString()');var c=+this;if(isNaN(c))return'Invalid Date';var d;d=N(b,'time','time');d=new ba(a,d);return Z(d,c)},I(O,'__applyLocaleSensitivePrototypes',{writable:!0,configurable:!0,value:function(){I(Number.prototype,
'toLocaleString',{writable:!0,configurable:!0,value:ha.Number.toLocaleString});I(Date.prototype,'toLocaleString',{writable:!0,configurable:!0,value:ha.Date.toLocaleString});for(var a in ha.Date)H.call(ha.Date,a)&&I(Date.prototype,a,{writable:!0,configurable:!0,value:ha.Date[a]})}}),I(O,'__addLocaleData',{value:function(a){if(!e(a.locale))throw Error('Invalid language tag "'+a.locale+'" when calling __addLocaleData("'+a.locale+'", ...) to register new locale data.');var b=a.locale;if(!a.number)throw Error("Object passed doesn't contain locale data for Intl.NumberFormat");
var c,d=[b];c=b.split('-');for(2<c.length&&4===c[1].length&&L.call(d,c[0]+'-'+c[2]);c=Ba.call(d);)L.call(Y.NumberFormat['[[availableLocales]]'],c),Y.NumberFormat['[[localeData]]'][c]=a.number,a.date&&(a.date.nu=a.number.nu,L.call(Y.DateTimeFormat['[[availableLocales]]'],c),Y.DateTimeFormat['[[localeData]]'][c]=a.date);void 0===ya&&(ya=b)}}),I(O,'__disableRegExpRestore',{value:function(){Y.disableRegExpRestore=!0}}),'undefined'===typeof Intl)try{window.Intl=O,O.__applyLocaleSensitivePrototypes()}catch(K){}return O});
(function(v){function z(a){switch(typeof a){case 'undefined':return'undefined';case 'boolean':return'boolean';case 'number':return'number';case 'string':return'string';default:return null===a?'null':'object'}}function p(a){return Object.prototype.toString.call(a).replace(/^\[object *|\]$/g,'')}function b(a){return'function'===typeof a}function d(a){if(null===a||void 0===a)throw TypeError();return Object(a)}function a(a){function b(b){Object.defineProperty(a,b,{get:function(){return a._getter(b)},
set:function(c){a._setter(b,c)},enumerable:!0,configurable:!1})}if(!('TYPED_ARRAY_POLYFILL_NO_ARRAY_ACCESSORS'in v)){if(1E5<a.length)throw RangeError('Array too large for polyfill');var c;for(c=0;c<a.length;c+=1)b(c)}}function c(a,b){var c=32-b;return a<<c>>c}function e(a,b){var c=32-b;return a<<c>>>c}function k(a){return[a&255]}function l(a){return c(a[0],8)}function h(a){return[a&255]}function g(a){return e(a[0],8)}function m(a){a=Z(Number(a));return[0>a?0:255<a?255:a&255]}function f(a){return[a&
255,a>>8&255]}function n(a){return c(a[1]<<8|a[0],16)}function q(a){return[a&255,a>>8&255]}function r(a){return e(a[1]<<8|a[0],16)}function u(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function t(a){return c(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function x(a){return[a&255,a>>8&255,a>>16&255,a>>24&255]}function y(a){return e(a[3]<<24|a[2]<<16|a[1]<<8|a[0],32)}function w(a,b,c){function d(a){var b=N(a);a-=b;return.5>a?b:.5<a?b+1:b%2?b+1:b}var f=(1<<b-1)-1,e,g,h;a!==a?(g=(1<<b)-1,h=F(2,c-1),e=0):Infinity===
a||-Infinity===a?(g=(1<<b)-1,h=0,e=0>a?1:0):0===a?(h=g=0,e=-Infinity===1/a?1:0):(e=0>a,a=R(a),a>=F(2,1-f)?(g=A(N(B(a)/T),1023),h=a/F(2,g),1>h&&(--g,h*=2),2<=h&&(g+=1,h/=2),a=F(2,c),h=d(h*a)-a,g+=f,1<=h/a&&(g+=1,h=0),g>2*f&&(g=(1<<b)-1,h=0)):(g=0,h=d(a/F(2,1-f-c))));for(f=[];c;--c)f.push(h%2?1:0),h=N(h/2);for(c=b;c;--c)f.push(g%2?1:0),g=N(g/2);f.push(e?1:0);f.reverse();b=f.join('');for(e=[];b.length;)e.unshift(parseInt(b.substring(0,8),2)),b=b.substring(8);return e}function C(a,b,c){var d=[],f,e,g;
for(f=0;f<a.length;++f)for(g=a[f],e=8;e;--e)d.push(g%2?1:0),g>>=1;d.reverse();e=d.join('');a=(1<<b-1)-1;d=parseInt(e.substring(0,1),2)?-1:1;f=parseInt(e.substring(1,1+b),2);e=parseInt(e.substring(1+b),2);return f===(1<<b)-1?0!==e?NaN:Infinity*d:0<f?d*F(2,f-a)*(1+e/F(2,c)):0!==e?d*F(2,-(a-1))*(e/F(2,c)):0>d?-0:0}function D(a){return C(a,11,52)}function U(a){return w(a,11,52)}function E(a){return C(a,8,23)}function ba(a){return w(a,8,23)}var T=Math.LN2,R=Math.abs,N=Math.floor,B=Math.log,J=Math.max,
A=Math.min,F=Math.pow,Z=Math.round;(function(){var a=Object.defineProperty,b;try{b=Object.defineProperty({},'x',{})}catch(ia){b=!1}a&&b||(Object.defineProperty=function(b,c,d){if(a)try{return a(b,c,d)}catch(W){}if(b!==Object(b))throw TypeError('Object.defineProperty called on non-object');Object.prototype.__defineGetter__&&'get'in d&&Object.prototype.__defineGetter__.call(b,c,d.get);Object.prototype.__defineSetter__&&'set'in d&&Object.prototype.__defineSetter__.call(b,c,d.set);'value'in d&&(b[c]=
d.value);return b})})();(function(){function c(a){a>>=0;if(0>a)throw RangeError('ArrayBuffer size is not a small enough positive integer.');Object.defineProperty(this,'byteLength',{value:a});Object.defineProperty(this,'_bytes',{value:Array(a)});for(var b=0;b<a;b+=1)this._bytes[b]=0}function e(){if(!arguments.length||'object'!==typeof arguments[0])return function(a){a>>=0;if(0>a)throw RangeError('length is not a small enough positive integer.');Object.defineProperty(this,'length',{value:a});Object.defineProperty(this,
'byteLength',{value:a*this.BYTES_PER_ELEMENT});Object.defineProperty(this,'buffer',{value:new c(this.byteLength)});Object.defineProperty(this,'byteOffset',{value:0})}.apply(this,arguments);if(1<=arguments.length&&'object'===z(arguments[0])&&arguments[0]instanceof e)return function(a){if(this.constructor!==a.constructor)throw TypeError();var b=a.length*this.BYTES_PER_ELEMENT;Object.defineProperty(this,'buffer',{value:new c(b)});Object.defineProperty(this,'byteLength',{value:b});Object.defineProperty(this,
'byteOffset',{value:0});Object.defineProperty(this,'length',{value:a.length});for(b=0;b<this.length;b+=1)this._setter(b,a._getter(b))}.apply(this,arguments);if(1<=arguments.length&&'object'===z(arguments[0])&&!(arguments[0]instanceof e)&&!(arguments[0]instanceof c||'ArrayBuffer'===p(arguments[0])))return function(a){var b=a.length*this.BYTES_PER_ELEMENT;Object.defineProperty(this,'buffer',{value:new c(b)});Object.defineProperty(this,'byteLength',{value:b});Object.defineProperty(this,'byteOffset',
{value:0});Object.defineProperty(this,'length',{value:a.length});for(b=0;b<this.length;b+=1)this._setter(b,Number(a[b]))}.apply(this,arguments);if(1<=arguments.length&&'object'===z(arguments[0])&&(arguments[0]instanceof c||'ArrayBuffer'===p(arguments[0])))return function(a,b,c){b>>>=0;if(b>a.byteLength)throw RangeError('byteOffset out of range');if(b%this.BYTES_PER_ELEMENT)throw RangeError('buffer length minus the byteOffset is not a multiple of the element size.');if(void 0===c){var d=a.byteLength-
b;if(d%this.BYTES_PER_ELEMENT)throw RangeError('length of buffer minus byteOffset not a multiple of the element size');c=d/this.BYTES_PER_ELEMENT}else c>>>=0,d=c*this.BYTES_PER_ELEMENT;if(b+d>a.byteLength)throw RangeError('byteOffset and length reference an area beyond the end of the buffer');Object.defineProperty(this,'buffer',{value:a});Object.defineProperty(this,'byteLength',{value:d});Object.defineProperty(this,'byteOffset',{value:b});Object.defineProperty(this,'length',{value:c})}.apply(this,
arguments);throw TypeError();}function w(b,c,d){var f=function(){Object.defineProperty(this,'constructor',{value:f});e.apply(this,arguments);a(this)};'__proto__'in f?f.__proto__=e:(f.from=e.from,f.of=e.of);f.BYTES_PER_ELEMENT=b;var g=function(){};g.prototype=C;f.prototype=new g;Object.defineProperty(f.prototype,'BYTES_PER_ELEMENT',{value:b});Object.defineProperty(f.prototype,'_pack',{value:c});Object.defineProperty(f.prototype,'_unpack',{value:d});return f}v.ArrayBuffer=v.ArrayBuffer||c;Object.defineProperty(e,
'from',{value:function(a){return new this(a)}});Object.defineProperty(e,'of',{value:function(){return new this(arguments)}});var C={};e.prototype=C;Object.defineProperty(e.prototype,'_getter',{value:function(a){if(1>arguments.length)throw SyntaxError('Not enough arguments');a>>>=0;if(!(a>=this.length)){var b=[],c,d;c=0;for(d=this.byteOffset+a*this.BYTES_PER_ELEMENT;c<this.BYTES_PER_ELEMENT;c+=1,d+=1)b.push(this.buffer._bytes[d]);return this._unpack(b)}}});Object.defineProperty(e.prototype,'get',{value:e.prototype._getter});
Object.defineProperty(e.prototype,'_setter',{value:function(a,b){if(2>arguments.length)throw SyntaxError('Not enough arguments');a>>>=0;if(!(a>=this.length)){var c=this._pack(b),d,f;d=0;for(f=this.byteOffset+a*this.BYTES_PER_ELEMENT;d<this.BYTES_PER_ELEMENT;d+=1,f+=1)this.buffer._bytes[f]=c[d]}}});Object.defineProperty(e.prototype,'constructor',{value:e});Object.defineProperty(e.prototype,'copyWithin',{value:function(a,b,c){var f=d(this),e=f.length>>>0,e=J(e,0);a>>=0;a=0>a?J(e+a,0):A(a,e);b>>=0;b=
0>b?J(e+b,0):A(b,e);c=void 0===c?e:c>>0;c=0>c?J(e+c,0):A(c,e);e=A(c-b,e-a);for(b<a&&a<b+e?(c=-1,b=b+e-1,a=a+e-1):c=1;0<e;)f._setter(a,f._getter(b)),b+=c,a+=c,--e;return f}});Object.defineProperty(e.prototype,'every',{value:function(a,c){if(void 0===this||null===this)throw TypeError();var d=Object(this),f=d.length>>>0;if(!b(a))throw TypeError();for(var e=0;e<f;e++)if(!a.call(c,d._getter(e),e,d))return!1;return!0}});Object.defineProperty(e.prototype,'fill',{value:function(a,b,c){var f=d(this),e=f.length>>>
0,e=J(e,0);b>>=0;b=0>b?J(e+b,0):A(b,e);c=void 0===c?e:c>>0;for(e=0>c?J(e+c,0):A(c,e);b<e;)f._setter(b,a),b+=1;return f}});Object.defineProperty(e.prototype,'filter',{value:function(a,c){if(void 0===this||null===this)throw TypeError();var d=Object(this),f=d.length>>>0;if(!b(a))throw TypeError();for(var e=[],g=0;g<f;g++){var h=d._getter(g);a.call(c,h,g,d)&&e.push(h)}return new this.constructor(e)}});Object.defineProperty(e.prototype,'find',{value:function(a){var c=d(this),f=c.length>>>0;if(!b(a))throw TypeError();
for(var e=1<arguments.length?arguments[1]:void 0,g=0;g<f;){var h=c._getter(g);if(a.call(e,h,g,c))return h;++g}}});Object.defineProperty(e.prototype,'findIndex',{value:function(a){var c=d(this),f=c.length>>>0;if(!b(a))throw TypeError();for(var e=1<arguments.length?arguments[1]:void 0,g=0;g<f;){var h=c._getter(g);if(a.call(e,h,g,c))return g;++g}return-1}});Object.defineProperty(e.prototype,'forEach',{value:function(a,c){if(void 0===this||null===this)throw TypeError();var d=Object(this),f=d.length>>>
0;if(!b(a))throw TypeError();for(var e=0;e<f;e++)a.call(c,d._getter(e),e,d)}});Object.defineProperty(e.prototype,'indexOf',{value:function(a){if(void 0===this||null===this)throw TypeError();var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=0;0<arguments.length&&(d=Number(arguments[1]),d!==d?d=0:0!==d&&d!==1/0&&d!==-(1/0)&&(d=(0<d||-1)*N(R(d))));if(d>=c)return-1;for(d=0<=d?d:J(c-R(d),0);d<c;d++)if(b._getter(d)===a)return d;return-1}});Object.defineProperty(e.prototype,'join',{value:function(a){if(void 0===
this||null===this)throw TypeError();for(var b=Object(this),c=b.length>>>0,d=Array(c),f=0;f<c;++f)d[f]=b._getter(f);return d.join(void 0===a?',':a)}});Object.defineProperty(e.prototype,'lastIndexOf',{value:function(a){if(void 0===this||null===this)throw TypeError();var b=Object(this),c=b.length>>>0;if(0===c)return-1;var d=c;1<arguments.length&&(d=Number(arguments[1]),d!==d?d=0:0!==d&&d!==1/0&&d!==-(1/0)&&(d=(0<d||-1)*N(R(d))));for(c=0<=d?A(d,c-1):c-R(d);0<=c;c--)if(b._getter(c)===a)return c;return-1}});
Object.defineProperty(e.prototype,'map',{value:function(a,c){if(void 0===this||null===this)throw TypeError();var d=Object(this),f=d.length>>>0;if(!b(a))throw TypeError();var e=[];e.length=f;for(var g=0;g<f;g++)e[g]=a.call(c,d._getter(g),g,d);return new this.constructor(e)}});Object.defineProperty(e.prototype,'reduce',{value:function(a){if(void 0===this||null===this)throw TypeError();var c=Object(this),d=c.length>>>0;if(!b(a))throw TypeError();if(0===d&&1===arguments.length)throw TypeError();var f=
0,e;for(e=2<=arguments.length?arguments[1]:c._getter(f++);f<d;)e=a.call(void 0,e,c._getter(f),f,c),f++;return e}});Object.defineProperty(e.prototype,'reduceRight',{value:function(a){if(void 0===this||null===this)throw TypeError();var c=Object(this),d=c.length>>>0;if(!b(a))throw TypeError();if(0===d&&1===arguments.length)throw TypeError();var d=d-1,f;for(f=2<=arguments.length?arguments[1]:c._getter(d--);0<=d;)f=a.call(void 0,f,c._getter(d),d,c),d--;return f}});Object.defineProperty(e.prototype,'reverse',
{value:function(){if(void 0===this||null===this)throw TypeError();for(var a=Object(this),b=a.length>>>0,c=N(b/2),d=0,b=b-1;d<c;++d,--b){var f=a._getter(d);a._setter(d,a._getter(b));a._setter(b,f)}return a}});Object.defineProperty(e.prototype,'set',{value:function(a,b){if(1>arguments.length)throw SyntaxError('Not enough arguments');var c,d,f,e,g,h;if('object'===typeof arguments[0]&&arguments[0].constructor===this.constructor){c=arguments[0];d=arguments[1]>>>0;if(d+c.length>this.length)throw RangeError('Offset plus length of array is out of range');
h=this.byteOffset+d*this.BYTES_PER_ELEMENT;d=c.length*this.BYTES_PER_ELEMENT;if(c.buffer===this.buffer){f=[];e=0;for(g=c.byteOffset;e<d;e+=1,g+=1)f[e]=c.buffer._bytes[g];for(e=0;e<d;e+=1,h+=1)this.buffer._bytes[h]=f[e]}else for(e=0,g=c.byteOffset;e<d;e+=1,g+=1,h+=1)this.buffer._bytes[h]=c.buffer._bytes[g]}else if('object'===typeof arguments[0]&&'undefined'!==typeof arguments[0].length){c=arguments[0];f=c.length>>>0;d=arguments[1]>>>0;if(d+f>this.length)throw RangeError('Offset plus length of array is out of range');
for(e=0;e<f;e+=1)g=c[e],this._setter(d+e,Number(g))}else throw TypeError('Unexpected argument type(s)');}});Object.defineProperty(e.prototype,'slice',{value:function(a,b){for(var c=d(this),f=c.length>>>0,e=a>>0,e=0>e?J(f+e,0):A(e,f),g=void 0===b?f:b>>0,f=0>g?J(f+g,0):A(g,f),g=new c.constructor(f-e),h=0;e<f;){var l=c._getter(e);g._setter(h,l);++e;++h}return g}});Object.defineProperty(e.prototype,'some',{value:function(a,c){if(void 0===this||null===this)throw TypeError();var d=Object(this),f=d.length>>>
0;if(!b(a))throw TypeError();for(var e=0;e<f;e++)if(a.call(c,d._getter(e),e,d))return!0;return!1}});Object.defineProperty(e.prototype,'sort',{value:function(a){if(void 0===this||null===this)throw TypeError();for(var b=Object(this),c=b.length>>>0,d=Array(c),f=0;f<c;++f)d[f]=b._getter(f);a?d.sort(a):d.sort();for(f=0;f<c;++f)b._setter(f,d[f]);return b}});Object.defineProperty(e.prototype,'subarray',{value:function(a,b){a>>=0;b>>=0;1>arguments.length&&(a=0);2>arguments.length&&(b=this.length);0>a&&(a=
this.length+a);0>b&&(b=this.length+b);var c=this.length;a=0>a?0:a>c?c:a;c=this.length;c=(0>b?0:b>c?c:b)-a;0>c&&(c=0);return new this.constructor(this.buffer,this.byteOffset+a*this.BYTES_PER_ELEMENT,c)}});var B=w(1,k,l),T=w(1,h,g),F=w(1,m,g),X=w(2,f,n),S=w(2,q,r),Z=w(4,u,t),H=w(4,x,y),I=w(4,ba,E),Q=w(8,U,D);v.Int8Array=v.Int8Array||B;v.Uint8Array=v.Uint8Array||T;v.Uint8ClampedArray=v.Uint8ClampedArray||F;v.Int16Array=v.Int16Array||X;v.Uint16Array=v.Uint16Array||S;v.Int32Array=v.Int32Array||Z;v.Uint32Array=
v.Uint32Array||H;v.Float32Array=v.Float32Array||I;v.Float64Array=v.Float64Array||Q})();(function(){function a(a,c){return b(a.get)?a.get(c):a[c]}function c(a,b,c){if(!(a instanceof ArrayBuffer||'ArrayBuffer'===p(a)))throw TypeError();b>>>=0;if(b>a.byteLength)throw RangeError('byteOffset out of range');c=void 0===c?a.byteLength-b:c>>>0;if(b+c>a.byteLength)throw RangeError('byteOffset and length reference an area beyond the end of the buffer');Object.defineProperty(this,'buffer',{value:a});Object.defineProperty(this,
'byteLength',{value:c});Object.defineProperty(this,'byteOffset',{value:b})}function d(b){return function(c,d){c>>>=0;if(c+b.BYTES_PER_ELEMENT>this.byteLength)throw RangeError('Array index out of range');c+=this.byteOffset;for(var f=new Uint8Array(this.buffer,c,b.BYTES_PER_ELEMENT),g=[],h=0;h<b.BYTES_PER_ELEMENT;h+=1)g.push(a(f,h));!!d===!!e&&g.reverse();return a(new b((new Uint8Array(g)).buffer),0)}}function f(b){return function(c,d,f){c>>>=0;if(c+b.BYTES_PER_ELEMENT>this.byteLength)throw RangeError('Array index out of range');
d=new b([d]);d=new Uint8Array(d.buffer);var g=[],h;for(h=0;h<b.BYTES_PER_ELEMENT;h+=1)g.push(a(d,h));!!f===!!e&&g.reverse();(new Uint8Array(this.buffer,c,b.BYTES_PER_ELEMENT)).set(g)}}var e=function(){var b=new Uint16Array([4660]),b=new Uint8Array(b.buffer);return 18===a(b,0)}();Object.defineProperty(c.prototype,'getUint8',{value:d(Uint8Array)});Object.defineProperty(c.prototype,'getInt8',{value:d(Int8Array)});Object.defineProperty(c.prototype,'getUint16',{value:d(Uint16Array)});Object.defineProperty(c.prototype,
'getInt16',{value:d(Int16Array)});Object.defineProperty(c.prototype,'getUint32',{value:d(Uint32Array)});Object.defineProperty(c.prototype,'getInt32',{value:d(Int32Array)});Object.defineProperty(c.prototype,'getFloat32',{value:d(Float32Array)});Object.defineProperty(c.prototype,'getFloat64',{value:d(Float64Array)});Object.defineProperty(c.prototype,'setUint8',{value:f(Uint8Array)});Object.defineProperty(c.prototype,'setInt8',{value:f(Int8Array)});Object.defineProperty(c.prototype,'setUint16',{value:f(Uint16Array)});
Object.defineProperty(c.prototype,'setInt16',{value:f(Int16Array)});Object.defineProperty(c.prototype,'setUint32',{value:f(Uint32Array)});Object.defineProperty(c.prototype,'setInt32',{value:f(Int32Array)});Object.defineProperty(c.prototype,'setFloat32',{value:f(Float32Array)});Object.defineProperty(c.prototype,'setFloat64',{value:f(Float64Array)});v.DataView=v.DataView||c})()})(self);
!function(v,z){var p={},b={};!function(b,a){function c(){this._endDelay=this._delay=0;this._fill='none';this._iterationStart=0;this._iterations=1;this._duration=0;this._playbackRate=1;this._direction='normal';this._easing='linear';this._easingFunction=r}function d(){return b.isDeprecated('Invalid timing inputs','2016-03-02','TypeError exceptions will be thrown instead.',!0)}function k(a,d,f){var e=new c;return d&&(e.fill='both',e.duration='auto'),'number'!==typeof a||isNaN(a)?void 0!==a&&Object.getOwnPropertyNames(a).forEach(function(c){'auto'==
a[c]||('number'===typeof e[c]||'duration'==c)&&('number'!==typeof a[c]||isNaN(a[c]))||'fill'==c&&-1==n.indexOf(a[c])||'direction'==c&&-1==q.indexOf(a[c])||'playbackRate'==c&&1!==a[c]&&b.isDeprecated('AnimationEffectTiming.playbackRate','2014-11-28','Use Animation.playbackRate instead.')||(e[c]=a[c])}):e.duration=a,e}function l(a,b,c,d){return 0>a||1<a||0>c||1<c?r:function(f){if(0>=f){var e=0;return 0<a?e=b/a:!b&&0<c&&(e=d/c),e*f}if(1<=f)return e=0,1>c?e=(d-1)/(c-1):1==c&&1>a&&(e=(b-1)/(a-1)),1+e*
(f-1);for(var e=0,g=1;e<g;){var h=(e+g)/2,l=3*a*(1-h)*(1-h)*h+3*c*(1-h)*h*h+h*h*h;if(1E-5>Math.abs(f-l))break;l<f?e=h:g=h}return 3*b*(1-h)*(1-h)*h+3*d*(1-h)*h*h+h*h*h}}function h(a,b){return function(c){if(1<=c)return 1;var d=1/a;return c+=b*d,c-c%d}}function g(a){w||(w=document.createElement('div').style);w.animationTimingFunction='';w.animationTimingFunction=a;var b=w.animationTimingFunction;if(''==b&&d())throw new TypeError(a+' is not a valid value for easing');return b}function m(a){if('linear'==
a)return r;var b=C.exec(a);return b?l.apply(this,b.slice(1).map(Number)):(b=D.exec(a))?h(Number(b[1]),{start:u,middle:t,end:x}[b[2]]):p[a]||r}function f(a,b,c){if(null==b)return v;var d=c.delay+a+c.endDelay;return b<Math.min(c.delay,d)?E:b>=Math.min(c.delay+a,d)?z:T}var n=['backwards','forwards','both','none'],q=['reverse','alternate','alternate-reverse'],r=function(a){return a};c.prototype={_setMember:function(a,c){this['_'+a]=c;this._effect&&(this._effect._timingInput[a]=c,this._effect._timing=
b.normalizeTimingInput(this._effect._timingInput),this._effect.activeDuration=b.calculateActiveDuration(this._effect._timing),this._effect._animation&&this._effect._animation._rebuildUnderlyingAnimation())},get playbackRate(){return this._playbackRate},set delay(a){this._setMember('delay',a)},get delay(){return this._delay},set endDelay(a){this._setMember('endDelay',a)},get endDelay(){return this._endDelay},set fill(a){this._setMember('fill',a)},get fill(){return this._fill},set iterationStart(a){if((isNaN(a)||
0>a)&&d())throw new TypeError('iterationStart must be a non-negative number, received: '+timing.iterationStart);this._setMember('iterationStart',a)},get iterationStart(){return this._iterationStart},set duration(a){if('auto'!=a&&(isNaN(a)||0>a)&&d())throw new TypeError('duration must be non-negative or auto, received: '+a);this._setMember('duration',a)},get duration(){return this._duration},set direction(a){this._setMember('direction',a)},get direction(){return this._direction},set easing(a){this._easingFunction=
m(g(a));this._setMember('easing',a)},get easing(){return this._easing},set iterations(a){if((isNaN(a)||0>a)&&d())throw new TypeError('iterations must be non-negative, received: '+a);this._setMember('iterations',a)},get iterations(){return this._iterations}};var u=1,t=.5,x=0,p={ease:l(.25,.1,.25,1),'ease-in':l(.42,0,1,1),'ease-out':l(0,0,.58,1),'ease-in-out':l(.42,0,.58,1),'step-start':h(1,u),'step-middle':h(1,t),'step-end':h(1,x)},w=null,C=/cubic-bezier\(\s*(-?\d+\.?\d*|-?\.\d+)\s*,\s*(-?\d+\.?\d*|-?\.\d+)\s*,\s*(-?\d+\.?\d*|-?\.\d+)\s*,\s*(-?\d+\.?\d*|-?\.\d+)\s*\)/,
D=/steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/,v=0,E=1,z=2,T=3;b.cloneTimingInput=function(a){if('number'===typeof a)return a;var b={},c;for(c in a)b[c]=a[c];return b};b.makeTiming=k;b.numericTimingToObject=function(a){return'number'===typeof a&&(a=isNaN(a)?{duration:0}:{duration:a}),a};b.normalizeTimingInput=function(a,c){return a=b.numericTimingToObject(a),k(a,c)};b.calculateActiveDuration=function(a){return Math.abs((0===a.duration||0===a.iterations?0:a.duration*a.iterations)/a.playbackRate)};
b.calculateIterationProgress=function(a,b,c){var d=f(a,b,c);a:{var e=c.fill;switch(d){case E:a='backwards'==e||'both'==e?0:null;break a;case T:a=b-c.delay;break a;case z:a='forwards'==e||'both'==e?a:null;break a;case v:a=null;break a}a=void 0}if(null===a)return null;b=c.duration;e=c.iterationStart;b=(0===b?d!==E&&(e+=c.iterations):e+=a/b,e);e=b===1/0?c.iterationStart%1:b%1;a=(0!==e||d!==z||0===c.iterations||0===a&&0!==c.duration||(e=1),e);e=d===z&&c.iterations===1/0?1/0:1===a?Math.floor(b)-1:Math.floor(b);
b=d=c.direction;'normal'!==d&&'reverse'!==d&&('alternate-reverse'===d&&(e+=1),b='normal',e!==1/0&&0!==e%2&&(b='reverse'));return c._easingFunction('normal'===b?a:1-a)};b.calculatePhase=f;b.normalizeEasing=g;b.parseEasingFunction=m}(p,null);(function(b,a){function c(a){var b=[],c;for(c in a)if(!(c in['easing','offset','composite'])){var d=a[c];Array.isArray(d)||(d=[d]);for(var e,g=d.length,h=0;h<g;h++)e={},'offset'in a?e.offset=a.offset:1==g?e.offset=1:e.offset=h/(g-1),'easing'in a&&(e.easing=a.easing),
'composite'in a&&(e.composite=a.composite),e[c]=d[h],b.push(e)}return b.sort(function(a,b){return a.offset-b.offset}),b}var d={background:'backgroundImage backgroundPosition backgroundSize backgroundRepeat backgroundAttachment backgroundOrigin backgroundClip backgroundColor'.split(' '),border:'borderTopColor borderTopStyle borderTopWidth borderRightColor borderRightStyle borderRightWidth borderBottomColor borderBottomStyle borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth'.split(' '),
borderBottom:['borderBottomWidth','borderBottomStyle','borderBottomColor'],borderColor:['borderTopColor','borderRightColor','borderBottomColor','borderLeftColor'],borderLeft:['borderLeftWidth','borderLeftStyle','borderLeftColor'],borderRadius:['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'],borderRight:['borderRightWidth','borderRightStyle','borderRightColor'],borderTop:['borderTopWidth','borderTopStyle','borderTopColor'],borderWidth:['borderTopWidth',
'borderRightWidth','borderBottomWidth','borderLeftWidth'],flex:['flexGrow','flexShrink','flexBasis'],font:'fontFamily fontSize fontStyle fontVariant fontWeight lineHeight'.split(' '),margin:['marginTop','marginRight','marginBottom','marginLeft'],outline:['outlineColor','outlineStyle','outlineWidth'],padding:['paddingTop','paddingRight','paddingBottom','paddingLeft']},k=document.createElementNS('http://www.w3.org/1999/xhtml','div'),l={thin:'1px',medium:'3px',thick:'5px'},h={borderBottomWidth:l,borderLeftWidth:l,
borderRightWidth:l,borderTopWidth:l,fontSize:{'xx-small':'60%','x-small':'75%',small:'89%',medium:'100%',large:'120%','x-large':'150%','xx-large':'200%'},fontWeight:{normal:'400',bold:'700'},outlineWidth:l,textShadow:{none:'0px 0px 0px transparent'},boxShadow:{none:'0px 0px 0px 0px transparent'}};b.convertToArrayForm=c;b.normalizeKeyframes=function(a){function e(){var a=f.length;null==f[a-1].offset&&(f[a-1].offset=1);1<a&&null==f[0].offset&&(f[0].offset=0);for(var b=0,c=f[0].offset,d=1;d<a;d++){var e=
f[d].offset;if(null!=e){for(var g=1;g<d-b;g++)f[b+g].offset=c+(e-c)*g/(d-b);b=d;c=e}}}if(null==a)return[];window.Symbol&&Symbol.iterator&&Array.prototype.from&&a[Symbol.iterator]&&(a=Array.from(a));Array.isArray(a)||(a=c(a));var f=a.map(function(a){var c={},f;for(f in a){var e=a[f];if('offset'==f){if(null!=e){if(e=Number(e),!isFinite(e))throw new TypeError('Keyframe offsets must be numbers.');if(0>e||1<e)throw new TypeError('Keyframe offsets must be between 0 and 1.');}}else if('composite'==f){if('add'==
e||'accumulate'==e)throw{type:DOMException.NOT_SUPPORTED_ERR,name:'NotSupportedError',message:'add compositing is not supported'};if('replace'!=e)throw new TypeError('Invalid composite mode '+e+'.');}else e='easing'==f?b.normalizeEasing(e):''+e;var g=void 0,l=f,n=e,e=c,m=l;if('display'!==m&&0!==m.lastIndexOf('animation',0)&&0!==m.lastIndexOf('transition',0))if(m=d[l])for(g in k.style[l]=n,m)l=m[g],n=k.style[l],e[l]=l in h?h[l][n]||n:n;else e[l]=l in h?h[l][n]||n:n}return void 0==c.offset&&(c.offset=
null),void 0==c.easing&&(c.easing='linear'),c});a=!0;for(var g=-(1/0),l=0;l<f.length;l++){var r=f[l].offset;if(null!=r){if(r<g)throw new TypeError('Keyframes are not loosely sorted by offset. Sort or specify offsets.');g=r}else a=!1}return f=f.filter(function(a){return 0<=a.offset&&1>=a.offset}),a||e(),f}})(p,null);(function(b){var a={};b.isDeprecated=function(b,d,k,l){l=l?'are':'is';var c=new Date;d=new Date(d);return d.setMonth(d.getMonth()+3),!(c<d&&(b in a||console.warn('Web Animations: '+b+' '+
l+' deprecated and will stop working on '+d.toDateString()+'. '+k),a[b]=!0,1))};b.deprecated=function(a,d,k,l){var c=l?'are':'is';if(b.isDeprecated(a,d,k,l))throw Error(a+' '+c+' no longer supported. '+k);}})(p);(function(){if(document.documentElement.animate){var d=document.documentElement.animate([],0),a=!0;if(d&&(a=!1,'play currentTime pause reverse playbackRate cancel finish startTime playState'.split(' ').forEach(function(b){void 0===d[b]&&(a=!0)})),!a)return}!function(a,b,d){function c(a){for(var b=
{},c=0;c<a.length;c++)for(var d in a[c])if('offset'!=d&&'easing'!=d&&'composite'!=d){var e={offset:a[c].offset,easing:a[c].easing,value:a[c][d]};b[d]=b[d]||[];b[d].push(e)}for(var g in b)if(a=b[g],0!=a[0].offset||1!=a[a.length-1].offset)throw{type:DOMException.NOT_SUPPORTED_ERR,name:'NotSupportedError',message:'Partial keyframes are not supported'};return b}function e(c){var d=[],f;for(f in c)for(var e=c[f],g=0;g<e.length-1;g++){var h=g,l=g+1,k=e[h].offset,x=e[l].offset,p=k,w=x;0==g&&(p=-(1/0),0==
x&&(l=h));g==e.length-2&&(w=1/0,1==k&&(h=l));d.push({applyFrom:p,applyTo:w,startOffset:e[h].offset,endOffset:e[l].offset,easingFunction:a.parseEasingFunction(e[h].easing),property:f,interpolation:b.propertyInterpolation(f,e[h].value,e[l].value)})}return d.sort(function(a,b){return a.startOffset-b.startOffset}),d}b.convertEffectInput=function(d){d=a.normalizeKeyframes(d);var g=c(d),f=e(g);return function(a,c){if(null!=c)f.filter(function(a){return c>=a.applyFrom&&c<a.applyTo}).forEach(function(d){var f=
c-d.startOffset,e=d.endOffset-d.startOffset,f=0==e?0:d.easingFunction(f/e);b.apply(a,d.property,d.interpolation(f))});else for(var d in g)'offset'!=d&&'easing'!=d&&'composite'!=d&&b.clear(a,d)}}}(p,b,null);(function(a,b,d){function c(a){return a.replace(/-(.)/g,function(a,b){return b.toUpperCase()})}var e={};b.addPropertiesHandler=function(a,b,d){for(var f=0;f<d.length;f++){var g=a,h=b,l=c(d[f]);e[l]=e[l]||[];e[l].push([g,h])}};var g={backgroundColor:'transparent',backgroundPosition:'0% 0%',borderBottomColor:'currentColor',
borderBottomLeftRadius:'0px',borderBottomRightRadius:'0px',borderBottomWidth:'3px',borderLeftColor:'currentColor',borderLeftWidth:'3px',borderRightColor:'currentColor',borderRightWidth:'3px',borderSpacing:'2px',borderTopColor:'currentColor',borderTopLeftRadius:'0px',borderTopRightRadius:'0px',borderTopWidth:'3px',bottom:'auto',clip:'rect(0px, 0px, 0px, 0px)',color:'black',fontSize:'100%',fontWeight:'400',height:'auto',left:'auto',letterSpacing:'normal',lineHeight:'120%',marginBottom:'0px',marginLeft:'0px',
marginRight:'0px',marginTop:'0px',maxHeight:'none',maxWidth:'none',minHeight:'0px',minWidth:'0px',opacity:'1.0',outlineColor:'invert',outlineOffset:'0px',outlineWidth:'3px',paddingBottom:'0px',paddingLeft:'0px',paddingRight:'0px',paddingTop:'0px',right:'auto',textIndent:'0px',textShadow:'0px 0px 0px transparent',top:'auto',transform:'',verticalAlign:'0px',visibility:'visible',width:'auto',wordSpacing:'normal',zIndex:'auto'};b.propertyInterpolation=function(d,f,h){var l=d;/-/.test(d)&&!a.isDeprecated('Hyphenated property names',
'2016-03-22','Use camelCase instead.',!0)&&(l=c(d));'initial'!=f&&'initial'!=h||('initial'==f&&(f=g[l]),'initial'==h&&(h=g[l]));d=f==h?[]:e[l];for(l=0;d&&l<d.length;l++){var k=d[l][0](f),n=d[l][0](h);if(void 0!==k&&void 0!==n&&(k=d[l][1](k,n))){var m=b.Interpolation.apply(null,k);return function(a){return 0==a?f:1==a?h:m(a)}}}return b.Interpolation(!1,!0,function(a){return a?h:f})}})(p,b,null);(function(a,b,d){function c(b){var c=a.calculateActiveDuration(b),d=function(d){return a.calculateIterationProgress(c,
d,b)};return d._totalDuration=b.delay+c+b.endDelay,d}b.KeyframeEffect=function(d,e,l,f){var g,h=c(a.normalizeTimingInput(l)),k=b.convertEffectInput(e);e=function(){k(d,g)};return e._update=function(a){return g=h(a),null!==g},e._clear=function(){k(d,null)},e._hasSameTarget=function(a){return d===a},e._target=d,e._totalDuration=h._totalDuration,e._id=f,e};b.NullEffect=function(a){var b=function(){a&&(a(),a=null)};return b._update=function(){return null},b._totalDuration=0,b._hasSameTarget=function(){return!1},
b}})(p,b,null);(function(a,b){function c(a,b,c){c.enumerable=!0;c.configurable=!0;Object.defineProperty(a,b,c)}function d(a){this._surrogateStyle=document.createElementNS('http://www.w3.org/1999/xhtml','div').style;this._style=a.style;this._length=0;this._isAnimatedProperty={};for(a=0;a<this._style.length;a++){var b=this._style[a];this._surrogateStyle[b]=this._style[b]}this._updateIndices()}function e(a){if(!a._webAnimationsPatchedStyle){var b=new d(a);try{c(a,'style',{get:function(){return b}})}catch(t){a.style._set=
function(b,c){a.style[b]=c},a.style._clear=function(b){a.style[b]=''}}a._webAnimationsPatchedStyle=a.style}}var g={cssText:1,length:1,parentRule:1},m={getPropertyCSSValue:1,getPropertyPriority:1,getPropertyValue:1,item:1,removeProperty:1,setProperty:1},f={removeProperty:1,setProperty:1};d.prototype={get cssText(){return this._surrogateStyle.cssText},set cssText(a){for(var b={},c=0;c<this._surrogateStyle.length;c++)b[this._surrogateStyle[c]]=!0;this._surrogateStyle.cssText=a;this._updateIndices();
for(c=0;c<this._surrogateStyle.length;c++)b[this._surrogateStyle[c]]=!0;for(var d in b)this._isAnimatedProperty[d]||this._style.setProperty(d,this._surrogateStyle.getPropertyValue(d))},get length(){return this._surrogateStyle.length},get parentRule(){return this._style.parentRule},_updateIndices:function(){for(;this._length<this._surrogateStyle.length;)Object.defineProperty(this,this._length,{configurable:!0,enumerable:!1,get:function(a){return function(){return this._surrogateStyle[a]}}(this._length)}),
this._length++;for(;this._length>this._surrogateStyle.length;)this._length--,Object.defineProperty(this,this._length,{configurable:!0,enumerable:!1,value:void 0})},_set:function(a,b){this._style[a]=b;this._isAnimatedProperty[a]=!0},_clear:function(a){this._style[a]=this._surrogateStyle[a];delete this._isAnimatedProperty[a]}};for(var n in m)d.prototype[n]=function(a,b){return function(){var c=this._surrogateStyle[a].apply(this._surrogateStyle,arguments);return b&&(this._isAnimatedProperty[arguments[0]]||
this._style[a].apply(this._style,arguments),this._updateIndices()),c}}(n,n in f);for(var q in document.documentElement.style)q in g||q in m||!function(a){c(d.prototype,a,{get:function(){return this._surrogateStyle[a]},set:function(b){this._surrogateStyle[a]=b;this._updateIndices();this._isAnimatedProperty[a]||(this._style[a]=b)}})}(q);a.apply=function(b,c,d){e(b);b.style._set(a.propertyName(c),d)};a.clear=function(b,c){b._webAnimationsPatchedStyle&&b.style._clear(a.propertyName(c))}})(b,null);(function(a){window.Element.prototype.animate=
function(b,c){var d='';return c&&c.id&&(d=c.id),a.timeline._play(a.KeyframeEffect(this,b,c,d))}})(b);(function(a,b){function c(a,b,d){if('number'===typeof a&&'number'===typeof b)return a*(1-d)+b*d;if('boolean'===typeof a&&'boolean'===typeof b)return.5>d?a:b;if(a.length==b.length){for(var e=[],f=0;f<a.length;f++)e.push(c(a[f],b[f],d));return e}throw'Mismatched interpolation arguments '+a+':'+b;}a.Interpolation=function(a,b,d){return function(e){return d(c(a,b,e))}}})(b,null);(function(a,b){var c=function(){function a(a,
b){for(var c=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],d=0;4>d;d++)for(var e=0;4>e;e++)for(var g=0;4>g;g++)c[d][e]+=b[d][g]*a[g][e];return c}return function(b,c,d,f,e){for(var g=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]],h=0;4>h;h++)g[h][3]=e[h];for(h=0;3>h;h++)for(e=0;3>e;e++)g[3][h]+=b[e]*g[e][h];b=f[0];h=f[1];e=f[2];f=f[3];var l=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];l[0][0]=1-2*(h*h+e*e);l[0][1]=2*(b*h-e*f);l[0][2]=2*(b*e+h*f);l[1][0]=2*(b*h+e*f);l[1][1]=1-2*(b*b+e*e);l[1][2]=2*(h*e-b*f);l[2][0]=
2*(b*e-h*f);l[2][1]=2*(h*e+b*f);l[2][2]=1-2*(b*b+h*h);g=a(g,l);f=[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];d[2]&&(f[2][1]=d[2],g=a(g,f));d[1]&&(f[2][1]=0,f[2][0]=d[0],g=a(g,f));d[0]&&(f[2][0]=0,f[1][0]=d[0],g=a(g,f));for(h=0;3>h;h++)for(e=0;3>e;e++)g[h][e]*=c[h];return 0==g[0][2]&&0==g[0][3]&&0==g[1][2]&&0==g[1][3]&&0==g[2][0]&&0==g[2][1]&&1==g[2][2]&&0==g[2][3]&&0==g[3][2]&&1==g[3][3]?[g[0][0],g[0][1],g[1][0],g[1][1],g[3][0],g[3][1]]:g[0].concat(g[1],g[2],g[3])}}();a.composeMatrix=c;a.quat=function(b,
c,d){var e=a.dot(b,c),e=Math.max(Math.min(e,1),-1),f=[];if(1===e)f=b;else for(var g=Math.acos(e),h=1*Math.sin(d*g)/Math.sqrt(1-e*e),l=0;4>l;l++)f.push(b[l]*(Math.cos(d*g)-e*h)+c[l]*h);return f}})(b,null);(function(a,b,d){a.sequenceNumber=0;var c=function(a,b,c){this.target=a;this.currentTime=b;this.timelineTime=c;this.type='finish';this.cancelable=this.bubbles=!1;this.currentTarget=a;this.defaultPrevented=!1;this.eventPhase=Event.AT_TARGET;this.timeStamp=Date.now()};b.Animation=function(b){this.id=
'';b&&b._id&&(this.id=b._id);this._sequenceNumber=a.sequenceNumber++;this._currentTime=0;this._startTime=null;this._paused=!1;this._playbackRate=1;this._finishedFlag=this._inTimeline=!0;this.onfinish=null;this._finishHandlers=[];this._effect=b;this._inEffect=this._effect._update(0);this._idle=!0;this._currentTimePending=!1};b.Animation.prototype={_ensureAlive:function(){0>this.playbackRate&&0===this.currentTime?this._inEffect=this._effect._update(-1):this._inEffect=this._effect._update(this.currentTime);
this._inTimeline||!this._inEffect&&this._finishedFlag||(this._inTimeline=!0,b.timeline._animations.push(this))},_tickCurrentTime:function(a,b){a!=this._currentTime&&(this._currentTime=a,this._isFinished&&!b&&(this._currentTime=0<this._playbackRate?this._totalDuration:0),this._ensureAlive())},get currentTime(){return this._idle||this._currentTimePending?null:this._currentTime},set currentTime(a){a=+a;isNaN(a)||(b.restart(),this._paused||null==this._startTime||(this._startTime=this._timeline.currentTime-
a/this._playbackRate),this._currentTimePending=!1,this._currentTime!=a&&(this._idle&&(this._idle=!1,this._paused=!0),this._tickCurrentTime(a,!0),b.applyDirtiedAnimation(this)))},get startTime(){return this._startTime},set startTime(a){a=+a;isNaN(a)||this._paused||this._idle||(this._startTime=a,this._tickCurrentTime((this._timeline.currentTime-this._startTime)*this.playbackRate),b.applyDirtiedAnimation(this))},get playbackRate(){return this._playbackRate},set playbackRate(a){if(a!=this._playbackRate){var c=
this.currentTime;this._playbackRate=a;this._startTime=null;'paused'!=this.playState&&'idle'!=this.playState&&(this._finishedFlag=!1,this._idle=!1,this._ensureAlive(),b.applyDirtiedAnimation(this));null!=c&&(this.currentTime=c)}},get _isFinished(){return!this._idle&&(0<this._playbackRate&&this._currentTime>=this._totalDuration||0>this._playbackRate&&0>=this._currentTime)},get _totalDuration(){return this._effect._totalDuration},get playState(){return this._idle?'idle':null==this._startTime&&!this._paused&&
0!=this.playbackRate||this._currentTimePending?'pending':this._paused?'paused':this._isFinished?'finished':'running'},_rewind:function(){if(0<=this._playbackRate)this._currentTime=0;else{if(!(this._totalDuration<1/0))throw new DOMException('Unable to rewind negative playback rate animation with infinite duration','InvalidStateError');this._currentTime=this._totalDuration}},play:function(){this._paused=!1;(this._isFinished||this._idle)&&(this._rewind(),this._startTime=null);this._idle=this._finishedFlag=
!1;this._ensureAlive();b.applyDirtiedAnimation(this)},pause:function(){this._isFinished||this._paused||this._idle?this._idle&&(this._rewind(),this._idle=!1):this._currentTimePending=!0;this._startTime=null;this._paused=!0},finish:function(){this._idle||(this.currentTime=0<this._playbackRate?this._totalDuration:0,this._startTime=this._totalDuration-this.currentTime,this._currentTimePending=!1,b.applyDirtiedAnimation(this))},cancel:function(){this._inEffect&&(this._inEffect=!1,this._idle=!0,this._paused=
!1,this._isFinished=!0,this._finishedFlag=!0,this._currentTime=0,this._startTime=null,this._effect._update(null),b.applyDirtiedAnimation(this))},reverse:function(){this.playbackRate*=-1;this.play()},addEventListener:function(a,b){'function'===typeof b&&'finish'==a&&this._finishHandlers.push(b)},removeEventListener:function(a,b){if('finish'==a){var c=this._finishHandlers.indexOf(b);0<=c&&this._finishHandlers.splice(c,1)}},_fireEvents:function(a){if(this._isFinished){if(!this._finishedFlag){var b=new c(this,
this._currentTime,a),d=this._finishHandlers.concat(this.onfinish?[this.onfinish]:[]);setTimeout(function(){d.forEach(function(a){a.call(b.target,b)})},0);this._finishedFlag=!0}}else this._finishedFlag=!1},_tick:function(a,b){this._idle||this._paused||(null==this._startTime?b&&(this.startTime=a-this._currentTime/this.playbackRate):this._isFinished||this._tickCurrentTime((a-this._startTime)*this.playbackRate));b&&(this._currentTimePending=!1,this._fireEvents(a))},get _needsTick(){return this.playState in
{pending:1,running:1}||!this._finishedFlag},_targetAnimations:function(){var a=this._effect._target;return a._activeAnimations||(a._activeAnimations=[]),a._activeAnimations},_markTarget:function(){var a=this._targetAnimations();-1===a.indexOf(this)&&a.push(this)},_unmarkTarget:function(){var a=this._targetAnimations(),b=a.indexOf(this);-1!==b&&a.splice(b,1)}}})(p,b,null);(function(a,b,d){function c(a){var b=q;q=[];a<w.currentTime&&(a=w.currentTime);w._animations.sort(e);w._animations=f(a,!0,w._animations)[0];
b.forEach(function(b){b[1](a)});k()}function e(a,b){return a._sequenceNumber-b._sequenceNumber}function g(){this._animations=[];this.currentTime=window.performance&&performance.now?performance.now():0}function k(){p.forEach(function(a){a()});p.length=0}function f(a,c,d){y=!0;t=!1;b.timeline.currentTime=a;u=!1;var e=[],f=[],g=[],h=[];return d.forEach(function(b){b._tick(a,c);b._inEffect?(f.push(b._effect),b._markTarget()):(e.push(b._effect),b._unmarkTarget());b._needsTick&&(u=!0);(b._inTimeline=b._inEffect||
b._needsTick)?g.push(b):h.push(b)}),p.push.apply(p,e),p.push.apply(p,f),u&&requestAnimationFrame(function(){}),y=!1,[g,h]}var n=window.requestAnimationFrame,q=[],r=0;window.requestAnimationFrame=function(a){var b=r++;return 0==q.length&&n(c),q.push([b,a]),b};window.cancelAnimationFrame=function(a){q.forEach(function(b){b[0]==a&&(b[1]=function(){})})};g.prototype={_play:function(c){c._timing=a.normalizeTimingInput(c.timing);c=new b.Animation(c);return c._idle=!1,c._timeline=this,this._animations.push(c),
b.restart(),b.applyDirtiedAnimation(c),c}};var u=!1,t=!1;b.restart=function(){return u||(u=!0,requestAnimationFrame(function(){}),t=!0),t};b.applyDirtiedAnimation=function(a){y||(a._markTarget(),a=a._targetAnimations(),a.sort(e),f(b.timeline.currentTime,!1,a.slice())[1].forEach(function(a){a=w._animations.indexOf(a);-1!==a&&w._animations.splice(a,1)}),k())};var p=[],y=!1,w=new g;b.timeline=w})(p,b,null);(function(a,b){function c(a,b){for(var c=0,d=0;d<a.length;d++)c+=a[d]*b[d];return c}function d(a,
b){return[a[0]*b[0]+a[4]*b[1]+a[8]*b[2]+a[12]*b[3],a[1]*b[0]+a[5]*b[1]+a[9]*b[2]+a[13]*b[3],a[2]*b[0]+a[6]*b[1]+a[10]*b[2]+a[14]*b[3],a[3]*b[0]+a[7]*b[1]+a[11]*b[2]+a[15]*b[3],a[0]*b[4]+a[4]*b[5]+a[8]*b[6]+a[12]*b[7],a[1]*b[4]+a[5]*b[5]+a[9]*b[6]+a[13]*b[7],a[2]*b[4]+a[6]*b[5]+a[10]*b[6]+a[14]*b[7],a[3]*b[4]+a[7]*b[5]+a[11]*b[6]+a[15]*b[7],a[0]*b[8]+a[4]*b[9]+a[8]*b[10]+a[12]*b[11],a[1]*b[8]+a[5]*b[9]+a[9]*b[10]+a[13]*b[11],a[2]*b[8]+a[6]*b[9]+a[10]*b[10]+a[14]*b[11],a[3]*b[8]+a[7]*b[9]+a[11]*b[10]+
a[15]*b[11],a[0]*b[12]+a[4]*b[13]+a[8]*b[14]+a[12]*b[15],a[1]*b[12]+a[5]*b[13]+a[9]*b[14]+a[13]*b[15],a[2]*b[12]+a[6]*b[13]+a[10]*b[14]+a[14]*b[15],a[3]*b[12]+a[7]*b[13]+a[11]*b[14]+a[15]*b[15]]}function e(a){return 2*((a.deg||0)/360+(a.grad||0)/400+(a.turn||0))*Math.PI+(a.rad||0)}function g(a){switch(a.t){case 'rotatex':return a=e(a.d[0]),[1,0,0,0,0,Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1];case 'rotatey':return a=e(a.d[0]),[Math.cos(a),0,-Math.sin(a),0,0,1,0,0,Math.sin(a),
0,Math.cos(a),0,0,0,0,1];case 'rotate':case 'rotatez':return a=e(a.d[0]),[Math.cos(a),Math.sin(a),0,0,-Math.sin(a),Math.cos(a),0,0,0,0,1,0,0,0,0,1];case 'rotate3d':var b=a.d[0],c=a.d[1],d=a.d[2];a=e(a.d[3]);var f=b*b+c*c+d*d;0===f?(b=1,d=c=0):1!==f&&(f=Math.sqrt(f),b/=f,c/=f,d/=f);f=Math.sin(a/2);a=f*Math.cos(a/2);f*=f;return[1-2*(c*c+d*d)*f,2*(b*c*f+d*a),2*(b*d*f-c*a),0,2*(b*c*f-d*a),1-2*(b*b+d*d)*f,2*(c*d*f+b*a),0,2*(b*d*f+c*a),2*(c*d*f-b*a),1-2*(b*b+c*c)*f,0,0,0,0,1];case 'scale':return[a.d[0],
0,0,0,0,a.d[1],0,0,0,0,1,0,0,0,0,1];case 'scalex':return[a.d[0],0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];case 'scaley':return[1,0,0,0,0,a.d[0],0,0,0,0,1,0,0,0,0,1];case 'scalez':return[1,0,0,0,0,1,0,0,0,0,a.d[0],0,0,0,0,1];case 'scale3d':return[a.d[0],0,0,0,0,a.d[1],0,0,0,0,a.d[2],0,0,0,0,1];case 'skew':return b=e(a.d[0]),c=e(a.d[1]),[1,Math.tan(c),0,0,Math.tan(b),1,0,0,0,0,1,0,0,0,0,1];case 'skewx':return a=e(a.d[0]),[1,0,0,0,Math.tan(a),1,0,0,0,0,1,0,0,0,0,1];case 'skewy':return a=e(a.d[0]),[1,Math.tan(a),
0,0,0,1,0,0,0,0,1,0,0,0,0,1];case 'translate':return b=a.d[0].px||0,c=a.d[1].px||0,[1,0,0,0,0,1,0,0,0,0,1,0,b,c,0,1];case 'translatex':return b=a.d[0].px||0,[1,0,0,0,0,1,0,0,0,0,1,0,b,0,0,1];case 'translatey':return c=a.d[0].px||0,[1,0,0,0,0,1,0,0,0,0,1,0,0,c,0,1];case 'translatez':return d=a.d[0].px||0,[1,0,0,0,0,1,0,0,0,0,1,0,0,0,d,1];case 'translate3d':return b=a.d[0].px||0,c=a.d[1].px||0,d=a.d[2].px||0,[1,0,0,0,0,1,0,0,0,0,1,0,b,c,d,1];case 'perspective':return[1,0,0,0,0,1,0,0,0,0,1,a.d[0].px?
-1/a.d[0].px:0,0,0,0,1];case 'matrix':return[a.d[0],a.d[1],0,0,a.d[2],a.d[3],0,0,0,0,1,0,a.d[4],a.d[5],0,1];case 'matrix3d':return a.d}}var m=function(){function a(a){return a[0][0]*a[1][1]*a[2][2]+a[1][0]*a[2][1]*a[0][2]+a[2][0]*a[0][1]*a[1][2]-a[0][2]*a[1][1]*a[2][0]-a[1][2]*a[2][1]*a[0][0]-a[2][2]*a[0][1]*a[1][0]}function b(a){var b=d(a);return[a[0]/b,a[1]/b,a[2]/b]}function d(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2])}function e(a,b,c,d){return[c*a[0]+d*b[0],c*a[1]+d*b[1],c*a[2]+d*b[2]]}
return function(f){f=[f.slice(0,4),f.slice(4,8),f.slice(8,12),f.slice(12,16)];if(1!==f[3][3])return null;for(var g=[],h=0;4>h;h++)g.push(f[h].slice());for(h=0;3>h;h++)g[h][3]=0;if(0===a(g))return!1;var l;l=[];if(f[0][3]||f[1][3]||f[2][3]){l.push(f[0][3]);l.push(f[1][3]);l.push(f[2][3]);l.push(f[3][3]);for(var k=1/a(g),m=g[0][0],n=g[0][1],h=g[0][2],q=g[1][0],p=g[1][1],r=g[1][2],u=g[2][0],v=g[2][1],z=g[2][2],k=[[(p*z-r*v)*k,(h*v-n*z)*k,(n*r-h*p)*k,0],[(r*u-q*z)*k,(m*z-h*u)*k,(h*q-m*r)*k,0],[(q*v-p*
u)*k,(u*n-m*v)*k,(m*p-n*q)*k,0]],m=[],n=0;3>n;n++){for(q=h=0;3>q;q++)h+=g[3][q]*k[q][n];m.push(h)}g=(m.push(1),k.push(m),k);g=[[g[0][0],g[1][0],g[2][0],g[3][0]],[g[0][1],g[1][1],g[2][1],g[3][1]],[g[0][2],g[1][2],g[2][2],g[3][2]],[g[0][3],g[1][3],g[2][3],g[3][3]]];k=[];for(m=0;4>m;m++){for(h=n=0;4>h;h++)n+=l[h]*g[h][m];k.push(n)}l=k}else l=[0,0,0,1];g=f[3].slice(0,3);k=[];k.push(f[0].slice(0,3));m=[];m.push(d(k[0]));k[0]=b(k[0]);n=[];k.push(f[1].slice(0,3));n.push(c(k[0],k[1]));k[1]=e(k[1],k[0],1,
-n[0]);m.push(d(k[1]));k[1]=b(k[1]);n[0]/=m[1];k.push(f[2].slice(0,3));n.push(c(k[0],k[2]));k[2]=e(k[2],k[0],1,-n[1]);n.push(c(k[1],k[2]));k[2]=e(k[2],k[1],1,-n[2]);m.push(d(k[2]));k[2]=b(k[2]);n[1]/=m[2];n[2]/=m[2];f=k[1];h=k[2];if(0>c(k[0],[f[1]*h[2]-f[2]*h[1],f[2]*h[0]-f[0]*h[2],f[0]*h[1]-f[1]*h[0]]))for(h=0;3>h;h++)m[h]*=-1,k[h][0]*=-1,k[h][1]*=-1,k[h][2]*=-1;var B,J;f=k[0][0]+k[1][1]+k[2][2]+1;return 1E-4<f?(B=.5/Math.sqrt(f),J=[(k[2][1]-k[1][2])*B,(k[0][2]-k[2][0])*B,(k[1][0]-k[0][1])*B,.25/
B]):k[0][0]>k[1][1]&&k[0][0]>k[2][2]?(B=2*Math.sqrt(1+k[0][0]-k[1][1]-k[2][2]),J=[.25*B,(k[0][1]+k[1][0])/B,(k[0][2]+k[2][0])/B,(k[2][1]-k[1][2])/B]):k[1][1]>k[2][2]?(B=2*Math.sqrt(1+k[1][1]-k[0][0]-k[2][2]),J=[(k[0][1]+k[1][0])/B,.25*B,(k[1][2]+k[2][1])/B,(k[0][2]-k[2][0])/B]):(B=2*Math.sqrt(1+k[2][2]-k[0][0]-k[1][1]),J=[(k[0][2]+k[2][0])/B,(k[1][2]+k[2][1])/B,.25*B,(k[1][0]-k[0][1])/B]),[g,m,n,J,l]}}();a.dot=c;a.makeMatrixDecomposition=function(a){return[m(0===a.length?[1,0,0,0,0,1,0,0,0,0,1,0,
0,0,0,1]:a.map(g).reduce(d))]}})(b,null);(function(a){function b(a,b){var c=a.exec(b);if(c)return c=a.ignoreCase?c[0].toLowerCase():c[0],[c,b.substr(c.length)]}function c(a,b){b=b.replace(/^\s*/,'');var c=a(b);if(c)return[c[0],c[1].replace(/^\s*/,'')]}function d(a,b){for(var c=a,d=b;c&&d;)c>d?c%=d:d%=c;return a*b/(c+d)}function h(a,b,c,e,h){for(var f=[],g=[],k=[],l=d(e.length,h.length),m=0;m<l;m++){var n=b(e[m%e.length],h[m%h.length]);if(!n)return;f.push(n[0]);g.push(n[1]);k.push(n[2])}return[f,g,
function(b){b=b.map(function(a,b){return k[b](a)}).join(c);return a?a(b):b}]}a.consumeToken=b;a.consumeTrimmed=c;a.consumeRepeated=function(a,d,e){a=c.bind(null,a);for(var f=[];;){var g=a(e);if(!g||(f.push(g[0]),e=g[1],g=b(d,e),!g||''==g[1]))return[f,e];e=g[1]}};a.consumeParenthesised=function(a,b){for(var c=0,d=0;d<b.length&&(!/\s|,/.test(b[d])||0!=c);d++)if('('==b[d])c++;else if(')'==b[d]&&(c--,0==c&&d++,0>=c))break;c=a(b.substr(0,d));return void 0==c?void 0:[c,b.substr(d)]};a.ignore=function(a){return function(b){b=
a(b);return b&&(b[0]=void 0),b}};a.optional=function(a,b){return function(c){return a(c)||[b,c]}};a.consumeList=function(b,c){for(var d=[],e=0;e<b.length;e++){var g=a.consumeTrimmed(b[e],c);if(!g||''==g[0])return;void 0!==g[0]&&d.push(g[0]);c=g[1]}if(''==c)return d};a.mergeNestedRepeated=h.bind(null,null);a.mergeWrappedNestedRepeated=h;a.mergeList=function(a,b,c){for(var d=[],e=[],f=[],g=0,h=0;h<c.length;h++)if('function'===typeof c[h]){var k=c[h](a[g],b[g++]);d.push(k[0]);e.push(k[1]);f.push(k[2])}else!function(a){d.push(!1);
e.push(!1);f.push(function(){return c[a]})}(h);return[d,e,function(a){for(var b='',c=0;c<a.length;c++)b+=f[c](a[c]);return b}]}})(b);(function(a){function b(b){var c={inset:!1,lengths:[],color:null};if((b=a.consumeRepeated(function(b){var d=a.consumeToken(/^inset/i,b);return d?(c.inset=!0,d):(d=a.consumeLengthOrPercent(b))?(c.lengths.push(d[0]),d):(d=a.consumeColor(b))?(c.color=d[0],d):void 0},/^/,b))&&b[0].length)return[c,b[1]]}var c=function(b,c,d,e){function f(a){return{inset:a,color:[0,0,0,0],
lengths:[{px:0},{px:0},{px:0},{px:0}]}}for(var g=[],h=[],k=0;k<d.length||k<e.length;k++){var l=d[k]||f(e[k].inset),m=e[k]||f(d[k].inset);g.push(l);h.push(m)}return a.mergeNestedRepeated(b,c,g,h)}.bind(null,function(b,c){for(;b.lengths.length<Math.max(b.lengths.length,c.lengths.length);)b.lengths.push({px:0});for(;c.lengths.length<Math.max(b.lengths.length,c.lengths.length);)c.lengths.push({px:0});if(b.inset==c.inset&&!!b.color==!!c.color){for(var d,e=[],f=[[],0],h=[[],0],k=0;k<b.lengths.length;k++){var l=
a.mergeDimensions(b.lengths[k],c.lengths[k],2==k);f[0].push(l[0]);h[0].push(l[1]);e.push(l[2])}b.color&&c.color&&(k=a.mergeColors(b.color,c.color),f[1]=k[0],h[1]=k[1],d=k[2]);return[f,h,function(a){for(var c=b.inset?'inset ':' ',f=0;f<e.length;f++)c+=e[f](a[0][f])+' ';return d&&(c+=d(a[1])),c}]}},', ');a.addPropertiesHandler(function(c){if((c=a.consumeRepeated(b,/^,/,c))&&''==c[1])return c[0]},c,['box-shadow','text-shadow'])})(b);(function(a,b){function c(a){return a.toFixed(3).replace('.000','')}
function d(a,b,c){return Math.min(b,Math.max(a,c))}function e(a){if(/^\s*[-+]?(\d*\.)?\d+\s*$/.test(a))return Number(a)}function g(a,b){return function(e,f){return[e,f,function(e){return c(d(a,b,e))}]}}a.clamp=d;a.addPropertiesHandler(e,g(0,1/0),['border-image-width','line-height']);a.addPropertiesHandler(e,g(0,1),['opacity','shape-image-threshold']);a.addPropertiesHandler(e,function(a,b){if(0!=a)return g(0,1/0)(a,b)},['flex-grow','flex-shrink']);a.addPropertiesHandler(e,function(a,b){return[a,b,
function(a){return Math.round(d(1,1/0,a))}]},['orphans','widows']);a.addPropertiesHandler(e,function(a,b){return[a,b,Math.round]},['z-index']);a.parseNumber=e;a.mergeNumbers=function(a,b){return[a,b,c]};a.numberToString=c})(b,null);(function(a,b){a.addPropertiesHandler(String,function(a,b){if('visible'==a||'visible'==b)return[0,1,function(c){return 0>=c?a:1<=c?b:'visible'}]},['visibility'])})(b);(function(a,b){function c(a){a=a.trim();g.fillStyle='#000';g.fillStyle=a;var b=g.fillStyle;if(g.fillStyle=
'#fff',g.fillStyle=a,b==g.fillStyle)return g.fillRect(0,0,1,1),a=g.getImageData(0,0,1,1).data,g.clearRect(0,0,1,1),b=a[3]/255,[a[0]*b,a[1]*b,a[2]*b,b]}function d(b,c){return[b,c,function(b){if(b[3])for(var c=0;3>c;c++)b[c]=Math.round(Math.max(0,Math.min(255,b[c]/b[3])));return b[3]=a.numberToString(a.clamp(0,1,b[3])),'rgba('+b.join(',')+')'}]}var e=document.createElementNS('http://www.w3.org/1999/xhtml','canvas');e.width=e.height=1;var g=e.getContext('2d');a.addPropertiesHandler(c,d,'background-color border-bottom-color border-left-color border-right-color border-top-color color outline-color text-decoration-color'.split(' '));
a.consumeColor=a.consumeParenthesised.bind(null,c);a.mergeColors=d})(b,null);(function(a,b){function c(a,b){if(b=b.trim().toLowerCase(),'0'==b&&0<='px'.search(a))return{px:0};if(/^[^(]*$|^calc/.test(b)){b=b.replace(/calc\(/g,'(');var c={};b=b.replace(a,function(a){return c[a]=null,'U'+a});for(var d='U('+a.source+')',e=b.replace(/[-+]?(\d*\.)?\d+/g,'N').replace(new RegExp('N'+d,'g'),'D').replace(/\s[+-]\s/g,'O').replace(/\s/g,''),f=[/N\*(D)/g,/(N|D)[*\/]N/g,/(N|D)O\1/g,/\((N|D)\)/g],g=0;g<f.length;)f[g].test(e)?
(e=e.replace(f[g],'$1'),g=0):g++;if('D'==e){for(var h in c){e=eval(b.replace(new RegExp('U'+h,'g'),'').replace(new RegExp(d,'g'),'*0'));if(!isFinite(e))return;c[h]=e}return c}}}function d(a,b){return e(a,b,!0)}function e(b,c,d){var e,f=[];for(e in b)f.push(e);for(e in c)0>f.indexOf(e)&&f.push(e);return b=f.map(function(a){return b[a]||0}),c=f.map(function(a){return c[a]||0}),[b,c,function(b){var c=b.map(function(c,e){return 1==b.length&&d&&(c=Math.max(c,0)),a.numberToString(c)+f[e]}).join(' + ');
return 1<b.length?'calc('+c+')':c}]}var g=c.bind(null,RegExp('px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc','g')),m=c.bind(null,RegExp('px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|%','g')),f=c.bind(null,/deg|rad|grad|turn/g);a.parseLength=g;a.parseLengthOrPercent=m;a.consumeLengthOrPercent=a.consumeParenthesised.bind(null,m);a.parseAngle=f;a.mergeDimensions=e;var g=a.consumeParenthesised.bind(null,g),g=a.consumeRepeated.bind(void 0,g,/^/),n=a.consumeRepeated.bind(void 0,g,/^,/);a.consumeSizePairList=
n;g=a.mergeNestedRepeated.bind(void 0,d,' ');f=a.mergeNestedRepeated.bind(void 0,g,',');a.mergeNonNegativeSizePair=g;a.addPropertiesHandler(function(a){if((a=n(a))&&''==a[1])return a[0]},f,['background-size']);a.addPropertiesHandler(m,d,'border-bottom-width border-image-width border-left-width border-right-width border-top-width flex-basis font-size height line-height max-height max-width outline-width width'.split(' '));a.addPropertiesHandler(m,e,'border-bottom-left-radius border-bottom-right-radius border-top-left-radius border-top-right-radius bottom left letter-spacing margin-bottom margin-left margin-right margin-top min-height min-width outline-offset padding-bottom padding-left padding-right padding-top perspective right shape-margin text-indent top vertical-align word-spacing'.split(' '))})(b,
null);(function(a,b){function c(b){return a.consumeLengthOrPercent(b)||a.consumeToken(/^auto/,b)}function d(b){if((b=a.consumeList([a.ignore(a.consumeToken.bind(null,/^rect/)),a.ignore(a.consumeToken.bind(null,/^\(/)),a.consumeRepeated.bind(null,c,/^,/),a.ignore(a.consumeToken.bind(null,/^\)/))],b))&&4==b[0].length)return b[0]}var e=a.mergeWrappedNestedRepeated.bind(null,function(a){return'rect('+a+')'},function(b,c){return'auto'==b||'auto'==c?[!0,!1,function(d){d=d?b:c;if('auto'==d)return'auto';
d=a.mergeDimensions(d,d);return d[2](d[0])}]:a.mergeDimensions(b,c)},', ');a.parseBox=d;a.mergeBoxes=e;a.addPropertiesHandler(d,e,['clip'])})(b,null);(function(a,b){function c(a){return function(b){var c=0;return a.map(function(a){return a===f?b[c++]:a})}}function d(a){return a}function e(a){return a.toFixed(6).replace('.000000','')}function g(b,c){if(b.decompositionPair!==c){b.decompositionPair=c;var d=a.makeMatrixDecomposition(b)}if(c.decompositionPair!==b){c.decompositionPair=b;var f=a.makeMatrixDecomposition(c)}return null==
d[0]||null==f[0]?[[!1],[!0],function(a){return a?c[0].d:b[0].d}]:(d[0].push(0),f[0].push(1),[d,f,function(b){var c=a.quat(d[0][3],f[0][3],b[5]);return a.composeMatrix(b[0],b[1],b[2],c,b[4]).map(e).join(',')}])}function m(a){return a.replace(/(x|y|z|3d)?$/,'3d')}var f=null,n={px:0},p={deg:0},r={matrix:['NNNNNN',[f,f,0,0,f,f,0,0,0,0,1,0,f,f,0,1],d],matrix3d:['NNNNNNNNNNNNNNNN',d],rotate:['A'],rotatex:['A'],rotatey:['A'],rotatez:['A'],rotate3d:['NNNA'],perspective:['L'],scale:['Nn',c([f,f,1]),d],scalex:['N',
c([f,1,1]),c([f,1])],scaley:['N',c([1,f,1]),c([1,f])],scalez:['N',c([1,1,f])],scale3d:['NNN',d],skew:['Aa',null,d],skewx:['A',null,c([f,p])],skewy:['A',null,c([p,f])],translate:['Tt',c([f,f,n]),d],translatex:['T',c([f,n,n]),c([f,n])],translatey:['T',c([n,f,n]),c([n,f])],translatez:['L',c([n,n,f])],translate3d:['TTL',d]};a.addPropertiesHandler(function(b){if(b=b.toLowerCase().trim(),'none'==b)return[];for(var c,d=/\s*(\w+)\(([^)]*)\)/g,e=[],f=0;(c=d.exec(b))&&c.index==f;){var f=c.index+c[0].length,
g=c[1],h=r[g];if(!h)break;c=c[2].split(',');h=h[0];if(h.length<c.length)break;for(var k=[],l=0;l<h.length;l++){var m,q=c[l],u=h[l];if(m=q?{A:function(b){return'0'==b.trim()?p:a.parseAngle(b)},N:a.parseNumber,T:a.parseLengthOrPercent,L:a.parseLength}[u.toUpperCase()](q):{a:p,n:k[0],t:n}[u],void 0===m)return;k.push(m)}if(e.push({t:g,d:k}),d.lastIndex==b.length)return e}},function(b,c){var d=a.makeMatrixDecomposition&&!0,e=!1;if(!b.length||!c.length){b.length||(e=!0,b=c,c=[]);for(var f=0;f<b.length;f++){var h=
b[f].t,k=b[f].d,l='scale'==h.substr(0,5)?1:0;c.push({t:h,d:k.map(function(a){if('number'===typeof a)return l;var b={},c;for(c in a)b[c]=l;return b})})}}var k=[],n=[],p=[];if(b.length!=c.length){if(!d)return;var q=g(b,c),k=[q[0]],n=[q[1]],p=[['matrix',[q[2]]]]}else for(f=0;f<b.length;f++){var h=b[f].t,t=c[f].t,u=b[f].d,v=c[f].d,q=r[h],z=r[t];if('perspective'==h&&'perspective'==t||!('matrix'!=h&&'matrix3d'!=h||'matrix'!=t&&'matrix3d'!=t)){if(!d)return;q=g([b[f]],[c[f]]);k.push(q[0]);n.push(q[1]);p.push(['matrix',
[q[2]]])}else{if(h!=t)if(q[2]&&z[2]&&h.replace(/[xy]/,'')==t.replace(/[xy]/,''))h=h.replace(/[xy]/,''),u=q[2](u),v=z[2](v);else{if(!q[1]||!z[1]||m(h)!=m(t)){if(!d)return;q=g(b,c);k=[q[0]];n=[q[1]];p=[['matrix',[q[2]]]];break}h=m(h);u=q[1](u);v=z[1](v)}for(var z=[],t=[],A=[],F=0;F<u.length;F++)q=('number'===typeof u[F]?a.mergeNumbers:a.mergeDimensions)(u[F],v[F]),z[F]=q[0],t[F]=q[1],A.push(q[2]);k.push(z);n.push(t);p.push([h,A])}}e&&(n=k=n);return[k,n,function(a){return a.map(function(a,b){var c=a.map(function(a,
c){return p[b][1][c](a)}).join(',');return'matrix'==p[b][0]&&16==c.split(',').length&&(p[b][0]='matrix3d'),p[b][0]+'('+c+')'}).join(' ')}]},['transform'])})(b,null);(function(a){function b(b){return b=100*Math.round(b/100),b=a.clamp(100,900,b),400===b?'normal':700===b?'bold':String(b)}a.addPropertiesHandler(function(a){a=Number(a);if(!(isNaN(a)||100>a||900<a||0!==a%100))return a},function(a,c){return[a,c,b]},['font-weight'])})(b);(function(a){function b(b){return a.consumeToken(/^(left|center|right|top|bottom)\b/i,
b)||a.consumeLengthOrPercent(b)}function c(c,d){var e=a.consumeRepeated(b,/^/,d);if(e&&''==e[1]&&(e=e[0],e[0]=e[0]||'center',e[1]=e[1]||'center',3==c&&(e[2]=e[2]||{px:0}),e.length==c)){if(/top|bottom/.test(e[0])||/left|right/.test(e[1])){var f=e[0];e[0]=e[1];e[1]=f}if(/left|right|center|Object/.test(e[0])&&/top|bottom|center|Object/.test(e[1]))return e.map(function(a){return'object'===typeof a?a:h[a]})}}function d(c){if(c=a.consumeRepeated(b,/^/,c)){for(var d=c[0],e=[{'%':50},{'%':50}],g=0,k=!1,l=
0;l<d.length;l++){var m=d[l];if('string'===typeof m)k=/bottom|right/.test(m),g={left:0,right:0,center:g,top:1,bottom:1}[m],e[g]=h[m],'center'==m&&g++;else{if(k){var k=void 0,p={};for(k in m)p[k]=-m[k];m=p;m['%']=(m['%']||0)+100}e[g]=m;g++;k=!1}}return[e,c[1]]}}var h={left:{'%':0},center:{'%':50},right:{'%':100},top:{'%':0},bottom:{'%':100}},g=a.mergeNestedRepeated.bind(null,a.mergeDimensions,' ');a.addPropertiesHandler(c.bind(null,3),g,['transform-origin']);a.addPropertiesHandler(c.bind(null,2),g,
['perspective-origin']);a.consumePosition=d;a.mergeOffsetList=g;g=a.mergeNestedRepeated.bind(null,g,', ');a.addPropertiesHandler(function(b){if((b=a.consumeRepeated(d,/^,/,b))&&''==b[1])return b[0]},g,['background-position','object-position'])})(b);(function(a){var b=a.consumeParenthesised.bind(null,a.parseLengthOrPercent),c=a.consumeRepeated.bind(void 0,b,/^/),d=a.mergeNestedRepeated.bind(void 0,a.mergeDimensions,' '),h=a.mergeNestedRepeated.bind(void 0,d,',');a.addPropertiesHandler(function(d){var e=
a.consumeToken(/^circle/,d);return e&&e[0]?['circle'].concat(a.consumeList([a.ignore(a.consumeToken.bind(void 0,/^\(/)),b,a.ignore(a.consumeToken.bind(void 0,/^at/)),a.consumePosition,a.ignore(a.consumeToken.bind(void 0,/^\)/))],e[1])):(e=a.consumeToken(/^ellipse/,d))&&e[0]?['ellipse'].concat(a.consumeList([a.ignore(a.consumeToken.bind(void 0,/^\(/)),c,a.ignore(a.consumeToken.bind(void 0,/^at/)),a.consumePosition,a.ignore(a.consumeToken.bind(void 0,/^\)/))],e[1])):(d=a.consumeToken(/^polygon/,d))&&
d[0]?['polygon'].concat(a.consumeList([a.ignore(a.consumeToken.bind(void 0,/^\(/)),a.optional(a.consumeToken.bind(void 0,/^nonzero\s*,|^evenodd\s*,/),'nonzero,'),a.consumeSizePairList,a.ignore(a.consumeToken.bind(void 0,/^\)/))],d[1])):void 0},function(b,c){if(b[0]===c[0])return'circle'==b[0]?a.mergeList(b.slice(1),c.slice(1),['circle(',a.mergeDimensions,' at ',a.mergeOffsetList,')']):'ellipse'==b[0]?a.mergeList(b.slice(1),c.slice(1),['ellipse(',a.mergeNonNegativeSizePair,' at ',a.mergeOffsetList,
')']):'polygon'==b[0]&&b[1]==c[1]?a.mergeList(b.slice(2),c.slice(2),['polygon(',b[1],h,')']):void 0},['shape-outside'])})(b);(function(a,b){function c(a,b){b.concat([a]).forEach(function(b){b in document.documentElement.style&&(d[a]=b)})}var d={};c('transform',['webkitTransform','msTransform']);c('transformOrigin',['webkitTransformOrigin']);c('perspective',['webkitPerspective']);c('perspectiveOrigin',['webkitPerspectiveOrigin']);a.propertyName=function(a){return d[a]||a}})(b,null)})();!function(){if(void 0===
document.createElement('div').animate([]).oncancel){var b;b=window.performance&&performance.now?function(){return performance.now()}:function(){return Date.now()};var a=function(a,b,c){this.target=a;this.currentTime=b;this.timelineTime=c;this.type='cancel';this.cancelable=this.bubbles=!1;this.currentTarget=a;this.defaultPrevented=!1;this.eventPhase=Event.AT_TARGET;this.timeStamp=Date.now()},c=window.Element.prototype.animate;window.Element.prototype.animate=function(d,k){var e=c.call(this,d,k);e._cancelHandlers=
[];e.oncancel=null;var h=e.cancel;e.cancel=function(){h.call(this);var c=new a(this,null,b()),d=this._cancelHandlers.concat(this.oncancel?[this.oncancel]:[]);setTimeout(function(){d.forEach(function(a){a.call(c.target,c)})},0)};var g=e.addEventListener;e.addEventListener=function(a,b){'function'===typeof b&&'cancel'==a?this._cancelHandlers.push(b):g.call(this,a,b)};var m=e.removeEventListener;return e.removeEventListener=function(a,b){if('cancel'==a){var c=this._cancelHandlers.indexOf(b);0<=c&&this._cancelHandlers.splice(c,
1)}else m.call(this,a,b)},e}}}();(function(b){var a=document.documentElement,c=null,d=!1;try{var k='0'==getComputedStyle(a).getPropertyValue('opacity')?'1':'0',c=a.animate({opacity:[k,k]},{duration:1});c.currentTime=0;d=getComputedStyle(a).getPropertyValue('opacity')==k}catch(h){}finally{c&&c.cancel()}if(!d){var l=window.Element.prototype.animate;window.Element.prototype.animate=function(a,c){return window.Symbol&&Symbol.iterator&&Array.prototype.from&&a[Symbol.iterator]&&(a=Array.from(a)),Array.isArray(a)||
null===a||(a=b.convertToArrayForm(a)),l.call(this,a,c)}}})(p);z['true']=v}({},function(){return this}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ })

},[194]);
//# sourceMappingURL=polyfills.bundle.js.map