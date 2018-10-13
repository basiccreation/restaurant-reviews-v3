
// /**
//  * Toggle favorite heart.
//  */

//  //favoriteRestaurantChecked
//  //favoriteRestaurantUnchecked
//http://localhost:1337/restaurants/<restaurant_id>/?is_favorite=true



// const favoriteURL = "http://localhost:1337/restaurants/"+ restaurantIDfromPage;

// function toggleFavorite() {

//     if (isFavorite === false) {

//         fetch('favoriteURL', {
//           method: 'PUT',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           },
//             body: JSON.stringify({
//                 is_favorite: true
//             })
//         }) 
//     }// end if
// else if (isFavorite === true) {
//         fetch('favoriteURL', {
//           method: 'PUT',
//           headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//           },
//             body: JSON.stringify({
//                 is_favorite: false
//             })
//         })
//     }// end else if
// } //end toggleFavorite

//     const favorite = document.getElementById("heart"); 

//     if (is_favorite === false) {
//         //favorite.classList.toggle("fas");
//         favorite.src.toggle = "img/heart.svg";
//         //favorite.src = DBHelper.favoriteRestaurantChecked(restaurant);
//     }
//     else if (is_favorite === true) {
//         //favorite.classList.toggle("far");
//         favorite.src.toggle = "img/heartsolid.svg";
//         //favorite.src = DBHelper.favoriteRestaurantUnchecked(restaurant);
//     }
//     else {
//         console.log ("toggleFavorite not working as planned")
//     }




