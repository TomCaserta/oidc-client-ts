/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/**
 * Generates RFC4122 version 4 guid ()
 */

// @ts-ignore
const crypto = (typeof window !== "undefined") ? (window.crypto || window.msCrypto) : undefined;

function _cryptoUuidv4() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (c ^ crypto!.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function _uuidv4() {
    // @ts-ignore
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ Math.random() * 16 >> c / 4).toString(16)
    );
}

export function random(): string {
    const hasRandomValues = crypto && Object.prototype.hasOwnProperty.call(crypto, "getRandomValues");
    const uuid = hasRandomValues ? _cryptoUuidv4 : _uuidv4;
    return uuid().replace(/-/g, "");
}
