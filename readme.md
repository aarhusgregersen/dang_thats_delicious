## What is this?

Just you wait folks!

## Sample Data

To load sample data, run the following command in your terminal:

```bash
npm run sample
```

If you have previously loaded in this data, you can wipe your database 100% clean with:

```bash
npm run blowitallaway
```

That will populate 16 stores with 3 authors and 41 reviews. The logins for the authors are as follows:

|Name|Email (login)|Password|
|---|---|---|
|Wes Bos|wes@example.com|wes|
|Debbie Downer|debbie@example.com|debbie|
|Beau|beau@example.com|beau|


## Environment variables

Coming back to this project after a while is troublesome, because we might forget that we're actually using a `variables.env` file in the repo, to connect to the database, among other things.

Create a `variables.env` file after pulling this repo, and make sure you have the following contents in it:

```
NODE_ENV=development
DATABASE=insert_your_mongodb_connect_string
MAIL_USER=123
MAIL_PASS=123
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
PORT=7777
MAP_KEY=insert_google_maps_key
SECRET=write_a_funny_secret
KEY=write_something_funny_to_serialize_cookies
```