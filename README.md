# Mike's Awful And Slow Lisp Interpreter. (MASLI)
(made in *javascript*)

for now user-defined macros aren't a thing, but they can be defined in code using attributes. (or not? idk) :)

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

### macros:
```lisp
(defun <name> (<argument-names>) <code>) ; -> defines a function
(declare <name> (<argument-types>)) ; -> declares function types (optional) (name of the decl is $<name>)
(let <type> <name> <value>) ; -> defines a variable
(= <name> <value>) ; -> sets a variable (or a function, doesn't matter)

[no_output] ; -> makes sure that the final result is not printed.

(import <module-path>) ; -> imports the module (module-path is path of the file separated with spaces and no extension)
(export <name> <value>) ; -> exports <value> with <name> (so it is visible when imported)
(exp <id>) ; -> alias to (export <id> <id>)
```

## stdlib:
### `stdlib core core`:
```lisp
(eq <Any> <Any>) ; -> equality
(: <expr> <type>) ; -> returns true if types are equal
(map <key-value-pairs>) ; -> creates a map
(list <values>) ; -> creates a list
(& <exprs>) ; -> executes all of the expressions and returns the result of the last one.
(panic <msg>) ; -> pAnIcS wItH tHe mEsSaGe :O
(tostr <expr>) ; -> returns colorful string representation of the object.
(write <exprs>) ; -> writes all of the exprs to the stdout.
;; TODO: add (read) 
```

### `stdlib math core`:
```lisp
(+ <Num> <Num>) ; -> addition
(- <Num> <Num>) ; -> substraction
(* <Num> <Num>) ; -> multiplication
(/ <Num> <Num>) ; -> division
(> <Num> <Num>) ; -> greater
(< <Num> <Num>) ; -> less
(>= <Num> <Num>) ; -> greater or equal
(<= <Num> <Num>) ; -> less or equal
```
### `stdlib math trig`
```lisp
(sin <Num>)           ; -> javascript: Math.sin(a)
(cos <Num>)           ; -> javascript: Math.cos(a)
(tan <Num>)           ; -> javascript: Math.tan(a)
(acos <Num>)          ; -> javascript: Math.acos(a)
(asin <Num>)          ; -> javascript: Math.acosh(a)
(acosh <Num>)         ; -> javascript: Math.acosn(a)
(atan <Num>)          ; -> javascript: Math.atan(a)
(atanh <Num>)         ; -> javascript: Math.atanh(a)
(atan2 <Num> <Num>)   ; -> javascript: Math.atan2(a, b)
(cosh <Num>)          ; -> javascript: Math.cosh(a)
(sinh <Num>)          ; -> javascript: Math.sinh(a)
```

### internal:
standard library contains only declarations, implementations are hard-coded. stdlib provides typechecking for std funcs.
```lisp
(import stdlib core core) ; -> core (std functions)
(import stdlib math core) ; -> math stuff, +, -, >, >= and so on.
(import stdlib math trig) ; -> other math stuff, sin, cos, PI, E and so on.
```
#### attributes:
do **not** use in your code, those are just for the stdlib.
```lisp
[__stdlib_lib_only]           ; -> makes sure that stdlib is not run.

;; (stdlib math trig): ;;

[__stdlib_math_trig_pi]       ; -> PI constant.
[__stdlib_math_trig_e]        ; -> E constant.
[__stdlib_math_trig_sqrt1_2]  ; -> javascript: Math.SQRT1_2
[__stdlib_math_trig_sqrt2]    ; -> javascript: Math.SQRT2
[__stdlib_math_trig_ln10]     ; -> javascript: Math.LN10
[__stdlib_math_trig_ln2]      ; -> javascript: Math.LN2
[__stdlib_math_trig_log2e]    ; -> javascript: Math.LOG2E
[__stdlib_math_trig_log10e]   ; -> javascript: Math.LOG10E
```

example can be found in `test.lisp`.

## TODO:
normal type system<br>
