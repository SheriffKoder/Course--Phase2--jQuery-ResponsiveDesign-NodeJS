/*
npm init
npm install -save express
npm install -save body-parser
npm install -save ejs
*/


//(1) main requires
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");


//(2) set temp engine
app.set("view engine", "ejs");
app.set("views", "views");

//(3) set body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));


//(4) import and use routes
const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

app.use(adminJsRoutes);
app.use(shopJsRoutes);

////filtering mechanism
////app.use("/admin", adminJsRoutes);


//(5) 404
const errorController = require("./controllers/errorController.js");
app.use(errorController.get404);


//(6)
app.listen(3000);




/*

MVC (model view controller) description:
app.js ;    import routes, app.use(routes)
^
routes:     just redirects the imported controller middlewares 
            to router.method("url", controller.middlewareName)
^
util
^
controllers middlewares, exports.name = req,res,next
            res.render ("name", {})
            model.methodFunction / new modelClass
            res.redirect
            uses req.body.formInput (understood from routes.js methods)
^
models      getproductsfrom file (x)
                fs.readfile "Data"file
                cb(parsed Data)
            
            class
                save()
                    (x) product of parsedData.push(this)
                    fs.writefile (Datafile,product)
                fetchAll(cb)
                    cb here takes the parsed data x(cb)

^
views
^
public



what urls do:
Admin JS router
get from > /add-product > getAddProduct controller > which render add-product.ejs
post from > /product > postAddProduct controller > which adds new product from req.body / product.save()

Shop JS router
get from > / > getProducts controller > which product.fetchAll(render) where render here takes the parsed data x(cb)




thinking from the view file:
add product view page
display form    > getAddProduct controller
take input and make product > postAddProduct controller > controllers use model

shop view page
displays product > getProducts controller


how it works:
make view
html/ejs
..
middleware exports
setup controller to view or take request
..
controller uses model functionality
which creates data path
..
routes redirects controller to url/method
..
app.js app.ue(router)



Steps: 
html/ejs
app.js / routers
controller (which) functionality and model (w/data)


*/