//@ts-check

export default class Logger {
    constructor() {};

    /**
     * @param {any} err
     */
    error(err) {
        console.log(err);
    };

    /**
     * @param {any} info
     */
    info(info) {
        console.log(info);
    }
}