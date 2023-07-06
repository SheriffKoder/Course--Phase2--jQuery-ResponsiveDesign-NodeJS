
const mongodb = require("mongodb");

const ProductClassModel = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
    //console.log("<h1>Add product page");
    //res.send(productAdd);
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    //res.sendFile(path.join(pathJSrootDir, "views", "add-product.html"));

    //add-product with file extension left out
    //productCSS is for handlebars layout link insertion
    res.render("admin/edit-product", 
    {
        myTitle: "Add-Product page", 
        path: "/admin/add-product", 
        editing: false, //to enable add product text on the button of edit-product.ejs
        productCSS: true, formsCSS: true, activeProductAdd: true});

};

//const products = [];


exports.postAddProduct = (req, res, next) => {
    //pass the form title and push the title to the products array in product.js using save
    const title = req.body.productAdded;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    //(3)
    //a new product based on our mongoose model
    //right side > schema keys
    //left side > received properties
    //(9) userId
    const product = new ProductClassModel(
        { 
            title: title, 
            price: price, 
            description: description, 
            imageUrl: imageUrl,
            userId: req.user //however can just use req.user and mongoose will pick the id from that object
        });

    product.save()
        .then((result) => {
            console.log("product created");
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        })


    /*
    //mongoDB
    //add a product into the db //(3)
    //the user id is a string //(9)
    //the user _id object is a reference pointing at the user who did create that product
    const product = new ProductClassModel(title, price, description, imageUrl, null, req.user._id);
    product.save()
        .then((result) => {
            console.log("created product");
            res.redirect("/admin/products");

        }).catch((err) => {
        console.log("postAddProduct error" + err);
        });
    */

    //const product = new ProductClassModel(null, title, imageUrl, price, description);

    //mySQL
    //just redirect in then (once the insertion is completed)
    /*
    product.save()
    .then(() => {
        res.redirect("/");
    })
    .catch((err) => {
        console.log(err);
    });
    */


   //Sequelize
   //create; creates a new element based on that models + saves it to the db
   //build; creates a new element but in js and have to save it manually
   //object model name: js name
   //sqlz works with promises
   /*
   ProductClassModel.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userId: req.user.id //(19)

   }).then((result) => {
        console.log("created product");
        res.redirect("/admin/products");

   }).catch((err) => {
    console.log("error" + err);

   });
   */

    //(19)
    //as we already defined a relation between user and product in app.js
    //sqlz creates a custom method named createProduct to the user
   /*
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id //(19)
    
       }).then((result) => {
            console.log("created product");
            res.redirect("/admin/products");
    
       }).catch((err) => {
        console.log("error" + err);
    
       });
    */

};



exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    //console.log(editMode); //true or false
    if (!editMode || editMode === "false") {
        return res.redirect("/");
    }

    //get the product id from the url
    const prodId = req.params.productId;
    //use the product model to find this product

    /*
    ProductClassModel.findMyId(prodId, product => {
        if (!product) {
            console.log("product does not exist to be edited");
            res.redirect("/");
        }
        res.render("admin/edit-product", 
        {
            product: product,
            myTitle: "edit-Product page", 
            path: "/admin/add-product", 
            editing: editMode
            
        });    
    });
    */

    //    ProductClassModel.findByPk(prodId)
        //.then((product) => {

    //(20)
    //getProducts given by sqlz
    //Sequelize
    /*
    req.user.getProducts({ where: { id:prodId} })
        .then((products) => {
            const product = products[0]; //(20)
            if (!product) {
                console.log("product does not exist to be edited");
                res.redirect("/");
            }
            res.render("admin/edit-product", 
            {
                product: product,
                myTitle: "edit-Product page", 
                path: "/admin/add-product", 
                editing: editMode
                
            });        
        })
        .catch((err) => {

        });
    */

    //mongoDB
    //also mongoose (as findById is a default method in mgs)
      ProductClassModel.findById(prodId)
      .then((product) => {
            if (!product) {
                console.log("product does not exist to be edited");
                res.redirect("/");
            }
            res.render("admin/edit-product", 
            {
                product: product,
                myTitle: "edit-Product page", 
                path: "/admin/add-product", 
                editing: editMode
                
            });        
            })
        .catch((err) => {
            console.log(err);
        })


};


exports.postEditProduct = (req,res, next) => {
    //construct a new product
    //replace the existing product

    //fetch info for the product
    //new product instance and populate it with that information
    //call save

    const prodId = req.body.productId;
    const updatedTitle = req.body.productAdded;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    //express
    /*
    const updatedProduct = new ProductClassModel(prodId, updatedTitle, updatedImageUrl, updatedPrice, updatedDescription);

    updatedProduct.save();
    res.redirect("/admin/products");
    */

    //sequelize
    /*
    ProductClassModel.findByPk(prodId)
        .then((product) => {

            //this will not change the data in our db, but will change them locally
            product.title = updatedTitle;   
            product.imageUrl = updatedImageUrl;
            product.price = updatedPrice;            
            product.description = updatedDescription;            

            //takes the product as we edited it
            //and saves it back to the database
            //either update values or create a new one if it does not exist yet
            //can return this, which returns a promise
            //
            return product.save();
         

        })
        .then(()=> {
            //handles any success responses from the (save) promise
            console.log("updated product");
            res.redirect("/admin/products");

        })
        .catch((err) => {
            //this catch will catch errors for the first promise (findByPk) 
            //and second promise (save)
            console.log(err);
        });
     //});
     */

    //mongoDB
    //create a new product
    //and pass in the id
    //but to pass the id has to convert it
    //so import mongodb 
    //(6)
    /*
    const product = new ProductClassModel(
        updatedTitle, 
        updatedPrice, 
        updatedDescription, 
        updatedImageUrl, 
        prodId );

    //as the save method in the model supports existing/new creations just call save
    product.save()
    .then(()=> {
        //handles any success responses from the (save) promise
        console.log("updated product");
        res.redirect("/admin/products");

    })
    .catch((err) => {
        console.log(err);
    });
    */


    //mongoose
    //(6)
    //find byId returns a mongoose object with all the mongoose methods
    //like save, if there is an existing object, will not save a new one, but the existing updates
    //but have to set our properties
    ProductClassModel.findById(prodId)
    .then((product) => {
        product.title = updatedTitle;   
        product.price = updatedPrice;  
        product.description = updatedDescription;                      
        product.imageUrl = updatedImageUrl;
        return product.save();      //return to chain another then
    })
    .then(() => {
        //handles any success responses from the (save) promise
        console.log("updated product");
        res.redirect("/admin/products");
    })
	.catch((err) => {
		console.log(err);
	})



}

exports.getProducts = (req, res, next) => {

    //express
    /*
    ProductClassModel.fetchAll(products => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});

    });
    */

    //Sequelize
    /*
    //ProductClassModel.findAll()
    req.user.getProducts()  //(20) //will return all products
    .then((products)=>{
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //mongoDB
    /*
    ProductClassModel.fetchAll()
    .then((products) => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});
	})
	.catch((err) => {
		console.log(err);
	});
    */

    //mongoose
    ProductClassModel.find()
    .then((products) => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});
	})
	.catch((err) => {
		console.log(err);
	});



 };

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;

    //express
    //ProductClassModel.deleteById(prodId);

    //sequelize, using destroy directly and adding a condition about which product to destroy
    //ProductClassModel.destroy({WHERE})
    /*
    ProductClassModel.findByPk(prodId)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            //.then on the destroy promise
            console.log("removed product");
            res.redirect("/admin/products");
        })
        .catch((err) => {
            console.log(err);
        });
    */

    //mongoDB   //(7)
    /*
    ProductClassModel.deleteById(prodId)
	.then((result) => {
        console.log("removed product");
        res.redirect("/admin/products");
    })
    .catch((err) => {
        console.log(err);
    });
    */

    //mongoose
    //(7)
    ProductClassModel.findByIdAndRemove(prodId)
	.then((result) => {
        console.log("removed product");
        res.redirect("/admin/products");
    })
    .catch((err) => {
        console.log(err);
    });



    //res.redirect("/admin/products");

};