# iTunes App Link Resolver

Uses the MixMax API to create a link resolver integration. 

Upon pasting a link in the form:
> https://itunes.apple.com/us/app/uofm-laundry/id998426445?mt=8

the integration will add a dynamically generated app preview including the app's
  - logo
  - creator
  - ratings
  - description
  - price
  - first screenshot

The code is based off of the sample code at http://sdk.mixmax.com/docs/tutorial-giphy-link-preview and calls the iTunes search api https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/

### Installation

```sh
$ npm install
```

```sh
$ npm start
```

### Adding the Integration

| Input Name    | Value         
| ------------- |:-------------|
| Description   | iTunes App   |
| Regex         | itunes.apple.com\/[a-z]{2}\/app\/      |
| Resolver URL  | http://localhost:9146/resolver      |


### TODOs

* Make responsive (currently not optimized for mobile)
* Turn screenshot into image slider of all screenshots (or animated gif)

