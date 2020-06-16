//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// WELCOME TO THE GARBAGE CODE ZONE ////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//      made by somerandomdev49. please do not use in prouction. this is awful code made to make the C lisp easier for me to make.      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require("fs");
const util = require('util');
const colors = require("colors");
const objtostr = (o, lvl=0) => {
	if(typeof(o) == "undefined") o = { type: "Nonsense", val: null };
	if(typeof(o) == "null") o = { type: "Empty", val: null };
	
	let s = "";
	if(o.type == "Num") s += `${o.val()}`.yellow.italic;
	if(o.type == "Str") s += `"${o.val()}"`.green.italic;
	if(o.type == "Fnc") s += '{ Function }'.blue.bold;
	if(o.type == "Empty") s += '{ Empty }'.gray.italic;
	if(o.type == "Nonsense") s += '{ Nonsense }'.grey.bold;
	if(o.type == "Arr" || o.type == "Map") {
		//console.log("TYPE")  ("\t".repeat(lvl) + 
		s +=("(").cyan.italic;
		let e = Object.entries(o.val);
		for(let i=0;i<e.length-1;i++)
			s += ("(".cyan.dim + e[i][0] + " " + objtostr(e[i][1], lvl+1) + ") ".cyan.dim);
		s += ("(".cyan.dim + e[e.length-1][0] + " " + objtostr(e[e.length-1][1], lvl+1) + ")".cyan.dim);
		s += (")").cyan.italic;
	}
	if(s.length == 0) return o.toString();
	return s;
}

const ascii = c => c.charCodeAt();

const is_valid_id = c =>
	(ascii(c) >= ascii('a') && ascii(c) <= ascii('z')) ||
	(ascii(c) >= ascii('A') && ascii(c) <= ascii('Z'))
	|| c == '_'
	|| c == '/'
	|| c == '*'
	|| c == '+'
	|| c == '>'
	|| c == '<'
	// || c == '-' <- checked in lexer/parser.
	|| c == '='
	|| c == '#'
	|| c == '$'
	|| c == "&";

const is_valid_num = c =>
	(ascii(c) >= ascii('0') && ascii(c) <= ascii('9'))
	|| c == '_';

const clsChars = (str, index, len) => {
	if (index > str.length - 1) return str;
	if (index+len > str.length) return str;
	return str.substr(0, index) + str.substr(index + len);
}

function stripComments(s) {
	var re1 = /^\s+|\s+$/g;  // Strip leading and trailing spaces
	var re2 = /\s*[;].+$/g; // Strip everything after # or ; to the end of the line, including preceding spaces
	return s.replace(re1,'').replace(re2,'').replace(re1,'');
}
function trim (s, c) {
	if (c === "]") c = "\\]";
	if (c === "\\") c = "\\\\";
	return s.replace(new RegExp(
		"^[" + c + "]+|[" + c + "]+$", "g"
	), "");
}

class Parser
{
	constructor(str) {
		this.str = str.replace(/(\;.*$)/gm, '');
		// let commentMode = false;
		// let startIndex = 0;
		// let endIndex = 0;
		// let index = 0;
		// for(let c of this.str) {
		// 	console.log(startIndex);
		// 	console.log(endIndex);
		// 	if(commentMode && c == '\r') {
		// 		commentMode = false;
		// 		endIndex = index;
		// 		this.str = clsChars(this.str, startIndex, endIndex-2);
		// 		console.log(this.str)
		// 	}
		// 	if(!commentMode && c == ";") {
		// 		commentMode = true;
		// 		startIndex = index;
		// 	}
		// 	index++;
		// }
		// console.log('"' + this.str.substr(startIndex, endIndex) + '"')	
	}
	trim() {
		//this.str = trim(this.str, " ");//stripComments(this.str);
		//this.str = trim(this.str, "\t");
		this.str = this.str.trim();
	}
	next() {
		this.str = this.str.substr(1);
	}
	parseId(buf) {
		if(!buf) buf = "";
		while(is_valid_id(this.str[0]) || is_valid_num(this.str[0]))
		{ buf += this.str[0]; this.next(); }
		this.trim();
		return { type: 1, val: buf }
	}
	parseNum(buf) {
		if(!buf) buf = "";
		if(this.str[0] == '-') { buf += this.str[0]; this.next(); }
		while(is_valid_num(this.str[0]))
		{ buf += this.str[0]; this.next(); }
		if(this.str[0] == '.') {
			buf += this.str[0]; this.next();
			while(is_valid_num(this.str[0]))
			{ buf += this.str[0]; this.next(); }
		}
		this.trim();
		return { type: 2, num: Number.parseFloat(buf.replace("_", "")) }
	}
	parse() {
		this.trim();
		if(this.str[0] == '(') {
			this.trim();
			this.next();
			this.trim();
			let exprs = []
			while(this.str[0] != ')')
			{ this.trim(); 
				exprs.push(this.parse()); 
				this.trim(); }
			if(this.str[0] != ')') { console.error("Expected ')'!"); process.exit(1); }
			else this.next();
			return { type: 0, exprs }
		}
		if(this.str[0] == '[') {
			this.trim();
			this.next();
			this.trim();
			let attr = this.parse();
			//while(this.str[0] != ']') { exprs.push(); this.trim(); }
			if(this.str[0] != ']') { console.error("Expected ']'!"); process.exit(1); }
			else this.next();
			return { type: 4, attr }
		}
		if(is_valid_id(this.str[0])) return this.parseId();
		if(this.str[0] == '.') {
			this.next();
			if(!this.str[0] == '.') { console.error("Expected '.'!"); process.exit(); }
			this.next();
			if(!this.str[0] == '.') { console.error("Expected '.'!"); process.exit(); }
			this.next();
			return { type: 5, args: this.parse() };
		}
		if(is_valid_num(this.str[0])) return this.parseNum();
		if(this.str[0] == '-') {
			this.next();
			this.trim();
			if(is_valid_id(this.str[0])) return this.parseId("-");
			if(is_valid_num(this.str[0])) return this.parseNum("-");
			else return this.parseId("-");
		}
		if(this.str[0] == '"') {
			this.next();
			let buf = "";
			while(this.str[0] != '"')
			{
				if(this.str[0] == '\\')
				{
					buf += this.str[0];
					if(this.str[0] == 'n') buf += "\n";
					if(this.str[0] == 't') buf += "\t";
					if(this.str[0] == 'r') buf += "\r";
					if(this.str[0] == 'r') buf += "\v";
					if(this.str[0] == '\\') buf += "\\";
					if(this.str[0] == '"') buf += "\"";
					if(this.str[0] == '\'') buf += "'";
					if(this.str[0] == 'b') buf += "\b";
					if(this.str[0] == '0') buf += "\0";
					else throw new Error("Unknown escape sequence: " + this.str[0]);
				}
				else buf += this.str[0];
				this.next();
			}
			this.next();
			return { type: 3, str: buf }
		}
		throw new Error("What is this? '" + this.str + "'");
	}
}

const val = (t, v) => ({ $$: false, type: t, val: () => v })
const fnc = v => ({ $$: false, type: "Fnc", val: v })

class Scope {
	constructor(o, parent) {
		this.o = o;
		this.parent = parent;
	}
	has(name) {
		return name in this.o ? true : this.parent ? this.parent.has(name) : false;
	}
	get(name) {
		//console.log("GET: ", name)
		if(name in this.o) return this.o[name];
		else if(this.parent) return this.parent.get(name);
		else return undefined;
	}
	set(name, value) {
		//console.log("SET: ", name)
		if(name in this.o) return this.setThis(name, value);
		else if(this.parent) return this.parent.set(name, value);
		throw new Error("No such name: " + name);
	}
	setThis(name, value) {
		//console.log("SET THIS: ".red, name, " -> ", value);
		//console.log("setThis: ", name, " = ", value)
		this.o[name] = value;
	}
}

// const mkScope = o => 
// 	new Proxy(
// 		new Scope(o),
// 		{
// 			has: (t, p) => Reflect.has(t.o, p),
// 			get: (t, p, r) => Reflect.get(t, "get", r).bind(t)(p),
// 			set: (t, p, v, r) => Reflect.get(t, "set", r).bind(t)(p, v)
// 		}
// 	)

const coreTypesSignatures = {
    Cmp:   {$$: false}, //=> ( ...Type )
    Fnc:   {$$: false}, //=> Type -> Type
    Arr:   {$$: false}, //=> [ ...T ], where T - Type
    Num:   {$$: true},  //=> Data
    Str:   {$$: true},  //=> Data
    Trh:   {$$: true},  //=> Data
}

// Please help with type system.

const eqType = (a, b) => {
    if(a.type != b.type) return false;
	if(a.type == "Cmp") { if(a.val.length != b.val.length) return a.val.every((v, i) => v == b.val[i]); }
	if(a.type == "Fnc") { return eqType(a.val.a, b.val.a) && eqType(a.val.b, b.val.b); }
	if(a.type == "Arr") { return eqType(a.val.type, b.val.type); }
    else return true;
};

const sfnc = f => fnc(a => f(a.val.bind(this)()));

let NO_OUTPUT = false;
class Walker {
	// setThis(name, value) {
	// 	let t = Reflect.get(this.env, "setThis", this.env);
	// 	console.log()
	// 	t(name, value);
	// }
	constructor(moduleName) {
		this.NO_OUTPUT = false
		this.__STDLIB_LIB_ONLY = false
		this.env = new Scope({ // $$ means no execution.
			"+": fnc((a, b) => {
				//console.log("add ", a.val(), ' ', b);
				return({ type: "Num", val: () => a.val() + b.val() })
			}),
			"-": fnc((a, b) => ({ type: "Num"  ,val: () => a.val() - b.val() })),
			"*": fnc((a, b) => ({ type: "Num"  ,val: () => a.val() * b.val() })),
			"/": fnc((a, b) => ({ type: "Num"  ,val: () => a.val() / b.val() })),
			">": fnc((a, b) => ({ type: "Num"  ,val: () => a.val() > b.val() })),
			"<": fnc((a, b) => ({ type: "Num"  ,val: () => a.val() < b.val() })),
			">=": fnc((a, b) => ({ type: "Num" ,val: () => a.val() >= b.val() })),
			"<=": fnc((a, b) => ({ type: "Num" ,val: () => a.val() <= b.val() })),
			eq: fnc((a, b) => ({ type: "Trh" ,val: () => a == b })),
			not: fnc(a => ({ type: "Trh"  ,val: () => !a.val() })),
			//not: fnc((a, b) => ({ type: "Num", val: () => a.val() + b.val() })),
			abc: val("Str", "add"),
			run: fnc((s) => eval(s)), // ah yes, securiti
			":": {
				$$: true, type: "Fnc",
				val: (v, type) => this.walk(v) == type.val
			},
			"&": fnc((...x) => x[x.length-1]),
			list: fnc((...x) => ({type:"Arr",val:x})),
			map: {
				$$: true, type: "Fnc",
				val: (...x) => {
					let obj = {};
					for(let y of x) obj[y.exprs[0].val] = this.walk(y.exprs[1]);
					return {type: "Map", val: obj};
				}
			},
			"=": {
				$$: true, type: "Fnc",
				val: (a, b) => {
					let l = this.walk(b);
					//console.log(a);
					if(l.type != this.env.get(a.val).type) this.env.o.panic.val.bind(this)("Types not compatible: " + this.env.get(a.val).type + " <- " + l.type);
					else this.env.set(a.val, this.walk(b));
				}
			},
			let: {
				$$: true, type: "Fnc",
				val: (t, n, v) => {
					let l = this.walk(v);
					if(l.type != t.val) this.env.o.panic.val.bind(this)("Types not compatible: " + t.val + " <- " + l.type);
					else this.env.setThis(n.val, l);
				}
			},
			if: {
				$$:true,type:"Fnc",
				val: (test, then, otherwise) => {
					let t = this.walk(test);
					if(t.type == "Trh" && t.val.bind(this)() == true) { this.walk(then); }
					else if(otherwise) { this.walk(otherwise); }
				}
			},
			import: {
				$$: true, type: "Fnc",
				val: (...mpath) => {
					//console.log("Import", ...mpath);
					let path = "./" + mpath.map(x=>x.val).join("/") + ".lisp";
					let mod = mpath.map(x=>x.val).join(" ");
					// console.log(mod, "in", this.loopingModules)
					if(this.loopingModules.includes(mod)) { this.env.o.warn.val.bind(this)("Module is already imported in this system: (" + mod + ")"); return; }
					//console.log("Import file", path);
					this.loopingModules.push(mod);
					if(!fs.existsSync(path)) { this.env.o.warn.val.bind(this)("Module does not exist: (" + mod + ")"); return; }
					else {
						//console.log("IMPORT!")
						let filedata = fs.readFileSync(path).toString();
						//console.log(filedata);
						let w = new Walker(mod);
						w.loopingModules = [...this.loopingModules];
						//w.loopingModules.push(this.moduleName);
						//console.log("WALK".blue.bold);
						w.walk(new Parser(filedata).parse());
						//console.log(w.env.o);
						for(let obj of Object.entries(w.exports)) {
							//console.log("import", obj)
							if(obj[0] in this.env.o);
							else this.env.o[obj[0]] = obj[1];
						}
						// console.log(this.env.o);
					}
				}
			},
			defun: {
				$$: true, type: "Fnc",
				val: (name, args, val) => {
					//console.log(name);
					//console.log(args);
					if(this.env.has("$" + name.val)) {
						if(args.exprs.length != this.env.get("$" + name.val).length)
						this.env.o.panic.val.bind(this)(`Argument count of (defun ${name.val} ...) does not equal the argument count of declare.`);
					}
					this.env.setThis(name.val, fnc((...callArgs) => {
						if(args.exprs.length != callArgs.length) this.env.o.panic.val.bind(this)("Not enough arguments!");
						let walker = new Walker(moduleName); walker.env.parent = this.env;
						for(let i=0;i<args.exprs.length;i++) {
							if(this.env.has("$" + name.val))
								if(this.env.get("$" + name.val)[i].val != callArgs[i].type
									&& this.env.get("$" + name.val)[i].val != "Any") 
								this.env.o.panic.val.bind(this)("Types not compatible: " + this.env.get("$" + name.val)[i].val  + " <- " + callArgs[i].type);
							walker.env.setThis(args.exprs[i].val, callArgs[i]);
						}
						return walker.walk(val);
					}));
					//console.log(this.env);
				}
			},
			exp: {
				$$: true, type: "Fnc",
				val: (name) => {
					this.env.o.export.val.bind(this)(name, name);
				}
			},
			declare: {
				$$: true, type: "Fnc",
				val: (name, argtypes) => {
					this.env.setThis("$" + name.val, argtypes.exprs);
				}
			},
			id: {
				$$: true, type: "Fnc",
				val: name => {
					return this.env.get(name);
				}
			},
			panic: fnc((...c) => {
				let msg = c.map(e => (e?e.val instanceof Function:undefined)?e.val():e);
				console.error("pAnIc:".red.bold, ...msg);
				process.exit(1);
			}),
			warn: fnc((...c) => {
				let msg = c.map(e => (e.val instanceof Function)?e.val():e);
				console.error("Warning:".yellow.bold, ...msg);
			}),
			tostr: fnc(x => ({type: "Str", val: () => objtostr(x)})),
			write: fnc((...msgs) => {
				//process.stdout.write("LANGUAGE OUTPUT: ".red.bold);
				for(let msg of msgs) process.stdout.write(msg.val?msg.val().toString():"Nonsense");
				process.stdout.write("\n");
			}),
			export: { $$:true, type: "Fnc", val: ((n, x) => { this.exports[n.val] = this.walk(x); }) },

			
			sin: fnc((a) => {Math.sin(a)}), // stdlib math trig
			cos: fnc((a) => {Math.cos(a)}),
			tan: fnc((a) => {Math.tan(a)}),
			acos: sfnc(Math.acos),	
			asin: sfnc(Math.asin),	
			acosh: sfnc(Math.acosh),	
			atan: sfnc(Math.atan),	
			atan2: fnc((x, y) => Math.atan2(x.val(), y.val())),	
			atanh: sfnc(Math.atanh()),
			cosh: sfnc(Math.cosh),
			sinh: sfnc(Math.sinh),
			
			floor: fnc((a) => {Math.floor(a)}), // stdlib math core
			ceil: fnc((a) => {Math.ceil(a)}),


		});
		this.moduleName = moduleName;
		this.exports = {}
		this.loopingModules = [moduleName]
	}
	walk(n) {
		//console.log("WALK!", n)
		if(n.type == 0)
		{
			if(n.exprs.length != 0) {
				
				let q = n.exprs[0];
				//console.log("name -> ", q);
				let a = this.walk(q);
				if(!a || a.type != "Fnc")
					this.env.o.panic.val.bind(this)(`object`, q.val, q, `not applicable!`);
				//console.log("value -> ", a);
				
				if(!a.$$) {
					let decl = this.env.get("$" + q.val);
					let exprs = n.exprs.slice(1).map(e => this.walk(e));
					if(this.env.has("$" + q.val)) {
						if(!decl.some(l => l.type == 5))
						if(exprs.length != decl.length)
						this.env.o.panic.val.bind(this)(`Argument count of (${q.val} ...) does not equal the argument count of declare.`);
					}
					let mulArgs = false; let mulArgsIdx = -1;
					for(let i=0;i<exprs.length;i++) {
						if(this.env.has("$" + q.val)) {
							if(!mulArgs && decl[i].type == 5) { mulArgs = true; mulArgsIdx = i; }
							if(
								((mulArgs?decl[mulArgsIdx].args.val:decl[i].val) != exprs[i].type) 
								&& ((mulArgs?decl[mulArgsIdx].args.val:decl[i].val) != "Any")
								) 
							this.env.o.panic.val.bind(this)
								("Types not compatible: " + (mulArgs?decl[mulArgsIdx].args.val:decl[i].val)  + " <- " + exprs[i].type);
						}
					}
					return a.val.bind(this)(...exprs);
				} else {
					//console.log("a.$$ = true")
					return a.val.bind(this)(...n.exprs.slice(1))
				};
			}
			else return null;
		}
		if(n.type == 1) {
			//console.log("NAME: ", n)
			//if(!(n.val in this.env.o)) this.env.o.panic.val.bind(this)("No such name: " + n.val);
			let tmp = this.env.get(n.val);
			//if(!tmp)
			return tmp;
			// if(tmp.type == "Fnc") return tmp;
			// console.log(tmp);
			// return tmp.val.bind(this)()
		}
		if(n.type == 2) {
			return {type: "Num", val: () => n.num};
		}
		if(n.type == 3) {
			return {type: "Str", val: () => n.str};
		}
		if(n.type == 4) {
			//console.log(n.attr.val == "no_output")
			if(n.attr.val == "no_output") this.NO_OUTPUT = true;
			if(n.attr.val == "__stdlib_lib_only") this.__STDLIB_LIB_ONLY = /*this.NO_OUTPUT = */true;
			if(n.attr.val == "__stdlib_math_trig_pi") return {type: "Num", val: () => Math.PI};
			if(n.attr.val == "__stdlib_math_trig_e") return {type: "Num", val: () => Math.E};
			if(n.attr.val == "__stdlib_math_trig_sqrt1_2") return {type: "Num", val: () => Math.SQRT1_2};
			if(n.attr.val == "__stdlib_math_trig_sqrt2") return {type: "Num", val: () => Math.SQRT2};
			if(n.attr.val == "__stdlib_math_trig_ln10") return {type: "Num", val: () => Math.LN10};
			if(n.attr.val == "__stdlib_math_trig_ln2") return {type: "Num", val: () => Math.LN2};
			if(n.attr.val == "__stdlib_math_trig_log2e") return {type: "Num", val: () => Math.LOG2E};
			if(n.attr.val == "__stdlib_math_trig_log10e") return {type: "Num", val: () => Math.LOG10E};
			if(this.__STDLIB_LIB_ONLY && this.moduleName == "$main")
				this.env.o.panic.val.bind(this)("Cannot run a library!");
			return {type: "$ATTR", val: () => n.attr.val};
		}
		if(n.type == 5) {
			return { type: "MulArgs", val: n.val };
		}
	}
}

let src = fs.readFileSync(process.argv[2]).toString();
let ast = new Parser(src).parse();
//let parser = 
//while(parser.str.trim().length != 0) nodes.push(parser);
//console.log(require('util').inspect(ast, false, null, true /* enable colors */)); // this was on line 69 at 15:15 12 of April, 2020.
let wlk = new Walker("$main");
let res = objtostr(wlk.walk(ast));
if(!wlk.NO_OUTPUT) console.log(`${res}`);
//for(node of nodes) wlk.walk(node);

//console.log("=============================");
//
