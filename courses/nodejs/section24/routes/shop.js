

const path = require("path");
const express = require("express");

const router = express.Router();

//module imported from /util/path.js
//const pathJSrootDir = require("../util/path.js");
//const adminData = require("./admin.js");

const shopController = require("../controllers/shop.js")

const isAuth = require("../middleware/is-auth.js");


router.get("/", shopController.getIndex);

/*
router.get("/", (req, res, next) => {
    const products = adminData.products;
    res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});

    console.log("shop.js is logging: ", adminData.products );

});
*/


router.get("/products", shopController.getProducts);

// //tell express router that there will be some variable segment
// //by adding a : then any name of our choice, that we will use to extract that information
// //router.get("/products/delete",...);
router.get("/products/:productId", shopController.getProduct);

// router.get("/checkout", shopController.getCheckout);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

//(23.0.1)
//isAuth to access if the user is authenticated
router.get("/checkout", isAuth, shopController.getCheckout);

//(23.0.2)
//can use in success postOrder
router.get("/checkout/success", shopController.getCheckoutSuccess);
router.get("/checkout/cancel", shopController.getCheckout);


router.get("/orders", isAuth, shopController.getOrders);

//-(23.0.2) replaced with checkout/success
//router.post("/create-order", isAuth, shopController.postOrder);

//(20.1.0)
router.get("/orders/:orderId",isAuth, shopController.getInvoice);


module.exports = router;





