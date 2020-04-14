require('dotenv').config();

export default function smartLog(message) {
    if ('test' === process.env.NODE_ENV) {
        return;
    }

    console.log(message);
}
