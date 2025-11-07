(begin
  (define countUp (lambda (n)
    (if (> n 10)
      n
      (begin
        (log n)
        (countUp (+ n 1))))))
  (countUp 0))
