var _url = process.env.BICICLETAS_URL;
var _port = process.env.BICICLETAS_PORT;
var _entryPoint = process.env.BICICLETAS_ENTRY;

console.log(`http://${_url}:${_port}/${_entryPoint}`);

export const url = _url ? _url : '192.168.99.102';
export const port = _port ? _port : '3004';
export const entryPoint = _entryPoint ? _entryPoint : "bicicletas";