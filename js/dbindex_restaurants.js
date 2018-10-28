"use strict";

//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//Inspiration was taken from 
//https://www.youtube.com/watch?v=3y_x3Nkc8Dw PothOnProgramming YouTube Video
//https://stackoverflow.com/questions/12607251/how-do-i-store-json-objects-in-indexeddb
//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
//https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB

var db;

if (!window.indexedDB) {
    console.log("no indexedDB");
}; // end if no indexedDB

if (window.indexedDB) {
    console.log("yay! indexedDB present");
}; //end if indexedDB

const request = window.indexedDB.open("database", 2);

request.onerror = function(e) {
    console.log("there was an error " + e.target.errorCode);
}; //end onerror

request.onsuccess = function(e) {
    db = e.target.result;
}; //end onsuccess

//runs if there is a new version (or if original database was deleted)
request.onupgradeneeded = function(e) {
    //save the database interface
    var db = e.target.result;

    //create object store for this database
    var restaurantstore = db.createObjectStore("restaurants", 
        { autoIncrement: true });
    var favoritestore = db.createObjectStore("favoriteRestaurants", 
        { autoIncrement: true });
    var reviewstore = db.createObjectStore("restaurantReviews", 
        { autoIncrement: true });

    //create index to look up restaurants by favorite
    favoritestore.createIndex("is_favorite", "is_favorite", { unique: false });
 reviewstore.createIndex("restaurant_id", "restaurant_id", { unique: false });

    restaurantstore.transaction.oncomplete = function(e) {

        const JSONurl = "http://localhost:1337/restaurants";

        fetch(JSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(resturantsJSON) {
                var transaction = db.transaction("restaurants", "readwrite");
                var objstore = transaction.objectStore("restaurants");
                for (var i = 0; i < resturantsJSON.length; i++) {
                    objstore.add(resturantsJSON[i])
                }
            })
            .catch(err => {
                console.log("resturant JSON err");
            }); // end fetch
    } // end restaurants objectstore



    reviewstore.transaction.oncomplete = function(e) {

        const JSONurl = "http://localhost:1337/reviews";

        fetch(JSONurl)
            .then(function(response) {
                return response.json();
            })
            .then(function(resturantsJSON) {
                var transaction = db.transaction("restaurantReviews", "readwrite");
                var objstore = transaction.objectStore("restaurantReviews");
                for (var i = 0; i < resturantsJSON.length; i++) {
                    objstore.add(resturantsJSON[i])
                }
            })
            .catch(err => {
                console.log("resturant JSON err");
            }); // end fetch
    }  // end restaurants reviewStore



    // favoriteStore.transaction.oncomplete = function(e) {

    //     const JSONurl = "http://localhost:1337/restaurants";

    //     fetch(JSONurl)
    //         .then(function(response) {
    //             return response.json();
    //         })
    //         .then(function(resturantsJSON) {
    //             var transaction = db.transaction("favoriteRestaurants", "readwrite");
    //             var favoritestore = transaction.favoriteStore("favoriteRestaurants");
    //             for (var i = 0; i < resturantsJSON.length; i++) {
    //                 favoritestore.add(resturantsJSON[i])
    //             }
    //         })
    //         .catch(err => {
    //             console.log("favorite resturant JSON err");
    //         }); // end fetch
    // } // end restaurants favoriteStore


} // onupgradeneeded