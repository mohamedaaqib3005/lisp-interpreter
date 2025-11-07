(begin
  (define fibonacci
    (lambda (n)
      (if (<= n 1)
          1
          (+ (fibonacci (- n 1)) (fibonacci (- n 2))))))
  (fibonacci 5))
