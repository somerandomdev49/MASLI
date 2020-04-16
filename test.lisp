(&
	; everything works without stdlib, but no typechecks.
	(import stdlib core core) ; core language
	(import stdlib math strictcore) ; strict math core, only numbers are allowed.
	(+ 1 1)
)
