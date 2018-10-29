
//https://developers.google.com/web/ilt/pwa/working-with-indexeddb


(function() {
  'use strict';

  //check for support
    if ('indexedDB' in window) {
      console.log('This browser supports IndexedDB');
    }

  if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
    return;
  }

 var dbPromise = idb.open('test-db2', 1, function(upgradeDb) {
    console.log('making first object store');
    if (!upgradeDb.objectStoreNames.contains('firstOS')) {
      var firstOS = upgradeDb.createObjectStore('firstOS', {keypath:"restaurant_id", autoIncrement: true });
      firstOS.createIndex('id', 'id', {unique: true});
      firstOS.createIndex('cuisinetype', 'cuisine_type', {unique: false});
    } // end if ... firstOS
    console.log('making second object store');
    if (!upgradeDb.objectStoreNames.contains('secondOS')) {
      var secondOS = upgradeDb.createObjectStore('secondOS', {keypath:"restaurant_id", autoIncrement: true });
      secondOS.createIndex('id', 'id', {unique: true});
    } // end if ... secondOS
    //     console.log('making third object store');
    // if (!upgradeDb.objectStoreNames.contains('thirdOS')) {
    //   var thirdOS = upgradeDb.createObjectStore('thirdOS', {keypath:"date", autoIncrement:true});
    // } // end if ... thirdOS

  }); // end dbPromise

    dbPromise.then(function(db) {

        const RestaurantJSONurl = "http://localhost:1337/restaurants";

        fetch(RestaurantJSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(resturantsJSON) {
                console.log(resturantsJSON)

                var tx = db.transaction(['firstOS'], 'readwrite');
                var store = tx.objectStore('firstOS');
                for (var i = 0; i < resturantsJSON.length; i++) {
                 store.add(resturantsJSON[i]);
                }
                tx.complete;

            })
            .catch(err => {
                console.log("firstOS JSON err");
            }); // end catch

        const ReviewJSONurl = "http://localhost:1337/reviews";

        fetch(ReviewJSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(reviewJSON) {
                console.log(reviewJSON)

                var tx = db.transaction(['secondOS'], 'readwrite');
                var store = tx.objectStore('secondOS');
                for (var i = 0; i < reviewJSON.length; i++) {
                 store.add(reviewJSON[i]);
                }
                tx.complete;

            })
            .catch(err => {
                console.log("secondOS JSON err");
            }); // end catch

    }) // end dbPromise.then

})(); // end anonymos function