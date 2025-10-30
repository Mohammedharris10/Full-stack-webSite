class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;       // main mongoose query
        this.queryStr = queryStr; // query string from URL
    }

    search() {
        // if keyword present, use regex for name search (case-insensitive)
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
        const queryStrCopy = { ...this.queryStr }; // make copy of query string

        const removeFields = ['keyword', 'limit', 'page'];
        // remove extra fields that not need for filter

        removeFields.forEach(field => delete queryStrCopy[field])

        let queryStr ={};
        for (let key in queryStrCopy) {
            if(key.includes('[')){
                let urlFilter = key.split('[')
                const field = urlFilter[0]; //split every return list like [price,]gt]
                const operator = urlFilter[1].replace(']','');

                if(!queryStr[field]){
                    queryStr[field] ={}
                }
                queryStr[field]['$' + operator] = Number(queryStrCopy[key])
            }

            else{
                queryStr[key] = queryStrCopy[key]
            }
        }

        this.query = this.query.find(queryStr)
        return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1)
        this.query.limit(resPerPage).skip(skip);
        return this;
    }
}

module.exports = APIFeatures;
