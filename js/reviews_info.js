
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

    });//then(function(reviews)

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

async function addNewReview(e) {
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
        })//end fetch
        .then((res) => res.json())


        .catch(e => console.log("THIS IS AN ERROR " + e))
        //.then(response => console.log('Success:', JSON.stringify(response)));

        //.then(data => console.log(data))
 
    // const OpenIDB = function() {
    //     return idb.open('RestaurantDatabase', 1, function(upgradeDb) {
        
    //         const offLineReviewStore = upgradeDb.createObjectStore('offLineReviewStore', { 
    //             keypath: "restaurant_id", 
    //             autoIncrement: true });
    //     });//end return idb.open
    // };//const OpenIDB 

    // OpenIDB().then((db) => {
    //     const dbStore = "offLineReviewStore";

    //     const transaction = db.transaction(dbStore, 'readwrite');
    //     const store = transaction.objectStore(dbStore);
    //     store.put(data); 
    //     return transaction.complete;
    // })//end OpenDB.then
    
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
} //end getRatingOption


// window.addEventListener('online',  updateOnlineStatus);
// window.addEventListener('offline', updateOfflineStatus);

// function updateOnlineStatus()
// {
//     console.log( "User is online");
// }

// function updateOfflineStatus()
// {
//     console.log( "User is offline");
// }
