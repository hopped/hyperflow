var AMQP_URL  = process.env.AMQP_URL ? process.env.AMQP_URL : "amqp://localhost:5672";
var WORKDIR   = process.env.WORKDIR;
var S3_BUCKET = process.env.S3_BUCKET;
var S3_PATH   = process.env.S3_PATH;

exports.amqp_url = AMQP_URL;

exports.options = {};
exports.options.workdir = WORKDIR;

//if (S3_BUCKET !== undefined && (typeof S3_BUCKET === 'string' || S3_BUCKET instanceof String)) {
  exports.options.storage = 's3';
  exports.options.bucket = 'paasage-bucket';
  exports.options.prefix = 'results';
//} else {
//  exports.options.storage = 'local';
//}

// Local storage
// exports.options = {
//    "storage": "local",
//    "workdir": WORKDIR
//};

// NFS storage
// exports.options = {
//     "storage": "nfs",
//     "workdir": "/path/where/workflow/data/is",
// }

// Local storage
// exports.options = {
//     "storage": "local"
//     "workdir": "/path/where/workflow/data/is",
// }
