var _url = process.env.PRESTAMOS_URL;
var _port = process.env.PRESTAMOS_PORT;
var _entryPoint = process.env.PRESTAMOS_ENTRY;

console.log(`http://${_url}:${_port}/${_entryPoint}`);

export const url = _url ? _url : 'localhost';
export const port = _port ? _port : '3002';
export const entryPoint = _entryPoint ? _entryPoint : "prestamos";