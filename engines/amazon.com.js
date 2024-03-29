var q = require('q');
var nconf = require('nconf');
nconf.argv().env().file({ file: 'local.json' });

var OperationHelper = require('apac').OperationHelper;
var opHelper = new OperationHelper({
  awsId: nconf.get('amazonKey'),
  awsSecret: nconf.get('amazonSecret'),
  assocId: nconf.get('amazonAssociateId')
});

module.exports = new (require('../Engine'))({
  "id": "amazon.com",
  "name": "Amazon.com",
  "site": "http://d2lo25i6d3q8zm.cloudfront.net/browser-plugins/AmazonSearchSuggestionsOSD.Firefox.xml",
  "suggestUrl": "http://completion.amazon.com/search/complete?method=completion&search-alias=aps&mkt=1&q={searchTerms}",
  "queryFunc": function (term) {
    var d = q.defer();
    var itemsArr = [];

    opHelper.execute('ItemSearch', {
      'SearchIndex': 'Blended',
      'Keywords': term,
      'ResponseGroup': 'ItemAttributes'
    }, function (err, results) {
      if (err) {
        d.reject(err);
      } else {
        var items = results.itemsearchresponse.items[0];

        if (items.item) {
          for (var i in items.item) {
            if (items.item[i].detailpageurl) {
              itemsArr.push(items.item[i]);
            }
          }
        }

        d.resolve(itemsArr);
      }
    });

    return d.promise;
  },
  "icon": "data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVHjalFM9TNtQEP4cB7PwM1RITUXIgsRaYEEVEyKZwhiyZAQyd0BhpFOlIjoBqhjSqVQMoVMLLAjEwECCQJkSkBqJYDOAFOMKFSf28d7DTUxiUDnp/Pzeu/vuu7t3ICKF6SLTMv2/lB0fRWKfjwDm4JJisYh0Oo3fpZLYT0SjSCQS8JAFMADNDZ3NZsnf1taiqVTKi4nGASruk5lkkmTmMB6JUKFQqO+DfX1eABWeQoVR6f7HSdM0obqu48Yw8G1tDT82NsRd1TSbU9BbGPCog8PDj+jLzurFoAVgMh4XxoNDQ6SqKi0tL9eBvAB8zZwymYxYY7EYAoEA8vm82BNTg6XUIs0MeGTZoR1mhXSnwNl4pmAbjU7mcjkKhkL1ynMnntZ4OEw3VyrV8utk7s5TdW++0QXz+1i3P7IK36t+PCfVn1OQOoOA0gXr5DPak+cPXbBK+/T3S69AtY3LJ98vZ1or/iLr+pTuvr59/A6s003UdqZFJF/PCKQ3o5CUznoBST2AfbEF/9iqYEDaIfwj73VJPEfgNTe0tWNYR0uwy9uOW0OkrgHI7z5ADo2C7v48nLV3XHKAT+x/1m1sX58xsBxg8rZJrDYD8DHHp4aJj/MK09sXjPOt46PcCzAACXY8/u34wN0AAAAASUVORK5CYII="
});
