(&
	; everything works without stdlib, but no typechecks.
	(import stdlib core core) ; core language
	(import stdlib math core) ; strict math core, only numbers are allowed.
	(import stdlib math trig)
	(+ 1 1)
	(sin (* (/ PI 180) 30))

	(string-trim "Hello, World!")
	
	(switch
		((eq 1 2) 2)
		((eq 1 1) 3)
		(otherwise 1)
	)
)
