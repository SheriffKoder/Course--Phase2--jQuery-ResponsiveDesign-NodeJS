
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
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser
    //console.log(req.body["productAdded"]);

    //change the value of products[] before getting to export
    //products.push({"recent_product": req.body.productAdded});

    //pass the form title and push the title to the products array in product.js using save
    const title = req.body.productAdded;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new ProductClassModel(title, imageUrl, price, description);

    product.save();

    //res.send("<h1>Add product page 2");
    res.redirect("/");
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


};




exports.getProducts = (req, res, next) => {

    ProductClassModel.fetchAll(products => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});

    });
};