
function is_file(v) { try { return fs.lstatSync(v).isFile(); } catch (e) { return false; } }
