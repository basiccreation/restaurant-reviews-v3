/*jshint esversion: 6 */
/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        const port = 1337; // Change this to your server port
        return `./data/restaurants.jso`;
        //return `http://localhost:${port}/data/restaurants.json`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", DBHelper.DATABASE_URL);
        xhr.onload = () => {
            if (xhr.status === 200) { // Got a success response from server!
                const json = JSON.parse(xhr.responseText);
                const restaurants = json.restaurants;
                callback(null, restaurants);
            } else if  (xhr.status === 404) { //this if statement, I'm adding for the dbindexed 

                let request = window.indexedDB.open("RestaurantDatabase", 1);
                request.onsuccess = function(e) {
                    db = e.target.result;

                function getAllItems(callback) {

                    var transaction = db.transaction("customers", "readwrite");
                    var objstore = transaction.objectStore("customers");
                    var items = [];

                    transaction.oncomplete = function(evt) {  
                            callback(items);
                        };
                     
                        var cursorRequest = objstore.openCursor();
                     
                        cursorRequest.onerror = function(error) {
                            console.log(error);
                        };
                     
                        cursorRequest.onsuccess = function(evt) {                    
                            var cursor = evt.target.result;
                            if (cursor) {
                                items.push(cursor.value);
                                cursor.continue();
                            }
                        };
                }

                getAllItems(function (items) {
                    //const json = JSON.parse(items);
                    //const restaurants = json.restaurants;
                    const restaurants = items;
                    callback(null, restaurants);


                    var len = items.length;
                    for (var i = 0; i < len; i += 1) {
                        console.log(items[i]);
                    }
                });




                    // let q1 = objstore.get(2);


                    // const json = JSON.parse(db);
                    // const restaurants = json.restaurants;
                    // callback(null, restaurants);



                    // q1.onsuccess = function() {
                    //     console.log(q1.result);
                    // }

                }; //end onsuccess

            } else { // Oops!. Got an error from server.
                const error = (`Request failed. Returned status of ${xhr.status}`);
                callback(error, null);
            }
        };
        xhr.send();
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                const restaurant = restaurants.find(r => r.id == id);
                if (restaurant) { // Got the restaurant
                    callback(null, restaurant);
                } else { // Restaurant does not exist in the database
                    callback("Restaurant does not exist", null);
                }
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants;
                if (cuisine != "all") { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != "all") { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        return (`./img/${restaurant.photograph}`);
    }

    /**
     * Restaurant image URL for restaurants-list.
     */
    static imageUrlForRestaurantList(restaurant) {
        return (`./img/${restaurant.photograph400}`);
    }

    /**
     * Restaurant image URL for restaurant viewport 500.
     */
    static imageUrlForRestaurant500(restaurant) {
        return (`./img/${restaurant.photograph500}`);
    }

    /**
     * Restaurant image URL for restaurant viewport 750.
     */
    static imageUrlForRestaurant750(restaurant) {
        return (`./img/${restaurant.photograph750}`);
    }

    /**
     * Restaurant image alt.
     */
    static imageAltForRestaurant(restaurant) {
        return (`Image of ${restaurant.name}`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
            position: restaurant.latlng,
            title: restaurant.name,
            url: DBHelper.urlForRestaurant(restaurant),
            map: map,
            animation: google.maps.Animation.DROP
        });
        return marker;
    }
}