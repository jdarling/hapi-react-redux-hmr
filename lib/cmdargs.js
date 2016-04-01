const parseArgs = (expTbl, argv)=>{
  const processArg = function(idx, args, argv){
    const arg = (idx)=>{
      return argv[idx]||'';
    };

    let key = arg(idx);
    const isArg = key.substr(0,1)==='-';
    if(isArg){
      if(key.substr(1,1)!=='-'){
        if(key.length>2){
          for(let i = 1; i<key.length; i++){
            let long = expTbl[key.substr(i, 1)];
            args[long] = true;
          }
          return 1;
        }
        key = expTbl[key.substr(1,1)];
        if(!key){
          throw new Error('Unknown argument "'+(arg(idx).replace(/^[\-]+/, '').substr(0, 1))+'" skipped.');
          return 1;
        }
      }
      if(key && key.substr(1,1)==='-'){
        key = key.substr(2);
      }
      const val = arg(idx+1);
      if((!val || (val.substr(0,1)==='-'))){
        args[key] = true;
        return 1;
      }
      if(args[key]){
        if(!(args[key] instanceof Array)){
          args[key] = [args[key]];
        }
        args[key].push(val);
        return 2;
      }
      args[key] = val;
      return 2;
    }
    args._.push(key);
    return 1;
  };

  const parseArgs = (argv)=>{
    let args = {_: []};

    let i = 0, key;
    const l = argv.length;
    for(;i<l;){
      i += processArg(i, args, argv);
    }
    return args;
  };

  if(argv){
    return parseArgs(argv);
  }
  return parseArgs;
};

module.exports = {
  parseArgs,
};
