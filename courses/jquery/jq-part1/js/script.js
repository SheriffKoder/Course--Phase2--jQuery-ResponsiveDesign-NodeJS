
/*
$
.fadeOut(ms); //gets display none, 400ms default/600slow/200fast, removes place
.fadeIn(ms);
.fadeTo(ms, opacity); //opacity timer, can set to opacity 0 to keep place
.fadeToggle(ms);  //toggle displayed/not-displayed
//uses: user clicks a read more button, show modal window taking whole screen, form next input/field


.hide() gets display none instantly, if ms used will have disappearing animation
.show() gets display block
.toggle() toggles .hide/.show
//uses: hovering/click of a menu to show a sub-menu/details


.slideUp(ms) slide up(vertical size decreases) until completely disappeared, gets display none
.slideDown(ms) slide down until completely sized, gets display block
.slideToggle(ms)
//uses: with .hide put before gives sliding animation


//+=/-= increases/decreases the margin already have by this value
//on a linear scale: 200px over 1000ms = 1px every 5ms
$(".blue-box").animate({
  "margin-top": "+=200px",
  "opacity": "0.2",

}, 1000, "linear");

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
//this function will be executed when the page is Ready
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



  //animate opacity for 3 elements from left to right
  //
  //$(".red-box").fadeTo(1000, 0.2);
  //$(".green-box").fadeTo(1000, 0.5);
  //$(".blue-box").fadeTo(1000, 0.7);



  //fadeToggle if its fadeOut already then Toggle will fadeIn etc.
  //*if its visible/opacity it will become invisible vice versa.
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

  //removing the added margin (back to original)
  $(".blue-box").animate({
    "margin-top": "-=200px",
    opacity: "1",

  }, 1000), "linear";
  */

  //custom: animation: fade out to right direction
  // 
  /*
  $(".green-box").animate({
    marginLeft: "+=200px",
    opacity: "0",
    height: "50px",
    width: "50px",
    marginTop: "25px"

  }, 1000, "linear");
  */

  //select all the p in html and increase their font-size to 20px in 1sec
  //
  /*
  $("p").animate({
    fontSize: "20px"

  }, 1000, "linear");
  */



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

  //chain and delay animation using delay and callbacks
  //in .delay next animation can start when first animation running
  //in callbacks first animation has to end for second to start
  //make an animation run after another animation end
  //time your animation
  //can chain fadeOut().fadeIn().delay() etc

  //.delay to wait then put the .animation wanted
  // .animation(time, callback) - callback of js code or $("p").animation

  //animate opacity for 3 elements from left to right
  //
  //$(".red-box").fadeTo(1000, 0.2).delay(3000).fadeTo(500, 1);
  //$(".blue-box").delay(1000).fadeTo(1000, 0.5);
  //$(".green-box").delay(2000).fadeTo(1000, 0.7);



  //adding a callback function as a parameter will be exe after animation is finished
  /*
  $(".blue-box").fadeTo(1000, 0.5, ()=> {
    alert("blue box");
  });
  */



  //timing using callback functions
  /*
  $(".red-box").fadeTo(1000, 0.5, () => {
    $(".blue-box").fadeTo(1000, 0.5, () => {
      $(".green-box").fadeTo(1000, 0.5, () => {
  
      });
    });
  });
  */



  //showing the lightbox example (position abs, top0, left0, height/w%)
  //
  //$(".lightbox").delay(500).fadeIn(1000);


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

  //Adding css with jquery
  // .css("css-property", "value")
  //$("p").css("background-color", "rgba(180,180,30,0.8");



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

  //ways of selecting elements in the document
  //selecting attribute selectors, (:email does not work)
  //:checked(radio), :selected(select option tags)
  //$("input[type=submit]").css("background-color", "rgba(180,180,30,0.8");
  //$("input:submit").css("background-color", "rgba(180,180,30,0.8");

  //selecting with multiple selectors
  //$("input[type='text'], input[type='email']").css("background-color", "rgba(180,180,30,0.8");



  //selecting the first element of its type (:first, :last, :even, :odd) starting with index 0)
  //$("input:first").css("background-color", "rgba(180,180,30,0.8");
  //$("li:last").css("background-color", "rgba(180,180,30,0.8");


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

  //jQ methods for traversal (recursive select)
  //any element on the page using jq functions that allows to traverse the html document
  //starting at one element making your way through the targeted element want to get

  //all children, direct children, all parents, direct parents
  //siblings, all next/previous

  $("#nestedLi").css("border", "2px solid rgba(0,0,255,0.2");

  ////down the hierarchy
  //find will go through all the child elements and their child elements to find (recursive)
  //$("#list").find("#nestedLi").css("background-color", "rgba(180,180,30,0.8");


  //children only take a look at the direct children of the element (not their children)
  //$("#list").children("#nestedLi").css("background-color", "rgba(180,180,30,0.8");



  ////up the hierarchy
  //will check on the parents and parents's parents and so on
  //$("#nestedLi").parents("ul").css("border", "2px solid rgba(180,180,30,0.8");

  //checking on only the direct parent, it is always one direct parent
  //$("#nestedLi").parent().css("border", "2px solid rgba(180,180,30,0.8");
  //$("#nestedLi").parent("ul").css("border", "2px solid rgba(180,180,30,0.8");



  //siblings (same level)
  //$("#nestedLi").siblings().css("border", "2px solid rgba(180,180,30,0.8");
  //$("#nestedLi").siblings("li").css("border", "2px solid rgba(180,180,30,0.8");
  
  //selecting all headers in the top level on the page
  //siblings of the #list element with type header
  //$("#list").siblings(":header").css("border", "2px solid rgba(180,180,30,0.8");



  //selecting all previous and next elements (same level)
  //$("#list").prev().css("border", "2px solid rgba(255,0,0,0.8");
  //$("#list").next().css("border", "2px solid rgba(0,255,0,0.8");



  //all the direct next elements that come after the header
  //$(":header").next().css("border", "2px solid rgba(255,0,0,0.8");
  //all input child elements of the form element with password input
  //$("form").children("input[type=email]").css("border", "2px solid rgba(255,0,0,0.8");



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

  //filter, not, first/last, eq(equals)

  //filter the elements you have selected by some criteria
  //selects every second list item
  //$("#list").children("li").filter(":even").css("border", "2px solid rgba(180,180,30,0.8");

  //can filter by any kind of function wanted
  //can pass a function in filter
  //the function will get the index of the selected item
  //for multiple occurrences , index will be 0,1,2.. etc
  //specify what element(s) you want
  //$("ul").filter(":first").css("border", "2px solid rgba(180,180,30,0.8")

  /*
  $("ul").filter((index) => {
      //return true ( returned on every case will not filter anything  )
      //return false ( the filter function will filter out all elements the function return false )
      
      //remainder of dividing by 3
      //remainder is 0, will keep the element
      //and discard it using the filter function
      //will only return true when 0, 3, 6, 9 etc.
      //return index % 3 === 0;

      //return index % 3 === 2;
      return index === 1; //2nd ul element on the html document
      

  }).css("border", "2px solid rgba(180,180,30,0.8");
  */

  //want everything but "not" the first one
  //can also pass a function that returns a number like filter
  //$("ul").not(":first").css("border", "2px solid rgba(180,180,30,0.8")

  //also can select in filter/not by selector
  //$("li").not("#list ul li").css("border", "2px solid rgba(180,180,30,0.8")


  //select the first/last ul element
  //$("ul").first().css("border", "2px solid rgba(180,180,30,0.8")
  //$("ul").last().css("border", "2px solid rgba(180,180,30,0.8")



  //similar to filter
  //pass to eq the number of the index for the element you want, first at 0
  //passing -ve numbers, will count back to front, starting -1
  //$("ul").eq(1).css("border", "2px solid rgba(180,180,30,0.8")
  //$("ul").eq(-2).css("border", "2px solid rgba(180,180,30,0.8")



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//the DOM basically defines the API (application programming interface) for javascript
//the browser generates the DOM from the html code

//meaning that js knows how it can access and manipulate each of those elements
//so whenever using js or jquery to manipulate the page
//we edit the "document object model tree" not the html code itself

//js refers to "document object model" specification to know how to work 
//on the objects/html elements to manipulate them




//adding children
//add new element as the "last" child of the selected element(s) in-front
//$("ul ul:first, ul ul:last").append("<li> Last item **** </li>");

//$("child").appendTo($(parent)) or just $("child").appendTo(parent);
//$("<li> Last item **** </li>").appendTo($("ul ul:first"));

//add new element as the "first" child of the selected element(s) in-front
//$("ul ul:first, ul ul:last").prepend("<li> First item **** </li>");

//$("<li> First item **** </li>").prependTo($("ul ul:first"));




//adding siblings
//$(".red-box").after("<div class='red-box'>red-box (after)</div>");
//$("<div class='red-box'>red-box (after)</div>").insertAfter(".red-box");

//$(".blue-box").before("<div class='blue-box'>blue-box (before)</div>");
//$("<div class='blue-box'>blue-box (before)</div>").insertBefore(".blue-box");



//moving and cloning as siblings
//can pass a string, function, existing element(to move it)
//adding an existing element before/after to "multiple" elements 
//will clone the existing for them starting second call
//here blue-box placed before red-box then another blue-box created before the green-box
//$(".red-box, .green-box").before($(".blue-box"));

//jQuery provides the ability to pass in functions instead of elements
/*
$("#list").before(()=> {
  //return "<div class='red-box'>red-box (after)</div>";

  //this does move the red-box to be before list !
  return $(".red-box");
});
*/


//$(".red-box").after($(".red-box")); //does not clone itself


//add a new box for each of the three boxes in the same color as the next sibling
/*
let color = ["red", "green", "blue"];

for (myColor in color) {
  let theColor = myColor+"-box";
  let myBox = "<div class='"+theColor+"'>"+theColor+"(after)</div>";
  $("."+theColor).after(myBox);
};
*/

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//replace existing elements on the page
//with either another element that is on your page
//or with a completely new element created to replace the other element

//$("ul li ul li").replaceWith("<li>Replaced</li>")
//$("ul li ul li").replaceWith(() => {});

//replace an item (delete) with an existing item (move)
//$("p:first").replaceWith($("li:last"));

//will be cloned for all p instances
//$("p").replaceWith($("li:last"));

//green-box replaces red/blue
//$(".red-box, .blue-box").replaceWith($(".green-box"));

//green-box replaces red/blue
//$(".green-box").replaceAll(".red-box, .blue-box");




//end of jQuery
});