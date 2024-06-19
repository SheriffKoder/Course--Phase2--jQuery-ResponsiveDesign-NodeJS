**Full-stack "Shop App" using Node.js & Templating engines**
with user sign-up/sign-in to Add/Edit/Delete products

[[ Live Demo ]](https://phase2-nodejs.onrender.com/)

>**Description**
- A simple CRUD shop website. Built with basic ExpressJS and additional helper libraries to handle the received and sent information.
- The front-end is constructed with "ejs", a HTML/CSS/Javascript templating engine.
- MVC (Model-view-controller) software architecture for code organization.
- Express.js middlewares forward to routes then use controller functions.
- Helper libraries like (multer: to store images locally, csrf protections, flash: to send messages to the front end as a response from the controller functions, express-session) are used.

>**Features**
- Create an account or use this account [ email: test@email.com / pass: 121212 ]
- Add a product by filling in the details from the nav bar.
- The ability to edit with the old information present from the "Admin Products" page.
- Delete a product from the "Admin Products" page.
- Add a product to the user's cart and view the cart.
- Make an order from the cart and clear the cart items.
- View your orders.

>**How to use the code**
- Clone or download the folder
- Open the folder in your IDE and run "npm install" in the terminal
- Create a mongoDB database [from here] and a stripe account [from here]
- Create a ".env" file in the root directory and fill these variables with values given from your mongoDB and stripe accounts
MONGO_DEFAULT_DATABASE=XXXX
MONGO_PASSWORD=XXXX
MONGO_USER=XXXX
STRIPE_KEY=XXXX
- run in the terminal "npm start"

#####
>**Screenshot - Shop App**

 ![screenshot](../../screenshot3.png)