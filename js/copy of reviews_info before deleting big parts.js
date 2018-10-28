
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
    // .then(function(json) {
    //     return json;
    // })
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
    rating.innerHTML = getRatingOption (r) + review.rating;
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




/*
 * Add new review
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
  //      .then((data) => console.log(data))
        .then(function(data) {
            if(navigator.offline) {
                console.log(data);

                // Get the existing data
                var existing = localStorage.getItem('offlineReviews');

                // If no existing data, create an array
                // Otherwise, convert the localStorage string to an array
                existing = existing ? JSON.parse(existing) : {};

                let reviewID = data.id;
     
                console.log(reviewID);


                // Add new data to localStorage Array
                existing[reviewID] = data;

                // Save back to localStorage
                localStorage.setItem('offlineReviews', JSON.stringify(existing));
            } // end if navigator

        }) //end then
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


window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOfflineStatus);

function updateOnlineStatus()
{
    console.log( "User is online");
}

function updateOfflineStatus()
{
    console.log( "User is offline");
}


// function updateOnlineStatus()
// {
//     document.getElementById("status").innerHTML = "User is online";


//     if (localStorage.length > 0) {
//         console.log(localStorage.length)
//         // add review to data base
//         // delete review from localstorage    
//     }


//     //document.getElementById("status").innerHTML = "User is online";
// }





/**
* Review Object Store
**/



//create object store for this database

request.onupgradeneeded = function(e) {


    var reviewObjectStore = db.createObjectStore("reviews", { autoIncrement: true });

    //create indexes to look up restaurants by
    reviewObjectStore.createIndex("name", "name", { unique: false });
    reviewObjectStore.transaction.oncomplete = function(e) {

        const JSONreviewURL = "http://localhost:1337/reviews/";

        fetch(JSONreviewURL)
            .then(function(response) {
                return response.json();
            })
            .then(function(reviewJSON) {
                var transaction = db.transaction("reviews", "readwrite");
                var objstore = transaction.objectStore("reviews");
                for (var i = 0; i < reviewJSON.length; i++) {
                    objstore.add(reviewJSON[i])
                }
            })
            .catch(err => {
                console.log("JSON review err");
            }); // end fetch
    }// end reviewObjectStore

};//end onupgradeneeded
