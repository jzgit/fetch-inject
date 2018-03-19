(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.fetchInject = factory());
}(this, (function () { 'use strict';

/**
 * BTC License
 *
 * © 2017, 13AMDq9isKtQTxMQG4w7Yo7cEhqKAqQ4Lz
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

const head = (function(i,s,o,g,r,a,m){a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.appendChild(s.createTextNode(g.text));a.onload=r(g);m?m.parentNode.insertBefore(a,m):s.head.appendChild(a);}); // eslint-disable-line

/**
 * Fetch Inject module.
 *
 * @module fetchInject
 * @license ISC
 * @param {(USVString[]|Request[])} inputs Resources you wish to fetch.
 * @param {Promise} [promise] A promise to await before attempting injection.
 * @throws {Promise<TypeError>} Rejects with error on invalid arguments.
 * @throws {Promise<Error>} Whatever `fetch` decides to throw.
 * @throws {SyntaxError} Via DOM upon attempting to parse unexpected tokens.
 * @returns {Promise<Object[]>} A promise which resolves to an `Array` of
 *     Objects containing `Response` `Body` properties used by the module.
 */
const fetchInject = function (inputs, promise) {
  if (!(inputs && Array.isArray(inputs))) return Promise.reject(new TypeError('`inputs` must be an array'))
  if (promise && !(promise instanceof Promise)) return Promise.reject(new TypeError('`promise` must be a promise'))

  const resources = [];
  const deferreds = promise ? [].concat(promise) : [];
  const thenables = [];

  inputs.forEach(input => deferreds.push(
    window.fetch(input).then(res => {
      return [res.clone().text(), res.blob()]
    }).then(promises => {
      return Promise.all(promises).then(resolved => {
        resources.push({ text: resolved[0], blob: resolved[1] });
      })
    })
  ));

  return Promise.all(deferreds).then(() => {
    resources.forEach(resource => {
      thenables.push({ then: resolve => {
        resource.blob.type.includes('text/css')
          ? head(window, document, 'style', resource, resolve)
          : head(window, document, 'script', resource, resolve);
      }});
    });
    return Promise.all(thenables)
  })
};

return fetchInject;

})));
