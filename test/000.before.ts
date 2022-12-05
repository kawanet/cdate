import {strict as assert} from "assert";

before(() => {
    // assert polyfill doesn't have assert.match method.
    if (!assert.match) {
        assert.match = (value, regExp, message) => {
            assert.ok(regExp.test(value), message || String(regExp));
        }
    }
});
