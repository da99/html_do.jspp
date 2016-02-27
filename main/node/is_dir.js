

function is_dir(v) { try { return fs.lstatSync(v).isDirectory(); } catch (e) { return false; } }
