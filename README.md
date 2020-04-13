# Mike's Awful And Slow Lisp Interpreter. (MASLI)
(made in *javascript*)

a very simple thing with some types (not custom ones).

> don't look in `main.js`

## run with `node main <filename>`

### types:
```
Num - number
Str - string
Trh - boolean ("truth", because i want only 3 letters)
Any - any type
```

### functions:
```lisp
(+ <Num> <Num>) -> addition
(- <Num> <Num>) -> substraction
(* <Num> <Num>) -> multiplication
(/ <Num> <Num>) -> division
(> <Num> <Num>) -> greater
(< <Num> <Num>) -> less
(>= <Num> <Num>) -> greater or equal
(<= <Num> <Num>) -> less or equal
(eq <Any> <Any>) -> equality

(defun <name> (<argument-names>) <code>) -> defines a function
(decl <name> (<argument-types>)) -> declares function types (optional)
(let <type> <name> <value>) -> defines a variable
(= <name> <value>) -> sets a variable (or a function, doesn't matter)
(: <expr> <type>) -> returns true if types are equal

(map <key-value-pairs>) -> creates a map
(list <values>) -> creates a list
(& <exprs>) -> executes all of the expressions and returns the result of the last one.
(panic <msg>) -> pAnIcS wItH tHe mEsSaGe :o
(tostr <expr>) -> returns colorful string representation of the object.
(write <exprs>) -> writes all
[no_output] -> makes sure that the result is not printed. 
```

example can be fount in `test.lisp`.

## TODO:
comments (how?!?! i tried)<br>
imports<br>
custom types<br>
