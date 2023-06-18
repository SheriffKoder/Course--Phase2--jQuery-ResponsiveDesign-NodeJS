/*

*/


//jq skeleton
//the $ sign refers to jq or can write jQuery(function)
//one way to enable jq when loading the page 
//to pass in a function in the ()
//ths function will be executed when the page is Ready
//all elements and object models are ready to be manipulated but the images are not loaded yet
//that is when jq starts working

$(function() {
  // jQuery goes here...

  // selecting the element want to work with with $/jQuery before it
  //then pass in a string that contains the css selector
  //fadeOut function, ms value (if left empty () by default it will be 400
  //("slow") 600ms ("fast") 200ms
  $(".red-box").fadeOut(2000);
});