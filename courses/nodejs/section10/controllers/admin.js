
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
   ProductClassModel.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
   }).then((result) => {
        console.log("created product");
   }).catch((err) => {
    console.log("error" + err);

   });


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


    ProductClassModel.findByPk(prodId)
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

        });



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


}

exports.getProducts = (req, res, next) => {

    //express
    /*
    ProductClassModel.fetchAll(products => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});

    });
    */

    //Sequelize
    ProductClassModel.findAll()
    .then((products)=>{
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});
    })
    .catch((err) => {
        console.log(err);
    });


};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    ProductClassModel.deleteById(prodId);
    res.redirect("/admin/products");

};