/*jshint esversion: 6 */
let restaurant;
var map;
let restaurantIDfromPage = getID('id', window.location);
let favorites = {};

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
};

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
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById("restaurant-name");
    name.innerHTML = restaurant.name;

    const heart = document.getElementById("heart");

    let currentfavorites = localStorage.getItem("favorites");
    currentfavorites = currentfavorites ? JSON.parse(currentfavorites) : {};
    const resID = "resID" + restaurantIDfromPage;

    if (currentfavorites[resID] === restaurantIDfromPage) {
        heart.src = "img/heartsolid.svg";
    } else {
        heart.src = "img/heart.svg";
    }

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
};

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

/**
 * load in reviews
 */
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

const reviewURL = "http://localhost:1337/reviews/?restaurant_id=" + restaurantIDfromPage;
let currentRestaurantName = (restaurant = self.restaurant) => {
    console.log(restaurant.name);
};

fetch(reviewURL)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        return json;
    })
    .then(function(reviews) {
        const container = document.getElementById("reviews-container");

        if (!reviews) {
            const noReviews = document.createElement("p");
            noReviews.innerHTML = "No reviews yet!";
            container.appendChild(noReviews);
            return;
        }

        const ul = document.getElementById("reviews-list");
        reviews.forEach(review => {
            ul.appendChild(createReviewHTML(review));
        });
        container.appendChild(ul);

    });

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
    const li = document.createElement("li");
    li.className = "col-l-3 left-m left-s"

    const div = document.createElement("div");
    li.appendChild(div);

    const name = document.createElement("p");
    name.innerHTML = review.name;
    name.className = "review-name";
    name.tabIndex = 1;
    div.appendChild(name);

    const rating = document.createElement("p");
    let r = review.rating;
    rating.innerHTML = getRatingOption (r);// + review.rating;
    rating.className = "review-rating";
    rating.tabIndex = 1;
    li.appendChild(rating);

    const comments = document.createElement("p");
    comments.innerHTML = review.comments;
    comments.className = "review-comments";
    comments.tabIndex = 1;
    li.appendChild(comments);

    return li;
};

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


/*
 *  * Toggle favorite heart.
 */

function toggleFavorite() {
    var image = document.getElementById("heart");
    var src = image.src;
    if (src === "http://localhost:8000/img/heartsolid.svg") {
        image.src = "img/heart.svg";
        let currentfavorites = localStorage.getItem("favorites");
        currentfavorites = JSON.parse(currentfavorites);
        const resID = "resID" + restaurantIDfromPage;
        delete currentfavorites[resID];
        localStorage.setItem('favorites', JSON.stringify(currentfavorites));

    } else if (src == "http://localhost:8000/img/heart.svg") {
        image.src = "img/heartsolid.svg";
        let currentfavorites = localStorage.getItem("favorites");
        currentfavorites = currentfavorites ? JSON.parse(currentfavorites) : {};
        currentfavorites["resID" + restaurantIDfromPage] = restaurantIDfromPage;
        localStorage.setItem('favorites', JSON.stringify(currentfavorites));
    }
} //end toggleFavorite

/*
 * Add new review form
 */

document.getElementById('add-review').addEventListener('submit', addNewReview);
document.getElementById('add-review').addEventListener('submit', resetForm);

function resetForm() {
    document.getElementById("add-review").reset();
}

function addNewReview(e) {
    e.preventDefault();
    let restaurant_id = restaurantIDfromPage;
    let name = document.getElementById('name').value;
    let rating = document.getElementById('rating').value;
    let comment = document.getElementById('comment').value;

    fetch('http://localhost:1337/reviews/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                restaurant_id: restaurant_id,
                name: name,
                rating: rating,
                comments: comment
            })
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
} // end addNewReview


function getRatingOption (r) {
        const ratingOptions = {
             "1" : "Never going back. ",
             "2" : "Have had better. ",
             "3" : "On the fence. ",
             "4" : "Food was great, but ... ",
             "5" : "Loved it! ",
             default: "One person's opinon. "
        };
        return (ratingOptions[r] || ratingOptions['default']);
    } //getRatingOption
