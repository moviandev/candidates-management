class APIFeats {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    // Cheking it has a query string
    if (this.queryStirng.sort) {
      // Formating data from req.query
      const sortBy = this.queryString.sort.split(',').join(' ');

      // Storing data passed through the URL
      this.query = this.query.sort(sortBy);
    } else this.query = this.query.sort('-createdAt');

    return this;
  }
}

module.exports = APIFeats;
