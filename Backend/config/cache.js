const NodeCache =require('node-cache');

const cache=new NodeCache({ stdTTL:600,mcheckperiod:120});
module.export=cache;