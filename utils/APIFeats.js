class APIFeats {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    // Cheking it has a query string
    if (this.queryString.sort) {
      // Formating data from req.query
      const sortBy = this.queryString.sort.split(',').join(' ');

      // Storing data passed through the URL
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');

    return this;
  }

  pagination() {
    // Declaring page and limit variables, with it doesn't receive anything it'll have its prefixed values
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 10;

    // Creating a skip
    const skip = (page - 1) * limit;

    // Setting query
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeats;
