// Type definitions for session-xp
// Project: session-xp
// Definitions by: Ronis Xogum <https://github.com/rxogum>
declare module "session-xp" {
    export = sessionXp
    class sessionXp {
        constructor (options?: sessionXp.options)
    }
}
declare namespace sessionXp {
    export interface options {
        collection?: string,
        dbname?: string,
        expires?: expiresObject
    }
    export interface expiresObject {
        years?: number,
        months?: number,
        weeks?: number,
        days?: number,
        hours?: number,
        minutes?: number,
        seconds?: number
    }
}
