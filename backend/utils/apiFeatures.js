class APIFeatures {
    constructor(query, queryStr){
        this.query = query;       // main mongoose query
        this.queryStr = queryStr; // query string from URL
    }

    search(){
        // if keyword present, use regex for name search (case-insensitive)
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' // i mean ignore case
            }}: {};

        this.query.find({...keyword}) // find products match keyword
        return this; // return current object for chaining
    }

    filter(){
        const queryStrCopy = {...this.queryStr}; // make copy of query string

        const removeFields = ['keyword','limit', 'page']; 
        // remove extra fields that not need for filter

        removeFields.forEach(field => delete queryStrCopy[field])

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match=>`$${match}`)



        this.query.find(JSON.parse(queryStr)) // filter product by remaining fields
        return this; // return object for chaining
    }
}