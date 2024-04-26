# Custom Twilio Alerting System

A custom Twilio alerting system using Express.js, json-rules-engine, and MongoDB

## Getting Started

1. **Clone the repository**: Start by cloning the repository to your local machine.

2. **Install Dependencies**: After cloning the repository, install the necessary dependencies.

    ```bash
    npm install
    ```

3. **Environment Setup**: Rename the file `.env.example` to `.env` and update the environment variables according to your setup.

4. **MongoDB Setup**: Set up a MongoDB cluster and create a database and collection. Copy the connection string and update the `.env` file with the connection details.

5. **Update Rules**: Customize the rules and thresholds in the `ruleEngine.js` file to match your alerting requirements.

## Usage

To run the application, execute the following command:

```bash
node app.js
```

For more information, check out the blog post - [Custom Twilio Alerting System using Express, MongoDB, and SendGrid](https://www.twilio.com/en-us/blog/custom-twilio-alerting-system-express-mongodb-sendgrid)
