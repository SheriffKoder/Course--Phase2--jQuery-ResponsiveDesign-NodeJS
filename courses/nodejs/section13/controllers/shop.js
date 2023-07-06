
const ProductClassModel = require("../models/product.js");
//as cart and order are related to the nexted user, we do not need to import

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
        res.render("shop/product-list.ejs", {prods: products, myTitle: "All products page", path:"/products"});
    })
    .catch((err) => {
        console.log(err);
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
        res.render("shop/product-details", {product: product, myTitle: product.title, path: "/products"});

    })
    .catch((err) => {
        console.log(err);
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

    //mongoose
    //find will get all products, into an array
    //when working with large amounts of data
    //can work with a cursor or manipulate find to limit the set of data that is retrieved (pagination)
    //can chain with cursor() to get access to cursor
    //then .next() to get the next element or each async to allow to loop through them
    ProductClassModel.find()
        .then((products)=>{
            res.render("shop/index.ejs", {prods: products, myTitle: "Shop page", path:"/"});
        })
        .catch((err) => {
            console.log(err);
        });




};


//relevant to add-to-cart button on ejs which passes productId
exports.postCart = (req, res, next) => {

    //mongoDB and mongoose - findById is default in mgs and we edited addToCart
    const prodId = req.body.productId;  //ejs hidden input has id
    ProductClassModel.findById(prodId)
    .then(product => {
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
    req.user
    .populate("cart.items.productId")
    .then(user => { //still working with the req.user
        const products = user.cart.items;
        console.log(products);  //to be able to see it and adjust the values in the ejs file
        res.render("shop/cart", {
            path: "/cart",
            myTitle: "Your Cart",
            products: products
        });    

    })
    .catch(err => {
        console.log(err);
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
    req.user.removeFromCart(prodId)
    .then (result => {
        res.redirect("/cart");
    })
    .catch(err => console.log(err));


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
        myTitle: "Checkout"
    });
};

const Order = require("../models/order.js");
//(14)
exports.postOrder = (req, res, next) => { 

    req.user
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
                name: req.user.name,        //a full user object fetched from the db, so will be a name property
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
        console.log(err);
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
            orders: orders
        });        
    })
    .catch(err => console.log(err));


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