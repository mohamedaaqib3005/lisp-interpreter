(begin
  (define primeno (lambda (n)
    (begin
      (define helper (lambda (i)
        (if (<= n 1)
          false
          (if (= i n)
            true
            (if (= (modulo n i) 0)
              false
              (helper (+ i 1)))))))
      (if (= n 2)
        true
        (helper 2)))))
  (primeno 17))
