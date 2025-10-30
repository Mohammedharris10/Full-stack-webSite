module.exports = func => (req, res, next) => {

   // run async function and catch any error
   return Promise.resolve(func(req, res, next)).catch(next)
   // why: this help to avoid using try-catch in every route
} 
