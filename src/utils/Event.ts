// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from "./Log";

export class Event {
    private _callbacks: ((...ev: any[]) => Promise<void> | void)[] = [];

    public constructor(protected _name: string) {}

    public addHandler(cb: (...ev: any[]) => Promise<void> | void): void {
        this._callbacks.push(cb);
    }

    public removeHandler(cb: (...ev: any[]) => Promise<void> | void): void {
        const idx = this._callbacks.findIndex(item => item === cb);
        if (idx >= 0) {
            this._callbacks.splice(idx, 1);
        }
    }

    public raise(...params: any[]): void {
        Log.debug("Event: Raising event: " + this._name);
        for (let i = 0; i < this._callbacks.length; i++) {
            void this._callbacks[i](...params);
        }
    }
}
