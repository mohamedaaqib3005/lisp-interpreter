(begin
  (define countUp (lambda (n)
    (if (< n 11)
      (begin
        (log n)
        (countUp (+ n 1))))))
  (countUp 0))
// the limit should be the arg not hardcoded
