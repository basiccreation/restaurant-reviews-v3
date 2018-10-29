



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
      upgradeDb.createObjectStore('firstOS');
    } // end if ... secondOS
        console.log('making second object store');
    if (!upgradeDb.objectStoreNames.contains('secondOS')) {
      upgradeDb.createObjectStore('secondOS');
    } // end if ... secondOS
        console.log('making third object store');
    if (!upgradeDb.objectStoreNames.contains('thirdOS')) {
      upgradeDb.createObjectStore('thirdOS');
    } // end if ... thirdOS
  }); // end dbPromise
})(); // end anonymos function