/*jshint esversion: 6 */
let restaurant;
var map;
let restaurantIDfromPage = getID('id', window.location);
let favorites = {};
let offlineReviews = {};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    fetchRestaurantFromURL((error, restaurant) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            self.map = new google.maps.Map(document.getElementById("map"), {
                zoom: 16,
                center: restaurant.latlng,
                scrollwheel: false
            });
            fillBreadcrumb();
            DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
        }
    });
}; // end initMap

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
    if (self.restaurant) { // restaurant already fetched!
        callback(null, self.restaurant);
        return;
    }
    const id = getParameterByName("id");

    if (!id) { // no id found in URL
        error = "No restaurant id in URL";
        callback(error, null);
    } else {
        DBHelper.fetchRestaurantById(id, (error, restaurant) => {
            self.restaurant = restaurant;
            if (!restaurant) {
                console.error(error);
                return;
            }
            fillRestaurantHTML();
            callback(null, restaurant);
        });
    }
}; // end fetchRestaurantFromURL

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById("restaurant-name");
    name.innerHTML = restaurant.name;

    const heart = document.getElementById("heart");

    if (restaurant.is_favorite === true) {
        heart.src = "img/heartsolid.svg";
        heart.classList.add('my-favorite');
    } else {
        heart.src = "img/heart.svg";
        heart.classList.remove('my-favorite');
    }

    heart.addEventListener("click", (event) => {
        event.preventDefault();
        if (heart.classList.contains("my-favorite")) {
            heart.src = "img/heart.svg";
            DBHelper.favoriteRestaurantUnchecked(restaurant.id);
            console.log("THIS RESTAURANT IS NO LONGER A FAVORITE" );
        } 
        else {
            heart.src = "img/heartsolid.svg";
            DBHelper.favoriteRestaurantChecked(restaurant.id);
            console.log("THIS RESTAURANT IS NOW A FAVORITE" );
        }
        heart.classList.toggle('my-favorite');
    })

    const address = document.getElementById("restaurant-address");
    address.innerHTML = restaurant.address;

    const image = document.getElementById("restaurant-img");
    image.alt = DBHelper.imageAltForRestaurant(restaurant);
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
    image.setAttribute("data-Src", DBHelper.imageUrlForRestaurantList(restaurant));

    const image500 = document.getElementById("viewport500");
    image500.setAttribute("data-Src", DBHelper.imageUrlForRestaurant500(restaurant));

    const image750 = document.getElementById("viewport750");
    image750.setAttribute("data-Src", DBHelper.imageUrlForRestaurant750(restaurant));

    const cuisine = document.getElementById("restaurant-cuisine");
    cuisine.innerHTML = restaurant.cuisine_type;

    const ul = document.getElementById("reviews-list");
    const title = document.getElementById("review-title");
    title.className = "review-title";
    title.innerHTML = "What other people say about " + restaurant.name;
    title.tabIndex = 1;
    ul.prepend(title);

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
}; // end fillRestaurantHTML

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById("restaurant-hours");
    for (let key in operatingHours) {
        const row = document.createElement("tr");

        const day = document.createElement("td");
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement("td");
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
};

// /**
//  * load in reviews
//  */
function getID(name, href) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById("breadcrumb");
    const li = document.createElement("li");
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

