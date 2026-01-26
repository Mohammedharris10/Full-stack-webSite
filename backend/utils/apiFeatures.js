class APIFeatures {
     // /api/v1/products?keyword=iphone&page=2&price[gt]=10000
     
    constructor(query, queryStr) {
        this.query = query;       // main mongoose query
        this.queryStr = queryStr; // query string from URL
    }

    search() {
        // if keyword present, use regex for 'name' search (case-insensitive)
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' // i mean ignore case
            }
        } : {};

        this.query.find({ ...keyword }) // find products match keyword
        return this; // return current Strect for chaining
    }

    filter() {

        // make copy of query params to avoid direct change
        const queryStrCopy = { ...this.queryStr };

        // remove fields which are not part of filter logic
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        // new object to build mongodb filter query
        let queryStr = {};

        for (let key in queryStrCopy) {

            // handle advanced filters like price[gt], price[lte]
            if (key.includes('[')) {

                // split field and operator
                let urlFilter = key.split('[');
                const field = urlFilter[0]; //split every return list like [price,]gt]
                const operator = urlFilter[1].replace(']', '');

                // create object if not exist
                if (!queryStr[field]) {
                    queryStr[field] = {};
                }

                // convert operator to mongodb format ($gt, $lt etc)
                queryStr[field]['$' + operator] = Number(queryStrCopy[key]);
            }

            // normal filter like category=mobile
            else {
                queryStr[key] = queryStrCopy[key];
            }
        }

        // apply filter query to mongoose
        this.query = this.query.find(queryStr);

        return this; // allow method chaining
    }

    paginate(resPerPage) {

        // get current page number from query, default is 1
        const currentPage = Number(this.queryStr.page) || 1;

        // calculate how many records to skip
        const skip = resPerPage * (currentPage - 1);

        // limit results and skip previous pages data
        this.query.limit(resPerPage).skip(skip);

        return this; // allow method chaining
    }
}

module.exports = APIFeatures;
