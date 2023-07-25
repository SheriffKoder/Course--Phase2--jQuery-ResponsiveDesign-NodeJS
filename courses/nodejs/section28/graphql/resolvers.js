
//you need a method for every query you define in your schema
//and the name has to match
module.exports = {
    hello() {
        return {
            text: "Hello World!",
            views: 1245
        }
    }
}