
/*
$
.fadeOut(ms); //gets display none, 400ms default/600slow/200fast, removes place
.fadeIn(ms)
.fadeTo(ms, opacity); //opacity timer, can set to opacity 0 to keep place
.fadeToggle(ms);  //toggle displayed/not-displayed
//uses: user clicks a + or read more, show modal window taking whole screen, form next input/field


.hide() gets display none instantly, if ms used will have disappearing animation
.show() gets display block
.toggle() toggles .hide/.show
//uses: hovering/click of a menu to show a sub-menu/details


.slideUp(ms) slide up until completely disappeared, gets display none
.slideDown(ms) slide down until completely sized, gets display block
.slideToggle(ms)
//uses: with .hide put before gives sliding animation


//+=/-= increases/decreases the margin already have by this value
//on a linear scale: 200px over 1000ms = 1px every 5ms
$(".blue-box").animate({
  "margin-top": "+=200px",
  "opacity": "0.2",

}, 1000), "linear";

//another way to write object keys 
$(".blue-box").animate({
  marginTop: "+=200px",
  opacity: "0.2",

}, 1000), "linear";




default 400ms on all or just fadeOut ?

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

  //fade the red-box for 2 seconds
  //
  //$(".red-box").fadeOut(2000);
  //$(".red-box").fadeIn(1000);
  //$(".red-box").fadeTo(1000, 0.5);



  //animate opacity from left to right
  //
  //$(".red-box").fadeTo(1000, 0.2);
  //$(".green-box").fadeTo(1000, 0.5);
  //$(".blue-box").fadeTo(1000, 0.7);



  //fadeToggle if its fadeOut already then Toggle will fadeIn etc.
  //*if its visible/opacity it will become invisible vv.
  //when returns visible keeping the opacity it had before
  //
  //$(".red-box").fadeToggle(1000);
  //$(".red-box").fadeToggle(1000);



  //pitfall: fadeTo after fadeOut will affect a displayed none element, so will not show
  //the display on the element has to be set to something for opacity to work
  //
  //$(".green-box").fadeOut(1000);
  //$(".green-box").fadeTo(1000, 0.5);



  //.hide() gets display none instantly, if ms used will have disappearing animation
  //time is async so timed hide will work after show, 
  //.show() gets display block
  //.toggle() toggles .hide/.show
  //
  //$(".green-box").hide(500);
  //$(".green-box").show(1000);
  //$(".green-box").toggle(500);
  //useful when hovering/click of a menu to show a sub-menu/details



  //slide up until completely disappeared, gets display none
  //slide down until completely sized, gets display block
  //
  //$(".blue-box").slideUp(2000); //css display none will make this be ignored
  //$(".blue-box").slideDown(2000);



  //paragraphs hidden then slide down
  //
  //$("p").hide();
  //$("p").slideDown(1000);
  //$("p").slideToggle(1000);



  //moving around elements on the page
  //changing the margin of the element to move around the page
  //or set position to absolute and then change positions
  //use: arrow key to change game player position
  //creating a custom animation
  //1st para: to pass in is an object
  //in the object pass any values you want to have
  //+=/-= increases/decreases the margin already have by this value
  //2nd para: animation time
  //3rd para: linear etc. default "swing"
  //on a linear scale: 200px over 1000ms = 1px every 5ms
  //can change some properties except colors
  /*
  $(".blue-box").animate({
    "margin-top": "+=200px",
    opacity: "0.2",

  }, 1000), "linear";

  //removing the added margin
  $(".blue-box").animate({
    "margin-top": "-=200px",
    opacity: "1",

  }, 1000), "linear";
  */

  //custom: animation: fade out to right direction
  $(".green-box").animate({
    marginLeft: "+=200px",
    opacity: "0",
    height: "50px",
    width: "50px",
    marginTop: "25px"

  }, 1000), "linear";



});