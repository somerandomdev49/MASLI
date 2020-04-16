(&
	[__stdlib_lib_only]
	(declare eq (Any Any)) (exp $eq)
	(declare not (Any)) (exp $not)
	(declare run (Any)) (exp $run)
	(declare list (...Any)) (exp $list)
	(declare map (...Any)) (exp $list) ; TODO: Normal type system, compound types.
	(declare panic (...Any)) (exp $panic)
	(declare warn (...Any)) (exp $warn)
	(declare write (...Any)) (exp $write)
	(declare tostr (Any)) (exp tostr)
	(declare string-trim (Str)) (exp string-trim) ; TODO: move to (str core)
	(declare switch (...Any)) (exp switch)
)