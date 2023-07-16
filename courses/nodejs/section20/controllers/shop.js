
const ProductClassModel = require("../models/product.js");
//as cart and order are related to the nexted user, we do not need to import

//(14) //(20.1.0)
const Order = require("../models/order.js");


//(20.1.0)
//core modules
const fs = require("fs");
const path = require("path");

//(20.2.1)
//pdfkit exposes a document constructor
const PDFDocument = require("pdfkit");
 
//(21.0.1)
const ITEMS_PER_PAGE = 1;




exports.getProducts = (req, res, next) => {
    //const products = adminData.products;
    //products already exists in this file no no need to define it

    //on fetchAll call, send this function that will be called to retrieve render 
    //based on the product status empty-array or data
    //*read file then pass read-products into this function to pass to the rendered ejs
    /*
    ProductClassModel.fetchAll(products => {
        res.render("shop/product-list", {prods: products, myTitle: "All Products page", path:"/products"});

    });
    */

    /*
    //mySQL
    ProductClassModel.fetchAll()
    .then(([rows, fieldData]) => {
        res.render("shop/product-list", {prods: rows, myTitle: "All Products page", path:"/products"});

    })
    .catch((err)=> {
        console.log(err);
    })
    */
    //console.log("shop.js is logging: ", products );


    //Sequelize
    /*
    ProductClassModel.findAll()
    .then((products)=>{
        res.render("shop/product-list.ejs", {prods: products, myTitle: "All products page", path:"/products"});
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //mongoDB //(4)
    /*
    ProductClassModel.fetchAll()
    .then((products)=>{
        res.render("shop/product-list.ejs", {prods: products, myTitle: "All products page", path:"/products"});
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //(4)
    //mongoose
   ProductClassModel.find()
    .then((products)=>{
        res.render("shop/product-list.ejs", {
            prods: products, 
            myTitle: "All products page", 
            path:"/products",
                    //isAuthenticated: req.isLoggedIn
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)

        });
    })
    .catch((err) => {
        // console.log(err);
        return next(new Error(err).httpStatusCode=500); //(19.0.3)
    });




};

//express js gives us a params object on our request
//access our productId because its used in the routes js files
exports.getProduct = (req, res, next) => {

    /*
    const prodId = req.params.productId;
    //console.log("prodId", prodId);
    ProductClassModel.findMyId(prodId, product => {
        //console.log(product);
        res.render("shop/product-details", {product: product, myTitle: product.title, path: "/products"});
    });
    
    //res.redirect("/");
    */

    const prodId = req.params.productId;

    //mySQL
    /*
    //use [0] because the returned value is an "array" with the product inside it
    ProductClassModel.findMyId(prodId)
    .then(([product])=> {
        //console.log(product[0].title);
        res.render("shop/product-details", {product: product[0], myTitle: product[0].title, path: "/products"});

    })
    .catch((err) => {
        console.log(err);
    });
    */

    //Sequelize
    //we receive a single product not in an array like mySQL
    //findAll always gives multiple items in an array even if it is only one element
    /*
    ProductClassModel.findAll({where: {id: prodId}})
        .then((product)=> {
            //console.log(product[0].title);
            res.render("shop/product-details", {product: product[0], myTitle: product[0].title, path: "/products"});

        })
        .catch((err) => {
            console.log(err);
        });
    */

    //Sequelize
    /*
    ProductClassModel.findByPk(prodId)
    .then((product)=> {
        //console.log(product[0].title);
        res.render("shop/product-details", {product: product, myTitle: product.title, path: "/products"});

    })
    .catch((err) => {
        console.log(err);
    });
    */


    //mongoDB //(5)
    /*
    ProductClassModel.findById(prodId)
    .then((product)=> {
        //console.log(product[0].title);
        res.render("shop/product-details", {product: product, myTitle: product.title, path: "/products"});

    })
    .catch((err) => {
        console.log(err);
    });
    */

    //(5)
    //mongoose has a findById method
    //we can pass it a string and it will convert to an object id (like the mongoDB product model we defined)
    ProductClassModel.findById(prodId)
    .then((product)=> {
        res.render("shop/product-detail", {
            product: product, 
            myTitle: product.title, 
            path: "/products",
                    //isAuthenticated: req.isLoggedIn
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)

        });

    })
    .catch((err) => {
        // console.log(err);
        return next(new Error(err).httpStatusCode=500); //(19.0.3)
    });



}


//main-page
exports.getIndex = (req, res, next) => {

    /*
    ProductClassModel.fetchAll(products => {
        res.render("shop/index.ejs", {prods: products, myTitle: "Shop page", path:"/"});

    });
    */


    //mySQL code
    //use destructuring to pull out information of the value received as an argument
    //custom name for first and second elements
    /*
    ProductClassModel.fetchAll()
    .then(([rows, fieldData]) => {
        res.render("shop/index.ejs", {prods: rows, myTitle: "Shop page", path:"/"});

    })
    .catch(err => console.log(err));
    */


    //Sequelize
    //findAll gets all the records for this data
    //can pass an object with some options
    //like where to restrict the kind of data we retrieve (more in the official docs)
    //ProductClassModel.findAll({where:..}).then().catch();
    /*
    ProductClassModel.findAll()
    .then((products)=>{
        res.render("shop/index.ejs", {prods: products, myTitle: "Shop page", path:"/"});
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //mongoDB //(4)
    /*
    ProductClassModel.fetchAll()
    .then((products)=>{
        res.render("shop/index.ejs", {prods: products, myTitle: "Shop page", path:"/"});
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //(21.0.1)
    //retrieve the information on which page we are
    //which data for which page needs to be displayed
    //page because we named the link /?page=n
    //getting the page "n" number and storing in the const
    //if page not hold a value (link "/") then it will be page=1
    //+ sign to not concatenated with numbers
    const page = +req.query.page || 1;
    
    //(21.0.2)
    //this will contain the number of products
    //will be returned in the render
    let totalItems;

    //now we need to define how many items should be displayed per page
    //will define a global constant in this file for the items per page
    //so on page 1 want to fetch 1,2
    //page 2, fetch items 3,4 etc.
    //we will limit the .find() which finds all products

    //(21.0.2)
    //this will not retrieve all the products
    //but simply just the number of products
    ProductClassModel.find().countDocuments()
	.then((numProducts) => {
    
        //(21.0.2)
        totalItems = numProducts;

        return ProductClassModel.find()
        //(21.0.1)
        //skip the items of previous pages
        //we can add .skip() on a cursor, returned by find
        //to skip the first x amount of results
        //on page=1, skip 0 but limit after
        //so on page=2 would skip the first two items
        .skip((page-1)*ITEMS_PER_PAGE)
        //i also want to limit the amount of items i retrieve also
        //on current page, fetch as many items as i want to display
        //.limit, limits the amount of data we fetch to the number we specify
        .limit(ITEMS_PER_PAGE)

    })

    //mongoose
    //find will get all products, into an array
    //when working with large amounts of data
    //can work with a cursor or manipulate find to limit the set of data that is retrieved (pagination)
    //can chain with cursor() to get access to cursor
    //then .next() to get the next element or each async to allow to loop through them
    // ProductClassModel.find() //-(21.0.2)
    // .skip((page-1)*ITEMS_PER_PAGE) //(21.0.1) //-(21.0.2)
    // .limit(ITEMS_PER_PAGE) //(21.0.1) //-(21.0.2)


        .then((products)=>{
            res.render("shop/index.ejs", {
                prods: products, 
                myTitle: "Shop page", 
                path:"/",
                        //isAuthenticated: req.isLoggedIn
                //isAuthenticated: req.session.isLoggedIn, //(2.9) //-(3.8)
                //method provided by the csrf middleware in app.js //(3.7)
                //csrfToken: req.csrfToken()  //-(3.8)
                
                //(21.0.2)
                currentPage: page,
                totalProducts: totalItems,
                //we have a next page if
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page -1,
                //if 11/2 = 5.5, ceil return 6 as last page
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE )

            });
        })
        .catch((err) => {
            // console.log(err);
            return next(new Error(err).httpStatusCode=500); //(19.0.3)
        });




};


//relevant to add-to-cart button on ejs which passes productId
exports.postCart = (req, res, next) => {

    //mongoDB and mongoose - findById is default in mgs and we edited addToCart
    const prodId = req.body.productId;  //ejs hidden input has id
    ProductClassModel.findById(prodId)
    .then(product => {
        //return req.user.addToCart(product)
        return req.user.addToCart(product)

    })
    .then(result => {
        //as addToCart returns a promise we can chain another then here
        console.log(result);
        res.redirect("/cart");

    })


    /*
    //sequelize
    //retrieve the product id from the incoming request
    //then fetch our product in the database/file
    //add to our cart
    //productId is the name used in the view file form on hidden input
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    //console.log(prodId);

    req.user.getCart()  //(22)
    .then((cart)=> {
        fetchedCart = cart;
        //find if the product im trying to add is already part of the cart
        //if it is, increase quantity, if its not add it with quantity 1
        return cart.getProducts({ where: {id: prodId}});
    })
    .then(products => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        if (product) {
            //existing product
            //cartItem added by sqlz to give access to the in between table
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        //adding a new product for the first time
        //new quantity =1 and storing the product with that quantity
        return ProductClassModel.findByPk(prodId)
    })
    .then( product => {
        return fetchedCart.addProduct(product, {
            through: { quantity: newQuantity}
        });
    })
    .then(() => {
        res.redirect("/cart");
    })
    .catch((err)=> {
        console.log(err)
    });
    */

    /*
    //express
    ProductClassModel.findMyId(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });

    res.redirect("/cart");
    */

};


//sqlz, 
//want to use the cart
//associate it with an existing user
//to get all products in it and render to stream

exports.getCart = (req, res, next) => {             //router


    //populate does not return a promise
    //so have to chain with execPopulate() so can chain .then
    //(12)
    //req.user
    req.user    //(2.9)
    .populate("cart.items.productId")
    .then(user => { //still working with the req.user
        const products = user.cart.items;
        console.log(products);  //to be able to see it and adjust the values in the ejs file
        res.render("shop/cart", {
            path: "/cart",
            myTitle: "Your Cart",
            products: products,
                    //isAuthenticated: req.isLoggedIn
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)

        });    

    })
    .catch(err => {
        console.log(err);
        return next(new Error(err).httpStatusCode=500); //(19.0.3)
    })

    //console.log("req.user.cart 1" + req.user.cart); //(21)

    
    //mongoDB
    /*
    req.user.getCart()
        .then(products => {
            console.log(products);
            res.render("shop/cart", {
                path: "/cart",
                myTitle: "Your Cart",
                products: products
            });    

        })
        .catch(err => {
            console.log(err);
        })
    */

    /*
    req.user.getCart()
    .then((cart)=> {
        console.log(cart)
        return cart.getProducts()
            .then(products => {
                res.render("shop/cart", {
                    path: "/cart",
                    myTitle: "Your Cart",
                    products: products
                });    
            })
            .catch(err => {
                console.log(err);
            })

    })
    .catch((err)=> {
        console.log(err)
    });
    */

    /*
    //express
    Cart.getCart(cart => {                          //returns cart to use in render
        
        ProductClassModel.fetchAll(products => {    //returns all my products
            const cartProducts = [];
            for (product of products) {             //for each product
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                //find in cart products the product matching fetchAll products

                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty });
                }
            }
            res.render("shop/cart", {
                path: "/cart",
                myTitle: "Your Cart",
                products: cartProducts
            });
        });   

    });
    */
};


exports.postCartDeleteProduct = (req, res, next) => {
    //need to remove product from the cart not the product it self
    const prodId = req.body.productId;

    //(13)
    // req.user.removeFromCart(prodId)
    req.user.removeFromCart(prodId) //(2.9)

    .then (result => {
        res.redirect("/cart");
    })
    // .catch(err => console.log(err));
    return next(new Error(err).httpStatusCode=500); //(19.0.3)


    //mongoDB
    /*
    req.user.deleteItemFromCart(prodId)
        .then (result => {
            res.redirect("/cart");
        })
        .catch(err => console.log(err));
    */

    //sequelize
    /*
    req.user.getCart().then(cart => {
        return cart.getProducts({where: {id: prodId}});
    })
    .then (products => {
        const product = products[0];
        //want to remove it from the in between cartItem table not products
        return product.cartItem.destroy();
    })
    .then (result => {
        res.redirect("/cart");
    })
    .catch(err => console.log(err));
    /*
    //get the price
    ProductClassModel.findMyId(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect("/cart");
    });
    */
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        myTitle: "Checkout",
                //isAuthenticated: req.isLoggedIn
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)

    });
};

//(14)
exports.postOrder = (req, res, next) => { 

    //req.user
    req.user //(2.9)
    .populate("cart.items.productId")
    .then(user => { //still working with the req.user

        const products = user.cart.items.map(item => {
            //returning the same structure as the order model
            //return {quantity: item.quantity, product: item.productId};    //this will return the product id only
            
            //using the spread operator and a special function ._doc to access just the data without meta data and pull out all the product data into a new object
            //otherwise the order will not populate correctly and no product data but the id is stored
            return {quantity: item.quantity, product: {...item.productId._doc}};

        });

        const order = new Order({
            user: {
                email: req.user.email, 
                //name: req.user.name,        //a full user object fetched from the db, so will be a name property //-(3.8)
                userId: req.user            //mongoose will pick the id
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        //(15)
        req.user.clearCart();
    })
    .then(() => {   //clearCart is returned in the model so can add .then
        //redirect after the cart is cleared
        res.redirect("/orders");
    })
    .catch( (err) => {
        // console.log(err);
        return next(new Error(err).httpStatusCode=500); //(19.0.3)
    })




    //mongoDB
    /*
    req.user.addOrder()
        .then(result => {
            res.redirect("/orders");
        })
        .catch( (err) => {
            console.log(err);
        })
    */


    //sequelize
    /*
    let fetchedCart //(26)

    req.user.getCart()
        .then((cart) => {
            fetchedCart = cart; //(26)
            //will get all products by default
            return cart.getProducts();
        })
        .then((products) => {
            //want to associate products to the order so will return
            return req.user.createOrder()     //provided by sqlz relationship
            .then(order => {
                //special field for products to access quantity
                //map() js run on an array and returns a new array with slightly
                //modified elements
                order.addProducts(products.map(product => {
                    product.orderItem = {quantity: product.cartItem.quantity};
                    return product;    
                }))});
        })
        .then(result => {
            //this will remove products from cart
            fetchedCart.setProducts(null); //(26)
        })
        .then(result => {
            res.redirect("/orders");
        })
        .catch( (err) => {
            console.log(err);
        })
        */


    };



exports.getOrders = (req, res, next) => { 
    
    //mongoose
    //(16)
    //get all orders that belong to that user
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render("shop/orders", {
            path: "/orders",
            myTitle: "Your Orders",
            orders: orders,
                    //isAuthenticated: req.isLoggedIn
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)

        });        
    })
    .catch((err) => {
        // console.log(err)
        return next(new Error(err).httpStatusCode=500); //(19.0.3)
    });


    //(14)
    //mongoDB
    /*
    req.user.getOrders()
        .then(orders => {
            res.render("shop/orders", {
                path: "/orders",
                myTitle: "Your Orders",
                orders: orders
            });        
        })
        .catch(err => console.log(err));
    */

    /*
    //sequelize
    //(27)
    //eger loading concept: if you are fetching all the orders 
    //also fetch all related products already
    //and give back one array of orders
    //also includes products per order
    //and this include works bec. we have a relation between orders and product in app.js
    req.user.getOrders({include: ["products"]})
    .then(orders => {
        res.render("shop/orders", {
            path: "/orders",
            myTitle: "Your Orders",
            orders: orders
        });
    })
    .catch(err => {
        console.log(err);
    })
    */

    //express
    /*
    res.render("shop/orders", {
        path: "/orders",
        myTitle: "Your Orders"
    });
    */
};

//(20.1.0)
exports.getInvoice = (req, res, next) => {
    //now want to return the file
    //retrieve the id as its passed in the router
    const orderId = req.params.orderId;

    //(20.1.2)
    //use the order model
    Order.findById(orderId)
	.then((order) => {
    
        if (!order) {
            return next(new Error("No order found"));
        }
        //check if the order user id is equal to the currently logged in user
        //i do not know why user is an array with an object
        if (order.user[0].userId.toString() !== req.user._id.toString()) {
            return next(new Error("Unauthorized"));
        }

        //only if i pass these two checks
        //i can read that file and output it
        //(20.1.0)
        const invoiceName = "invoice-" + orderId + ".pdf";
        //the path i want to read
        const invoicePath = path.join("data", "invoices", invoiceName);
    
        //(20.1.0)
        //we can retrieve the file with the node file system
        //path should be constructed by the path core module
            //so it can work on all operating systems
        //read file gives a callback exe once done reading the file
        //data will be in the format of a buffer
        /*
        fs.readFile(invoicePath, (err, data) => {
            
            if (err) {
                //next so the default handling function can take over
                //return so the other code do not execute
                return next(err);
            }
            //(20.1.1)
            //setHeader gives the browser some information
            //to handle the request in a better way
            //this will make the file as pdf, thus it will open in the browser, if the browser supports that
            res.setHeader("Content-Type", "application/pdf");
            // inline to also tell the browser to open the file inside the browser
            //also will add the proper filename with the proper extension
            //to make it open download ui, use attachment instead of inline
            res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"   ');
            //data here theoretically should be our file
            res.send(data);
        });
        */

        //(20.2.1)
        //create a pdf document (write to pc)
        //which is a readable stream
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        
        res.setHeader('Content-Disposition', 
        'inline; filename="' + invoiceName + '"   '
        );

        //pass a path to WriteSteam where want to write
        //this ensures that the pdf we write here
        //also get stored on the server, not just served to the client
        pdfDoc.pipe(fs.createWriteStream(invoicePath));
        //return it to the client
        pdfDoc.pipe(res);
        //now whatever we add to the document
        //will be forwarded into this file which gets generated on the fly
        //and to the response

        //this allows to add a single line of text into the pdf document
        //pdfDoc.text("Hello World!");

        //(20.2.2)
        pdfDoc.fontSize(26).text("Invoice", {
            underline: true
        });
        pdfDoc.fontSize(14).text("-------------------------");
        //looping through the orders products when creating the output
        //with the hierarchy seen in the database
        let totalPrice = 0;
        order.products.forEach(prod => {
            totalPrice = totalPrice + (prod.quantity * prod.product.price);
            pdfDoc.fontSize(14).
            text(
                prod.product.title + 
                " - " + 
                prod.quantity + 
                " x " + 
                "$" + prod.product.price
            );
        });
        pdfDoc.text("----------");
        pdfDoc.fontSize(18).text("Total Price: $" + totalPrice);


        //tell node that we are done writing to the stream
        //the streams for writing and sending to response
        //will be closes
        //thus the file will be saved and response will be sent
        pdfDoc.end();









        //(20.2.0)
        //streaming files (reading files from pc)
        //node js will then read in the file step by step
        //in different chunks
        //const file = fs.createReadStream(invoicePath);
        
        // res.setHeader("Content-Type", "application/pdf");
        
        // res.setHeader('Content-Disposition', 
        // 'inline; filename="' + invoiceName + '"   '
        // );

        //pipe, to forward the data that is read in with that stream
        //to the response
        //because the response object is a writable stream actually
        //and you can use readable streams to pipe their output
        //to a writable stream
        //this means the browser can view the data (downloaded step by step)
        //for large files this has an advantage
        //because node does not have to pre-load all data into memory
        //but just streams it to the client on the fly
        //and the most it has to store, it one chunk of data
        //the chunks are what we work with, the buffers gives access to them
        //we not store chunks but forward them to the browser
        //then it will be able to concatenate the incoming data pieces
        //into the final file
        // file.pipe(res);



    })
    .catch((err) => {
        //next an error to use the default error handling function
		next(err);
	})

}
