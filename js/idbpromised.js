
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
      var firstOS = upgradeDb.createObjectStore('firstOS', {autoIncrement:true});
       firstOS.createIndex('id', 'id', {unique: true});

    } // end if ... secondOS
        console.log('making second object store');
    if (!upgradeDb.objectStoreNames.contains('secondOS')) {
      var secondOS = upgradeDb.createObjectStore('secondOS', {autoIncrement:true});
       secondOS.createIndex('id', 'id', {unique: true});

    } // end if ... secondOS
        console.log('making third object store');
    if (!upgradeDb.objectStoreNames.contains('thirdOS')) {
      var thirdOS = upgradeDb.createObjectStore('thirdOS', {keypath:"date", autoIncrement:false});
    } // end if ... thirdOS
  }); // end dbPromise
})(); // end anonymos function