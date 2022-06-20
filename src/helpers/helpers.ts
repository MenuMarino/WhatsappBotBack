import e from 'cors';
import { isPlainObject } from 'is-plain-object';
import unset from 'unset-value';
const mongoose = require('mongoose');
const axios = require('axios').default;

export const State = {
  NEW: 'new',
  PENDING: 'pending',
  VERIFIED: 'verified',
};

export function connectToDb(uri) {
  const connectOptions = {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    keepAlive: true,
    keepAliveInitialDelay: 5000,
    sslValidate: false,
  };
  const connection = mongoose.createConnection(uri);
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    name: String,
    email: String,
    phone: Number,
    state: { type: String, default: State.NEW },
  });
  const UserModel = connection.model('user', UserSchema);
  return UserModel;
}

export async function checkIfExists(model, phone) {
  try {
    const user = await model.findOne({ phone });
    return user;
  } catch (e) {
    return null;
  }
}

export function checkBody(body) {
  return (
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0] &&
    body.entry[0].changes[0].value.messages &&
    body.entry[0].changes[0].value.messages[0]
  );
}

export function sendMessage(phone_number_id, token, msg, phone) {
  axios({
    method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
    url:
      'https://graph.facebook.com/v12.0/' +
      phone_number_id +
      '/messages?access_token=' +
      token,
    data: {
      messaging_product: 'whatsapp',
      to: phone,
      text: {
        body: msg,
      },
    },
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => {
      // console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function saveInDb(model, phone, state, name = '', email = '') {
  try {
    const user = new model({ name, phone, email, state });
    await user.save();
    return user;
  } catch (e) {
    return null;
  }
}

export function sendInformation(user, msg, phone_number_id, token, from, url) {
  const values = msg.split(',');
  if (values.length >= 2) {
    user.name = values[0];
    user.email = values[1].trim();
    user.state = State.VERIFIED;
    user.save();
    sendMessage(
      phone_number_id,
      token,
      `Informacion sobre el proyecto de inmobiliaria: ${url}.`,
      from
    );
  } else {
    if (user.state === State.PENDING) {
    } else {
      sendMessage(
        phone_number_id,
        token,
        'Muchas gracias. Para continuar, bríndeme su nombre y correo electrónico, separado por 1 coma.',
        from
      );
    }
  }
}

export function omit(value, keys) {
  if (typeof value === 'undefined') {
    return {};
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = omit(value[i], keys);
    }
    return value;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (typeof keys === 'string') {
    keys = keys.split(' ');
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (let j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (const key in value) {
    // eslint-disable-next-line no-prototype-builtins
    if (value.hasOwnProperty(key)) {
      value[key] = omit(value[key], keys);
    }
  }

  return value;
}
