# Mike's Awful And Slow Lisp Interpreter. (MASLI)
(made in *javascript*)

a very simple thing with some types (not custom ones).

> don't look in `main.js`

## run with `node main <filename>`

### syntax:
basically a bad [lisp](https://en.wikipedia.org/wiki/Lisp_(programming_language)) with even worse runtime, but! here is the syntax in some form;
```
expr ->
  0 -> '(' expr* ')'
  1 -> [a-zA-Z_+-=/*&$#><][a-zA-Z0-9_+-=/*&$#><]*
  2 -> -?[0-9]+(\.[0-9]+)?
  3 -> '"' .* '"'
  4 -> '[' expr ']'
  5 -> '...' expr
```

### types:
```
Num - number
Str - string
Trh - boolean ("truth", because i want only 3 letters)
Fnc - function
Any - any type
```

### functions:
```lisp
(+ <Num> <Num>) ; -> addition
(- <Num> <Num>) ; -> substraction
(* <Num> <Num>) ; -> multiplication
(/ <Num> <Num>) ; -> division
(> <Num> <Num>) ; -> greater
(< <Num> <Num>) ; -> less
(>= <Num> <Num>) ; -> greater or equal
(<= <Num> <Num>) ; -> less or equal
(eq <Any> <Any>) ; -> equality

(defun <name> (<argument-names>) <code>) ; -> defines a function
(declare <name> (<argument-types>)) ; -> declares function types (optional) (name of the decl is $<name>)
(let <type> <name> <value>) ; -> defines a variable
(= <name> <value>) ; -> sets a variable (or a function, doesn't matter)
(: <expr> <type>) ; -> returns true if types are equal

(map <key-value-pairs>) ; -> creates a map
(list <values>) ; -> creates a list
(& <exprs>) ; -> executes all of the expressions and returns the result of the last one.
(panic <msg>) ; -> pAnIcS wItH tHe mEsSaGe :O
(tostr <expr>) ; -> returns colorful string representation of the object.
(write <exprs>) ; -> writes all
[no_output] ; -> makes sure that the final result is not printed.

(import <module-path>) ; -> imports the module (module-path is path of the file separated with spaces and no extension)
(export <name> <value>) ; -> exports <value> with <name> (so it is visible when imported)
(exp <id>) ; -> alias to (export <id> <id>)
```

standard library contains only declarations, implementations are hard-coded. stdlib provides typechecking for std funcs.
```lisp
(import stdlib core core) ; -> core (std functions)
(import stdlib math core) ; -> math stuff, +, -, >, >= and so on. (expected js errors)
(import stdlib math strictcore) ; -> strict math, only numbers are allowed.
```

example can be found in `test.lisp`.

## TODO:
normal type system<br>
