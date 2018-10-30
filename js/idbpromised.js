
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

 var dbPromise = idb.open("RestaurantDatabase", 1, function(upgradeDb) {
    //console.log('making restaurantObjectStore');
    if (!upgradeDb.objectStoreNames.contains('restaurantObjectStore')) {
      var restaurantObjectStore = upgradeDb.createObjectStore('restaurantObjectStore', {keypath:"restaurant_id", autoIncrement: true });
      restaurantObjectStore.createIndex('id', 'id', {unique: true});
      restaurantObjectStore.createIndex('cuisinetype', 'cuisine_type', {unique: false});
    } // end if ... restaurantObjectStore
    
   // console.log('making reviewObjectStore');
    if (!upgradeDb.objectStoreNames.contains('reviewObjectStore')) {
      var reviewObjectStore = upgradeDb.createObjectStore('reviewObjectStore', {keypath:"id", autoIncrement: true });
      reviewObjectStore.createIndex('reviewid', 'id', {unique: true});
      reviewObjectStore.createIndex('restaurantid', 'restaurant_id', {unique: false});
    } // end if ... reviewObjectStore
    
   // console.log('making currentFavoriteObjectStore');
    if (!upgradeDb.objectStoreNames.contains('currentFavoriteObjectStore')) {
      var currentFavoriteObjectStore = upgradeDb.createObjectStore('currentFavoriteObjectStore', {keyPath: 'restaurant_id'});
    } // end if ... currentFavoriteObjectStore
    
  //  console.log('making savedOfflineReviews');
    if (!upgradeDb.objectStoreNames.contains("savedOfflineReviews")) {
    var savedOfflineReviews = upgradeDb.createObjectStore('savedOnlineReviews', {keyPath: 'id', autoIncrement: true});
    savedOfflineReviews.createIndex("restaurant_id", "restaurant_id")
    }

  }); // end dbPromise

dbPromise.then(function(db) {
  var tx = db.transaction('reviewObjectStore', 'readonly');
  var store = tx.objectStore('reviewObjectStore');
  return store.getAll();
}).then(function(items) {
  console.log('Items by name:', items);
});


    dbPromise.then(function(db) {

        const RestaurantJSONurl = "http://localhost:1337/restaurants";

        fetch(RestaurantJSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(resturantsJSON) {
                //console.log(resturantsJSON)

                var tx = db.transaction(['restaurantObjectStore'], 'readwrite');
                var store = tx.objectStore('restaurantObjectStore');
                for (var i = 0; i < resturantsJSON.length; i++) {
                 store.add(resturantsJSON[i]);
                }
                tx.complete;

            })
            .catch(err => {
                console.log("restaurantObjectStore JSON err");
            }); // end catch

        const ReviewJSONurl = "http://localhost:1337/reviews";

        fetch(ReviewJSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(reviewJSON) {
                //console.log(reviewJSON)

                var tx = db.transaction(['reviewObjectStore'], 'readwrite');
                var store = tx.objectStore('reviewObjectStore');
                for (var i = 0; i < reviewJSON.length; i++) {
                 store.add(reviewJSON[i]);
                }
                tx.complete;

            })
            .catch(err => {
                console.log("reviewObjectStore JSON err");
            }); // end catch

    }) // end dbPromise.then

})(); // end anonymos function