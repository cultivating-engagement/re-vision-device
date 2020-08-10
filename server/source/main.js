//////////////////////////////////////////////////////////////////////////////

'use strict';

const Https = require('https');
const Path = require('path');

const BodyParser = require('body-parser');
const Express = require('express');
const Mongoose = require('mongoose');

//////////////////////////////////////////////////////////////////////////////
// configuration:

// for each configuration, use optional environment variable or default:

const    apiPrefixPath = process.env.VVF_API_PREFIX_PATH    || '/api';
const clientTargetPath = process.env.VVF_CLIENT_TARGET_PATH || '../../client/target';
const      databaseUrl = process.env.VVF_DATABASE_URL       || 'mongodb://localhost:27017/vvf';
const       serverPort = process.env.VVF_SERVER_PORT        || 4000;

// log configuration:

console.log('VVF configuration: ');
console.log('  - API prefix path    = ' + apiPrefixPath);
console.log('  - client target path = ' + clientTargetPath);
console.log('  - database URL       = ' + databaseUrl);
console.log('  - server port        = ' + serverPort);

//////////////////////////////////////////////////////////////////////////////
// connection:

Mongoose.connect(databaseUrl, { useNewUrlParser: true });
const connection = Mongoose.connection;

connection.on('error', () => {
  console.log('Error: Could not connect to MongoDB.');
  process.exit(1);
});

let imageSchema,
    imageModel,
    visionSchema,
    visionModel;

connection.once('open', function() {

  imageSchema = new Mongoose.Schema({
    id: String,
    linkId: String
  });

  imageModel = Mongoose.model(
    'images',
    imageSchema
  );

  visionSchema = new Mongoose.Schema({
    age:        Number,
    child:      Boolean,
    comment:    String,
    familiar:   Number,
    host:       String,
    images:     [{
      caption:      String,
      filter:       String,
      id:           String,
      location:     String,
      mediaUrl:     String,
      noComments:   Number,
      noLikes:      Number,
      tags:         String,
      thumbnailUrl: String,
      uploadTime:   String,
      uploaderId:   String,
      uploaderName: String,
      url:          String,
    }],
    imageTags:  String,
    influences: {
      ethical:     Boolean,
      local:       Boolean,
      nutritional: Boolean,
      organic:     Boolean,
      other:       String,
      outdoors:    Boolean,
      price:       Boolean,
    },
    ipAddress:  String,
    language:   String,
    residence:  {
      country:    String,
      postalCode: String,
    },
    technology: Number,
    time:       Date,
    title:      String,
  });

  visionModel = Mongoose.model(
    'visions',
    visionSchema
  );

});

//////////////////////////////////////////////////////////////////////////////
// API implementation:

const server = Express();

server.get('/', (request, response) => {
  response.sendFile(
    Path.join(
      __dirname,
      clientTargetPath,
      'index.html'));
});

server.get('/index.js', (request, response) => {
  response.sendFile(
    Path.join(
      __dirname,
      clientTargetPath,
      'index.js'));
});

// define `getImage` function with reference so that we can invoke it
// recursively.
function getImage(request, response) {
  imageModel
    .findOne()
    .skip(Math.floor(Math.random() * 16405))
    .exec((error, image) => {

      // case: an error occured.
      if (error) {
        // no recursion here because of possible endless-loop.
        response.json({ success: false });
        return;
      }

      const imageObject = image.toObject();
      imageObject.mediaUrl = imageObject.url + 'media/?size=l';

      // fetch image.
      Https.get(imageObject.mediaUrl, instagramResponse => {

        // case: image not found
        if (instagramResponse.statusCode === 404) {
          // try another random image.
          getImage(request, response);
          return;
        }

        response.json({
          success: true,
          image: {
            caption: imageObject.caption,
            filter: imageObject.filter,
            id: imageObject.id,
            location: imageObject.location,
            mediaUrl: imageObject.mediaUrl,
            noComments: imageObject.noComments,
            noLikes: imageObject.noLikes,
            tags: imageObject.tags,
            thumbnailUrl: imageObject.thumbnailUrl,
            uploadTime: imageObject.uploadTime,
            uploaderId: imageObject.uploaderId,
            uploaderName: imageObject.uploaderName,
            url: imageObject.url,
          }
        });
      });
    });
}

server.get(apiPrefixPath + '/image', getImage);

// use body-parser library to parse response.
server.use(BodyParser.json());

const validate = {

  age(age, requestBody, isChild) {
    return isChild ||
           (age === undefined) ||
           (age === null) ||
           (Number.isInteger(+age) && (0 <= +age) && (+age <= 99));
  },

  child(child) {
    return (child === true) || (child === false);
  },

  comment(comment) {
    return true;
  },

  familiar(familiar, requestBody, isChild) {
    return isChild || (
      familiar &&
      Number.isInteger(+familiar) &&
      (0 <= +familiar) && (+familiar <= 2)
    );
  },

  host(host) {
    return true;
  },

  images(images) {
    return true;
  },

  imageTags(ugh, requestBody) {
    return requestBody.images.every(image =>
      image.hasOwnProperty('tags'));
  },

  influences(influences, requestBody, isChild) {

    if (isChild) {
      return true;
    }

    if (!influences) {
      return false;
    }

    let nTrueInfluences = 0;
    for (let influenceKey of [
      'ethical',
      'local',
      'nutritional',
      'organic',
      'other',
      'outdoors',
      'price',
    ]) {

      if (!influences.hasOwnProperty(influenceKey)) {
        return false;
      }

      else if (
        (influences[influenceKey] === true) ||
        ((influenceKey === 'other') &&
         influences[influenceKey] &&
         /^\s*$/.test(influences[influenceKey])
        )
      ) {
        nTrueInfluences++;
        if (nTrueInfluences > 3) {
          return false;
        }
      }

      else if (
        (influenceKey !== 'other') &&
        (influences[influenceKey] !== false)
      ) {
        return false;
      }
    }

    return true;
  },

  language(language) {
    return ['deutsch','english'].includes(language);
  },

  residence(residence) {
    return true;
  },

  technology(technology, requestBody, isChild) {
    return isChild || (
      technology &&
      Number.isInteger(+technology) && // integer.
      (-2 <= +technology) &&           // minimum 2.
      (+technology <= 2)               // maximum 2.
    );
  },

  title(title) {
    return true;
  },
};

server.post(apiPrefixPath + '/vision', (request, response) => {

  let isChild = request.body['child'] === true;

  for (let visionKey in validate) {
    if (validate[visionKey](request.body[visionKey], request.body, isChild) !== true) {
      response.json({
        success: false,
        message: {
          deutsch: 'Die Eigenschaft „' + visionKey + '“ ist ungültig.',
          english: 'The “' + visionKey + '” property is invalid.'
        },
      });
      return;
    }
  }

  const imageTags = Array
    .from(
      new Set(
        [].concat.apply(
          ...request.body.images.map(image =>
            image.tags.split(', ')))))
    .sort()
    .join(', ');

  // saving:
  new visionModel({

    age:        request.body.age,
    child:      request.body.child,
    comment:    request.body.comment,
    familiar:   request.body.familiar,
    host:       request.get('host'),
    images:     request.body.images,
    imageTags:  imageTags,
    influences: request.body.influences,
    ipAddress:  request.header('x-forwarded-for') ||
                request.connection.remoteAddress,
    language:   request.body.language,
    residence:  request.body.residence,
    technology: request.body.technology === null ? null : Number.parseInt(request.body.technology),
    time:       new Date(Date.now()),
    title:      request.body.title,

  }).save((error, product) => {

    // case: saving failed.
    if (error) {
      console.log(error);
      response.json({
        success: false,
        message: {
          deutsch: 'Dokument konnte nicht gespeichert werden.',
          english: 'Failed to save document.',
        },
      });
    }

    // case: saving succeeded.
    else {
      response.json({ success: true });
    }
  });
});

//////////////////////////////////////////////////////////////////////////////
// start server:

server.listen(serverPort);
