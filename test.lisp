(&
	(import test2)
	(decl abcde (Num Any))
	(defun
		abcde
		(a b)
		(&
			(if (> a b)
				(write "! " a " is greater than " b)
				(+ a b)
			)
		)
	)
	(abcde
		123
		2
	)
	(list -1.2 2 3 4)
	abcde
	"Hello, World!"
	(map (a 1) (x (map (a 1))) (b (abcde 0 2)) (c 3))
	abcde 1 2
	(let Num x (abcde 1 3))
	x
	(= x 5)
	x
	(meme 4 3)
)
