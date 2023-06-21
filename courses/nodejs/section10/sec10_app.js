/*
Databases introduction


storing:
memory: store data in a variable
file
database

database, a specific program for storing/retrieving data
types: SQL (e.g MySQL) and NoSQL (e.g MongoDB)

our goal is to store data and make it easily available/accessible
easy > efficient / fast 
quicker than accessing a file especially when data grows
do not have to read the entire file to just find one piece of information

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
SQL (structured query language)
commands we use to interact with the data base


thinks in tables
and in each table fields/columns
we fill in data for these fields called records

core feature:
allows to relate different tables
ex. an Order can be described as a connection between a user and a product tables
a user can order a couple of different products
and an order can be ordered by a couple of different users


table: Users 
field: id/email/name fields
records: 1/max@test.com/Maximilian Schwarzmuller

table: Products table: 
field: id/title/price/description
record:  1/chair/ 120.99/A comfy chair
         2/book/ 10.99/exciting book

//(relation between users and products)
table: Orders 
field: id/user_id/product_id
record 2/1      /1

///////////////////////////////////
core sql database characteristics:
strong data schema; for each table we clearly define how the data in there should look like
which fields we do have, 
so structure is required - all data (in a table) has to fit


Data relations;
one-to-one; each record fits another record
one-to-many; a record might fit multiple other records
many-to-many; multiple records in table A can fit multiple records in table B

tables are connected

ex: SELECT * FROM users WHERE age > 28
SQL Keywords/Syntax: SELECT, FROM, WHERE
Parameters/Data to connect with these keywords; *, users, age > 28



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
NoSQL


Database; shop
Collections (like tables); Users, Orders
Documents (like records); {name: "max", age: 29} , {name: "peter"}
        - documents not must have a schema, data entries can not be all used (Schema-less)
        - you can store multiple documents with different structures (fill) in the same collection


Orders:
{id: "sdasd", user: {id: 1, email: "max@test.com"}, products: {id:2, price: 10.99} }

Users:
{id: 1, email: "max@test.com"}

Products:
{id:2, title:"Chair", price: 10.99}


in NoSQL we do not have relations between collections but "duplicate data"
this means that when data is updated, it has to be updated in many places

but also has an advantage that we do not have to write code to relate all datas 
for example we can have all the data we need in the orders collection without reaching to other collections

characteristics:
> no data schema - no structure is required
> no data relations - you can relate documents but you do not have to 
                        and shouldn't do it too much or your queries become slow
                        we do have no / few connections
                        instead copy data and have data collections of their own



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
as our application grows and need to store more and more data
and access that data or work with it more frequently
we might need to scale our database servers

horizontal and vertical scaling

horizontal scaling: we add more servers, can do this infinitely
can always buy new servers, on a cloud provider or our own data center
and connect them to our data base and split this data across all our servers
-this means we would need some process that runs queries on all of them
    and merges them together intelligently, not an easy to do thing

vertical scaling: make our existing server stronger
by adding more hardware, cpu, memory, 
and this has some limit on the machine, not infinite


so SQL:
Data uses Schemas
has relations
data is distributed across multiple tables
horizontal scaling is hard or impossible due to the way SQL works
this is a problem if we have multiple/thousands read and write queries per second
thus SQL can reach limits

NoSQL:
schema-less
has only a few relations if at all
data is not distributed accross multiple collections
but instead we work with merged or nested documents in an existing document
though we have different collections for the different features in our application
horizontal scaling is easier, still you know what you are doing
but there are cloud providers that can do this for us
due to the few relations existing
great performance for mass read and write requests for applications with high trough put

choosing between the two always depends on the kind of data you are storing
also for different parts of the application, for example handling user info does not change frequently

but for orders etc. they can be stored in a NoSQL (change frequently)
and there also the relations might not be that important because you can always put
the shopping information that belongs to a shopping cart in one single document



//////////////////////////////////////////////////////////////////////
go to mySQL.com and download the community edition

mySQL community server, mySQL workbench
or a combined installer for windows MySQL (installer & tools)

the work bench is a virtual client used to connect to the database
inspect it and play around with it outside our node application
which simply makes debugging a little easier


//////////////////////////////////////////////////////////////////////
working in the workbench

left pane > schemas (database)
right-click > create new > name: node-complete > apply > apply
you will find you have a couple of tables
will later store data in the tables drop down






*/