// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Timer } from "../../src/utils";
import { AccessTokenEvents } from "../../src/AccessTokenEvents";
import type { User } from "../../src/User";

describe("AccessTokenEvents", () => {

    let subject: AccessTokenEvents;
    let expiringTimer: StubTimer;
    let expiredTimer: StubTimer;

    beforeEach(() => {
        expiringTimer = new StubTimer("stub expiring timer");
        expiredTimer = new StubTimer("stub expired timer");

        subject = new AccessTokenEvents({ expiringNotificationTimeInSeconds: 60 });

        // access private members
        subject["_expiringTimer"] = expiringTimer;
        subject["_expiredTimer"] = expiredTimer;
    });

    describe("constructor", () => {

        it("should use default expiringNotificationTime", () => {
            expect(subject["_expiringNotificationTimeInSeconds"]).toEqual(60);
        });

    });

    describe("load", () => {

        it("should cancel existing timers", () => {
            // act
            subject.load({} as User);

            // assert
            expect(expiringTimer.cancelWasCalled).toEqual(true);
            expect(expiredTimer.cancelWasCalled).toEqual(true);
        });

        it("should initialize timers", () => {
            // act
            subject.load({
                access_token:"token",
                expires_in : 70
            } as User);

            // assert
            expect(expiringTimer.duration).toEqual(10);
            expect(expiredTimer.duration).toEqual(71);
        });

        it("should immediately schedule expiring timer if expiration is soon", () => {
            // act
            subject.load({
                access_token:"token",
                expires_in : 10
            } as User);

            // assert
            expect(expiringTimer.duration).toEqual(1);
        });

        it("should not initialize expiring timer if already expired", () => {
            // act
            subject.load({
                access_token:"token",
                expires_in : 0
            } as User);

            // assert
            expect(expiringTimer.duration).toEqual(undefined);
        });

        it("should initialize expired timer if already expired", () => {
            // act
            subject.load({
                access_token:"token",
                expires_in : 0
            } as User);

            // assert
            expect(expiredTimer.duration).toEqual(1);
        });

        it("should not initialize timers if no access token", () => {
            // act
            subject.load({
                expires_in : 70
            } as User);

            // assert
            expect(expiringTimer.duration).toEqual(undefined);
            expect(expiredTimer.duration).toEqual(undefined);
        });

        it("should not initialize timers if no expiration on access token", () => {
            // act
            subject.load({
                access_token:"token"
            } as User);

            // assert
            expect(expiringTimer.duration).toEqual(undefined);
            expect(expiredTimer.duration).toEqual(undefined);
        });
    });

    describe("unload", () => {

        it("should cancel timers", () => {
            // act
            subject.unload();

            // assert
            expect(expiringTimer.cancelWasCalled).toEqual(true);
            expect(expiredTimer.cancelWasCalled).toEqual(true);
        });
    });
});

class StubTimer extends Timer {
    cancelWasCalled: boolean;
    duration: number | undefined;

    constructor(name: string) {
        super(name);
        this.cancelWasCalled = false;
        this.duration = undefined;
    }

    init(duration: number) {
        this.duration = duration;
    }

    cancel() {
        this.cancelWasCalled = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    addHandler() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    removeHandler() {}
}
